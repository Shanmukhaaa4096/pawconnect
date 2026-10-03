import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Heart, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Application } from '../../types';
import { api } from '../../services/api';
import { useFavorites } from '../../context/FavoritesContext';
import { StatusBadge } from '../common/Badge';
import { PetCard } from '../common/PetCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { KawaiiPaw, KawaiiSparkle, KawaiiEmptyPet } from '../common/KawaiiIcons';

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
      <div className="flex border-b border-[#EDE6DC] gap-2 sm:gap-4 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 py-3 px-3.5 rounded-t-2xl font-black text-sm whitespace-nowrap transition-all ${
            activeTab === 'applications'
              ? 'bg-[#FFF6EC] border-b-2 border-[#FF7E67] text-[#FF7E67]'
              : 'text-[#7A6E68] hover:text-[#2B2523] hover:bg-[#FAF7F2]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 py-3 px-3.5 rounded-t-2xl font-black text-sm whitespace-nowrap transition-all ${
            activeTab === 'favorites'
              ? 'bg-[#FFF6EC] border-b-2 border-[#FF7E67] text-[#FF7E67]'
              : 'text-[#7A6E68] hover:text-[#2B2523] hover:bg-[#FAF7F2]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favorites ({favorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 py-3 px-3.5 rounded-t-2xl font-black text-sm whitespace-nowrap transition-all ${
            activeTab === 'history'
              ? 'bg-[#FFF6EC] border-b-2 border-[#FF7E67] text-[#FF7E67]'
              : 'text-[#7A6E68] hover:text-[#2B2523] hover:bg-[#FAF7F2]'
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
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#EDE6DC] shadow-xs space-y-4 max-w-lg mx-auto">
              <KawaiiEmptyPet className="w-44 h-36 mx-auto" />
              <h3 className="text-xl font-black text-[#2B2523]">No Adoption Requests Yet</h3>
              <p className="text-sm text-[#7A6E68] max-w-sm mx-auto leading-relaxed">
                You haven't submitted any adoption requests yet. Browse our lovely companions and apply today!
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7E67] text-white font-extrabold text-sm hover:bg-[#F26B53] transition-all shadow-md shadow-[#FF7E67]/20 active:scale-98"
              >
                <span>Explore Adoptable Pets</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EDE6DC] shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.pet?.photos?.[0] || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=200&q=80'}
                      alt={app.pet?.name || 'Pet'}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-[#EDE6DC] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <Link
                          to={`/pets/${app.pet?._id}`}
                          className="text-lg font-black text-[#2B2523] hover:text-[#FF7E67] transition-colors"
                        >
                          {app.pet?.name}
                        </Link>
                        <StatusBadge status={app.status} size="sm" />
                      </div>
                      <p className="text-xs text-[#7A6E68] mb-1 font-medium">
                        {app.pet?.breed} • Submitted on{' '}
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs font-bold text-[#5C524E]">
                        Shelter: {app.shelter?.name || 'Rescue Center'}
                      </p>
                      {app.shelterNotes && (
                        <div className="mt-2 text-xs bg-[#FAF7F2] border border-[#EDE6DC] p-2.5 rounded-2xl text-[#2B2523]">
                          <span className="font-extrabold text-[#965B20]">Shelter Note: </span>
                          {app.shelterNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 rounded-2xl text-xs font-black bg-[#FAF7F2] hover:bg-[#EDE6DC] text-[#2B2523] border border-[#EDE6DC] transition-all"
                    >
                      View Details
                    </button>
                    <Link
                      to={`/messages`}
                      className="px-4 py-2 rounded-2xl text-xs font-black bg-[#FFF2EE] hover:bg-[#FFE3DC] text-[#FF7E67] border border-[#FCD7CE] transition-all flex items-center gap-1.5"
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
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#EDE6DC] shadow-xs space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#FFF2EE] text-[#FF7E67] flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h3 className="text-xl font-black text-[#2B2523]">No Saved Favorites Yet</h3>
              <p className="text-sm text-[#7A6E68] max-w-sm mx-auto leading-relaxed">
                Click the heart icon on any pet card while browsing to save them here for quick access!
              </p>
              <Link
                to="/browse"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FF7E67] text-white font-extrabold text-sm hover:bg-[#F26B53] transition-all shadow-md shadow-[#FF7E67]/20 active:scale-98"
              >
                <span>Browse Pets Now</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
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
            <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#EDE6DC] shadow-xs space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#EEF8F5] text-[#1C6C57] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#2B2523]">No Completed Adoptions Yet</h3>
              <p className="text-sm text-[#7A6E68] max-w-sm mx-auto leading-relaxed">
                When a shelter finalizes your adoption request, your pet companion will appear here with post-adoption care records!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#EEF8F5] border border-[#CCE8DF] text-[#1C6C57] rounded-3xl p-6 shadow-xs flex items-center gap-4">
                <ShieldCheck className="w-10 h-10 text-[#1C6C57] shrink-0" />
                <div>
                  <h4 className="font-black text-lg">Congratulations on Your Adoptions! 🐾</h4>
                  <p className="text-xs text-[#1C6C57]/80 font-medium">
                    Thank you for opening your heart and home to rescue animals. You made a lasting difference!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedAdoptions.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-3xl p-5 border border-[#EDE6DC] shadow-xs flex items-center gap-4"
                  >
                    <img
                      src={app.pet?.photos?.[0]}
                      alt={app.pet?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EDE6DC]"
                    />
                    <div>
                      <h4 className="font-black text-[#2B2523] text-base">{app.pet?.name}</h4>
                      <p className="text-xs text-[#7A6E68] font-medium">{app.pet?.breed}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F2F1FD] text-[#4844B3] border border-[#DFDCF7]">
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
        <div className="fixed inset-0 z-50 bg-[#2B2523]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#EDE6DC] p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
              <div>
                <h3 className="font-black text-[#2B2523] text-lg">Application Details</h3>
                <p className="text-xs text-[#7A6E68] font-medium">For {selectedApp.pet?.name}</p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="space-y-3 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE6DC]">
              <div>
                <span className="font-bold text-[#2B2523]">Adopter:</span> {selectedApp.questionnaire?.fullName} ({selectedApp.questionnaire?.phone})
              </div>
              <div>
                <span className="font-bold text-[#2B2523]">Living Situation:</span> {selectedApp.questionnaire?.housingType} ({selectedApp.questionnaire?.ownership})
              </div>
              <div>
                <span className="font-bold text-[#2B2523]">Experience:</span> {selectedApp.questionnaire?.petExperience}
              </div>
              <div>
                <span className="font-bold text-[#2B2523]">Reason for Adopting:</span>
                <p className="italic text-[#5C524E] mt-1">"{selectedApp.questionnaire?.reasonForAdopting}"</p>
              </div>
              {selectedApp.shelterNotes && (
                <div className="pt-2 border-t border-[#EDE6DC]">
                  <span className="font-black text-[#965B20]">Shelter Feedback:</span>
                  <p className="text-[#2B2523] mt-1">{selectedApp.shelterNotes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#A49B95] mb-2">
                Status History
              </h4>
              <div className="space-y-2">
                {selectedApp.timeline?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#FF7E67] mt-1" />
                    <div>
                      <span className="font-extrabold text-[#2B2523]">{item.status}</span> •{' '}
                      <span className="text-[#7A6E68]">{new Date(item.date).toLocaleDateString()}</span>
                      {item.note && <p className="text-[#5C524E]">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full py-2.5 rounded-2xl bg-[#2B2523] hover:bg-[#3D3532] text-white font-extrabold text-xs transition-all active:scale-98"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

