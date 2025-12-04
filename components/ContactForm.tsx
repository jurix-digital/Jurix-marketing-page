'use client';

import { useState } from 'react';
import { Geist } from 'next/font/google';

const albertSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    message: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!agreed) {
      setMessage({ type: 'error', text: 'Please agree to the Terms and Privacy Policy' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setMessage({ type: 'success', text: 'Form submitted successfully!' });
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        occupation: '',
        message: '',
      });
      setAgreed(false);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-transparent p-0"
    >
      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
      {/* 2-column layout for first 4 fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <label className={`${albertSans.className} block text-[14px] tracking-[0] text-[#1A1C1E] mb-2`}>
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-[10px] bg-[#EEE9E2] border border-[#D3CEC6] text-[#85807B] placeholder:text-[#85807B] text-[14px] focus:outline-none focus:ring-0"
          />
        </div>

        <div>
          <label className={`${albertSans.className} block text-[14px] tracking-[0] text-[#1A1C1E] mb-2`}>
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Enter your phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-[10px] bg-[#EEE9E2] border border-[#D3CEC6] text-[#85807B] placeholder:text-[#85807B] text-[14px] focus:outline-none focus:ring-0"
          />
        </div>

        <div>
          <label className={`${albertSans.className} block text-[14px] tracking-[0] text-[#1A1C1E] mb-2`}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-[10px] bg-[#EEE9E2] border border-[#D3CEC6] text-[#85807B] placeholder:text-[#85807B] text-[14px] focus:outline-none focus:ring-0"
          />
        </div>

        <div>
          <label className={`${albertSans.className} block text-[14px] tracking-[0] text-[#1A1C1E] mb-2`}>
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            placeholder="Enter your occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-[10px] bg-[#EEE9E2] border border-[#D3CEC6] text-[#85807B] placeholder:text-[#85807B] text-[14px] focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Message full width */}
      <div className="mt-6">
        <label className={`${albertSans.className} block text-[14px] tracking-[0] text-[#1A1C1E] mb-2`}>
          Message
        </label>
        <textarea
          name="message"
          placeholder="Add your message here"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 rounded-[10px] bg-[#EEE9E2] border border-[#D3CEC6] text-[#85807B] placeholder:text-[#85807B] text-[14px] focus:outline-none focus:ring-0"
        />
      </div>

      {/* Terms */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => setAgreed(a => !a)}
          className={`w-6 h-6 border rounded-md flex items-center justify-center cursor-pointer ${
            agreed ? 'bg-[#1f3774] border-[#1f3774]' : 'border-[#d4c4b2]'
          }`}
        >
          {agreed && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        <label
          className="text-sm text-[#333333]"
          onClick={() => setAgreed(a => !a)}
        >
          I agree to the{' '}
          <a href="#" className="underline">
            Terms and Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`${albertSans.className} inline-flex items-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[16px] shadow-md hover:opacity-90 disabled:opacity-60 cursor-pointer`}
          style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
        >
          Submit
          <img src="/arrow-icon.svg" alt="Arrow" />
        </button>
      </div>
    </form>
  );
}
