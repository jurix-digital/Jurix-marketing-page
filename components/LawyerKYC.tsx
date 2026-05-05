'use client';

import { useState, useEffect } from 'react';
import { Albert_Sans } from 'next/font/google';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-albert-sans',
});

type Step = 'personal' | 'professional' | 'declaration' | 'review' | 'success';

interface FormData {
  // Personal Verification
  aadharCard: File | null;
  panCard: File | null;
  addressProof: File | null;
  passportPhoto: File | null;
  signature: File | null;
  // Professional Credentials
  barCouncilId: File | null;
  experienceCertificate: File | null;
  certificateOfPractice: File | null;
  // Declaration
  confirmGenuine: boolean;
  isRegisteredAdvocate: boolean;
  agreeToTerms: boolean;
  agreeToCodeOfConduct: boolean;
  selfDeclarationForm: File | null;
}

interface FileUploadBoxProps {
  label: string;
  field: keyof FormData;
  accept: string;
  maxSize: string;
  file: File | null;
  onFileUpload: (field: keyof FormData, file: File) => void;
}

function FileUploadBox({ label, field, accept, maxSize, file, onFileUpload }: FileUploadBoxProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative">
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            onFileUpload(field, selectedFile);
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {file ? (
        <div className="text-green-600">
          <p className="font-medium text-sm md:text-base truncate">{file.name}</p>
          <p className="text-xs md:text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 font-medium mb-1 text-sm md:text-base">{label}</p>
          <p className="text-xs md:text-sm text-gray-400">Max {maxSize}</p>
        </div>
      )}
    </div>
  );
}

interface StepIndicatorProps {
  currentStep: Step;
}

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
    { id: 'declaration', label: 'Declaration' },
    { id: 'review', label: 'Review' },
    { id: 'success', label: 'Success' },
  ] as const;

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-base font-medium ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <p
                  className={`text-[8px] md:text-xs mt-1 md:mt-2 text-center leading-tight ${
                    isCurrent ? 'text-blue-500 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-0.5 md:mx-2 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LawyerKYC() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [token, setToken] = useState('');
  const [profileId, setProfileId] = useState('');
  const [formData, setFormData] = useState<FormData>({
    aadharCard: null,
    panCard: null,
    addressProof: null,
    passportPhoto: null,
    signature: null,
    barCouncilId: null,
    experienceCertificate: null,
    certificateOfPractice: null,
    confirmGenuine: false,
    isRegisteredAdvocate: false,
    agreeToTerms: false,
    agreeToCodeOfConduct: false,
    selfDeclarationForm: null,
  });

  // Check for token and profileId in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlProfileId = urlParams.get('profileId');
      if (urlToken) setToken(urlToken);
      if (urlProfileId) setProfileId(urlProfileId);
    }
  }, []);

  const handleFileUpload = (field: keyof FormData, file: File) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleCheckboxChange = (field: keyof FormData, value: boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const nextStep = () => {
    const steps: Step[] = ['personal', 'professional', 'declaration', 'review', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['personal', 'professional', 'declaration', 'review', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmitKYC = async () => {
    setMessage(null);
    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      // Add documents
      if (formData.aadharCard) submitFormData.append('aadharCard', formData.aadharCard);
      if (formData.panCard) submitFormData.append('panCard', formData.panCard);
      if (formData.addressProof) submitFormData.append('addressProof', formData.addressProof);
      if (formData.passportPhoto) submitFormData.append('passportPhoto', formData.passportPhoto);
      if (formData.signature) submitFormData.append('signature', formData.signature);
      if (formData.barCouncilId) submitFormData.append('barCouncilId', formData.barCouncilId);
      if (formData.experienceCertificate) submitFormData.append('experienceCertificate', formData.experienceCertificate);
      if (formData.certificateOfPractice) submitFormData.append('certificateOfPractice', formData.certificateOfPractice);
      if (formData.selfDeclarationForm) submitFormData.append('selfDeclarationForm', formData.selfDeclarationForm);
      
      // Add declarations
      submitFormData.append('confirmGenuine', formData.confirmGenuine.toString());
      submitFormData.append('isRegisteredAdvocate', formData.isRegisteredAdvocate.toString());
      submitFormData.append('agreeToTerms', formData.agreeToTerms.toString());
      submitFormData.append('agreeToCodeOfConduct', formData.agreeToCodeOfConduct.toString());
      
      // Add token and profileId if available
      if (token) submitFormData.append('token', token);
      if (profileId) submitFormData.append('profileId', profileId);

      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        body: submitFormData,
      });

      if (!res.ok) {
        throw new Error('Failed to submit KYC');
      }

      setMessage({ type: 'success', text: 'KYC submitted successfully' });
      nextStep();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to submit KYC. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className={`${albertSans.className} text-2xl md:text-3xl font-bold text-[#2D3136] mb-2`}>
            Lawyer KYC Verification
          </h1>
          <p className="text-[#666666] mb-6 md:mb-8 text-sm md:text-base">
            Complete your KYC verification to start using Jurix platform
          </p>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <StepIndicator currentStep={currentStep} />

          {currentStep === 'personal' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                Personal Verification
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FileUploadBox
                  label="Aadhar Card"
                  field="aadharCard"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.aadharCard}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="PAN Card"
                  field="panCard"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.panCard}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="Address Proof"
                  field="addressProof"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.addressProof}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="Passport Size Photo"
                  field="passportPhoto"
                  accept="image/*"
                  maxSize="4MB"
                  file={formData.passportPhoto}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="Signature"
                  field="signature"
                  accept="image/*"
                  maxSize="4MB"
                  file={formData.signature}
                  onFileUpload={handleFileUpload}
                />
              </div>

              <button
                onClick={nextStep}
                className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
              >
                Continue to Professional Details
              </button>
            </div>
          )}

          {currentStep === 'professional' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                Professional Credentials
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FileUploadBox
                  label="Bar Council ID Proof"
                  field="barCouncilId"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.barCouncilId}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="Experience Certificate"
                  field="experienceCertificate"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.experienceCertificate}
                  onFileUpload={handleFileUpload}
                />
                <FileUploadBox
                  label="Certificate Of Practice"
                  field="certificateOfPractice"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.certificateOfPractice}
                  onFileUpload={handleFileUpload}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  onClick={prevStep}
                  className={`${albertSans.className} w-full md:w-auto px-8 py-3 rounded-full text-[#2D3136] border border-gray-300 hover:bg-gray-50 text-sm md:text-base`}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                  style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
                >
                  Continue to Declaration
                </button>
              </div>
            </div>
          )}

          {currentStep === 'declaration' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                Declaration
              </h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                By submitting this form, I declare that all the details and documents provided are true to the best of my knowledge. I understand that providing false information may result in suspension or termination of my Jurix account.
              </p>

              <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                Consent & Agreement
              </h2>
              <div className="space-y-3 md:space-y-4 mb-6">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.confirmGenuine}
                    onChange={(e) => handleCheckboxChange('confirmGenuine', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 flex-shrink-0"
                  />
                  <span className="text-sm md:text-base text-gray-600">I confirm that all documents uploaded are genuine and belong to me.</span>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.isRegisteredAdvocate}
                    onChange={(e) => handleCheckboxChange('isRegisteredAdvocate', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 flex-shrink-0"
                  />
                  <span className="text-sm md:text-base text-gray-600">I am a registered advocate under the Bar Council of India.</span>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleCheckboxChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 flex-shrink-0"
                  />
                  <span className="text-sm md:text-base text-gray-600">I agree to Jurix&apos;s Terms & Conditions and Privacy Policy.</span>
                </label>
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToCodeOfConduct}
                    onChange={(e) => handleCheckboxChange('agreeToCodeOfConduct', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 flex-shrink-0"
                  />
                  <span className="text-sm md:text-base text-gray-600">I agree to abide by the code of conduct and ethical guidelines.</span>
                </label>
              </div>

              <div className="mb-6">
                <h3 className={`${albertSans.className} text-lg font-semibold text-[#2D3136] mb-3`}>
                  Self Declaration Form (Optional)
                </h3>
                <FileUploadBox
                  label="Upload Self Declaration Form"
                  field="selfDeclarationForm"
                  accept="image/*,.pdf"
                  maxSize="4MB"
                  file={formData.selfDeclarationForm}
                  onFileUpload={handleFileUpload}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  onClick={prevStep}
                  className={`${albertSans.className} w-full md:w-auto px-8 py-3 rounded-full text-[#2D3136] border border-gray-300 hover:bg-gray-50 text-sm md:text-base`}
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.confirmGenuine || !formData.isRegisteredAdvocate || !formData.agreeToTerms || !formData.agreeToCodeOfConduct}
                  className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                  style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
                >
                  Proceed to Review
                </button>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-4 md:space-y-6">
              <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                Review & Submit
              </h2>
              
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-800">Personal Documents</h3>
                <ul className="text-sm space-y-2">
                  <li className={formData.aadharCard ? 'text-green-600' : 'text-red-600'}>
                    {formData.aadharCard ? '✓' : '✗'} Aadhar Card
                  </li>
                  <li className={formData.panCard ? 'text-green-600' : 'text-red-600'}>
                    {formData.panCard ? '✓' : '✗'} PAN Card
                  </li>
                  <li className={formData.addressProof ? 'text-green-600' : 'text-red-600'}>
                    {formData.addressProof ? '✓' : '✗'} Address Proof
                  </li>
                  <li className={formData.passportPhoto ? 'text-green-600' : 'text-red-600'}>
                    {formData.passportPhoto ? '✓' : '✗'} Passport Size Photo
                  </li>
                  <li className={formData.signature ? 'text-green-600' : 'text-red-600'}>
                    {formData.signature ? '✓' : '✗'} Signature
                  </li>
                </ul>

                <h3 className="font-medium text-gray-800 pt-4">Professional Documents</h3>
                <ul className="text-sm space-y-2">
                  <li className={formData.barCouncilId ? 'text-green-600' : 'text-red-600'}>
                    {formData.barCouncilId ? '✓' : '✗'} Bar Council ID Proof
                  </li>
                  <li className={formData.experienceCertificate ? 'text-green-600' : 'text-red-600'}>
                    {formData.experienceCertificate ? '✓' : '✗'} Experience Certificate
                  </li>
                  <li className={formData.certificateOfPractice ? 'text-green-600' : 'text-red-600'}>
                    {formData.certificateOfPractice ? '✓' : '✗'} Certificate Of Practice
                  </li>
                </ul>

                <h3 className="font-medium text-gray-800 pt-4">Declaration</h3>
                <ul className="text-sm space-y-2">
                  <li className={formData.confirmGenuine ? 'text-green-600' : 'text-red-600'}>
                    {formData.confirmGenuine ? '✓' : '✗'} Documents confirmed genuine
                  </li>
                  <li className={formData.isRegisteredAdvocate ? 'text-green-600' : 'text-red-600'}>
                    {formData.isRegisteredAdvocate ? '✓' : '✗'} Registered advocate confirmed
                  </li>
                  <li className={formData.agreeToTerms ? 'text-green-600' : 'text-red-600'}>
                    {formData.agreeToTerms ? '✓' : '✗'} Terms & Conditions agreed
                  </li>
                  <li className={formData.agreeToCodeOfConduct ? 'text-green-600' : 'text-red-600'}>
                    {formData.agreeToCodeOfConduct ? '✓' : '✗'} Code of conduct agreed
                  </li>
                  <li className={formData.selfDeclarationForm ? 'text-green-600' : 'text-gray-500'}>
                    {formData.selfDeclarationForm ? '✓' : '○'} Self Declaration Form (optional)
                  </li>
                </ul>
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  onClick={prevStep}
                  className={`${albertSans.className} w-full md:w-auto px-8 py-3 rounded-full text-[#2D3136] border border-gray-300 hover:bg-gray-50 text-sm md:text-base`}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitKYC}
                  disabled={loading}
                  className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                  style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
                >
                  {loading ? 'Submitting...' : 'Submit KYC'}
                </button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="flex flex-col items-center text-center py-6 md:py-8 px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className={`${albertSans.className} text-xl md:text-2xl font-semibold text-[#2D3136] mb-2`}>
                Thank you! Your KYC has been submitted
              </h2>
              
              <div className="bg-[#F5F0E6] p-4 md:p-6 rounded-lg w-full max-w-md mb-4 md:mb-6">
                <p className="text-gray-700 text-sm md:text-base">
                  Your KYC has been successfully submitted. Our team will review your documents to complete the verification process.
                </p>
              </div>
              
              <div className="w-full max-w-md mb-4 md:mb-6">
                <h3 className={`${albertSans.className} font-semibold text-[#2D3136] mb-2 text-sm md:text-base`}>
                  Important Note
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  Verification typically takes 2-3 business days. You will receive a notification once your account is approved.
                </p>
              </div>
              
              <button
                onClick={() => window.location.href = '/'}
                className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                style={{background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px'}}
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
