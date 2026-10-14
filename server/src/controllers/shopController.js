import { repository } from '../store/inMemoryStore.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Delivery from '../models/Delivery.js';
import Feedback from '../models/Feedback.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, petType, search } = req.query;
    const products = await repository.getProducts({ category, petType, search });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await repository.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!deliveryAddress || !deliveryAddress.address) {
      return res.status(400).json({ message: 'Valid delivery address is required' });
    }

    // Backend price recalculation (Never trust raw totals from frontend!)
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await repository.getProductById(item.productId || item.product || item._id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.name || item.productId} is unavailable` });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const itemPrice = Number(product.price);
      calculatedSubtotal += itemPrice * qty;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: qty,
        image: product.image,
      });
    }

    const shippingFee = calculatedSubtotal >= 50 ? 0 : 5.99;
    const tax = Math.round(calculatedSubtotal * 0.08 * 100) / 100;
    const total = Math.round((calculatedSubtotal + shippingFee + tax) * 100) / 100;

    const orderNumber = `PAW-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const orderData = {
      orderNumber,
      user: req.user._id,
      items: verifiedItems,
      subtotal: Math.round(calculatedSubtotal * 100) / 100,
      shippingFee,
      tax,
      total,
      deliveryAddress: {
        label: deliveryAddress.label || 'Home',
        recipientName: deliveryAddress.recipientName || req.user.name,
        address: deliveryAddress.address,
        city: deliveryAddress.city || '',
        state: deliveryAddress.state || '',
        zipCode: deliveryAddress.zipCode || '',
        phone: deliveryAddress.phone || req.user.phone || '',
      },
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid', // Verified simulation
      status: 'Out for Delivery',
      courier: {
        name: 'Olivia Wilson',
        phone: '+1 (555) 019-2834',
        vehicle: 'Eco Delivery Scooter',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      },
      estimatedDeliveryTime: '25 mins to 2h',
    };

    const order = await repository.createOrder(orderData);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery partner dispatched.',
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await repository.getMyOrders(req.user._id);
    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await repository.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const getDeliveryTracking = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await repository.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view tracking for this order' });
    }

    const delivery = await repository.getDeliveryByOrderId(orderId);

    res.json({
      success: true,
      order,
      delivery: delivery || {
        order: orderId,
        courierName: order.courier.name,
        courierPhone: order.courier.phone,
        courierAvatar: order.courier.avatar,
        status: order.status,
        eta: order.estimatedDeliveryTime,
        destinationLocation: { address: order.deliveryAddress.address },
        timeline: [
          { title: 'Order Confirmed', description: 'Your order has been placed successfully.', completed: true, time: order.createdAt },
          { title: 'Packed at Hub', description: 'Items verified and safely packaged.', completed: true, time: order.createdAt },
          { title: 'Out with Courier', description: `${order.courier.name} is on the way on Eco Scooter.`, completed: true, time: order.createdAt },
          { title: 'Delivered', description: 'Package handed over at delivery address.', completed: false, time: null },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { rating, comment, emoji } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const order = await repository.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (orderUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only leave feedback on your own orders' });
    }

    const emojisMap = {
      1: '😡',
      2: '🙁',
      3: '😐',
      4: '😊',
      5: '🤩',
    };

    const feedback = await repository.createFeedback({
      order: order._id,
      user: req.user._id,
      rating: Number(rating),
      emoji: emoji || emojisMap[Number(rating)] || '🤩',
      comment: comment || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (err) {
    next(err);
  }
};
