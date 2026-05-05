import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import { Upload, UserPlus } from 'lucide-react';

// ── Defined OUTSIDE component so it never re-creates on re-render ─────────────
const inputCls = `w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all
  focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500`;
const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-slate-300">{label}</label>
    {children}
  </div>
);

const AdminAddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const { addDoctor } = useContext(AdminContext);
  const { getDoctorsData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!docImg) return;

    const formData = new FormData();
    formData.append('image', docImg);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('experience', experience);
    formData.append('fees', fees);
    formData.append('about', about);
    formData.append('speciality', speciality);
    formData.append('degree', degree);
    formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

    const success = await addDoctor(formData);
    if (success) {
      // Refresh frontend doctors list so new doctor appears immediately
      await getDoctorsData();
      setDocImg(null); setName(''); setEmail(''); setPassword('');
      setExperience('1 Year'); setFees(''); setAbout('');
      setSpeciality('General physician'); setDegree('');
      setAddress1(''); setAddress2('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Add New Doctor</h1>
        <p className="text-sm mt-1" style={{ color: '#8ba3c7' }}>Fill in the details to register a new doctor</p>
      </div>

      <form onSubmit={onSubmitHandler}>
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8">
            {/* Photo upload */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <label htmlFor="doc-img" className="cursor-pointer group">
                <div
                  className="w-32 h-32 rounded-2xl overflow-hidden flex items-center justify-center relative transition-all"
                  style={{
                    background: docImg ? 'transparent' : 'rgba(0,212,255,0.07)',
                    border: '2px dashed rgba(0,212,255,0.3)',
                  }}
                >
                  {docImg ? (
                    <>
                      <img
                        className="w-full h-full object-cover"
                        src={URL.createObjectURL(docImg)}
                        alt="Doctor"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center px-3">
                      <Upload size={24} style={{ color: '#00d4ff' }} />
                      <p className="text-xs font-medium" style={{ color: '#8ba3c7' }}>Upload Photo</p>
                    </div>
                  )}
                </div>
              </label>
              <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden required />
              <p className="text-xs text-center" style={{ color: '#8ba3c7' }}>Doctor's profile photo</p>
            </div>

            {/* Form fields */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Doctor Name">
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="text" placeholder="Full name" required
                />
              </Field>

              <Field label="Speciality">
                <select
                  value={speciality} onChange={e => setSpeciality(e.target.value)}
                  className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist'].map(s => (
                    <option key={s} style={{ background: '#0d1525' }}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Email">
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="email" placeholder="doctor@email.com" required
                />
              </Field>

              <Field label="Password">
                <input
                  value={password} onChange={e => setPassword(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="password" placeholder="Set a password" required
                />
              </Field>

              <Field label="Education / Degree">
                <input
                  value={degree} onChange={e => setDegree(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="text" placeholder="e.g. MBBS, MD" required
                />
              </Field>

              <Field label="Experience">
                <select
                  value={experience} onChange={e => setExperience(e.target.value)}
                  className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years'].map(y => (
                    <option key={y} style={{ background: '#0d1525' }}>{y}</option>
                  ))}
                </select>
              </Field>

              <Field label="Consultation Fees (₹)">
                <input
                  value={fees} onChange={e => setFees(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="number" placeholder="e.g. 500" required
                />
              </Field>

              <Field label="Address Line 1">
                <input
                  value={address1} onChange={e => setAddress1(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="text" placeholder="Clinic / Hospital address" required
                />
              </Field>

              <Field label="Address Line 2">
                <input
                  value={address2} onChange={e => setAddress2(e.target.value)}
                  className={inputCls} style={inputStyle}
                  type="text" placeholder="City, State, PIN"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="About Doctor">
                  <textarea
                    value={about} onChange={e => setAbout(e.target.value)}
                    className={`${inputCls} resize-none`} style={inputStyle}
                    placeholder="Write a brief description about the doctor's expertise and background..."
                    rows={4} required
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(14,165,233,0.35)',
              }}
            >
              <UserPlus size={16} />
              Add Doctor
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminAddDoctor;
