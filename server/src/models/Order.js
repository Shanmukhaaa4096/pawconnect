import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      label: { type: String, default: 'Home' },
      recipientName: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'PayPal', 'Google Pay', 'Visa', 'Cash on Delivery', 'Simulated Card'],
      default: 'Credit Card',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Paid',
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Out for Delivery',
    },
    courier: {
      name: { type: String, default: 'Olivia Wilson' },
      phone: { type: String, default: '+1 (555) 019-2834' },
      vehicle: { type: String, default: 'Eco Scooter' },
      avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      },
    },
    estimatedDeliveryTime: {
      type: String,
      default: '25 mins to 2h',
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
