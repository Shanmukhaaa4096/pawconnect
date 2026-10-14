import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const serif: React.CSSProperties = { fontFamily: 'var(--font-serif)' };
const input =
  'w-full h-11 px-4 rounded-xl bg-white border-2 border-[#EBC9A5] text-sm text-[#3E1F1A] placeholder-[#B99A86] focus:outline-none focus:border-[#C2572F] transition';

const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <label className="block">
    <span className="block text-[11px] font-black uppercase tracking-wider text-[#8A5A48] mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-[#B99A86] mt-1">{hint}</span>}
  </label>
);

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const isShelter = user?.role === 'shelter';

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    orgName: user?.organization?.name || '',
    orgDescription: user?.organization?.description || '',
    orgWebsite: user?.organization?.website || '',
    orgLicense: user?.organization?.licenseNumber || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateUser({
        name: form.name.trim(),
        phone: form.phone.trim(),
        avatar: form.avatar.trim() || undefined,
        bio: form.bio,
        location: { ...user.location, city: form.city.trim(), state: form.state.trim() },
        ...(isShelter && {
          organization: {
            ...user.organization,
            name: form.orgName.trim(),
            description: form.orgDescription,
            website: form.orgWebsite.trim(),
            licenseNumber: form.orgLicense.trim(),
          },
        }),
      });
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl sm:text-4xl font-black text-[#8E3B22]" style={serif}>Your profile</h1>
      <p className="text-sm text-[#8A5A48] font-medium mt-1">
        {user.email} · <span className="capitalize">{user.role}</span>
      </p>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <section className="bg-white rounded-3xl border-2 border-[#EBC9A5] p-6 space-y-5">
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-[#EBC9A5]" />
            ) : (
              <span className="w-16 h-16 rounded-full bg-[#F8DDBF] flex items-center justify-center text-2xl font-black text-[#8E3B22]">
                {form.name.charAt(0).toUpperCase() || '?'}
              </span>
            )}
            <div className="flex-1">
              <Field label="Photo URL">
                <input className={input} value={form.avatar} onChange={set('avatar')} placeholder="https://..." />
              </Field>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name">
              <input className={input} value={form.name} onChange={set('name')} required />
            </Field>
            <Field label="Phone">
              <input className={input} value={form.phone} onChange={set('phone')} placeholder="+1 555 0100" />
            </Field>
            <Field label="City">
              <input className={input} value={form.city} onChange={set('city')} />
            </Field>
            <Field label="State">
              <input className={input} value={form.state} onChange={set('state')} />
            </Field>
          </div>
          <Field label="About you">
            <textarea
              className={`${input} h-28 py-3 resize-none`}
              value={form.bio}
              onChange={set('bio')}
              maxLength={400}
              placeholder="Tell shelters a little about yourself."
            />
          </Field>
        </section>

        {isShelter && (
          <section className="bg-white rounded-3xl border-2 border-[#EBC9A5] p-6 space-y-5">
            <h2 className="font-black text-lg text-[#3E1F1A]" style={serif}>Organization</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Organization name">
                <input className={input} value={form.orgName} onChange={set('orgName')} />
              </Field>
              <Field label="Licence number" hint="Admins use this to verify your shelter.">
                <input className={input} value={form.orgLicense} onChange={set('orgLicense')} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Website">
                  <input className={input} value={form.orgWebsite} onChange={set('orgWebsite')} placeholder="https://" />
                </Field>
              </div>
            </div>
            <Field label="About the shelter">
              <textarea
                className={`${input} h-28 py-3 resize-none`}
                value={form.orgDescription}
                onChange={set('orgDescription')}
                maxLength={600}
              />
            </Field>
          </section>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-[#FCE4E1] text-[#B3261E] text-sm font-bold px-4 py-3">{error}</p>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-full bg-[#C2572F] hover:bg-[#8E3B22] disabled:opacity-60 text-white text-sm font-extrabold inline-flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#137333]" role="status">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
