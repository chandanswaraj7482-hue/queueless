import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { socket } from '../utils/socket';
import {
  Stethoscope,
  CheckCircle,
  CheckCircle2,
  Clock,
  Play,
  User,
  HeartPulse,
  Pill,
  Plus,
  Trash2,
  Printer,
  FileText,
  X,
  AlertCircle,
  Sparkles,
  Download,
  Share2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Zap,
  BellRing,
  ArrowRight,
  Calendar,
  MessageCircle,
  FlaskConical,
  Send,
  Check,
  Copy,
  ExternalLink,
  QrCode,
  Volume2,
  Activity,
  FileDown,
  Star,
  BookmarkPlus,
  Sliders,
  Car,
  Coffee,
  PhoneCall,
  RefreshCw,
} from 'lucide-react';
import { getAuthSession, setAuthSession, clearAuthSession } from '../utils/auth';
import { playClinicChime, playClinicVoiceAnnouncement } from '../utils/audio';

import { API_BASE_URL } from '../config/api';

export interface RxCustomSection {
  id: string;
  title: string;
  content: string;
}

interface MedicineRow {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface ClinicalPreset {
  id: string;
  name: string;
  diagnosis: string;
  medicines: MedicineRow[];
  labTests?: string[];
  clinicalNotes: string;
}

const COMMON_LAB_TESTS = [
  'Complete Blood Count (CBC)',
  'Fasting Blood Sugar (FBS)',
  'Post-Prandial Blood Sugar (PPBS)',
  'HbA1c (3-Month Sugar)',
  'Lipid Profile (Cholesterol)',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT / Creatinine)',
  'Thyroid Profile (T3, T4, TSH)',
  'Serum Electrolytes (Na+, K+)',
  'Urine Routine & Microscopic',
  'Chest X-Ray (PA View)',
  '12-Lead Resting ECG',
  'Ultrasound Whole Abdomen (USG)',
  'Dengue NS1 Antigen / IgM',
  'Typhoid Widal / Typhidot',
  'Vitamin D3 & Vitamin B12',
];

const COMMON_DIAGNOSES = [
  'Viral Fever & Bodyache (Acute Pyrexia)',
  'Acute URTI (Cold, Cough & Throat Infection)',
  'Acid Peptic Disease / GERD / Hyperacidity',
  'Primary Essential Hypertension',
  'Type 2 Diabetes Mellitus',
  'Acute Gastroenteritis / Diarrhea',
  'Tension Headache / Migraine',
  'Lumbar Spondylosis / Low Back Pain',
  'Allergic Rhinitis / Bronchial Asthma',
  'Enteric / Typhoid Fever',
  'Urinary Tract Infection (UTI)',
  'Osteoarthritis Knee Joint',
];

const COMMON_ADVICE_CHIPS = [
  '💧 Drink plenty of warm water & stay hydrated (3L/day)',
  '🌶️ Avoid spicy, oily, fried & street junk food',
  '🛌 Strict bed rest for 48 hours',
  '🍬 Strictly avoid sugar, sweets, potatoes & refined carbs (Diabetic Diet)',
  '🧂 Low salt (Namak kam) & low oil heart-healthy diet',
  '🥛 Take all medicines after meals with warm water',
  '📋 Review in OPD with fresh lab investigation reports',
  '🚨 Visit Emergency immediately if severe breathlessness or chest pain occurs',
];

const QUICK_DRUG_PRESETS = [
  { name: '+ Paracetamol 650mg', row: { medicineName: 'Tab. Paracetamol 650mg (Dolo)', dosage: '1 Tab', frequency: '1-0-1', duration: '3 Days', instructions: 'After Food (खाने के बाद - SOS for fever/pain)' } },
  { name: '+ Pan-D 40mg (Acidity)', row: { medicineName: 'Cap. Pan-D (Pantoprazole + Domperidone)', dosage: '1 Cap', frequency: '1-0-0', duration: '5 Days', instructions: 'Before Food (सुबह खाली पेट 30 mins पहले)' } },
  { name: '+ Azithromycin 500mg', row: { medicineName: 'Tab. Azithromycin 500mg (Azee)', dosage: '1 Tab', frequency: '1-0-0', duration: '3 Days', instructions: 'After Food (खाने के बाद)' } },
  { name: '+ Cetirizine 10mg', row: { medicineName: 'Tab. Cetirizine 10mg (Okacet)', dosage: '1 Tab', frequency: '0-0-1', duration: '5 Days', instructions: 'At Bedtime (रात को सोते समय)' } },
  { name: '+ Augmentin 625mg', row: { medicineName: 'Tab. Augmentin 625mg (Amoxyclav)', dosage: '1 Tab', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food (खाने के बाद)' } },
  { name: '+ Cough Syrup 10ml', row: { medicineName: 'Syp. Ascoril-D / Grilinctus', dosage: '10 ml', frequency: '1-1-1', duration: '5 Days', instructions: 'After Food (गुनगुने पानी से)' } },
  { name: '+ Electral ORS', row: { medicineName: 'Sachet Electral ORS', dosage: '1 Sachet', frequency: 'Twice Daily', duration: '3 Days', instructions: 'In 1L boiled and cooled water' } },
  { name: '+ Telma 40mg (BP)', row: { medicineName: 'Tab. Telmisartan 40mg (Telma)', dosage: '1 Tab', frequency: '1-0-0', duration: '30 Days', instructions: 'Morning after breakfast (नाश्ते के बाद)' } },
  { name: '+ Metformin 500mg', row: { medicineName: 'Tab. Metformin 500mg (Glycomet)', dosage: '1 Tab', frequency: '1-0-1', duration: '30 Days', instructions: 'After Food (खाने के बाद)' } },
  { name: '+ Ondansetron 4mg', row: { medicineName: 'Tab. Ondansetron 4mg (Emeset)', dosage: '1 Tab', frequency: 'SOS', duration: '3 Days', instructions: 'Before Food (उल्टी महसूस होने पर)' } },
  { name: '+ Montair-LC', row: { medicineName: 'Tab. Montair-LC (Montelukast + Levo)', dosage: '1 Tab', frequency: '0-0-1', duration: '7 Days', instructions: 'At Bedtime (रात को सोते समय)' } },
  { name: '+ Neurobion Forte', row: { medicineName: 'Tab. Neurobion Forte (B-Complex)', dosage: '1 Tab', frequency: '1-0-0', duration: '15 Days', instructions: 'After Food (रोज सुबह नाश्ते के बाद)' } },
];

const generateWhatsAppRxUrl = (data: any) => {
  const phone = data.patient?.mobile || data.patientMobile || '';
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);

  let text = `🏥 *${data.clinic?.name || data.clinicName || 'Queueless Hospital OPD'}*\n`;
  text += `👨‍⚕️ *Dr. ${data.doctor?.name || data.doctorName || 'Consultant'}* (${data.doctor?.specialty || 'General Physician'})\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📋 *OFFICIAL DIGITAL PRESCRIPTION*\n`;
  text += `👤 *Patient:* ${data.patient?.name || data.patientName || 'Patient'}\n`;
  text += `🎫 *Token:* ${data.tokenNumber || data.token || ''} | *Rx #:* ${data.rxNumber || 'Official'}\n`;
  if (data.diagnosis) {
    text += `🩺 *Diagnosis:* ${data.diagnosis}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;

  const meds = data.medicines || data.prescriptions || [];
  if (meds.length > 0) {
    text += `💊 *PRESCRIBED MEDICINES:*\n`;
    meds.forEach((m: any, i: number) => {
      text += `${i + 1}. *${m.medicineName}*\n`;
      text += `   Dosage: ${m.dosage || '1 Tab'} | Timing: ${m.frequency || '1-0-1'}\n`;
      text += `   Duration: ${m.duration || '5 Days'}${m.instructions ? ` (${m.instructions})` : ''}\n`;
    });
    text += `\n`;
  }

  const tests = data.labTests || [];
  if (tests.length > 0) {
    text += `🧪 *INVESTIGATIONS / LAB TESTS:*\n`;
    tests.forEach((t: string) => {
      text += `• ${t}\n`;
    });
    text += `\n`;
  }

  const adv = data.advice || data.clinicalNotes;
  if (adv) {
    text += `📝 *DOCTOR ADVICE:* ${adv}\n\n`;
  }

  const customs = data.customSections || [];
  if (Array.isArray(customs) && customs.length > 0) {
    customs.forEach((cs: any) => {
      text += `📌 *${(cs.title || 'SPECIAL NOTE').toUpperCase()}:*\n${cs.content}\n\n`;
    });
  }

  if (data.followUpDays) {
    text += `📅 *Next Review:* After ${data.followUpDays} days in OPD\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  const tokenRef = data.publicToken || data.tokenNumber || data.token;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://queueless-os.vercel.app';
  text += `🔗 *View & Download Official PDF Prescription:*\n`;
  text += `${baseUrl}/token/${tokenRef}\n\n`;
  text += `🔐 *Synced to Patient ID:* Login at ${baseUrl}/portal with +91 ${cleanPhone}\n`;
  text += `_Powered by Queueless Healthcare OS_`;

  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`;
};

const CLINICAL_PRESETS: ClinicalPreset[] = [
  {
    id: 'VIRAL_FEVER',
    name: '🤒 Viral Fever & Bodyache',
    diagnosis: 'Acute Febrile Illness / Viral Pyrexia with Generalized Myalgia',
    medicines: [
      { medicineName: 'Paracetamol 650mg (Dolo)', dosage: '1 Tab', frequency: '1-0-1 (After Food)', duration: '5 Days', instructions: 'Take SOS if fever > 100°F' },
      { medicineName: 'Cetirizine 10mg', dosage: '1 Tab', frequency: '0-0-1 (At Bedtime)', duration: '5 Days', instructions: 'Take with warm water' },
      { medicineName: 'Pantoprazole 40mg (Pan-40)', dosage: '1 Tab', frequency: '1-0-0 (Empty Stomach)', duration: '5 Days', instructions: '30 mins before breakfast' },
      { medicineName: 'Vitamin C + Zinc (Limcee)', dosage: '1 Chewable', frequency: '1-0-0 (After Meals)', duration: '10 Days', instructions: 'Chew tablet daily' },
    ],
    labTests: ['Complete Blood Count (CBC)', 'Dengue NS1 Antigen / IgM', 'Malarial Parasite (MP Smear)'],
    clinicalNotes: 'Plenty of oral fluids (ORS, coconut water, soup). Bed rest for 48 hours. Report back if fever > 102°F or persists beyond 3 days.',
  },
  {
    id: 'COUGH_COLD',
    name: '🤧 Cough & Cold / URTI',
    diagnosis: 'Acute Upper Respiratory Tract Infection (URTI) with Productive Cough',
    medicines: [
      { medicineName: 'Azithromycin 500mg (Azee)', dosage: '1 Tab', frequency: '1-0-0 (After Lunch)', duration: '3 Days', instructions: 'Complete full 3-day course' },
      { medicineName: 'Levocetirizine + Montelukast', dosage: '1 Tab', frequency: '0-0-1 (Night)', duration: '5 Days', instructions: 'Take at bedtime' },
      { medicineName: 'Ascoril D+ / Cough Linctus Syrup', dosage: '10 ml', frequency: '1-1-1 (TDS)', duration: '5 Days', instructions: 'Take after meals' },
      { medicineName: 'Paracetamol 650mg', dosage: '1 Tab', frequency: 'SOS (As Needed)', duration: '3 Days', instructions: 'For throat ache / fever' },
    ],
    labTests: ['Chest X-Ray (PA View)', 'Complete Blood Count (CBC)'],
    clinicalNotes: 'Warm water gargle with pinch of salt twice daily. Steam inhalation morning and night. Avoid ice-cold beverages and citrus juices.',
  },
  {
    id: 'ACIDITY_GERD',
    name: '🔥 Acidity & GERD',
    diagnosis: 'Gastroesophageal Reflux Disease (GERD) with Acute Acid Dyspepsia',
    medicines: [
      { medicineName: 'Rabeprazole 20mg + Domperidone 30mg (Rabekind-DSR)', dosage: '1 Cap', frequency: '1-0-0 (Morning)', duration: '14 Days', instructions: 'Empty stomach 30 mins before food' },
      { medicineName: 'Mucaine Gel / Digene Antacid Gel', dosage: '10 ml', frequency: '1-1-1 (After Food)', duration: '7 Days', instructions: 'Take 1 hour after meals' },
      { medicineName: 'Dicyclomine 10mg + Paracetamol', dosage: '1 Tab', frequency: 'SOS (If pain occurs)', duration: '3 Days', instructions: 'For acute abdominal colic' },
    ],
    labTests: ['Ultrasound Whole Abdomen (USG)', 'Serum Amylase & Lipase'],
    clinicalNotes: 'Avoid spicy, oily, and deep-fried foods. Eat small frequent meals. Maintain a 2-hour gap between dinner and sleeping.',
  },
  {
    id: 'HYPERTENSION',
    name: '🩺 Hypertension Routine',
    diagnosis: 'Essential Hypertension (Stage 1 / Maintenance Review)',
    medicines: [
      { medicineName: 'Telmisartan 40mg (Telma)', dosage: '1 Tab', frequency: '1-0-0 (Morning)', duration: '30 Days', instructions: 'Take with breakfast' },
      { medicineName: 'Amlodipine 5mg (Amlong)', dosage: '1 Tab', frequency: '0-0-1 (Night)', duration: '30 Days', instructions: 'Take at bed time' },
    ],
    labTests: ['12-Lead Resting ECG', 'Lipid Profile (Cholesterol)', 'Kidney Function Test (KFT / Creatinine)', 'Urine Routine & Microscopic'],
    clinicalNotes: 'Strict low-sodium (low-salt) diet. 30 minutes of brisk daily walking. Check BP weekly and keep a logbook.',
  },
  {
    id: 'DIABETES_REVIEW',
    name: '🩸 Diabetes Regular Review',
    diagnosis: 'Type 2 Diabetes Mellitus (Routine Glycemic Management)',
    medicines: [
      { medicineName: 'Metformin 500mg SR (Glycomet-SR)', dosage: '1 Tab', frequency: '1-0-1 (With Food)', duration: '30 Days', instructions: 'Take during or immediately after meals' },
      { medicineName: 'Glimepiride 1mg (Amaryl)', dosage: '1 Tab', frequency: '1-0-0 (Before Breakfast)', duration: '30 Days', instructions: '15 mins before morning meal' },
    ],
    labTests: ['Fasting Blood Sugar (FBS)', 'Post-Prandial Blood Sugar (PPBS)', 'HbA1c (3-Month Sugar)', 'Lipid Profile', 'Kidney Function Test (KFT / Creatinine)'],
    clinicalNotes: 'Strictly avoid direct sweets, sugar, and sweetened beverages. Daily morning walk. Check fasting & PP blood sugar every 2 weeks.',
  },
];

interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  weight: string;
}

interface QueueItem {
  id: string;
  token: string;
  publicToken?: string;
  status: string;
  visitReason?: string;
  joinedAt: string;
  completedAt?: string;
  feeAmount?: number;
  paymentStatus?: string;
  isFollowUp?: boolean;
  diagnosis?: string;
  vitalsJson?: string;
  prescriptionJson?: string;
  clinicalNotes?: string;
  virtualWait?: {
    location?: 'LOBBY' | 'CAR' | 'CAFE';
    vehiclePlate?: string;
    notes?: string;
    pagedAt?: string;
    pagedMessage?: string;
    insurance?: {
      payerName: string;
      memberId: string;
      groupNumber: string;
      coverageStatus: string;
      networkStatus: string;
      copay: number;
      deductibleTotal: number;
      deductibleMet: number;
      deductibleRemaining: number;
      coinsurance: string;
      priorAuthRequired: boolean;
      verifiedAt: string;
      copayPaid?: boolean;
      copayPaymentRef?: string;
    };
  };
  patient: {
    id?: string;
    name: string;
    mobile: string;
    email?: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
    address?: string;
    emergencyContact?: string;
  };
  doctor?: {
    id: string;
    displayName: string;
    specialty?: string;
    roomNumber: string;
  };
}

export const DoctorView: React.FC = () => {
  const [clinicId, setClinicId] = useState<string>('85234de5-9582-4220-a9c7-e862fa7e742d');
  const [clinicData, setClinicData] = useState<any>(null);
  const [doctors, setDoctors] = useState<Array<{ id: string; displayName: string; specialty: string; roomNumber: string }>>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Doctor Authentication & PIN Gate (Strict Session or PIN verification - No URL bypass)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      !!getAuthSession('DOCTOR') ||
      !!getAuthSession('ADMIN')
    );
  });
  const [loginDoctorId, setLoginDoctorId] = useState<string>('');
  const [doctorPasswordInput, setDoctorPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const submitDoctorLogin = async (docId: string, pinOrPwd: string) => {
    if (!docId) {
      setLoginError('Please select a doctor cabin.');
      return;
    }
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'DOCTOR',
          doctorId: docId,
          password: pinOrPwd.trim(),
          clinicId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSession('DOCTOR', {
          clinicId: data.clinicId,
          doctorId: data.doctorId,
          doctorName: data.name,
        });
        setSelectedDoctorId(data.doctorId);
        setIsAuthenticated(true);
        setDoctorPasswordInput('');
      } else {
        setLoginError(data.error || 'Incorrect PIN or password.');
      }
    } catch (err) {
      setLoginError('Could not verify credentials with clinic server.');
    } finally {
      setLoggingIn(false);
    }
  };

  // Doctor Change PIN / Password Modal State
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState<string | null>(null);
  const [changePinSuccess, setChangePinSuccess] = useState<string | null>(null);
  const [savingPin, setSavingPin] = useState(false);

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError(null);
    setChangePinSuccess(null);

    if (!newPinInput.trim()) {
      setChangePinError('Please enter a new PIN or password.');
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setChangePinError('New PINs do not match.');
      return;
    }

    setSavingPin(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/${clinicData?.id || clinicId}/doctors/${selectedDoctorId}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPinInput.trim(),
          newPin: newPinInput.trim(),
          newPassword: newPinInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChangePinSuccess('Your Doctor PIN / Password was updated successfully!');
        setTimeout(() => {
          setShowChangePinModal(false);
          setCurrentPinInput('');
          setNewPinInput('');
          setConfirmPinInput('');
          setChangePinSuccess(null);
        }, 1500);
      } else {
        setChangePinError(data.error || 'Failed to update PIN.');
      }
    } catch {
      setChangePinError('Network error connecting to clinic server.');
    } finally {
      setSavingPin(false);
    }
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const docId = loginDoctorId || selectedDoctorId || (doctors.length > 0 ? doctors[0].id : '');
    if (!docId) {
      setLoginError('Please select a doctor cabin.');
      return;
    }
    if (!doctorPasswordInput.trim()) {
      setLoginError('Please enter doctor PIN or password.');
      return;
    }
    submitDoctorLogin(docId, doctorPasswordInput);
  };

  const handleDoctorLogout = () => {
    clearAuthSession('DOCTOR');
    clearAuthSession('ADMIN');
    setIsAuthenticated(false);
  };

  // EMR Consultation Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [vitals, setVitals] = useState<Vitals>({ bp: '120/80', pulse: '76', temp: '98.6', spo2: '99', weight: '' });
  const [medicines, setMedicines] = useState<MedicineRow[]>([
    { medicineName: 'Tab. Paracetamol 650mg', dosage: '1 Tab', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food (खाने के बाद)' },
  ]);
  const [labTests, setLabTests] = useState<string[]>([]);
  const [customLabInput, setCustomLabInput] = useState('');
  const [followUpDays, setFollowUpDays] = useState<number>(7);
  const [customFollowUpDaysInput, setCustomFollowUpDaysInput] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('Maintain good hydration. Follow up after 5 days if fever persists.');
  const [savingConsultation, setSavingConsultation] = useState(false);
  const [dispatchSuccessBanner, setDispatchSuccessBanner] = useState<string | null>(null);
  const [customDoctorPresets, setCustomDoctorPresets] = useState<ClinicalPreset[]>(() => {
    try {
      const saved = localStorage.getItem('queueless_doctor_custom_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Custom Clinical Sections in Consultation Desk (User: "kuch ko remove v kar skta ha and kuch ka custom add v kar skt ha")
  const [customSections, setCustomSections] = useState<RxCustomSection[]>([]);
  const [showAddSectionDrawer, setShowAddSectionDrawer] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Rx Letterhead Section Visibility Controls (Doctor can toggle any on/off)
  const [rxVisibility, setRxVisibility] = useState({
    showHospitalHeader: true,
    showDoctorInfo: true,
    showPatientInfo: true,
    showVitals: true,
    showDiagnosis: true,
    showMedicines: true,
    showLabTests: true,
    showAdvice: true,
    showFollowUp: true,
    showSignature: true,
    showQueuelessBottom: true,
  });
  const [showRxCustomizer, setShowRxCustomizer] = useState(false);
  const [modalCustomSections, setModalCustomSections] = useState<RxCustomSection[]>([]);

  // Google AI Studio (Gemini 1.5 Flash) Copilot State
  const [aiGeneratingSummary, setAiGeneratingSummary] = useState(false);
  const [aiSummaryResult, setAiSummaryResult] = useState<string | null>(null);
  const [showAiDictationModal, setShowAiDictationModal] = useState(false);
  const [rawDictationText, setRawDictationText] = useState('');
  const [aiParsingDictation, setAiParsingDictation] = useState(false);

  const handleGenerateAiSummary = async (lang: 'hi' | 'en') => {
    setAiGeneratingSummary(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ai/summarize-rx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: activePatient?.patient?.name || 'Patient',
          doctorName: currentDoc?.displayName || 'Doctor',
          diagnosis,
          medicines,
          advice: clinicalNotes,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setAiSummaryResult(data.summary);
        setClinicalNotes((prev) => `${prev ? prev + '\n\n' : ''}💡 [Gemini AI ${lang === 'hi' ? 'Hindi' : 'English'} Directions]: ${data.summary}`);
        playClinicChime();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGeneratingSummary(false);
    }
  };

  const handleParseAiDictation = async () => {
    if (!rawDictationText.trim()) return;
    setAiParsingDictation(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/ai/dictate-rx`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes: rawDictationText.trim() }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        if (d.diagnosis) setDiagnosis(d.diagnosis);
        if (d.vitals) setVitals((prev) => ({ ...prev, ...d.vitals }));
        if (Array.isArray(d.medicines) && d.medicines.length > 0) {
          setMedicines((prev) => [...prev, ...d.medicines]);
        }
        if (Array.isArray(d.labTests) && d.labTests.length > 0) {
          setLabTests((prev) => Array.from(new Set([...prev, ...d.labTests])));
        }
        if (d.advice) setClinicalNotes(d.advice);
        if (d.followUpDays) setFollowUpDays(d.followUpDays);
        setShowAiDictationModal(false);
        setRawDictationText('');
        playClinicChime();
        setDispatchSuccessBanner('✨ Gemini AI successfully structured clinical dictation into prescription form!');
        setTimeout(() => setDispatchSuccessBanner(null), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiParsingDictation(false);
    }
  };

  const handleAddPresetSection = (title: string, defaultContent: string) => {
    const newSec: RxCustomSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      content: defaultContent,
    };
    setCustomSections((prev) => [...prev, newSec]);
  };

  const handleCreateCustomSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSec: RxCustomSection = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newSectionTitle.trim(),
      content: newSectionContent.trim(),
    };
    setCustomSections((prev) => [...prev, newSec]);
    setNewSectionTitle('');
    setNewSectionContent('');
    setShowAddSectionDrawer(false);
  };

  const handleRemoveSection = (id: string) => {
    setCustomSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSection = (id: string, field: 'title' | 'content', value: string) => {
    setCustomSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddModalSection = (title: string, defaultContent: string) => {
    const newSec: RxCustomSection = {
      id: `sec-mod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      content: defaultContent,
    };
    setModalCustomSections((prev) => [...prev, newSec]);
  };

  const handleRemoveModalSection = (id: string) => {
    setModalCustomSections((prev) => prev.filter((s) => s.id !== id));
  };

  const { slug, doctorId: routeDoctorId } = useParams<{ slug?: string; doctorId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const queryDoctor = searchParams.get('doctor') || searchParams.get('cabin') || searchParams.get('doc');
  const targetDoctorIdentifier = routeDoctorId || queryDoctor;
  const activeSlug = slug || 'caremax-opd';

  // Dedicated Doctor Links Modal & Copy State
  const [showDoctorLinksModal, setShowDoctorLinksModal] = useState(false);
  const [copiedDoctorId, setCopiedDoctorId] = useState<string | null>(null);

  const resolveMatchingDoctor = (doctorList: any[], identifier?: string | null) => {
    if (!doctorList || doctorList.length === 0) return null;
    if (!identifier) return doctorList[0];
    const clean = identifier.trim().toLowerCase();

    // 1. Direct ID match
    const byId = doctorList.find((d) => d.id?.toLowerCase() === clean);
    if (byId) return byId;

    // 2. Room number match (e.g. "cabin-1", "cabin-2", "cabin 1", "cabin1")
    const byRoom = doctorList.find((d) => {
      const roomSlug = (d.roomNumber || '').toLowerCase().replace(/\s+/g, '-');
      const roomClean = (d.roomNumber || '').toLowerCase().replace(/\s+/g, '');
      return roomSlug === clean || roomClean === clean || d.roomNumber?.toLowerCase() === clean;
    });
    if (byRoom) return byRoom;

    // 3. Cabin digit match (e.g. "1" -> Cabin 1, "2" -> Cabin 2)
    const digitMatch = clean.match(/\d+/);
    if (digitMatch) {
      const digit = digitMatch[0];
      const byDigit = doctorList.find((d) => (d.roomNumber || '').includes(digit));
      if (byDigit) return byDigit;
    }

    // 4. Name match (e.g. "rohan", "rajiv", "priya", "amit")
    const byName = doctorList.find((d) => {
      const nameClean = (d.displayName || '').toLowerCase();
      return nameClean.includes(clean);
    });
    if (byName) return byName;

    return doctorList[0];
  };

  const copyDoctorCabinLink = (doc: { id: string; roomNumber?: string; displayName?: string }) => {
    const cabinSlug = doc.roomNumber
      ? doc.roomNumber.toLowerCase().replace(/\s+/g, '-')
      : doc.id;
    const fullUrl = `${window.location.origin}/doctor/${activeSlug}/${cabinSlug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedDoctorId(doc.id);
      setTimeout(() => setCopiedDoctorId(null), 2500);
    });
  };

  // Prescription Letterhead Modal
  const [viewingPrescription, setViewingPrescription] = useState<any | null>(null);

  // Load clinic details and doctors
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/clinics/public/${activeSlug}`)
      .then((res) => res.json())
      .then((data) => {
        let customHospitalName = 'Caremax OPD Central Hospital';
        let customHospitalLogo = '';
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (activeSlug && storedHospitals[activeSlug]) {
            customHospitalName = storedHospitals[activeSlug].name;
            customHospitalLogo = storedHospitals[activeSlug].logoUrl || '';
          } else if (activeSlug && activeSlug !== 'city-health') {
            const cleanWords = activeSlug
              .split('-')
              .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
              .join(' ');
            customHospitalName = cleanWords.toLowerCase().endsWith('opd') ||
              cleanWords.toLowerCase().endsWith('clinic') ||
              cleanWords.toLowerCase().endsWith('hospital') ||
              cleanWords.toLowerCase().endsWith('center')
              ? cleanWords
              : cleanWords + ' OPD';
          }
          if (!customHospitalLogo && activeSlug) {
            customHospitalLogo = localStorage.getItem('queueless_clinic_logo_' + activeSlug) || '';
          }
        } catch (e) {}

        const fallbackDocs = [
          { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', specialty: 'Orthopedics & Joint Care', roomNumber: 'Cabin 1' },
          { id: 'doc-2', displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology', roomNumber: 'Cabin 2' },
          { id: 'doc-3', displayName: 'Dr. Priya Patel, MBBS', specialty: 'Pediatrics', roomNumber: 'Cabin 3' },
          { id: 'doc-4', displayName: 'Dr. Amit Roy, MS', specialty: 'General Medicine', roomNumber: 'Cabin 4' },
        ];

        if (data.success && data.data) {
          setClinicData({
            ...data.data,
            name: data.data.name || customHospitalName,
            logoUrl: data.data.logoUrl || customHospitalLogo,
          });
          setClinicId(data.data.id);
          const docs = data.data.doctors?.length > 0 ? data.data.doctors : fallbackDocs;
          setDoctors(docs);
          const matched = resolveMatchingDoctor(docs, targetDoctorIdentifier);
          if (matched) {
            setSelectedDoctorId(matched.id);
            setLoginDoctorId(matched.id);
          }
        } else {
          setClinicData({
            id: activeSlug,
            name: customHospitalName,
            logoUrl: customHospitalLogo,
            slug: activeSlug,
            doctors: fallbackDocs,
          });
          setDoctors(fallbackDocs);
          const matched = resolveMatchingDoctor(fallbackDocs, targetDoctorIdentifier);
          if (matched) {
            setSelectedDoctorId(matched.id);
            setLoginDoctorId(matched.id);
          }
        }
      })
      .catch(() => {
        let customHospitalName = 'Caremax OPD Central Hospital';
        let customHospitalLogo = '';
        try {
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (activeSlug && storedHospitals[activeSlug]) {
            customHospitalName = storedHospitals[activeSlug].name;
            customHospitalLogo = storedHospitals[activeSlug].logoUrl || '';
          } else if (activeSlug && activeSlug !== 'city-health') {
            const cleanWords = activeSlug
              .split('-')
              .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
              .join(' ');
            customHospitalName = cleanWords.toLowerCase().endsWith('opd') ||
              cleanWords.toLowerCase().endsWith('clinic') ||
              cleanWords.toLowerCase().endsWith('hospital') ||
              cleanWords.toLowerCase().endsWith('center')
              ? cleanWords
              : cleanWords + ' OPD';
          }
          if (!customHospitalLogo && activeSlug) {
            customHospitalLogo = localStorage.getItem('queueless_clinic_logo_' + activeSlug) || '';
          }
        } catch (e) {}

        const fallbackDocs = [
          { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', specialty: 'Orthopedics & Joint Care', roomNumber: 'Cabin 1' },
          { id: 'doc-2', displayName: 'Dr. Rajiv Mehra, MD', specialty: 'Cardiology', roomNumber: 'Cabin 2' },
          { id: 'doc-3', displayName: 'Dr. Priya Patel, MBBS', specialty: 'Pediatrics', roomNumber: 'Cabin 3' },
          { id: 'doc-4', displayName: 'Dr. Amit Roy, MS', specialty: 'General Medicine', roomNumber: 'Cabin 4' },
        ];
        setClinicData({
          id: activeSlug,
          name: customHospitalName,
          logoUrl: customHospitalLogo,
          slug: activeSlug,
          doctors: fallbackDocs,
        });
        setDoctors(fallbackDocs);
        const matched = resolveMatchingDoctor(fallbackDocs, targetDoctorIdentifier);
        if (matched) {
          setSelectedDoctorId(matched.id);
          setLoginDoctorId(matched.id);
        }
      });
  }, [activeSlug]);

  // Update selected doctor if URL path or query parameter changes
  useEffect(() => {
    if (targetDoctorIdentifier && doctors.length > 0) {
      const matched = resolveMatchingDoctor(doctors, targetDoctorIdentifier);
      if (matched && matched.id !== selectedDoctorId) {
        setSelectedDoctorId(matched.id);
        setLoginDoctorId(matched.id);
      }
    }
  }, [targetDoctorIdentifier, doctors]);

  // Fetch queue for this doctor
  const fetchDoctorQueue = () => {
    if (!selectedDoctorId) return;
    fetch(`${API_BASE_URL}/api/v1/queue/clinics/${clinicId}/today?doctorId=${selectedDoctorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setQueue(data.data);
        } else {
          setQueue([
            {
              id: 'q-101',
              token: 'A-101',
              publicToken: 'QL-84921',
              status: 'IN_CONSULTATION',
              visitReason: 'Post-op knee ligament review',
              joinedAt: new Date(Date.now() - 35 * 60000).toISOString(),
              feeAmount: 250,
              paymentStatus: 'PAID',
              patient: {
                id: 'pat-1',
                name: 'Vikas Malhotra',
                mobile: '+91 98765 11223',
                age: 42,
                gender: 'Male',
                bloodGroup: 'B+',
              },
              doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
            },
            {
              id: 'q-102',
              token: 'A-102',
              publicToken: 'QL-84920',
              status: 'WAITING',
              visitReason: 'Joint stiffness & lower back pain',
              joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
              feeAmount: 250,
              paymentStatus: 'PAID',
              patient: {
                id: 'pat-2',
                name: 'Sunil Verma',
                mobile: '+91 98765 43210',
                age: 35,
                gender: 'Male',
                bloodGroup: 'O+',
              },
              doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
            },
            {
              id: 'q-103',
              token: 'A-103',
              publicToken: 'QL-84922',
              status: 'WAITING',
              visitReason: 'Routine health checkup',
              joinedAt: new Date(Date.now() - 10 * 60000).toISOString(),
              feeAmount: 0,
              isFollowUp: true,
              paymentStatus: 'FREE_FOLLOW_UP',
              patient: {
                id: 'pat-3',
                name: 'Ramesh Gupta',
                mobile: '+91 98111 22334',
                age: 51,
                gender: 'Male',
                bloodGroup: 'A+',
              },
              doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
            },
          ]);
        }
      })
      .catch(() => {
        setQueue([
          {
            id: 'q-101',
            token: 'A-101',
            publicToken: 'QL-84921',
            status: 'IN_CONSULTATION',
            visitReason: 'Post-op knee ligament review',
            joinedAt: new Date(Date.now() - 35 * 60000).toISOString(),
            feeAmount: 250,
            paymentStatus: 'PAID',
            patient: {
              id: 'pat-1',
              name: 'Vikas Malhotra',
              mobile: '+91 98765 11223',
              age: 42,
              gender: 'Male',
              bloodGroup: 'B+',
            },
            doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
          },
          {
            id: 'q-102',
            token: 'A-102',
            publicToken: 'QL-84920',
            status: 'WAITING',
            visitReason: 'Joint stiffness & lower back pain',
            joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
            feeAmount: 250,
            paymentStatus: 'PAID',
            patient: {
              id: 'pat-2',
              name: 'Sunil Verma',
              mobile: '+91 98765 43210',
              age: 35,
              gender: 'Male',
              bloodGroup: 'O+',
            },
            doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
          },
          {
            id: 'q-103',
            token: 'A-103',
            publicToken: 'QL-84922',
            status: 'WAITING',
            visitReason: 'Routine health checkup',
            joinedAt: new Date(Date.now() - 10 * 60000).toISOString(),
            feeAmount: 0,
            isFollowUp: true,
            paymentStatus: 'FREE_FOLLOW_UP',
            patient: {
              id: 'pat-3',
              name: 'Ramesh Gupta',
              mobile: '+91 98111 22334',
              age: 51,
              gender: 'Male',
              bloodGroup: 'A+',
            },
            doctor: { id: 'doc-1', displayName: 'Dr. Rohan Sharma, MD', roomNumber: 'Cabin 1' },
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctorQueue();

    socket.emit('join_clinic', clinicId);
    socket.on('queue_updated', fetchDoctorQueue);
    socket.on('patient_called', fetchDoctorQueue);

    return () => {
      socket.off('queue_updated');
      socket.off('patient_called');
    };
  }, [selectedDoctorId, clinicId]);

  const handleStatusChange = async (entryId: string, targetStatus: string) => {
    try {
      if (targetStatus === 'CALLED') {
        const targetPatient = queue.find((q) => q.id === entryId);
        if (targetPatient && targetPatient.token) {
          playClinicVoiceAnnouncement(
            targetPatient.token,
            currentDoc?.roomNumber ? `Cabin ${currentDoc.roomNumber}` : 'Cabin 1',
            currentDoc?.displayName,
            true
          );
        } else {
          playClinicChime();
        }
      }
      await fetch(`${API_BASE_URL}/api/v1/queue/${entryId}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetStatus, actorName: 'Doctor' }),
      });
      fetchDoctorQueue();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageCar = async (entryId: string, patientName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/queue/${entryId}/page-car`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorName: currentDoc?.displayName || 'Doctor',
          examRoom: currentDoc?.roomNumber ? `Cabin ${currentDoc.roomNumber}` : 'Cabin 1',
        }),
      });
      const resJson = await res.json();
      if (resJson.success) {
        setDispatchSuccessBanner(`📲 Paged ${patientName} via SMS! Called into ${currentDoc?.roomNumber || 'Cabin 1'}`);
        playClinicChime();
        setTimeout(() => setDispatchSuccessBanner(null), 5000);
        fetchDoctorQueue();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activePatient = queue.find((item) => item.status === 'CALLED' || item.status === 'IN_CONSULTATION');

  // Set default initial consultation values if existing
  useEffect(() => {
    if (activePatient?.diagnosis) setDiagnosis(activePatient.diagnosis);
    if (activePatient?.vitalsJson) {
      try {
        setVitals(JSON.parse(activePatient.vitalsJson));
      } catch (e) {}
    }
    if (activePatient?.prescriptionJson) {
      try {
        const parsed = JSON.parse(activePatient.prescriptionJson);
        if (Array.isArray(parsed)) {
          setMedicines(parsed);
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.medicines)) setMedicines(parsed.medicines);
          if (Array.isArray(parsed.labTests)) setLabTests(parsed.labTests);
          if (parsed.followUpDays) setFollowUpDays(parsed.followUpDays);
          if (parsed.advice) setClinicalNotes(parsed.advice);
        }
      } catch (e) {}
    }
    if (activePatient?.clinicalNotes) setClinicalNotes(activePatient.clinicalNotes);
  }, [activePatient?.id]);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { medicineName: '', dosage: '1 Tab', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
    ]);
  };

  const handleAddQuickDrug = (row: MedicineRow) => {
    if (medicines.length === 1 && !medicines[0].medicineName.trim()) {
      setMedicines([{ ...row }]);
    } else {
      setMedicines([...medicines, { ...row }]);
    }
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleMedicineChange = (idx: number, field: keyof MedicineRow, value: string) => {
    const updated = [...medicines];
    updated[idx][field] = value;
    setMedicines(updated);
  };

  const handleToggleLabTest = (testName: string) => {
    if (labTests.includes(testName)) {
      setLabTests(labTests.filter((t) => t !== testName));
    } else {
      setLabTests([...labTests, testName]);
    }
  };

  const handleAddCustomLabTest = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customLabInput.trim()) return;
    if (!labTests.includes(customLabInput.trim())) {
      setLabTests([...labTests, customLabInput.trim()]);
    }
    setCustomLabInput('');
  };

  const handleRemoveLabTest = (testName: string) => {
    setLabTests(labTests.filter((t) => t !== testName));
  };

  const applyClinicalPreset = (preset: ClinicalPreset) => {
    setDiagnosis(preset.diagnosis);
    setMedicines([...preset.medicines]);
    if (preset.labTests) setLabTests([...preset.labTests]);
    setClinicalNotes(preset.clinicalNotes);
  };

  const handleSaveCurrentAsCustomPreset = () => {
    const presetName = window.prompt('Enter a custom name for this clinical template (e.g. "My Dengue Care Protocol" or "Post-Op Knee Care"):');
    if (!presetName || !presetName.trim()) return;

    const validMeds = medicines.filter((m) => m.medicineName.trim().length > 0);
    if (validMeds.length === 0 && !diagnosis.trim()) {
      alert('Please enter at least a diagnosis or one medicine before saving.');
      return;
    }

    const newPreset: ClinicalPreset = {
      id: `CUSTOM_${Date.now()}`,
      name: `⭐ ${presetName.trim()}`,
      diagnosis: diagnosis || 'General Clinical Treatment Protocol',
      medicines: validMeds.length > 0 ? [...validMeds] : [{ medicineName: 'Tab. Paracetamol 650mg', dosage: '1 Tab', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food (खाने के बाद)' }],
      labTests: [...labTests],
      clinicalNotes: clinicalNotes || 'Follow dietary advice and take medicines on time.',
    };

    const updated = [...customDoctorPresets, newPreset];
    setCustomDoctorPresets(updated);
    try {
      localStorage.setItem('queueless_doctor_custom_presets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomPreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this custom preset?')) return;
    const updated = customDoctorPresets.filter((p) => p.id !== presetId);
    setCustomDoctorPresets(updated);
    try {
      localStorage.setItem('queueless_doctor_custom_presets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAdviceChip = (chipText: string) => {
    if (!clinicalNotes.trim()) {
      setClinicalNotes(chipText);
    } else if (!clinicalNotes.includes(chipText)) {
      setClinicalNotes(`${clinicalNotes.trim()}\n• ${chipText}`);
    }
  };

  const handleSetDiagnosisChip = (diagText: string) => {
    if (!diagnosis.trim()) {
      setDiagnosis(diagText);
    } else if (!diagnosis.includes(diagText)) {
      setDiagnosis(`${diagnosis.trim()}, ${diagText}`);
    }
  };

  const handleSaveAndCompleteConsultation = async (complete: boolean) => {
    if (!activePatient) return;
    setSavingConsultation(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/queue/${activePatient.id}/consultation`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis,
          vitals,
          prescriptions: medicines.filter((m) => m.medicineName.trim().length > 0),
          labTests,
          advice: clinicalNotes,
          followUpDays,
          customSections,
          completeConsultation: complete,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (complete) {
          const rxNum = data.data?.rxNumber || 'Official';
          setDispatchSuccessBanner(`✓ Digital Prescription (${rxNum}) successfully issued! Synced to Patient Mobile ID (+91 ${activePatient.patient?.mobile || ''}) and dispatched via WhatsApp.`);
          setTimeout(() => setDispatchSuccessBanner(null), 9000);
          handleOpenPrescriptionModal(activePatient.id);
        }
        fetchDoctorQueue();
      }
    } catch (err) {
      console.error('Error saving consultation:', err);
    } finally {
      setSavingConsultation(false);
    }
  };

  const handleOpenPrescriptionModal = async (entryId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/queue/${entryId}/prescription`);
      const data = await res.json();
      if (data.success) {
        setViewingPrescription(data.data);
        if (data.data?.customSections && Array.isArray(data.data.customSections) && data.data.customSections.length > 0) {
          setModalCustomSections(data.data.customSections);
        } else {
          setModalCustomSections([...customSections]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Only paid patients with assigned tokens are active in the doctor queue!
  const waitingPatients = queue.filter(
    (item) => item.status === 'WAITING' && (item.paymentStatus === 'PAID' || item.paymentStatus === 'FREE_FOLLOW_UP' || item.isFollowUp) && item.token !== 'PENDING'
  );
  // Patients at reception counter paying cash (token not yet issued)
  const pendingDeskPatients = queue.filter(
    (item) => (item.status === 'CHECKED_IN' || item.paymentStatus === 'PAY_AT_CLINIC' || item.paymentStatus === 'PENDING' || item.token === 'PENDING') && !item.isFollowUp && item.paymentStatus !== 'PAID'
  );
  const completedPatients = queue.filter((item) => item.status === 'COMPLETED');
  const currentDoc = doctors.find((d) => d.id === selectedDoctorId);

  // Global Keyboard Shortcut: Alt+N -> Call Next Patient
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        if (waitingPatients.length > 0) {
          handleStatusChange(waitingPatients[0].id, 'CALLED');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [waitingPatients]);

  // Doctor PIN / Password Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 mt-12 pb-24">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-sky-600/30 ring-4 ring-sky-50">
            <Stethoscope className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 text-[11px] font-black uppercase tracking-wider rounded-full border border-sky-200/80 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Clinical OPD Operating System</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Cabin Console</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            Select your assigned consultation cabin and enter your 4-digit PIN or password to unlock your clinical OPD workbench.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Select Your Doctor Cabin
              </label>
              <select
                value={loginDoctorId || selectedDoctorId}
                onChange={(e) => setLoginDoctorId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 shadow-xs cursor-pointer"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.displayName} — {d.specialty} ({d.roomNumber || 'Cabin 1'})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-left">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Doctor PIN (4-Digit) or Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={doctorPasswordInput}
                  onChange={(e) => setDoctorPasswordInput(e.target.value)}
                  placeholder="Enter your 4-digit PIN (e.g. 1234)"
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-mono font-bold text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn || !doctorPasswordInput.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loggingIn ? 'Verifying PIN...' : 'Unlock Doctor OPD Console'}</span>
            </button>
          </form>

          {/* Master Credentials PDF Quick Download for Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Need Demo Passwords or Links?
            </span>
            <a
              href="/QUEUOUS_CREDENTIALS.pdf"
              download="QUEUOUS_CREDENTIALS.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95"
              title="Download Master Passwords & Demo Links PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-sky-600" />
              <span>Download Master Credentials (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header with Doctor Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06)] mb-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4">
          {clinicData?.logoUrl ? (
            <img
              src={clinicData.logoUrl}
              alt={clinicData.name}
              className="w-14 h-14 rounded-2xl border border-slate-200 object-contain p-1 bg-white shadow-xs shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-sky-600/25 shrink-0 ring-2 ring-sky-100">
              <Stethoscope className="w-7 h-7" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {clinicData?.name ? `${clinicData.name}` : 'Doctor OPD Console'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cabin Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="text-sky-700 font-black">{currentDoc?.displayName}</span>
              <span className="text-slate-300">•</span>
              <span>{currentDoc?.specialty || 'General OPD'}</span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-mono font-bold text-[11px]">
                {currentDoc?.roomNumber ? (currentDoc.roomNumber.toLowerCase().includes('cabin') ? currentDoc.roomNumber : `Cabin ${currentDoc.roomNumber}`) : 'Cabin 1'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Test Voice Chime Announcement */}
          <button
            onClick={() => {
              playClinicVoiceAnnouncement('A-101', currentDoc?.roomNumber || 'Cabin 1', currentDoc?.displayName, true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-all border border-emerald-200 cursor-pointer active:scale-95 shadow-2xs"
            title="Test real voice announcement and acoustic chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Test Voice Chime</span>
          </button>

          {/* Master PDF Download Button */}
          <a
            href="/QUEUOUS_CREDENTIALS.pdf"
            download="QUEUOUS_CREDENTIALS.pdf"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer active:scale-95 shadow-2xs"
            title="Download Master Credentials & Direct Demo Links PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Credentials (PDF)</span>
          </a>

          {/* Direct Cabin Link Button */}
          {currentDoc && (
            <button
              onClick={() => copyDoctorCabinLink(currentDoc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold rounded-xl transition-all border border-sky-300 cursor-pointer active:scale-95"
              title="Copy direct dedicated link for this doctor cabin"
            >
              {copiedDoctorId === currentDoc.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-sky-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  <span>Copy Cabin Link</span>
                </>
              )}
            </button>
          )}

          {/* All Doctor Links Modal Trigger */}
          <button
            onClick={() => setShowDoctorLinksModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl transition-all border border-indigo-200 cursor-pointer active:scale-95"
            title="View all dedicated doctor links for this hospital"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>All Links</span>
          </button>

          <button
            onClick={() => setShowChangePinModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
            title="Change My Doctor PIN / Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>PIN</span>
          </button>

          <button
            onClick={handleDoctorLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            title="Switch Cabin / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-600 pl-2">Cabin:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => {
                const newDocId = e.target.value;
                setSelectedDoctorId(newDocId);
                const target = doctors.find((d) => d.id === newDocId);
                if (target) {
                  const cabinSlug = target.roomNumber
                    ? target.roomNumber.toLowerCase().replace(/\s+/g, '-')
                    : target.id;
                  navigate(`/doctor/${activeSlug}/${cabinSlug}`, { replace: true });
                }
              }}
              className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white cursor-pointer"
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.roomNumber ? `${d.roomNumber}: ` : ''}{d.displayName} ({d.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {pendingDeskPatients.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50/90 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-medium">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{pendingDeskPatients.length} patient(s)</strong> are currently at the Reception Desk paying cash. Official tokens will be generated and admitted here once cash is collected.
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shrink-0">
            Awaiting Reception Cash
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Consultation / OPD Card */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-slate-100">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs shadow-emerald-500/50"></span>
                <span>Active Consultation Station</span>
              </span>
              {activePatient && (
                <span
                  className={`text-xs font-black px-3.5 py-1.5 rounded-full shadow-2xs border ${
                    activePatient.status === 'IN_CONSULTATION'
                      ? 'bg-blue-50 text-blue-800 border-blue-200 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {activePatient.status === 'IN_CONSULTATION' ? '● In Consultation' : 'Waiting at Door (Called)'}
                </span>
              )}
            </div>

            {activePatient ? (
              <div className="space-y-5">
                {/* Patient Overview Header */}
                <div className="flex items-start justify-between bg-gradient-to-r from-slate-50 via-sky-50/30 to-indigo-50/30 p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight bg-white px-3.5 py-1 rounded-2xl border border-slate-200 shadow-xs">
                        {activePatient.token}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-xl">
                        Ref: #QL-{activePatient.id.substring(0, 6).toUpperCase()}
                      </span>
                      <span className="text-xs font-black text-sky-700 bg-sky-100/80 px-3 py-1 rounded-full border border-sky-200">
                        Live OPD Token
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 mt-2">
                      {activePatient.patient.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{activePatient.patient.age ? `${activePatient.patient.age} yrs` : 'Age N/A'}</span>
                      <span>•</span>
                      <span className="font-semibold">{activePatient.patient.gender || 'Patient'}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-slate-700">Phone: {activePatient.patient.mobile}</span>
                      {activePatient.patient.bloodGroup && (
                        <span className="font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-lg text-[11px]">
                          Blood: {activePatient.patient.bloodGroup}
                        </span>
                      )}
                      {activePatient.virtualWait?.location === 'CAR' && (
                        <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-[11px] inline-flex items-center gap-1">
                          <Car className="w-3 h-3 text-emerald-600" />
                          <span>Waiting in Car ({activePatient.virtualWait.vehiclePlate || 'Parked'})</span>
                        </span>
                      )}
                      {activePatient.virtualWait?.insurance && (
                        <span className="font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg text-[11px] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-indigo-600" />
                          <span>Insurance Cleared: {activePatient.virtualWait.insurance.payerName} (Copay ${activePatient.virtualWait.insurance.copay} {activePatient.virtualWait.insurance.copayPaid ? 'PAID' : 'DUE'})</span>
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    {activePatient.isFollowUp ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 text-purple-900 text-xs font-black rounded-full border border-purple-200 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{activePatient.feeAmount === 0 || activePatient.paymentStatus === 'FREE_FOLLOW_UP' ? '15-Day Free Follow-Up (₹0)' : `Follow-Up (₹${activePatient.feeAmount})`}</span>
                      </span>
                    ) : activePatient.paymentStatus === 'PAID' ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-black rounded-full border border-emerald-200 shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Fee Paid (₹{activePatient.feeAmount || 500})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-200 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Fee Due at Counter</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Stated Symptoms / Complaint */}
                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 shadow-2xs">
                  <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block mb-1">
                    Chief Complaint / Patient Visit Reason:
                  </span>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    "{activePatient.visitReason || 'General medical consultation'}"
                  </p>
                </div>

                {/* Status Switchers if CALLED */}
                {activePatient.status === 'CALLED' && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="text-xs font-black text-emerald-950">Patient has entered consultation cabin?</div>
                      <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Click start to begin clinical examination & prescription writing.</div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleStatusChange(activePatient.id, 'IN_CONSULTATION')}
                        className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-5 rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Consultation</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(activePatient.id, 'NO_SHOW')}
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Absent (No-Show)
                      </button>
                    </div>
                  </div>
                )}

                {/* EMR CLINICAL WORKBENCH (Only active when in consultation) */}
                {activePatient.status === 'IN_CONSULTATION' && (
                  <div className="space-y-4 pt-2 border-t border-slate-100">
                    {/* 1. Clinical Vitals Row */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                        <span>Patient Vitals Examination</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Blood Pressure</span>
                          <input
                            type="text"
                            placeholder="120/80"
                            value={vitals.bp}
                            onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none mt-0.5"
                          />
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Pulse (BPM)</span>
                          <input
                            type="text"
                            placeholder="76 bpm"
                            value={vitals.pulse}
                            onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none mt-0.5"
                          />
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Temperature</span>
                          <input
                            type="text"
                            placeholder="98.6 °F"
                            value={vitals.temp}
                            onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none mt-0.5"
                          />
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">SpO2 (%)</span>
                          <input
                            type="text"
                            placeholder="99 %"
                            value={vitals.spo2}
                            onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none mt-0.5"
                          />
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Weight (kg)</span>
                          <input
                            type="text"
                            placeholder="65 kg"
                            value={vitals.weight}
                            onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-none mt-0.5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Clinical Rx Presets & Custom Templates */}
                    <div className="bg-gradient-to-r from-sky-50 via-indigo-50/60 to-blue-50 border border-sky-200/80 rounded-2xl p-3.5 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>Clinical Rx Presets & Custom Templates</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveCurrentAsCustomPreset}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-[10px] font-extrabold shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                            title="Save current diagnosis, medicines & advice as your own reusable clinical template"
                          >
                            <BookmarkPlus className="w-3 h-3 text-emerald-600" />
                            <span>Save Current as My Preset</span>
                          </button>
                          <span className="text-[10px] text-sky-700 font-bold bg-white/90 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                            ⚡ 1-Tap Auto-Fill
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Built-in clinical presets */}
                        {CLINICAL_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => applyClinicalPreset(preset)}
                            className="px-2.5 py-1.5 bg-white hover:bg-sky-600 hover:text-white text-slate-800 text-[11px] font-bold rounded-xl border border-slate-200/90 hover:border-sky-600 shadow-2xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                            title={`Auto-fill diagnosis, medicines, and advice for ${preset.name}`}
                          >
                            <span>{preset.name}</span>
                          </button>
                        ))}

                        {/* Doctor's saved custom presets */}
                        {customDoctorPresets.map((preset) => (
                          <div
                            key={preset.id}
                            className="inline-flex items-center bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-[11px] font-extrabold shadow-2xs overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => applyClinicalPreset(preset)}
                              className="px-2.5 py-1.5 text-left cursor-pointer flex items-center gap-1"
                              title="Click to apply your custom template"
                            >
                              <span>{preset.name}</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                              className="px-1.5 py-1.5 text-amber-600 hover:text-rose-600 hover:bg-rose-50 border-l border-amber-200 cursor-pointer"
                              title="Delete custom preset"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Doctor Diagnosis (Custom typing + 1-Tap suggestions) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>Doctor Clinical Diagnosis / Provisional Findings</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">Type custom diagnosis or tap suggestions below</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Type custom diagnosis (e.g. Acute URTI with dry cough, Bronchial Asthma, etc.)..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-2xs"
                      />

                      {/* 1-Tap Diagnosis Suggestion Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {COMMON_DIAGNOSES.map((diag) => (
                          <button
                            key={diag}
                            type="button"
                            onClick={() => handleSetDiagnosisChip(diag)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200/90 hover:border-sky-300 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                          >
                            + {diag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ✨ Google AI Studio (Gemini 1.5 Flash) Copilot Bar */}
                    <div className="p-3.5 bg-gradient-to-r from-indigo-50/90 via-sky-50/90 to-teal-50/90 rounded-2xl border border-indigo-200/90 shadow-2xs space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-xs">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-900">
                                Gemini AI Clinical Copilot
                              </h4>
                              <span className="text-[9px] font-black uppercase px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                                Google AI Studio
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Instant dictation parsing, prescription structuring & bilingual patient WhatsApp directions.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setShowAiDictationModal(true)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 text-[11px] font-bold rounded-xl border border-indigo-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>🎙️ AI Dictate Notes</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGenerateAiSummary('hi')}
                            disabled={aiGeneratingSummary}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{aiGeneratingSummary ? 'Translating...' : 'Hindi Directions'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGenerateAiSummary('en')}
                            disabled={aiGeneratingSummary}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                            <span>{aiGeneratingSummary ? 'Translating...' : 'English Directions'}</span>
                          </button>
                        </div>
                      </div>

                      {aiSummaryResult && (
                        <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-1">
                          <span className="text-[10px] font-black uppercase text-indigo-700 block">
                            ✨ Generated Patient WhatsApp Directions (Auto-Added to Advice):
                          </span>
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">{aiSummaryResult}</p>
                        </div>
                      )}
                    </div>

                    {/* 3. Prescription Rx Table & Quick Drug Presets */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Rx Prescribed Medicines ({medicines.length})</span>
                        </label>
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs border border-indigo-200/80 active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Custom Medicine</span>
                        </button>
                      </div>

                      {/* 1-Tap Quick Drug Add Pills */}
                      <div className="mb-2.5 p-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Quick 1-Tap Add Common Drugs:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_DRUG_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleAddQuickDrug(preset.row)}
                              className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Medicine Cards with Custom Inputs & Food Timing Selector */}
                      <div className="space-y-2.5">
                        {medicines.map((med, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-2"
                          >
                            {/* Row 1: Name, Dose, Frequency, Duration, Remove */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-12 sm:col-span-5">
                                <input
                                  type="text"
                                  placeholder="Medicine name (e.g. Tab. Dolo 650mg, Syp. Ascoril)..."
                                  value={med.medicineName}
                                  onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                                  className="w-full text-xs font-bold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div className="col-span-4 sm:col-span-2">
                                <input
                                  type="text"
                                  placeholder="Dose (1 Tab)"
                                  value={med.dosage}
                                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                                  list={`dosage-options-${index}`}
                                />
                                <datalist id={`dosage-options-${index}`}>
                                  <option value="1 Tab" />
                                  <option value="2 Tabs" />
                                  <option value="1 Cap" />
                                  <option value="5 ml" />
                                  <option value="10 ml" />
                                  <option value="1 Sachet" />
                                  <option value="1 Puff" />
                                  <option value="2 Drops" />
                                  <option value="1 Inj" />
                                </datalist>
                              </div>

                              <div className="col-span-4 sm:col-span-2">
                                <input
                                  type="text"
                                  placeholder="Freq (1-0-1)"
                                  value={med.frequency}
                                  onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                                  list={`freq-options-${index}`}
                                />
                                <datalist id={`freq-options-${index}`}>
                                  <option value="1-0-1 (सुबह-शाम)" />
                                  <option value="1-1-1 (सुबह-दोपहर-रात)" />
                                  <option value="1-0-0 (सुबह)" />
                                  <option value="0-0-1 (रात को)" />
                                  <option value="0-1-0 (दोपहर)" />
                                  <option value="SOS (ज़रूरत पर)" />
                                </datalist>
                              </div>

                              <div className="col-span-3 sm:col-span-2">
                                <input
                                  type="text"
                                  placeholder="Duration (5d)"
                                  value={med.duration}
                                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                                  list={`duration-options-${index}`}
                                />
                                <datalist id={`duration-options-${index}`}>
                                  <option value="3 Days" />
                                  <option value="5 Days" />
                                  <option value="7 Days" />
                                  <option value="10 Days" />
                                  <option value="15 Days" />
                                  <option value="1 Month" />
                                  <option value="Continue" />
                                </datalist>
                              </div>

                              <div className="col-span-1 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedicine(index)}
                                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Remove Medicine"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Row 2: Food / Timing Instructions (खाना खाने से पहले/बाद) */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 text-[11px]">
                              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mr-1">
                                🍽️ निर्देश:
                              </span>
                              {[
                                'After Food (खाने के बाद)',
                                'Before Food (खाने से पहले)',
                                'Empty Stomach (खाली पेट)',
                                'At Bedtime (रात को सोते समय)',
                                'With Milk (दूध के साथ)',
                                'SOS (ज़रूरत पड़ने पर)',
                              ].map((instructionOption) => (
                                <button
                                  key={instructionOption}
                                  type="button"
                                  onClick={() => handleMedicineChange(index, 'instructions', instructionOption)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                    med.instructions === instructionOption
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                  }`}
                                >
                                  {instructionOption}
                                </button>
                              ))}
                              <input
                                type="text"
                                placeholder="या कस्टम निर्देश लिखें (जैसे: गुनगुने पानी के साथ)..."
                                value={med.instructions}
                                onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                                className="flex-1 min-w-[170px] text-[10px] font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}

                        {/* Add Medicine Button at bottom */}
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          className="w-full py-2 bg-slate-50 hover:bg-indigo-50/60 text-slate-700 hover:text-indigo-700 border border-dashed border-slate-300 hover:border-indigo-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add Another Custom Medicine Row</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. Diagnostic Lab Tests / Investigations */}
                    <div className="bg-gradient-to-r from-teal-50/60 via-emerald-50/40 to-sky-50/60 p-3.5 rounded-2xl border border-teal-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                          <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                          <span>Diagnostic Lab Tests / Investigations ({labTests.length})</span>
                        </label>
                        <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200 shadow-2xs">
                          {labTests.length > 0 ? `${labTests.length} Tests Ordered` : '1-Click Tests'}
                        </span>
                      </div>

                      {/* Selected Tests Chips */}
                      {labTests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5 p-2 bg-white rounded-xl border border-teal-200">
                          {labTests.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-100/90 text-teal-900 text-[11px] font-extrabold rounded-lg shadow-2xs"
                            >
                              <span>{t}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLabTest(t)}
                                className="hover:text-rose-600 ml-0.5 font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick 1-Click Lab Test Presets */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {COMMON_LAB_TESTS.map((testName) => {
                          const isSelected = labTests.includes(testName);
                          return (
                            <button
                              key={testName}
                              type="button"
                              onClick={() => handleToggleLabTest(testName)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                                  : 'bg-white hover:bg-teal-50 text-slate-700 border-slate-200 hover:border-teal-300'
                              }`}
                            >
                              {isSelected ? <Check className="w-3 h-3 stroke-[3]" /> : <span>+</span>}
                              <span>{testName}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Test Input */}
                      <form onSubmit={handleAddCustomLabTest} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add custom investigation (e.g. MRI Spine, Serum Ferritin, USG KUB)..."
                          value={customLabInput}
                          onChange={(e) => setCustomLabInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomLabTest()}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Test</span>
                        </button>
                      </form>
                    </div>

                    {/* 5. Doctor Advice & Instructions (Custom text + 1-Tap chips) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Clinical Advice / Dietary Instructions:</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">Type custom advice or tap chips below</span>
                      </div>
                      <textarea
                        rows={2}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="e.g. Plenty of oral fluids. Avoid cold food. Strictly bed rest for 48 hours."
                        className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-2xs"
                      />

                      {/* 1-Tap Advice Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {COMMON_ADVICE_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleAddAdviceChip(chip)}
                            className="px-2 py-0.5 bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 6. Follow-up Review Timeline (Quick chips + Custom days) */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>Follow-up Review Schedule</span>
                        </label>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                          After {followUpDays} Days (15-Day Free OPD Policy)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[3, 5, 7, 10, 15, 30].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => {
                              setFollowUpDays(days);
                              setCustomFollowUpDaysInput('');
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              followUpDays === days && !customFollowUpDaysInput
                                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {days} Days
                          </button>
                        ))}

                        {/* Custom Days Input */}
                        <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                          <span>Custom:</span>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            placeholder="e.g. 21"
                            value={customFollowUpDaysInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomFollowUpDaysInput(val);
                              const parsed = parseInt(val, 10);
                              if (!isNaN(parsed) && parsed > 0) {
                                setFollowUpDays(parsed);
                              }
                            }}
                            className="w-12 text-xs font-black text-blue-700 bg-slate-50 px-1 py-0.5 rounded border border-slate-200 text-center focus:outline-none"
                          />
                          <span>Days</span>
                        </div>
                      </div>
                    </div>

                    {/* 7. Custom Rx Sections & Additions (User: "kuch ko remove kv kar skta ha and kuch ka custom add v kar skt ha") */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Custom Rx Sections & Notes (कस्टम सेक्शन)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowAddSectionDrawer(!showAddSectionDrawer)}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 cursor-pointer transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Custom Field</span>
                        </button>
                      </div>

                      {/* Quick 1-Click Common Section Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleAddPresetSection('Allergies & Drug Warnings', 'Known allergy to Penicillin / Sulfa drugs. Avoid NSAIDs.')}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <span>⚠️ Allergies Warning</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddPresetSection('Surgical & Wound Care', 'Keep dressing clean and dry. Sterile saline wash twice daily.')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <span>🩹 Wound Dressing</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddPresetSection('Dietary Restrictions', 'Low sodium / low salt diet. Strict avoidance of oily and spicy foods.')}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <span>🥗 Dietary Rules</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddPresetSection('Specialist Referral', 'Referred to Cardiology / Orthopedic specialist for secondary evaluation.')}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <span>🩺 Specialist Referral</span>
                        </button>
                      </div>

                      {/* Render Active Custom Sections in Form */}
                      {customSections.length > 0 && (
                        <div className="space-y-2 mb-2.5">
                          {customSections.map((sec) => (
                            <div key={sec.id} className="p-3 bg-white border border-slate-200 rounded-xl relative group shadow-2xs">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <input
                                  type="text"
                                  value={sec.title}
                                  onChange={(e) => handleUpdateSection(sec.id, 'title', e.target.value)}
                                  className="font-bold text-xs text-indigo-900 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 focus:outline-none w-full"
                                  placeholder="Section Heading"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSection(sec.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-all shrink-0"
                                  title="Remove this section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                value={sec.content}
                                onChange={(e) => handleUpdateSection(sec.id, 'content', e.target.value)}
                                className="w-full text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                                placeholder="Enter custom instructions or findings..."
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Custom Blank Section Drawer */}
                      {showAddSectionDrawer && (
                        <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl mb-2 space-y-2 animate-in fade-in">
                          <div className="text-[11px] font-bold text-indigo-950">Add New Custom Rx Section:</div>
                          <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="Section Title (e.g. Pre-Op Instructions, Emergency Warning)"
                            className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none font-bold"
                          />
                          <textarea
                            rows={2}
                            value={newSectionContent}
                            onChange={(e) => setNewSectionContent(e.target.value)}
                            placeholder="Section Content / Instructions..."
                            className="w-full px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddSectionDrawer(false)}
                              className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCreateCustomSection}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-2xs"
                            >
                              Add to Rx
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleSaveAndCompleteConsultation(false)}
                        disabled={savingConsultation}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Save Clinical Draft</span>
                      </button>

                      <button
                        onClick={() => handleSaveAndCompleteConsultation(true)}
                        disabled={savingConsultation}
                        className="flex-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-3.5 px-4 rounded-2xl text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{savingConsultation ? 'Issuing Digital Rx...' : 'Complete Consultation & Issue Digital Rx'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 px-4 relative">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-3xl bg-sky-400/20 animate-ping opacity-60" />
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-50 to-indigo-50 text-sky-600 flex items-center justify-center border border-sky-200 shadow-inner">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Consultation Cabin Ready</h3>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  {waitingPatients.length > 0
                    ? `There are ${waitingPatients.length} patient(s) waiting in the OPD lobby. Click below to chime and announce the next patient.`
                    : 'The OPD waiting queue is clear. When patients register at reception or entrance QR, they will appear in real-time.'}
                </p>

                {waitingPatients.length > 0 && (
                  <div className="mt-7 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(waitingPatients[0].id, 'CALLED')}
                      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3 group active:scale-[0.99] cursor-pointer shimmer-sweep ring-4 ring-emerald-100"
                    >
                      <BellRing className="w-5 h-5 text-amber-300 animate-bounce" />
                      <span>CALL NEXT PATIENT: Token {waitingPatients[0].token}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-200 bg-emerald-900/70 px-2 py-0.5 rounded-lg border border-emerald-400/30">
                        Alt+N
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[11px] text-slate-500 mt-2.5 font-medium">
                      Next in queue: <strong className="text-slate-900">{waitingPatients[0].patient.name}</strong> • "{waitingPatients[0].visitReason || 'General checkup'}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Upcoming Queue & Completed Consultations */}
        <div className="space-y-5">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_6px_25px_-5px_rgba(0,0,0,0.05)]">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3.5 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                <span>Next in Line ({waitingPatients.length})</span>
              </span>
              <Clock className="w-4 h-4 text-slate-400" />
            </h3>

            {waitingPatients.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-400">No waiting patients in queue</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {waitingPatients.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/70 hover:border-sky-300 hover:shadow-xs flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-sky-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                          {item.token}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{item.patient.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[150px] mt-1 font-medium">
                        {item.visitReason || 'General checkup'}
                      </p>

                      {/* Virtual Wait Location Badge */}
                      {item.virtualWait?.location === 'CAR' ? (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100/90 text-emerald-800 text-[10px] font-bold rounded-md">
                          <Car className="w-3 h-3 text-emerald-700" />
                          <span className="truncate max-w-[130px]">{item.virtualWait.vehiclePlate || 'In Car'}</span>
                        </div>
                      ) : item.virtualWait?.location === 'CAFE' ? (
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100/90 text-amber-800 text-[10px] font-bold rounded-md">
                          <Coffee className="w-3 h-3 text-amber-700" />
                          <span>Nearby Cafe</span>
                        </div>
                      ) : null}

                      {/* Insurance Eligibility Cleared Badge */}
                      {item.virtualWait?.insurance && (
                        <div className="mt-0.5 text-[9px] font-bold text-indigo-700 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                          <span>EDI Cleared: Copay ${item.virtualWait.insurance.copay} ({item.virtualWait.insurance.copayPaid ? 'PAID' : 'DUE'})</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.virtualWait?.location === 'CAR' && (
                        <button
                          type="button"
                          onClick={() => handlePageCar(item.id, item.patient.name)}
                          className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-black rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                          title="Page patient from car via SMS"
                        >
                          <PhoneCall className="w-3 h-3 text-sky-200" />
                          <span>Page Car</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'CALLED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                        title={`Call Token ${item.token}`}
                      >
                        <BellRing className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Call</span>
                      </button>
                      <span className="text-[10px] font-black text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Completed OPD Consultations */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_6px_25px_-5px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Seen Today</span>
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {completedPatients.length} Patients
              </span>
            </div>

            {completedPatients.length === 0 ? (
              <div className="py-6 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-semibold text-slate-400">No completed consultations yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {completedPatients.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/70 hover:border-slate-300 flex items-center justify-between text-xs transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {item.token}
                        </span>
                        <span className="font-bold text-slate-800 truncate max-w-[120px]">{item.patient.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate max-w-[130px] block mt-0.5 font-medium">
                        {item.diagnosis || 'Consultation completed'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenPrescriptionModal(item.id)}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 hover:border-sky-300 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Rx</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRINTABLE DIGITAL PRESCRIPTION LETTERHEAD MODAL */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
            <button
              onClick={() => setViewingPrescription(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letterhead & Sections Customization Bar (User: "kuch ko remove kv kar skta ha and kuch ka custom add v kar skt ha") */}
            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 print:hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700">
                    <Sliders className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-black text-xs text-slate-800">
                      Customize Letterhead & Sections (हटाएं या नया जोड़ें)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Toggle sections on/off or add custom fields before printing or sharing
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRxCustomizer(!showRxCustomizer)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{showRxCustomizer ? 'Close Customizer ✕' : '⚙️ Toggle / Add Sections'}</span>
                </button>
              </div>

              {/* Expandable Customizer Controls */}
              {showRxCustomizer && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      1. Show / Hide Standard Sections (हटाएं / छुपाएं):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showHospitalHeader}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showHospitalHeader: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Hospital Letterhead</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showDoctorInfo}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showDoctorInfo: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Doctor Info & Reg No</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showPatientInfo}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showPatientInfo: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Patient Details</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showVitals}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showVitals: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Vitals (BP, Pulse...)</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showDiagnosis}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showDiagnosis: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Clinical Diagnosis</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showMedicines}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showMedicines: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Medicines Table</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showLabTests}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showLabTests: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Lab Tests</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showAdvice}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showAdvice: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Doctor Advice</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showFollowUp}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showFollowUp: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">15-Day Free Follow-up</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showSignature}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showSignature: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Doctor Signature Stamp</span>
                      </label>
                      <label className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                        <input
                          type="checkbox"
                          checked={rxVisibility.showQueuelessBottom}
                          onChange={(e) => setRxVisibility({ ...rxVisibility, showQueuelessBottom: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Queueless Bottom Logo</span>
                      </label>
                    </div>
                  </div>

                  {/* 2. Add Custom Section Directly to Modal */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      2. Add Custom Section to Letterhead (कस्टम जोड़ें):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddModalSection('Allergies / Drug Warning', 'Known allergy to Penicillin / Sulfa. Avoid NSAIDs.')}
                        className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold hover:bg-rose-100 cursor-pointer"
                      >
                        + ⚠️ Allergies Warning
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModalSection('Surgical & Wound Care', 'Keep dressing clean and dry. Sterile saline wash twice daily.')}
                        className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold hover:bg-amber-100 cursor-pointer"
                      >
                        + 🩹 Wound Dressing
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModalSection('Dietary Restrictions', 'Low sodium / low salt diet. Strict avoidance of oily and spicy foods.')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100 cursor-pointer"
                      >
                        + 🥗 Dietary Rules
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModalSection('Specialist Referral', 'Referred to Cardiology / Specialist for secondary evaluation.')}
                        className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold hover:bg-purple-100 cursor-pointer"
                      >
                        + 🩺 Specialist Referral
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddModalSection('Custom Clinical Note', 'Special medical precautions recorded by attending consultant.')}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold hover:bg-indigo-100 cursor-pointer"
                      >
                        + 📝 Custom Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print Friendly Prescription Content */}
            <div id="printable-rx" className="p-2">
              {/* Hospital Header Letterhead (Top - Hospital Data & Logo) */}
              {rxVisibility.showHospitalHeader && (
                <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {viewingPrescription.clinic?.logoUrl ? (
                      <img
                        src={viewingPrescription.clinic.logoUrl}
                        alt={viewingPrescription.clinic.name}
                        className="w-12 h-12 rounded-xl object-contain border border-slate-200 p-1 bg-white shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                        🏥
                      </div>
                    )}
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                        {viewingPrescription.clinic?.name || 'Caremax Multi-Specialty Hospital'}
                      </h1>
                      <p className="text-xs text-slate-600 max-w-sm mt-0.5 font-medium">
                        {viewingPrescription.clinic?.address || 'Suite 402, Metro Healthcare Towers, Bengaluru'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Phone / Desk: {viewingPrescription.clinic?.phone || '+91 80 4920 1100'} • Ayushman Bharat (ABDM) & NABH Aligned OPD
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1 shadow-2xs">
                      Official OPD Rx
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      Token: <span className="font-mono font-black text-slate-900">{viewingPrescription.token}</span>
                      <span className="mx-1 text-slate-300">•</span>
                      Ref: <span className="font-mono font-bold text-slate-600">#QL-{(viewingPrescription.id || '').substring(0, 6).toUpperCase()}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">Date: {viewingPrescription.date}</div>
                  </div>
                </div>
              )}

              {/* Doctor & Patient Info Bar */}
              {(rxVisibility.showDoctorInfo || rxVisibility.showPatientInfo) && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-4">
                  {rxVisibility.showDoctorInfo && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consulting Doctor</span>
                      <div className="font-extrabold text-slate-900 text-sm">{viewingPrescription.doctor?.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{viewingPrescription.doctor?.specialty} • {viewingPrescription.doctor?.roomNumber}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Reg No: {viewingPrescription.doctor?.regNumber || `MCI-${(viewingPrescription.doctor?.id || '84920').substring(0, 6).toUpperCase()}`}
                      </div>
                    </div>
                  )}
                  {rxVisibility.showPatientInfo && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Details</span>
                      <div className="font-extrabold text-slate-900 text-sm">{viewingPrescription.patient?.name}</div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {viewingPrescription.patient?.age ? `${viewingPrescription.patient?.age} yrs` : 'Age N/A'} • {viewingPrescription.patient?.gender || 'Patient'}
                        {viewingPrescription.patient?.bloodGroup && ` • Blood Group: ${viewingPrescription.patient?.bloodGroup}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Mobile: +91 {viewingPrescription.patient?.mobile || 'Registered'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals Examination */}
              {rxVisibility.showVitals && viewingPrescription.vitals && (
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Vitals:</span>
                  {viewingPrescription.vitals.bp && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">BP: <strong>{viewingPrescription.vitals.bp}</strong></span>
                  )}
                  {viewingPrescription.vitals.pulse && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Pulse: <strong>{viewingPrescription.vitals.pulse} bpm</strong></span>
                  )}
                  {viewingPrescription.vitals.temp && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Temp: <strong>{viewingPrescription.vitals.temp}</strong></span>
                  )}
                  {viewingPrescription.vitals.spo2 && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">SpO2: <strong>{viewingPrescription.vitals.spo2}</strong></span>
                  )}
                  {viewingPrescription.vitals.weight && (
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800">Weight: <strong>{viewingPrescription.vitals.weight}</strong></span>
                  )}
                </div>
              )}

              {/* Diagnosis */}
              {rxVisibility.showDiagnosis && (
                <div className="mb-4 pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Diagnosis</span>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {viewingPrescription.diagnosis || 'General OPD Examination'}
                  </p>
                </div>
              )}

              {/* Rx Medicines Table with Instructions */}
              {rxVisibility.showMedicines && (
                <div className="mb-5">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="text-lg font-serif italic text-emerald-700">℞</span>
                    <span>Prescribed Medicines & Schedule</span>
                  </div>
                  <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Medicine</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5">Instructions (Timing / Food)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {((viewingPrescription.medicines || viewingPrescription.prescriptions || []).length > 0) ? (
                        (viewingPrescription.medicines || viewingPrescription.prescriptions).map((m: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-900">{m.medicineName}</td>
                            <td className="p-2.5 text-slate-700 font-medium">{m.dosage}</td>
                            <td className="p-2.5 text-slate-700 font-mono font-bold text-blue-700">{m.frequency}</td>
                            <td className="p-2.5 text-slate-700 font-medium">{m.duration}</td>
                            <td className="p-2.5 text-slate-600 italic font-medium">{m.instructions || 'After Food (खाने के बाद)'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400">
                            No specific medicines prescribed. General clinical advice provided.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Diagnostic Lab Tests / Investigations */}
              {rxVisibility.showLabTests && viewingPrescription.labTests && viewingPrescription.labTests.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recommended Diagnostic Lab Tests ({viewingPrescription.labTests.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-teal-50/60 rounded-2xl border border-teal-200">
                    {viewingPrescription.labTests.map((t: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-white text-teal-900 font-extrabold text-xs rounded-xl border border-teal-200 shadow-2xs flex items-center gap-1">
                        <span>🧪</span>
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Advice */}
              {rxVisibility.showAdvice && (viewingPrescription.advice || viewingPrescription.clinicalNotes) && (
                <div className="mb-4 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 text-xs">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                    Doctor Advice & Dietary Instructions:
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                    {viewingPrescription.advice || viewingPrescription.clinicalNotes}
                  </p>
                </div>
              )}

              {/* Custom Clinical Sections Rendered on Letterhead */}
              {modalCustomSections.length > 0 && (
                <div className="space-y-3 mb-4">
                  {modalCustomSections.map((sec) => (
                    <div key={sec.id} className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 text-xs relative group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-3 h-3 text-indigo-600" />
                          <span>{sec.title}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveModalSection(sec.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 print:hidden cursor-pointer transition-all"
                          title="Remove this section from print"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 15-Day Free Follow-up Review Notice */}
              {rxVisibility.showFollowUp && (
                <div className="mb-4 p-3 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>15-Day Free Follow-Up Review:</span>
                  </span>
                  <span className="font-black text-blue-800 bg-white px-2.5 py-1 rounded-xl border border-blue-200 font-mono text-[11px]">
                    Valid for {viewingPrescription.followUpDays || 15} Days (₹0 Consultation Fee in OPD)
                  </span>
                </div>
              )}

              {/* Doctor Sign-off (Bottom Right) */}
              {rxVisibility.showSignature && (
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <div className="text-[10px] text-slate-400">Valid Digital Prescription generated via Hospital EMR</div>
                    <div className="font-semibold text-slate-700 mt-0.5">Official Digital OPD Record • Signed electronically</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif italic font-bold text-slate-900 text-base">
                      {viewingPrescription.doctor?.name}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Authorized Doctor Sign-off</div>
                  </div>
                </div>
              )}

              {/* Bottom Footer: Powered by Queueless Healthcare OS (User: "mera bottom me rahega") */}
              {rxVisibility.showQueuelessBottom && (
                <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold text-slate-600">
                    <span className="px-1 py-0.2 bg-blue-600 text-white rounded text-[8px] font-black">Q</span>
                    <span>Powered by Queueless Healthcare OS • Ayushman Bharat (ABDM M1/M2) & HIPAA Aligned</span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-400">
                    Universal Health Vault Sync: https://queueless-os.vercel.app/portal
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Synced to Patient Mobile ID (+91 {viewingPrescription.patient?.mobile || ''})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingPrescription(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={generateWhatsAppRxUrl({ ...viewingPrescription, customSections: modalCustomSections })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Share on WhatsApp</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Rx</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Doctor Change PIN / Password Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Change Cabin PIN</h3>
                <p className="text-xs text-slate-500">Update your individual secret PIN / password</p>
              </div>
            </div>

            {changePinError && (
              <div className="my-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{changePinError}</span>
              </div>
            )}

            {changePinSuccess && (
              <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{changePinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePinSubmit} className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current PIN / Password (Optional)
                </label>
                <input
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Enter current PIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New 4-Digit PIN or Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="e.g. 5821"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New PIN *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Re-enter new PIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPin}
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {savingPin ? 'Saving...' : 'Update PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All Doctor Cabin Dedicated Links Modal */}
      {showDoctorLinksModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Individual Doctor Cabin Links
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dedicated direct link for each doctor station in {clinicData?.name || 'Caremax OPD'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDoctorLinksModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {doctors.map((doc, idx) => {
                const cabinSlug = doc.roomNumber
                  ? doc.roomNumber.toLowerCase().replace(/\s+/g, '-')
                  : `cabin-${idx + 1}`;
                const directUrl = `${window.location.origin}/doctor/${activeSlug}/${cabinSlug}`;
                const isSelected = doc.id === selectedDoctorId;

                return (
                  <div
                    key={doc.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-sky-50/60 border-sky-300 ring-2 ring-sky-400/20'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-extrabold text-[10px] rounded-md uppercase">
                            {doc.roomNumber || `Cabin ${idx + 1}`}
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            {doc.displayName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {doc.specialty || 'OPD Consultant'}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full shrink-0">
                          Active Cabin
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 p-2 bg-white rounded-xl border border-slate-200/90 flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="truncate text-[11px] text-slate-600 font-medium select-all">
                        {directUrl}
                      </span>
                      <button
                        onClick={() => copyDoctorCabinLink(doc)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Copy direct cabin link"
                      >
                        {copiedDoctorId === doc.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `👨‍⚕️ ${doc.displayName} - Your Dedicated Queueless OPD Cabin Station Link:\n${directUrl}\n\nLogin with your 4-digit PIN.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Send to Doctor via WhatsApp</span>
                      </a>

                      <Link
                        to={`/doctor/${activeSlug}/${cabinSlug}`}
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setLoginDoctorId(doc.id);
                          setShowDoctorLinksModal(false);
                        }}
                        className="text-sky-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Open Station</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setShowDoctorLinksModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎙️ Gemini AI Dictation & Clinical Note Structuring Modal (Google AI Studio) */}
      {showAiDictationModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-up space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>Gemini AI Clinical Scribe</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                      Google AI Studio
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dictate or paste raw doctor notes. Gemini extracts diagnosis, vitals & medicine table instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiDictationModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Doctor Dictation / Raw Clinical Notes:
              </label>
              <textarea
                rows={5}
                value={rawDictationText}
                onChange={(e) => setRawDictationText(e.target.value)}
                placeholder="Example: Patient has high fever 102 F, BP 130/80, pulse 84, sore throat. Prescribe Tab Paracetamol 650mg twice daily for 3 days after food, Tab Azithromycin 500mg once daily for 3 days. Advice blood CBC and return after 4 days."
                className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>💡 Tip: Mention dose, timing (1-0-1 or OD/BD), and vitals freely.</span>
                <button
                  type="button"
                  onClick={() =>
                    setRawDictationText(
                      'Patient has high fever 101.4 F, BP 124/82 mmHg, pulse 80 bpm, cough and cold for 3 days. Prescribe Tab Paracetamol 650mg TDS for 3 days after meals, Tab Levocetirizine 5mg OD at night for 5 days. Drink warm fluids, avoid cold water, follow up after 5 days.'
                    )
                  }
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Load Sample Dictation
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiDictationModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleParseAiDictation}
                disabled={aiParsingDictation || !rawDictationText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {aiParsingDictation ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                ) : (
                  <Zap className="w-4 h-4 text-amber-300" />
                )}
                <span>{aiParsingDictation ? 'Structuring with Gemini...' : 'Extract & Fill Rx Form'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
