import React, { useContext, useState, useEffect, useRef } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import gsap from 'gsap';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  // Refs for GSAP
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const field1Ref = useRef(null);
  const field2Ref = useRef(null);
  const btnRef = useRef(null);
  const footerRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Floating orbs ──────────────────────────────────────────
      gsap.set([orb1Ref.current, orb2Ref.current, orb3Ref.current], { opacity: 0, scale: 0 });

      gsap.to(orb1Ref.current, {
        opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out',
        onComplete: () => {
          gsap.to(orb1Ref.current, {
            y: -30, x: 20, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
        }
      });
      gsap.to(orb2Ref.current, {
        opacity: 1, scale: 1, duration: 1.8, delay: 0.3, ease: 'power3.out',
        onComplete: () => {
          gsap.to(orb2Ref.current, {
            y: 25, x: -15, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
        }
      });
      gsap.to(orb3Ref.current, {
        opacity: 1, scale: 1, duration: 1.8, delay: 0.6, ease: 'power3.out',
        onComplete: () => {
          gsap.to(orb3Ref.current, {
            y: -20, x: 10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
        }
      });

      // ── Particles ──────────────────────────────────────────────
      particlesRef.current.forEach((p, i) => {
        if (!p) return;
        gsap.set(p, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0,
          scale: Math.random() * 0.8 + 0.2,
        });
        gsap.to(p, {
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 2 + 1,
          delay: Math.random() * 1.5,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(p, {
              y: `-=${Math.random() * 120 + 60}`,
              x: `+=${(Math.random() - 0.5) * 80}`,
              opacity: 0,
              duration: Math.random() * 5 + 4,
              ease: 'none',
              repeat: -1,
              repeatRefresh: true,
            });
          }
        });
      });

      // ── Card entrance ──────────────────────────────────────────
      gsap.set(cardRef.current, { opacity: 0, y: 60, rotateX: 15, scale: 0.92 });
      gsap.to(cardRef.current, {
        opacity: 1, y: 0, rotateX: 0, scale: 1,
        duration: 1, delay: 0.4, ease: 'expo.out',
      });

      // ── Logo bounce ────────────────────────────────────────────
      gsap.set(logoRef.current, { opacity: 0, scale: 0, rotation: -180 });
      gsap.to(logoRef.current, {
        opacity: 1, scale: 1, rotation: 0,
        duration: 0.9, delay: 0.8, ease: 'back.out(2)',
        onComplete: () => {
          gsap.to(logoRef.current, {
            boxShadow: '0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.2)',
            duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
        }
      });

      // ── Title & subtitle stagger ───────────────────────────────
      gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 20 });
      gsap.to([titleRef.current, subtitleRef.current], {
        opacity: 1, y: 0,
        duration: 0.7, delay: 1.1, stagger: 0.15, ease: 'power3.out'
      });

      // ── Form fields slide in ───────────────────────────────────
      gsap.set([field1Ref.current, field2Ref.current], { opacity: 0, x: -30 });
      gsap.to([field1Ref.current, field2Ref.current], {
        opacity: 1, x: 0,
        duration: 0.6, delay: 1.35, stagger: 0.12, ease: 'power3.out'
      });

      // ── Button pop ────────────────────────────────────────────
      gsap.set(btnRef.current, { opacity: 0, scale: 0.8, y: 15 });
      gsap.to(btnRef.current, {
        opacity: 1, scale: 1, y: 0,
        duration: 0.6, delay: 1.65, ease: 'back.out(1.8)'
      });

      // ── Footer fade ───────────────────────────────────────────
      gsap.set(footerRef.current, { opacity: 0 });
      gsap.to(footerRef.current, {
        opacity: 1, duration: 0.8, delay: 1.9, ease: 'power2.out'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBtnHover = (enter) => {
    gsap.to(btnRef.current, {
      scale: enter ? 1.04 : 1,
      boxShadow: enter
        ? '0 12px 40px rgba(245,158,11,0.55)'
        : '0 8px 24px rgba(245,158,11,0.35)',
      duration: 0.25, ease: 'power2.out'
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Button shake + pulse on submit
    gsap.to(btnRef.current, {
      scale: 0.96, duration: 0.1, ease: 'power2.in',
      onComplete: () => gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: 'elastic.out(1.2, 0.5)' })
    });

    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
      if (data.success) {
        // Success: card flies up and out
        gsap.to(cardRef.current, {
          y: -80, opacity: 0, scale: 1.05,
          duration: 0.6, ease: 'power3.in',
          onComplete: () => {
            localStorage.setItem('aToken', data.token);
            setAToken(data.token);
            navigate('/dashboard');
            toast.success('Welcome, Admin!');
          }
        });
      } else {
        // Error: card shake
        gsap.to(cardRef.current, {
          x: -12, duration: 0.07, ease: 'power2.inOut', yoyo: true, repeat: 7,
          onComplete: () => gsap.set(cardRef.current, { x: 0 })
        });
        toast.error(data.message);
      }
    } catch (error) {
      gsap.to(cardRef.current, {
        x: -12, duration: 0.07, ease: 'power2.inOut', yoyo: true, repeat: 7,
        onComplete: () => gsap.set(cardRef.current, { x: 0 })
      });
      toast.error(error.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-amber-500/40';
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  // 20 floating particles
  const particles = Array.from({ length: 20 });

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1230 50%, #060b18 100%)' }}
    >
      {/* Floating orbs */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        ref={orb3Ref}
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }}
      />

      {/* Particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          ref={el => (particlesRef.current[i] = el)}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ background: i % 3 === 0 ? '#f59e0b' : i % 3 === 1 ? '#818cf8' : '#00d4ff', opacity: 0 }}
        />
      ))}

      {/* Card */}
      <div
        ref={cardRef}
        className="w-full max-w-md relative"
        style={{ perspective: '1000px' }}
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              ref={logoRef}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))',
                border: '1px solid rgba(245,158,11,0.5)',
                boxShadow: '0 0 30px rgba(245,158,11,0.3)',
              }}
            >
              <ShieldCheck size={30} style={{ color: '#f59e0b' }} />
            </div>
            <h2 ref={titleRef} className="text-2xl font-bold text-white">Admin Portal</h2>
            <p ref={subtitleRef} className="text-slate-400 text-sm mt-1">Sign in to access the dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div ref={field1Ref}>
              <label className="block text-sm text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@medinexus.ai"
                  className={inputBase} style={inputStyle}
                />
              </div>
            </div>

            <div ref={field2Ref}>
              <label className="block text-sm text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputBase} pr-11`} style={inputStyle}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              ref={btnRef}
              type="submit"
              disabled={loading}
              onMouseEnter={() => handleBtnHover(true)}
              onMouseLeave={() => handleBtnHover(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'black',
                boxShadow: '0 8px 24px rgba(245,158,11,0.35)',
              }}
            >
              <ShieldCheck size={16} />
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

          <p ref={footerRef} className="text-center text-xs text-slate-500 mt-6">
            Restricted access — authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
