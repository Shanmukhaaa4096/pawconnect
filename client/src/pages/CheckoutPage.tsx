import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  Edit2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Building,
  Home as HomeIcon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DeliveryAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, lazyLogin } = useAuth();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  const [selectedAddressLabel, setSelectedAddressLabel] = useState<'Home' | 'Office'>('Home');
  const [customHomeAddress, setCustomHomeAddress] = useState('742 Evergreen Terrace, Austin, TX');
  const [customOfficeAddress, setCustomOfficeAddress] = useState('100 Innovation Park, Suite 300, Austin, TX');
  const [editingAddress, setEditingAddress] = useState<'Home' | 'Office' | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Google Pay' | 'Visa'>('Credit Card');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3E6E6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-[#EAD2D3] shadow-md space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#C96366] mx-auto" />
          <h2 className="text-xl font-black text-[#292323]">Your Cart is Empty</h2>
          <p className="text-xs text-[#736363]">Add healthy pet food or supplies before checking out.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C96366] text-white text-xs font-black shadow hover:bg-[#98494B] transition"
          >
            <span>Browse Pet Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please log in or create an account to complete your order.');
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const activeAddressStr = selectedAddressLabel === 'Home' ? customHomeAddress : customOfficeAddress;

      const deliveryAddress: DeliveryAddress = {
        label: selectedAddressLabel,
        recipientName: user.name,
        address: activeAddressStr,
        city: 'Austin',
        state: 'TX',
        phone: user.phone || '+1 (555) 234-5678',
      };

      const res = await api.createOrder({
        items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        deliveryAddress,
        paymentMethod,
      });

      // Clear local cart
      clearCart();

      // Navigate straight to Screen 10 Delivery Tracking!
      navigate(`/orders/${res.order._id}/delivery`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E6E6] py-6 sm:py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Back Link */}
        <div className="mb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#736363] hover:text-[#C96366] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pet Shop</span>
          </Link>
        </div>

        {/* ── Screen 9 Card Container ─────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAD2D3] shadow-xl space-y-6">
          <div className="border-b border-[#F4E4E4] pb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C96366]">
              Order Confirmation
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#292323] tracking-tight mt-0.5">
              Checkout & Delivery Details
            </h1>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {!user && (
            <div className="p-4 rounded-2xl bg-[#FFF5F5] border border-[#EAD2D3] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#C96366]">
                  <Zap className="w-4 h-4 fill-[#C96366]" />
                  <span>Guest Checkout Enabled</span>
                </div>
                <p className="text-[11px] text-[#736363] mt-0.5">
                  Click Lazy Login to complete your checkout instantly without passwords.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await lazyLogin('adopter');
                  } catch (err: any) {
                    setErrorMsg('Lazy login failed');
                  }
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-[#C96366] text-white text-xs font-black shadow hover:opacity-95 transition cursor-pointer shrink-0"
              >
                ⚡ 1-Click Lazy Login
              </button>
            </div>
          )}

          {/* 1. SELECT DELIVERY ADDRESS (Matches Screen 9) */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-[#292323] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C96366]" />
              <span>Select Delivery Address</span>
            </h3>

            {/* Home Address Option */}
            <div
              onClick={() => setSelectedAddressLabel('Home')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAddressLabel === 'Home'
                  ? 'border-[#C96366] bg-[#FDEEEF] shadow-xs'
                  : 'border-[#EAD2D3] bg-white hover:border-[#C96366]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressLabel === 'Home' ? 'border-[#C96366]' : 'border-gray-300'
                  }`}
                >
                  {selectedAddressLabel === 'Home' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C96366]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <HomeIcon className="w-4 h-4 text-[#C96366]" />
                    <span className="font-extrabold text-xs sm:text-sm text-[#292323]">Home</span>
                  </div>
                  <p className="text-xs text-[#736363] mt-0.5">{customHomeAddress}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = prompt('Edit Home Address:', customHomeAddress);
                  if (updated && updated.trim()) setCustomHomeAddress(updated.trim());
                }}
                className="p-1.5 rounded-full text-[#736363] hover:text-[#C96366] hover:bg-white transition"
                title="Edit address"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Office Address Option */}
            <div
              onClick={() => setSelectedAddressLabel('Office')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedAddressLabel === 'Office'
                  ? 'border-[#C96366] bg-[#FDEEEF] shadow-xs'
                  : 'border-[#EAD2D3] bg-white hover:border-[#C96366]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressLabel === 'Office' ? 'border-[#C96366]' : 'border-gray-300'
                  }`}
                >
                  {selectedAddressLabel === 'Office' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C96366]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#C96366]" />
                    <span className="font-extrabold text-xs sm:text-sm text-[#292323]">Office</span>
                  </div>
                  <p className="text-xs text-[#736363] mt-0.5">{customOfficeAddress}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = prompt('Edit Office Address:', customOfficeAddress);
                  if (updated && updated.trim()) setCustomOfficeAddress(updated.trim());
                }}
                className="p-1.5 rounded-full text-[#736363] hover:text-[#C96366] hover:bg-white transition"
                title="Edit address"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. PAYMENT METHOD SELECTION (Matches Screen 9) */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-sm text-[#292323] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C96366]" />
              <span>Payment Method</span>
            </h3>

            <div className="space-y-2">
              {[
                { id: 'Credit Card', label: 'Credit Card (Instant Demo Sim)', icon: '💳' },
                { id: 'PayPal', label: 'PayPal', icon: '🅿️' },
                { id: 'Google Pay', label: 'Google Pay', icon: '📱' },
                { id: 'Visa', label: 'Visa / Debit Card', icon: '💳' },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C96366] bg-[#FDEEEF] shadow-xs'
                        : 'border-[#EAD2D3] bg-white hover:border-[#C96366]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-xs sm:text-sm font-bold text-[#292323]">{method.label}</span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#C96366]' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#C96366]" />}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. ORDER SUMMARY (Matches Screen 9) */}
          <div className="bg-[#F3E6E6]/60 rounded-2xl p-4 sm:p-5 border border-[#EAD2D3] space-y-2 text-xs font-bold">
            <div className="flex justify-between text-[#736363]">
              <span>Items Total ({items.length} products)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#736363]">
              <span>Estimated Delivery</span>
              <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#292323] pt-2 border-t border-[#EAD2D3]">
              <span>Total Amount</span>
              <span className="text-[#C96366]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* 4. PLACE TO ORDER BUTTON (Matches Screen 9) */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-4 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white font-black text-sm tracking-wide shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            {submitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Place to Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
