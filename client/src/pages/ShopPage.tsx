import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, addToCart, removeFromCart, updateQuantity, totalCount, subtotal, shippingFee, total } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPetType, setSelectedPetType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Grooming', 'Beds & Crates'];
  const petTypes = ['All', 'Dog', 'Cat'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts({
          category: selectedCategory,
          petType: selectedPetType,
          search: searchQuery,
        });
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedPetType, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedAnimationId(product._id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <div className="min-h-screen bg-[#F3E6E6] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEEEF] text-[#C96366] text-xs font-black uppercase tracking-wider mb-2 border border-[#EAD2D3]">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pet Supplies & Nutrition</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#292323] tracking-tight">
              PawConnect Pet Shop
            </h1>
            <p className="text-xs sm:text-sm text-[#736363] mt-1 font-medium">
              Wholesome food, safe toys, and cozy beds for your new family member.
            </p>
          </div>

          {/* Cart Status Button */}
          {totalCount > 0 && (
            <Link
              to="/checkout"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C96366] text-white text-xs font-black shadow-md hover:bg-[#98494B] transition shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart & Checkout ({totalCount} items · ${total.toFixed(2)})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EAD2D3] shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89898]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, toys, beds..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[#F3E6E6]/60 border border-[#EAD2D3] text-xs font-medium text-[#292323] placeholder-[#A89898] focus:outline-none focus:border-[#C96366]"
              />
            </div>

            {/* Pet Type Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-[#736363] uppercase tracking-wider mr-1">Pet:</span>
              {petTypes.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setSelectedPetType(pt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    selectedPetType === pt
                      ? 'bg-[#C96366] text-white shadow-xs'
                      : 'bg-[#F3E6E6] text-[#736363] hover:bg-[#EAD2D3]'
                  }`}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#98494B] text-white shadow-xs'
                    : 'bg-[#FDEEEF] text-[#C96366] hover:bg-[#C96366] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Layout: Product Grid + Screen 8 Cart Summary ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Products Grid */}
          <div className={`${items.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {loading ? (
              <div className="py-16 flex justify-center">
                <LoadingSpinner label="Loading pet supplies..." />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EAD2D3] shadow-sm">
                <ShoppingBag className="w-12 h-12 text-[#A89898] mx-auto mb-3" />
                <h3 className="font-extrabold text-base text-[#292323]">No items match your filter</h3>
                <p className="text-xs text-[#736363] mt-1">Try selecting "All" categories or changing keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                {products.map((product) => {
                  const isJustAdded = addedAnimationId === product._id;
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl p-3.5 border border-[#EAD2D3] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                    >
                      <div>
                        {/* Image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FDEEEF] mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[#98494B] text-[9px] font-black uppercase tracking-wider shadow">
                            {product.category}
                          </span>
                        </div>

                        {/* Title & Reviews */}
                        <h3 className="font-extrabold text-xs sm:text-sm text-[#292323] group-hover:text-[#C96366] transition line-clamp-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="text-[11px] font-black ml-1 text-[#292323]">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#A89898]">({product.reviewsCount})</span>
                        </div>

                        <p className="text-[11px] text-[#736363] mt-1.5 line-clamp-2 font-medium">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing & Add Button */}
                      <div className="mt-3 pt-3 border-t border-[#F4E4E4] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm sm:text-base font-black text-[#C96366]">
                            ${product.price.toFixed(2)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-[10px] text-[#A89898] line-through">
                              ${product.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ${
                            isJustAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#C96366] hover:bg-[#98494B] text-white active:scale-95'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Screen 8 Cart Summary & Order Card ───────────────────── */}
          {items.length > 0 && (
            <div className="lg:col-span-4 sticky top-20 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD2D3] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4E4E4]">
                <h3 className="font-black text-base text-[#292323] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C96366]" />
                  <span>Your Order ({totalCount})</span>
                </h3>
                <span className="text-xs font-bold text-[#C96366]">Delivery Ready</span>
              </div>

              {/* Items List (Matches Screen 8 item cards) */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F4E4E4] pr-1 space-y-2">
                {items.map(({ product, quantity }) => (
                  <div key={product._id} className="pt-2 flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EAD2D3]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#292323] truncate">{product.name}</h4>
                      <p className="text-xs font-extrabold text-[#C96366] mt-0.5">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="w-5 h-5 rounded-full bg-[#F3E6E6] text-[#292323] flex items-center justify-center text-xs hover:bg-[#EAD2D3]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black px-1">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="w-5 h-5 rounded-full bg-[#F3E6E6] text-[#292323] flex items-center justify-center text-xs hover:bg-[#EAD2D3]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-[#A89898] hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-3 border-t border-[#F4E4E4] space-y-1.5 text-xs font-bold">
                <div className="flex justify-between text-[#736363]">
                  <span>Sub Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#736363]">
                  <span>Delivery Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#292323] pt-2 border-t border-[#F4E4E4]">
                  <span>Total</span>
                  <span className="text-[#C96366]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* ORDER BUTTON (Screen 8) */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 rounded-full bg-[#C96366] hover:bg-[#98494B] text-white font-black text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>ORDER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#A89898] font-medium">
                🔒 Safe checkout with simulated payment & doorstep delivery tracking
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
