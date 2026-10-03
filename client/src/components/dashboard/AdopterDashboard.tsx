import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, CheckCircle2, Clock, Calendar, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { StatusBadge } from '../common/Badge';
import { PetCard } from '../common/PetCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdopterDashboard: React.FC<{ initialTab?: string }> = ({ initialTab = 'applications' }) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'favorites' | 'history'>(
    initialTab as any || 'applications'
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.getMyApplications();
        setApplications(res.applications || []);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const completedAdoptions = applications.filter((a) => a.status === 'Completed');

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'applications'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'favorites'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 py-3 px-2 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
            activeTab === 'history'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Adoption History ({completedAdoptions.length})</span>
        </button>
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {loading ? (
            <LoadingSpinner label="Loading your applications..." />
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Adoption Requests Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                You haven't submitted any adoption requests yet. Browse our lovely pets and apply today!
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition-colors shadow-md shadow-orange-600/20"
              >
                Explore Adoptable Pets <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          to={`/pets/${app.pet?._id}`}
                          className="text-lg font-bold text-slate-900 hover:text-orange-600 transition-colors"
                        >
                          {app.pet?.name}
                        </Link>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 mb-1">
                        {app.pet?.breed} • Submitted on{' '}
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs font-semibold text-slate-700">
                        Shelter: {app.shelter?.name || 'Rescue Center'}
                      </p>
                      {app.shelterNotes && (
                        <div className="mt-2 text-xs bg-slate-50 border border-slate-200 p-2 rounded-lg text-slate-700">
                          <span className="font-bold text-slate-900">Shelter Note: </span>
                          {app.shelterNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/messages`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat with Shelter
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Saved Pets</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Click the heart icon on any pet card while browsing to save them here for quick access!
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-500 transition-colors shadow-md shadow-orange-600/20"
              >
                Browse Pets Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADOPTION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {completedAdoptions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Completed Adoptions Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                When a shelter finalizes your adoption request, your pet companion will appear here with post-adoption care resources and history!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 shadow-md flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 text-emerald-200 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-lg">Congratulations on Your Adoptions!</h4>
                  <p className="text-xs text-emerald-100">
                    Thank you for opening your heart and home to rescue animals. You made a lasting difference!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedAdoptions.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4"
                  >
                    <img
                      src={app.pet?.photos?.[0]}
                      alt={app.pet?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{app.pet?.name}</h4>
                      <p className="text-xs text-slate-500">{app.pet?.breed}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        Adopted through {app.shelter?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Application Details</h3>
                <p className="text-xs text-slate-500">For {selectedApp.pet?.name}</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-700">Adopter:</span> {selectedApp.questionnaire?.fullName} ({selectedApp.questionnaire?.phone})
              </div>
              <div>
                <span className="font-bold text-slate-700">Living Situation:</span> {selectedApp.questionnaire?.housingType} ({selectedApp.questionnaire?.ownership})
              </div>
              <div>
                <span className="font-bold text-slate-700">Experience:</span> {selectedApp.questionnaire?.petExperience}
              </div>
              <div>
                <span className="font-bold text-slate-700">Reason for Adopting:</span>
                <p className="italic text-slate-600 mt-1">"{selectedApp.questionnaire?.reasonForAdopting}"</p>
              </div>
              {selectedApp.shelterNotes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Shelter Feedback:</span>
                  <p className="text-slate-700 mt-1">{selectedApp.shelterNotes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Status History
              </h4>
              <div className="space-y-2">
                {selectedApp.timeline?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1" />
                    <div>
                      <span className="font-bold text-slate-800">{item.status}</span> •{' '}
                      <span className="text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                      {item.note && <p className="text-slate-600">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
