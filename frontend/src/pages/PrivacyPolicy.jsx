import React from 'react'
import { Shield, Eye, Lock, Database, Bell, UserCheck, Globe, Mail } from 'lucide-react'

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)' }}>
        <Icon size={18} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    <div className="text-sm leading-7 pl-12" style={{ color: '#8ba3c7' }}>
      {children}
    </div>
  </div>
)

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(99,102,241,0.08) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(14,165,233,0.15), transparent)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(14,165,233,0.15)', color: '#00d4ff', border: '1px solid rgba(14,165,233,0.3)' }}>
            <Shield size={13} /> Legal Document
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Privacy <span style={{ color: '#00d4ff' }}>Policy</span>
          </h1>
          <p className="text-base" style={{ color: '#8ba3c7' }}>
            Last updated: <span className="text-white font-medium">May 3, 2025</span>
          </p>
          <p className="mt-4 text-sm leading-7 max-w-xl mx-auto" style={{ color: '#8ba3c7' }}>
            At MediCare+, your privacy is our priority. This policy explains how we collect, use, and protect your personal and medical information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        <Section icon={Eye} title="Information We Collect">
          <p>We collect the following types of information to provide and improve our services:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'Personal details: name, email address, phone number, and date of birth.',
              'Medical information: health history, symptoms, prescriptions, and appointment records.',
              'Account credentials: encrypted passwords and authentication tokens.',
              'Usage data: pages visited, features used, and interaction logs for improving the platform.',
              'Device information: IP address, browser type, and operating system for security purposes.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Database} title="How We Use Your Information">
          <p>Your information is used solely to deliver a safe and personalized healthcare experience:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'Booking and managing doctor appointments on your behalf.',
              'Providing AI-powered health insights and chatbot assistance.',
              'Sending appointment reminders, health tips, and important notifications.',
              'Processing payments securely through Razorpay.',
              'Improving platform features based on anonymized usage analytics.',
              'Complying with applicable healthcare regulations and legal obligations.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Lock} title="Data Security">
          <p>
            We implement industry-standard security measures to protect your data at all times:
          </p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'All data is encrypted in transit using TLS/SSL protocols.',
              'Passwords are hashed using bcrypt — we never store plain-text passwords.',
              'Medical records are stored in isolated, access-controlled databases.',
              'Regular security audits and vulnerability assessments are conducted.',
              'Two-factor authentication (OTP) is available for account protection.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Globe} title="Sharing of Information">
          <p>
            We do <span className="text-white font-semibold">not</span> sell, rent, or trade your personal information to third parties. We may share data only in the following limited circumstances:
          </p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'With your assigned doctor to facilitate consultation and treatment.',
              'With payment processors (Razorpay) strictly for transaction purposes.',
              'With cloud service providers (Cloudinary, MongoDB Atlas) for secure storage.',
              'When required by law, court order, or government authority.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Bell} title="Cookies & Tracking">
          <p>
            MediCare+ uses cookies and similar technologies to enhance your experience:
          </p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'Session cookies to keep you logged in securely.',
              'Preference cookies to remember your settings and language.',
              'Analytics cookies (anonymized) to understand how users interact with the platform.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            You can disable cookies through your browser settings, though some features may not function correctly without them.
          </p>
        </Section>

        <Section icon={UserCheck} title="Your Rights">
          <p>As a user of MediCare+, you have the following rights regarding your data:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              'Access: Request a copy of all personal data we hold about you.',
              'Correction: Update or correct inaccurate information in your profile.',
              'Deletion: Request permanent deletion of your account and associated data.',
              'Portability: Export your medical records and appointment history.',
              'Opt-out: Unsubscribe from newsletters and marketing communications at any time.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00d4ff' }} />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Shield} title="Children's Privacy">
          <p>
            MediCare+ is not intended for children under the age of 13. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal data, please contact us immediately and we will delete it promptly.
          </p>
        </Section>

        <Section icon={Mail} title="Contact Us">
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to us:
          </p>
          <div className="mt-4 p-5 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p><span className="text-white font-medium">Email:</span> privacy@medinexus.ai</p>
            <p><span className="text-white font-medium">Phone:</span> +91-11-4567-8900</p>
            <p><span className="text-white font-medium">Address:</span> 42, Connaught Place, New Delhi – 110001, India</p>
          </div>
          <p className="mt-4">
            We aim to respond to all privacy-related inquiries within <span className="text-white font-medium">72 hours</span>.
          </p>
        </Section>

        {/* Policy update note */}
        <div className="mt-4 p-5 rounded-2xl text-sm" style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: '#8ba3c7' }}>
          <span className="text-white font-semibold">Policy Updates: </span>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date. Continued use of MediCare+ after changes constitutes your acceptance of the updated policy.
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
