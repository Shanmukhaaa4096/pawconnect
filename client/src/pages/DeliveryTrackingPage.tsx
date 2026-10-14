import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Truck,
  Phone,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Star,
  MessageSquare,
  Home,
  Check,
  Package,
} from 'lucide-react';
import { Order, DeliveryTracking } from '../types';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DeliveryTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(true);

  // Feedback Modal State (Screens 11 & 12)
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getDeliveryTracking(id);
        setOrder(res.order);
        setDelivery(res.delivery);
      } catch (err) {
        console.error('Error fetching delivery tracking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryData();
  }, [id]);

  const ratingEmojis = [
    { rating: 1, emoji: '😡', label: 'Very Poor' },
    { rating: 2, emoji: '🙁', label: 'Poor' },
    { rating: 3, emoji: '😐', label: 'Average' },
    { rating: 4, emoji: '😊', label: 'Good' },
    { rating: 5, emoji: '🤩', label: 'Excellent' },
  ];

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSubmittingFeedback(true);
      const activeObj = ratingEmojis.find((r) => r.rating === selectedRating);
      await api.submitOrderFeedback(id, {
        rating: selectedRating,
        emoji: activeObj?.emoji || '🤩',
        comment: feedbackComment,
      });
      setFeedbackSubmitted(true);
    } catch (err: any) {
      alert(`Could not submit feedback: ${err.message}`);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Locating live courier and delivery route..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F3E6E6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#EAD2D3] shadow-md space-y-4">
          <Truck className="w-12 h-12 text-[#C96366] mx-auto" />
          <h2 className="text-xl font-black text-[#292323]">Order Not Found</h2>
          <p className="text-xs text-[#736363]">The delivery tracking link may be outdated.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C96366] text-white text-xs font-black shadow hover:bg-[#98494B] transition"
          >
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3E6E6] py-6 sm:py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#736363] hover:text-[#C96366] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pet Supplies</span>
          </Link>
          <span className="text-xs font-black text-[#C96366]">Order #{order.orderNumber}</span>
        </div>

        {/* ── Screen 10 Tracking Container ─────────────────────────── */}
        <div className="bg-white rounded-3xl border border-[#EAD2D3] shadow-xl overflow-hidden flex flex-col">
          {/* Top Graphic Map Simulation (Screen 10) */}
          <div className="relative h-64 sm:h-72 bg-[#E5ECDB] overflow-hidden flex items-center justify-center border-b border-[#EAD2D3]">
            {/* Stylized Street Grid SVG Background */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="400" height="300" fill="#E8EFE0" />
              {/* Green Park Zones */}
              <polygon points="20,20 120,40 100,140 30,110" fill="#D3E2C4" />
              <polygon points="250,160 380,180 370,290 260,280" fill="#D3E2C4" />
              <polygon points="280,30 380,40 360,120 270,110" fill="#D3E2C4" />
              {/* Street Grid Lines */}
              <line x1="0" y1="60" x2="400" y2="60" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#FFFFFF" strokeWidth="14" />
              <line x1="0" y1="240" x2="400" y2="240" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="80" y1="0" x2="80" y2="300" stroke="#FFFFFF" strokeWidth="12" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#FFFFFF" strokeWidth="14" />
              <line x1="320" y1="0" x2="320" y2="300" stroke="#FFFFFF" strokeWidth="12" />
              {/* Route Line in Coral Pink */}
              <polyline
                points="80,240 200,240 200,150 320,150 320,60"
                fill="none"
                stroke="#C96366"
                strokeWidth="4"
                strokeDasharray="6,4"
              />
            </svg>

            {/* Courier Scooter Marker (Live Location) */}
            <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#98494B] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                🛵
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-[#98494B] text-white text-[9px] font-black shadow">
                Courier on Route
              </span>
            </div>

            {/* Destination Pin Marker */}
            <div className="absolute top-[18%] right-[18%] z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#C96366] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-white text-[#C96366] border border-[#EAD2D3] text-[9px] font-black shadow">
                {order.deliveryAddress.label || 'Home'}
              </span>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#292323] text-xs font-black shadow-sm flex items-center gap-1.5 border border-[#EAD2D3]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Delivery Route</span>
            </div>
          </div>

          {/* Bottom Card Content (Matches Screen 10) */}
          <div className="p-6 bg-white space-y-6">
            {/* Delivery Time & Status */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F4E4E4]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#A89898] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C96366]" />
                  Delivery Time
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#292323] mt-0.5">
                  {order.estimatedDeliveryTime || '25 mins to 2h'}
                </h2>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-[#FDEEEF] text-[#C96366] font-black text-xs border border-[#EAD2D3]">
                  {order.status}
                </span>
                <p className="text-[10px] text-[#A89898] mt-1 font-bold">
                  Order ID: {order.orderNumber}
                </p>
              </div>
            </div>

            {/* Courier Profile Card (Matches Screen 10) */}
            <div className="p-4 rounded-2xl bg-[#FDEEEF] border border-[#EAD2D3] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={order.courier.avatar}
                    alt={order.courier.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-[#292323]">{order.courier.name}</h4>
                  <p className="text-xs text-[#736363] font-medium">{order.courier.vehicle || 'Eco Courier'}</p>
                </div>
              </div>

              <a
                href={`tel:${order.courier.phone}`}
                className="p-2.5 rounded-full bg-white text-[#C96366] hover:bg-[#C96366] hover:text-white transition shadow-sm border border-[#EAD2D3]"
                title="Call Courier"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Items in Delivery */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A89898]">
                Package Items ({order.items.length})
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <span className="font-bold text-[#292323]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-black text-[#C96366]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Trigger Button (Matches Screen 10 "Feedback" button) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className="w-full py-3.5 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white font-black text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEEDBACK MODAL (Screens 11 & 12 Reference Mockups) ──────── */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#C96366] text-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border-2 border-white/20 animate-in zoom-in-95 text-center relative overflow-hidden">
            {/* Header: DELIVERY DONE (Screens 11 & 12) */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1">
                <span className="text-4xl">D</span>
                <span className="text-lg uppercase tracking-wider leading-none">
                  ELIVERY<br />DONE
                </span>
              </h2>
            </div>

            {!feedbackSubmitted ? (
              /* Screen 11: Rating & Scooter Partner */
              <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                {/* 3D Scooter Partner Icon / Illustration */}
                <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center text-5xl shadow-inner border border-white/30">
                  🛵
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    How satisfied are you with our service
                  </h3>
                  <p className="text-[11px] text-white/80 mt-1">Tap an emoji to rate your experience</p>
                </div>

                {/* Emoji Rating Picker (Screen 11: 😡 🙁 😐 😊 🤩) */}
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-2">
                  {ratingEmojis.map(({ rating, emoji, label }) => {
                    const isSelected = selectedRating === rating;
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setSelectedRating(rating)}
                        className={`text-2xl sm:text-3xl p-1.5 rounded-2xl transition-all cursor-pointer ${
                          isSelected
                            ? 'scale-135 bg-white/30 shadow-lg'
                            : 'opacity-65 hover:opacity-100 hover:scale-110'
                        }`}
                        title={label}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>

                {/* Optional comment */}
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Leave a short comment for Olivia Wilson..."
                  rows={2}
                  className="w-full p-3 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 text-xs focus:outline-none focus:bg-white/30 resize-none font-medium"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(false)}
                    className="flex-1 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="flex-1 py-3 rounded-full bg-white text-[#98494B] hover:bg-white/90 font-black text-xs shadow-md transition disabled:opacity-50"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            ) : (
              /* Screen 12: Heart-Eyes Emoji "Thank you for your feedback!" */
              <div className="space-y-6 py-4 animate-in fade-in">
                {/* Big Heart-Eyes Emoji (Screen 12) */}
                <div className="text-7xl animate-bounce">
                  😍
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Thank you for your feedback!
                  </h3>
                  <p className="text-xs text-white/80 max-w-xs mx-auto">
                    Your rating helps Olivia Wilson and our rescue shelters maintain five-star care!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFeedbackOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-3.5 rounded-full bg-white text-[#98494B] font-black text-xs shadow-lg hover:bg-white/90 transition cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
