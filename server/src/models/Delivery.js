import mongoose from 'mongoose';

const deliveryTimelineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  time: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true,
    },
    courierName: {
      type: String,
      default: 'Olivia Wilson',
    },
    courierPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    courierAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Picked Up', 'On The Way', 'Arrived', 'Delivered'],
      default: 'On The Way',
    },
    eta: {
      type: String,
      default: '25 mins to 2h',
    },
    pickupLocation: {
      name: { type: String, default: 'PawConnect Central Hub' },
      address: { type: String, default: '100 Rescue Ave, Suite 4B' },
      lat: { type: Number, default: 30.2672 },
      lng: { type: Number, default: -97.7431 },
    },
    destinationLocation: {
      address: { type: String, default: '' },
      lat: { type: Number, default: 30.2750 },
      lng: { type: Number, default: -97.7350 },
    },
    timeline: [deliveryTimelineSchema],
  },
  {
    timestamps: true,
  }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
