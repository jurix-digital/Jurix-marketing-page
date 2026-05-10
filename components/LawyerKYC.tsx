// This component implements the KYC  verification flow for lawyers and law clerks on the Jurix platform. 
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Albert_Sans } from 'next/font/google';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-albert-sans',
});

type Step = 'personal' | 'professional' | 'declaration' | 'review' | 'success';
type ProfileType = 'lawyer' | 'clerk';
type SupportedDocType =
  | 'aadhaar'
  | 'pan'
  | 'address_proof'
  | 'passport_photo'
  | 'signature'
  | 'bar_council_id'
  | 'experience_certificate'
  | 'clerk_id_card'
  | 'educational_certificate'
  | 'certificate_of_practice'
  | 'self_declaration_form';

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
  clerkIdCard: File | null;
  educationalCertificate: File | null;
  // Declaration
  confirmGenuine: boolean;
  isRegisteredAdvocate: boolean;
  agreeToTerms: boolean;
  agreeToCodeOfConduct: boolean;
  selfDeclarationForm: File | null;
  // Personal Information
  name: string;
  email: string;
  phone: string;
  designation: string;
  city: string;
  barCouncilNumber: string;
  referredBy: string;
}

interface UploadedDocument {
  label: string;
  fileName: string;
  fileUrl: string;
  docType: string;
}

interface KycValidationResult {
  valid: boolean;
  reason?: string;
  profileType?: ProfileType;
  roleLabel?: string;
  docTypes?: SupportedDocType[];
  mandatoryDocTypes?: SupportedDocType[];
}

interface FileUploadBoxProps {
  label: string;
  field: keyof FormData;
  accept: string;
  maxSize: string;
  file: File | null;
  onFileUpload: (field: keyof FormData, file: File) => void;
}

interface StepIndicatorProps {
  currentStep: Step;
}

interface LawyerKYCProps {
  initialToken?: string;
  initialProfileId?: string;
}

interface UploadConfig {
  label: string;
  field: keyof FormData;
  docType: SupportedDocType;
  accept: string;
  maxSize: string;
}

const DEFAULT_ALLOWED_DOC_TYPES_BY_ROLE: Record<ProfileType, SupportedDocType[]> = {
  lawyer: [
    'aadhaar',
    'pan',
    'bar_council_id',
    'address_proof',
    'passport_photo',
    'signature',
    'experience_certificate',
    'certificate_of_practice',
    'self_declaration_form',
  ],
  clerk: [
    'aadhaar',
    'pan',
    'address_proof',
    'passport_photo',
    'signature',
    'experience_certificate',
    'clerk_id_card',
    'educational_certificate',
    'self_declaration_form',
  ],
};

const DEFAULT_MANDATORY_DOC_TYPES_BY_ROLE: Record<ProfileType, SupportedDocType[]> = {
  lawyer: [
    'aadhaar',
    'pan',
    'bar_council_id',
    'address_proof',
    'passport_photo',
    'signature',
    'experience_certificate',
  ],
  clerk: [
    'aadhaar',
    'pan',
    'address_proof',
    'passport_photo',
    'signature',
    'experience_certificate',
    'clerk_id_card',
    'educational_certificate',
  ],
};

const PERSONAL_UPLOAD_CONFIGS: UploadConfig[] = [
  {
    label: 'Aadhar Card',
    field: 'aadharCard',
    docType: 'aadhaar',
    accept: 'image/*,.pdf',
    maxSize: '4MB',
  },
  {
    label: 'PAN Card',
    field: 'panCard',
    docType: 'pan',
    accept: 'image/*,.pdf',
    maxSize: '4MB',
  },
  {
    label: 'Address Proof',
    field: 'addressProof',
    docType: 'address_proof',
    accept: 'image/*,.pdf',
    maxSize: '4MB',
  },
  {
    label: 'Passport Size Photo',
    field: 'passportPhoto',
    docType: 'passport_photo',
    accept: 'image/*',
    maxSize: '4MB',
  },
  {
    label: 'Signature',
    field: 'signature',
    docType: 'signature',
    accept: 'image/*',
    maxSize: '4MB',
  },
];

const PROFESSIONAL_UPLOAD_CONFIGS: Record<ProfileType, UploadConfig[]> = {
  lawyer: [
    {
      label: 'Bar Council ID Proof',
      field: 'barCouncilId',
      docType: 'bar_council_id',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
    {
      label: 'Experience Certificate',
      field: 'experienceCertificate',
      docType: 'experience_certificate',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
    {
      label: 'Certificate Of Practice',
      field: 'certificateOfPractice',
      docType: 'certificate_of_practice',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
  ],
  clerk: [
    {
      label: "Advocate's Employment Proof",
      field: 'experienceCertificate',
      docType: 'experience_certificate',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
    {
      label: 'Proof of Identity',
      field: 'clerkIdCard',
      docType: 'clerk_id_card',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
    {
      label: 'Educational Certificate',
      field: 'educationalCertificate',
      docType: 'educational_certificate',
      accept: 'image/*,.pdf',
      maxSize: '4MB',
    },
  ],
};

const STEP_SEQUENCE: Step[] = [
    'personal',
    'professional',
    'declaration',
    'review',
    'success',
  ];

const ROLE_LABELS: Record<ProfileType, string> = {
  lawyer: 'Lawyer',
  clerk: 'Clerk',
};

const REQUIRED_PERSONAL_FIELDS: Array<keyof FormData> = [
  'name',
  'email',
  'phone',
  'designation',
  'city',
];

const REQUIRED_DECLARATION_FIELDS: Array<keyof FormData> = [
  'confirmGenuine',
  'isRegisteredAdvocate',
  'agreeToTerms',
  'agreeToCodeOfConduct',
];

const DOCUMENT_FIELD_MAP: Record<SupportedDocType, keyof FormData> = {
  aadhaar: 'aadharCard',
  pan: 'panCard',
  address_proof: 'addressProof',
  passport_photo: 'passportPhoto',
  signature: 'signature',
  bar_council_id: 'barCouncilId',
  experience_certificate: 'experienceCertificate',
  clerk_id_card: 'clerkIdCard',
  educational_certificate: 'educationalCertificate',
  certificate_of_practice: 'certificateOfPractice',
  self_declaration_form: 'selfDeclarationForm',
};

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

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
    { id: 'declaration', label: 'Declaration' },
    { id: 'review', label: 'Review' },
    { id: 'success', label: 'Success' },
  ] as const;

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

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



  function resolveKycMetadata(data: KycValidationResult) {
    validateKycRoleMetadata(data);
    validateKycDocumentMetadata(data);

    const allowedDocTypes = new Set(
      DEFAULT_ALLOWED_DOC_TYPES_BY_ROLE[data.profileType],
    );

    const docTypes = filterAllowedDocTypes(
      data.docTypes,
      allowedDocTypes,
    );

    const mandatoryDocTypes = filterAllowedDocTypes(
      data.mandatoryDocTypes,
      allowedDocTypes,
    );

    validateResolvedDocTypes(docTypes, mandatoryDocTypes);

    return {
      profileType: data.profileType,
      roleLabel: data.roleLabel || ROLE_LABELS[data.profileType],
      docTypes,
      mandatoryDocTypes,
    };
  }

  function validateKycRoleMetadata(data: KycValidationResult): asserts data is KycValidationResult & {
    profileType: ProfileType;
  } {
    if (!data.valid || !data.profileType) {
      throw new Error('KYC role metadata is missing from token validation');
    }
  }

  function validateKycDocumentMetadata(
    data: KycValidationResult,
  ): asserts data is KycValidationResult & {
    docTypes: SupportedDocType[];
    mandatoryDocTypes: SupportedDocType[];
  } {
    if (!data.docTypes?.length || !data.mandatoryDocTypes?.length) {
      throw new Error('KYC document metadata is missing from token validation');
    }
  }

  function validateResolvedDocTypes(
    docTypes: SupportedDocType[],
    mandatoryDocTypes: SupportedDocType[],
  ) {
    if (!docTypes.length || !mandatoryDocTypes.length) {
      throw new Error('KYC document metadata is invalid for this profile type');
    }
  }

  function filterAllowedDocTypes(
    docTypes: SupportedDocType[],
    allowedDocTypes: Set<SupportedDocType>,
  ) {
    return docTypes.filter((docType) => allowedDocTypes.has(docType));
  }

export default function LawyerKYC({ initialToken, initialProfileId }: LawyerKYCProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDeepLinkFlow = pathname.startsWith('/kyc/');
  const searchToken = searchParams.get('token') || '';
  const searchProfileId = searchParams.get('profileId') || '';
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [token, setToken] = useState(initialToken || searchToken);
  const [profileId, setProfileId] = useState(initialProfileId || searchProfileId);
  const [profileType, setProfileType] = useState<ProfileType>('lawyer');
  const [roleLabel, setRoleLabel] = useState('Lawyer');
  const [allowedDocTypes, setAllowedDocTypes] = useState<SupportedDocType[]>(
    DEFAULT_ALLOWED_DOC_TYPES_BY_ROLE.lawyer,
  );
  const [mandatoryDocTypes, setMandatoryDocTypes] = useState<SupportedDocType[]>(
    DEFAULT_MANDATORY_DOC_TYPES_BY_ROLE.lawyer,
  );
  const [hasValidatedRole, setHasValidatedRole] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    aadharCard: null,
    panCard: null,
    addressProof: null,
    passportPhoto: null,
    signature: null,
    barCouncilId: null,
    experienceCertificate: null,
    certificateOfPractice: null,
    clerkIdCard: null,
    educationalCertificate: null,
    confirmGenuine: false,
    isRegisteredAdvocate: false,
    agreeToTerms: false,
    agreeToCodeOfConduct: false,
    selfDeclarationForm: null,
    name: '',
    email: '',
    phone: '',
    designation: '',
    city: '',
    barCouncilNumber: '',
    referredBy: '',
  });


  const updateFormData = <K extends keyof FormData>(field: K,value: FormData[K],) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const hasRequiredPersonalDetails = () =>
    REQUIRED_PERSONAL_FIELDS.every(
      (field) => Boolean(formData[field]),
    );

  const hasCompletedDeclarations = () =>
    REQUIRED_DECLARATION_FIELDS.every(
      (field) => Boolean(formData[field]),
    );

  const isClerkProfile = profileType === 'clerk';
  const requiresRoleValidation = Boolean(token && profileId);
  const visiblePersonalUploads = PERSONAL_UPLOAD_CONFIGS.filter(({ docType }) =>
    allowedDocTypes.includes(docType),
  );
  const visibleProfessionalUploads = PROFESSIONAL_UPLOAD_CONFIGS[profileType].filter(({ docType }) =>
    allowedDocTypes.includes(docType),
  );
  const DECLARATION_ROLE_LABELS: Record<ProfileType, string> = {
  clerk: 'I am a registered or practicing Law Clerk.',
  lawyer: 'I am a registered advocate under the Bar Council of India.',
  };

  const declarationRoleLabel =DECLARATION_ROLE_LABELS[profileType];

  useEffect(() => {
    if (!token && searchToken) {
      setToken(searchToken);
    }

    if (!profileId && searchProfileId) {
      setProfileId(searchProfileId);
    }

    if (isDeepLinkFlow && !initialToken && !token && !searchToken) {
      setMessage({
        type: 'error',
        text: 'Invalid KYC link. Please use the link sent to you with token and profileId.',
      });
    }

    if (isDeepLinkFlow && !initialProfileId && !profileId && !searchProfileId) {
      setMessage({
        type: 'error',
        text: 'Invalid KYC link. Please use the link sent to you with token and profileId.',
      });
    }
  }, [initialProfileId, initialToken, isDeepLinkFlow, profileId, searchProfileId, searchToken, token]);

  useEffect(() => {
    if (!requiresRoleValidation) {
      return;
    }

    let isMounted = true;

    const validateToken = async () => {
      setIsValidatingToken(true);

      try {
        const response = await fetch(`/api/kyc/validate-token/${profileId}?token=${encodeURIComponent(token)}`);
        const data: KycValidationResult = await response.json();

        if (!response.ok || !data.valid) {
          throw new Error(data.reason || 'Invalid KYC link');
        }

        if (!isMounted) {
          return;
        }

        const metadata = resolveKycMetadata(data);
        setProfileType(metadata.profileType);
        setRoleLabel(metadata.roleLabel);
        setAllowedDocTypes(metadata.docTypes);
        setMandatoryDocTypes(metadata.mandatoryDocTypes);
        setHasValidatedRole(true);
        setMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error(error);
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Invalid KYC link',
        });
        setHasValidatedRole(false);
      } finally {
        if (isMounted) {
          setIsValidatingToken(false);
        }
      }
    };

    validateToken();

    return () => {
      isMounted = false;
    };
  }, [profileId, requiresRoleValidation, token]);

  useEffect(() => {
    if (!isClerkProfile) {
      return;
    }

    setFormData((current) => ({
      ...current,
      barCouncilNumber: '',
      barCouncilId: null,
      certificateOfPractice: null,
    }));
  }, [isClerkProfile]);

  const handleFileUpload = (field: keyof FormData,file: File,) => {
   updateFormData(field, file);
  };

  const handleCheckboxChange = (field: keyof FormData,value: boolean,) => {
    updateFormData(field, value);
  };

  const navigateStep = (direction: 1 | -1) => {
  const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
  const nextIndex = currentIndex + direction;

  if (nextIndex >= 0 && nextIndex < STEP_SEQUENCE.length) {
    setCurrentStep(STEP_SEQUENCE[nextIndex]);
  }
  };

  const nextStep = () => navigateStep(1);

  const prevStep = () => navigateStep(-1);

  const getMissingUploadLabels = (uploads: UploadConfig[]) =>
    uploads
      .filter(({ docType, field }) => mandatoryDocTypes.includes(docType) && !formData[field])
      .map(({ label }) => label);

  const validateCurrentStep = () => {
  const validationMap: Partial<Record<Step, () => string | null>> = {
    personal: () => {
      if (!hasRequiredPersonalDetails()) {
        return 'Please fill in all required personal details before continuing.';
      }

      if (!isClerkProfile) {
        return null;
      }

      const missingPersonalUploads =
        getMissingUploadLabels(visiblePersonalUploads);

      return missingPersonalUploads.length
        ? `Please upload: ${missingPersonalUploads.join(', ')}.`
        : null;
    },

    professional: () => {
      if (!isClerkProfile) {
        return null;
      }

      const missingProfessionalUploads =
        getMissingUploadLabels(visibleProfessionalUploads);

      return missingProfessionalUploads.length
        ? `Please upload: ${missingProfessionalUploads.join(', ')}.`
        : null;
    },

    declaration: () => {
      return hasCompletedDeclarations()
        ? null
        : 'Please complete all required declarations before continuing.';
    },
  };

    return validationMap[currentStep]?.() || null;
  };

  const handleContinue = () => {
    const validationError = validateCurrentStep();

    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setMessage(null);
    nextStep();
  };

  const uploadDocument = async (file: File, docType: string): Promise<UploadedDocument> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('docType', docType);
    uploadFormData.append('profileId', profileId);
    uploadFormData.append('token', token);

    const res = await fetch('/api/kyc/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload ${docType}`);
    }

    const data = await res.json();
    return {
      label: docType,
      fileName: file.name,
      fileUrl: data.fileUrl || data.url,
      docType,
    };
  };

  const getDocumentMap = () =>
  Object.entries(DOCUMENT_FIELD_MAP).reduce<Record<string, File | null>>((documentMap, [docType, field]) => {
    if (allowedDocTypes.includes(docType as SupportedDocType)) {
      documentMap[docType] =
        formData[field] as File | null;
    }

    return documentMap;
  }, {});

  const handleSubmitKYC = async () => {
    setMessage(null);
    setLoading(true);

    try {
      // Validate required fields
      if (!hasRequiredPersonalDetails()) {
        throw new Error('Please fill in all required fields');
      }

      if (!token || !profileId) {
        throw new Error('Missing token or profileId');
      }

      if (isClerkProfile) {
        const missingRequiredUploads = getMissingUploadLabels([
          ...visiblePersonalUploads,
          ...visibleProfessionalUploads,
        ]);

        if (missingRequiredUploads.length > 0) {
          throw new Error(`Please upload: ${missingRequiredUploads.join(', ')}.`);
        }
      }

      if (!hasCompletedDeclarations()){
        throw new Error('Please complete all required declarations before submitting.');
      }

      // Upload documents individually
      const documents: UploadedDocument[] = [];

      const documentMap = getDocumentMap();

      for (const [docType, file] of Object.entries(documentMap)) {
        if (file) {
          const uploadedDoc = await uploadDocument(file, docType);
          documents.push(uploadedDoc);
        }
      }

      // Submit KYC with all required fields
      const submitPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        designation: formData.designation,
        city: formData.city,
        barCouncilNumber: isClerkProfile ? '' : formData.barCouncilNumber,
        referredBy: formData.referredBy,
        profileId,
        documents,
        verification: {
          requestId: '',
          status: 'pending',
          docType: 'kyc',
          extractedData: {},
        },
      };

      const submitFormData = new FormData();
      submitFormData.append('data', JSON.stringify(submitPayload));
      submitFormData.append('token', token);
      submitFormData.append('profileId', profileId);

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

  const showLoadingState = requiresRoleValidation && !message && (isValidatingToken || !hasValidatedRole);
  const canRenderForm = !requiresRoleValidation || hasValidatedRole;

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className={`${albertSans.className} text-2xl md:text-3xl font-bold text-[#2D3136] mb-2`}>
            {roleLabel} KYC Verification
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

          {showLoadingState ? (
            <p className="text-[#666666] text-sm md:text-base">Validating KYC link...</p>
          ) : canRenderForm ? (
            <>
              <StepIndicator currentStep={currentStep} />

              {currentStep === 'personal' && (
                <div className="space-y-4 md:space-y-6">
                  <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4`}>
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Designation *</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {!isClerkProfile && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bar Council Number</label>
                        <input
                          type="text"
                          value={formData.barCouncilNumber}
                          onChange={(e) => setFormData({ ...formData, barCouncilNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Referred By (Optional)</label>
                      <input
                        type="text"
                        value={formData.referredBy}
                        onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <h2 className={`${albertSans.className} text-lg md:text-xl font-semibold text-[#2D3136] mb-4 mt-6`}>
                    Personal Verification
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {visiblePersonalUploads.map((upload) => (
                      <FileUploadBox
                        key={upload.docType}
                        label={upload.label}
                        field={upload.field}
                        accept={upload.accept}
                        maxSize={upload.maxSize}
                        file={formData[upload.field] as File | null}
                        onFileUpload={handleFileUpload}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleContinue}
                    className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                    style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
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
                    {visibleProfessionalUploads.map((upload) => (
                      <FileUploadBox
                        key={upload.docType}
                        label={upload.label}
                        field={upload.field}
                        accept={upload.accept}
                        maxSize={upload.maxSize}
                        file={formData[upload.field] as File | null}
                        onFileUpload={handleFileUpload}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <button
                      onClick={prevStep}
                      className={`${albertSans.className} w-full md:w-auto px-8 py-3 rounded-full text-[#2D3136] border border-gray-300 hover:bg-gray-50 text-sm md:text-base`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                      style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
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
                      <span className="text-sm md:text-base text-gray-600">{declarationRoleLabel}</span>
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

                  {allowedDocTypes.includes('self_declaration_form') && (
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
                  )}

                  <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <button
                      onClick={prevStep}
                      className={`${albertSans.className} w-full md:w-auto px-8 py-3 rounded-full text-[#2D3136] border border-gray-300 hover:bg-gray-50 text-sm md:text-base`}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleContinue}
                      disabled={!hasCompletedDeclarations()}
                      className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                      style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
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
                      {visiblePersonalUploads.map((upload) => (
                        <li key={upload.docType} className={formData[upload.field] ? 'text-green-600' : 'text-red-600'}>
                          {formData[upload.field] ? '✓' : '✗'} {upload.label}
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-medium text-gray-800 pt-4">Professional Documents</h3>
                    <ul className="text-sm space-y-2">
                      {visibleProfessionalUploads.map((upload) => (
                        <li key={upload.docType} className={formData[upload.field] ? 'text-green-600' : 'text-red-600'}>
                          {formData[upload.field] ? '✓' : '✗'} {upload.label}
                        </li>
                      ))}
                    </ul>

                    <h3 className="font-medium text-gray-800 pt-4">Declaration</h3>
                    <ul className="text-sm space-y-2">
                      <li className={formData.confirmGenuine ? 'text-green-600' : 'text-red-600'}>
                        {formData.confirmGenuine ? '✓' : '✗'} Documents confirmed genuine
                      </li>
                      <li className={formData.isRegisteredAdvocate ? 'text-green-600' : 'text-red-600'}>
                        {formData.isRegisteredAdvocate ? '✓' : '✗'} {isClerkProfile ? 'Law Clerk status confirmed' : 'Registered advocate confirmed'}
                      </li>
                      <li className={formData.agreeToTerms ? 'text-green-600' : 'text-red-600'}>
                        {formData.agreeToTerms ? '✓' : '✗'} Terms & Conditions agreed
                      </li>
                      <li className={formData.agreeToCodeOfConduct ? 'text-green-600' : 'text-red-600'}>
                        {formData.agreeToCodeOfConduct ? '✓' : '✗'} Code of conduct agreed
                      </li>
                      {allowedDocTypes.includes('self_declaration_form') && (
                        <li className={formData.selfDeclarationForm ? 'text-green-600' : 'text-gray-500'}>
                          {formData.selfDeclarationForm ? '✓' : '○'} Self Declaration Form (optional)
                        </li>
                      )}
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
                      style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
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
                    KYC Completed
                  </h2>

                  <div className="bg-[#F5F0E6] p-4 md:p-6 rounded-lg w-full max-w-md mb-4 md:mb-6">
                    <p className="text-gray-700 text-sm md:text-base">
                      The Jurix team will get in touch soon.
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/'}
                    className={`${albertSans.className} w-full md:w-auto inline-flex items-center justify-center gap-4 px-[10px] py-[10px] rounded-full text-[#FCFCFC] text-[14px] md:text-[16px] shadow-md hover:opacity-90 cursor-pointer`}
                    style={{ background: 'linear-gradient(90deg, #4261A8 0%, #304A85 100%)', paddingLeft: '20px' }}
                  >
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
