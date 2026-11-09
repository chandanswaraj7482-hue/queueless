import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Printer,
  Download,
  Stethoscope,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Users,
  Settings,
  TrendingUp,
  QrCode,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Phone,
  Banknote,
  CreditCard,
  Upload,
  Image as ImageIcon,
  Sparkles,
  X,
  RefreshCw,
  BarChart3,
  Award,
  Activity,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  Zap,
  Star,
  MessageSquare,
  Heart,
  Tv,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { getAuthSession, setAuthSession, clearAuthSession } from '../utils/auth';

import { API_BASE_URL } from '../config/api';
const PRESET_LOGOS = [
  {
    name: 'Apollo Red Cross',
    color: 'Red & White',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%23dc2626"/><path d="M40 20h20v20h20v20H60v20H40V60H20V40h20z" fill="%23ffffff"/></svg>',
  },
  {
    name: 'City Health Emerald Crest',
    color: 'Emerald Shield',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%23059669"/><path d="M50 16 L76 30 L76 56 C76 74 50 86 50 86 C50 86 24 74 24 56 L24 30 Z" fill="%23ffffff"/><path d="M43 36h14v10h10v14h-10v10H43v-10h-10V46h10z" fill="%23059669"/></svg>',
  },
  {
    name: 'Metro Medical Pulse',
    color: 'Sky Cyan Wave',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%230284c7"/><path d="M16 52 h18 l6-18 l12 36 l10-24 l6 8 h16" fill="none" stroke="%23ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    name: 'Apex Multi-Speciality',
    color: 'Indigo Crest',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%234f46e5"/><circle cx="50" cy="30" r="11" fill="%23ffffff"/><path d="M50 38 v46 M30 46 c10-10 30-10 40 0 M32 60 c9-8 27-8 36 0" fill="none" stroke="%23ffffff" stroke-width="6" stroke-linecap="round"/></svg>',
  },
];

interface Doctor {
  id: string;
  displayName: string;
  specialty: string;
  roomNumber: string;
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  fee: number;
  durationMinutes: number;
  active: boolean;
}

interface ClinicSettings {
  allowWalkIns?: boolean;
  allowPreBooking?: boolean;
  allowCashAtCounter?: boolean;
  requireDeskAdmission?: boolean;
  allowOnlineUPI?: boolean;
  chimeSoundEnabled?: boolean;
  isFreeFollowUp?: boolean;
  followUpFeeAmount?: number;
  autoRouteSameDoctor?: boolean;
  priorityFollowUp?: boolean;
}

export const ClinicAdmin: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const activeSlug = slug || 'city-health';
  const [clinic, setClinic] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ANALYTICS' | 'DOCTORS' | 'SERVICES' | 'PROFILE' | 'RULES' | 'SECURITY' | 'STANDEE'>('OVERVIEW');
  const [downloading, setDownloading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Business Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAuthSession('ADMIN'));
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Staff Passwords & Security Management State (Managed by Business Admin)
  const [secAdminPassword, setSecAdminPassword] = useState('');
  const [secReceptionPassword, setSecReceptionPassword] = useState('');
  const [secDoctorPasswords, setSecDoctorPasswords] = useState<Array<{ doctorId: string; name: string; specialty: string; roomNumber: string; password: string; pin: string }>>([]);
  const [showSecPasswords, setShowSecPasswords] = useState<{ [key: string]: boolean }>({});
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [samePasswordInput, setSamePasswordInput] = useState('');

  const applySamePasswordToAll = (masterPwd: string) => {
    if (!masterPwd.trim()) return;
    const pwd = masterPwd.trim();
    setSecAdminPassword(pwd);
    setSecReceptionPassword(pwd);
    const pin = pwd.replace(/\D/g, '').slice(-4) || '1234';
    setSecDoctorPasswords((prev) =>
      prev.map((doc) => ({
        ...doc,
        password: pwd,
        pin: pin.length === 4 ? pin : '1234',
      }))
    );
    setToastMessage('Applied same master password to Admin, Reception, and all Doctors! Click "Save All Security Passwords" to persist.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const submitAdminLogin = async (pwd: string) => {
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'ADMIN',
          password: pwd.trim(),
          clinicId: clinic?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSession('ADMIN', { clinicId: data.clinicId, name: data.name });
        setIsAuthenticated(true);
        setAdminPasswordInput('');
      } else {
        setLoginError(data.error || 'Incorrect password.');
      }
    } catch (err) {
      setLoginError('Could not verify password with server.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordInput.trim()) {
      setLoginError('Please enter the Hospital Business Admin password.');
      return;
    }
    submitAdminLogin(adminPasswordInput);
  };

  const handleAdminLogout = () => {
    clearAuthSession('ADMIN');
    setIsAuthenticated(false);
  };

  const fetchSecuritySettings = async () => {
    if (!clinic?.id) return;
    setLoadingSecurity(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/security`);
      const data = await res.json();
      if (data.success && data.data) {
        setSecAdminPassword(data.data.adminPassword);
        setSecReceptionPassword(data.data.receptionPassword);
        setSecDoctorPasswords(
          data.data.doctors.map((d: any) => ({
            doctorId: d.id,
            name: d.name,
            specialty: d.specialty,
            roomNumber: d.roomNumber,
            password: d.password,
            pin: d.pin,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const handleSaveSecuritySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinic?.id) return;
    setSavingSecurity(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/security`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminPassword: secAdminPassword,
          receptionPassword: secReceptionPassword,
          doctorPasswords: secDoctorPasswords,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Staff & Doctor passwords successfully updated by Business Admin!');
      } else {
        alert(data.error || 'Failed to update passwords');
      }
    } catch (err) {
      alert('Error updating passwords');
    } finally {
      setSavingSecurity(false);
    }
  };

  // Executive Analytics State
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const fetchExecutiveAnalytics = async () => {
    if (!clinic?.id) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reports/clinics/${clinic.id}/executive-analytics`);
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Profile & Branding Form States
  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [clinicLogo, setClinicLogo] = useState<string>('');
  const [followUpDays, setFollowUpDays] = useState<number>(15);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queue & Cash Rules States
  const [settings, setSettings] = useState<ClinicSettings>({
    allowWalkIns: true,
    allowPreBooking: true,
    allowCashAtCounter: true,
    requireDeskAdmission: true,
    allowOnlineUPI: true,
    chimeSoundEnabled: true,
    isFreeFollowUp: true,
    followUpFeeAmount: 0,
    autoRouteSameDoctor: true,
    priorityFollowUp: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Doctor Modal States
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');
  const [docRoom, setDocRoom] = useState('');
  const [docActive, setDocActive] = useState(true);

  // Service Modal States
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvName, setSrvName] = useState('');
  const [srvFee, setSrvFee] = useState('');
  const [srvDuration, setSrvDuration] = useState('15');

  const qrRef = useRef<HTMLDivElement>(null);

  const fetchClinicData = async () => {
    const cleanWords = activeSlug
      .split('-')
      .map((w: string) => (w.toLowerCase() === 'opd' ? 'OPD' : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join(' ');
    let customName = cleanWords.toLowerCase().endsWith('opd') ||
      cleanWords.toLowerCase().endsWith('clinic') ||
      cleanWords.toLowerCase().endsWith('hospital') ||
      cleanWords.toLowerCase().endsWith('center')
      ? cleanWords
      : cleanWords + ' OPD';
    let customAddress = 'Suite 402, Metro Healthcare Towers, MG Road';
    let customPhone = '+91 98765 43210';
    let customHours = '08:30 AM - 08:30 PM';
    let customLogo = '';
    let customFollowUp = 15;

    try {
      const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
      if (activeSlug && storedHospitals[activeSlug]) {
        customName = storedHospitals[activeSlug].name || customName;
        customAddress = storedHospitals[activeSlug].address || customAddress;
        customPhone = storedHospitals[activeSlug].phone || customPhone;
        customHours = storedHospitals[activeSlug].openingHours || customHours;
        customLogo = storedHospitals[activeSlug].logoUrl || '';
        customFollowUp = storedHospitals[activeSlug].followUpDays || 15;
      }
      if (!customLogo && activeSlug) {
        customLogo = localStorage.getItem('queueless_clinic_logo_' + activeSlug) || '';
      }
    } catch (e) {}

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const cRes = await fetch(`${API_BASE_URL}/api/v1/clinics/public/${activeSlug}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const cData = await cRes.json();
      if (cData.success && cData.data) {
        setClinic(cData.data);
        setClinicName(cData.data.name || customName);
        setClinicAddress(cData.data.address || customAddress);
        setClinicPhone(cData.data.contactPhone || customPhone);
        setOpeningHours(cData.data.openingHours || customHours);
        setClinicLogo(customLogo || cData.data.logoUrl || '');
        setFollowUpDays(cData.data.followUpDays || customFollowUp);
        if (cData.data.settings) {
          try {
            const parsed = typeof cData.data.settings === 'string' ? JSON.parse(cData.data.settings) : cData.data.settings;
            setSettings((prev) => ({ ...prev, ...parsed }));
          } catch (e) {}
        }

        const activeId = cData.data.id;
        const sRes = await fetch(`${API_BASE_URL}/api/v1/reports/clinics/${activeId}/summary`);
        const sData = await sRes.json();
        if (sData.success) {
          setSummary(sData.data);
        }
      } else {
        throw new Error('Local fallback');
      }
    } catch (err) {
      setClinic({
        id: activeSlug,
        name: customName,
        slug: activeSlug,
        address: customAddress,
        contactPhone: customPhone,
        openingHours: customHours,
        logoUrl: customLogo,
        followUpDays: customFollowUp,
      });
      setClinicName(customName);
      setClinicAddress(customAddress);
      setClinicPhone(customPhone);
      setOpeningHours(customHours);
      setClinicLogo(customLogo);
      setFollowUpDays(customFollowUp);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hospital Logo Upload Handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setClinicLogo(reader.result);
        showToast('Hospital Logo loaded! Click "Save Profile Changes" to apply across all screens.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Logo Selection
  const handleSelectPresetLogo = (presetUrl: string) => {
    setClinicLogo(presetUrl);
    showToast('Preset Hospital Logo selected! Click "Save Profile Changes" to apply.');
  };

  // 1. Save Hospital Profile & Logo
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (clinic?.id && clinic.id !== activeSlug) {
        await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: clinicName,
            address: clinicAddress,
            contactPhone: clinicPhone,
            openingHours,
            logoUrl: clinicLogo,
            followUpDays,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      // offline / local fallback
    } finally {
      try {
        if (activeSlug) {
          if (clinicLogo) {
            localStorage.setItem('queueless_clinic_logo_' + activeSlug, clinicLogo);
          } else {
            localStorage.removeItem('queueless_clinic_logo_' + activeSlug);
          }
          const storedHospitals = JSON.parse(localStorage.getItem('queueless_registered_hospitals') || '{}');
          if (!storedHospitals[activeSlug]) {
            storedHospitals[activeSlug] = { slug: activeSlug };
          }
          storedHospitals[activeSlug].name = clinicName;
          storedHospitals[activeSlug].address = clinicAddress;
          storedHospitals[activeSlug].phone = clinicPhone;
          storedHospitals[activeSlug].openingHours = openingHours;
          storedHospitals[activeSlug].logoUrl = clinicLogo;
          storedHospitals[activeSlug].followUpDays = followUpDays;
          localStorage.setItem('queueless_registered_hospitals', JSON.stringify(storedHospitals));
        }
      } catch (e) {}

      setClinic((prev: any) => ({
        ...prev,
        name: clinicName,
        address: clinicAddress,
        contactPhone: clinicPhone,
        openingHours,
        logoUrl: clinicLogo,
        followUpDays,
      }));
      setSavingProfile(false);
      showToast('Hospital profile & brand logo saved! Live across Mobile Check-in, TV Kiosk, & Doctor Cabin.');
    }
  };

  // Save Queue & Cash Rules
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          followUpDays,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClinic(data.data);
        showToast('Queue rules & cash policy saved successfully!');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // 2. Doctor CRUD
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/doctors/${editingDoctorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: docName,
            specialty: docSpecialty,
            roomNumber: docRoom,
            active: docActive,
          }),
        });
        showToast('Doctor details updated!');
      } else {
        await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/doctors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: docName,
            specialty: docSpecialty,
            roomNumber: docRoom,
            active: docActive,
          }),
        });
        showToast('New doctor added to OPD roster!');
      }
      setShowDoctorModal(false);
      resetDoctorForm();
      fetchClinicData();
    } catch (err) {
      alert('Error saving doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!window.confirm('Are you sure you want to remove this doctor from OPD?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/doctors/${doctorId}`, {
        method: 'DELETE',
      });
      showToast('Doctor removed.');
      fetchClinicData();
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  const resetDoctorForm = () => {
    setEditingDoctorId(null);
    setDocName('');
    setDocSpecialty('');
    setDocRoom('');
    setDocActive(true);
  };

  const openEditDoctor = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setDocName(doc.displayName);
    setDocSpecialty(doc.specialty);
    setDocRoom(doc.roomNumber);
    setDocActive(doc.active);
    setShowDoctorModal(true);
  };

  // 3. Service CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/services/${editingServiceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: srvName,
            fee: srvFee,
            durationMinutes: srvDuration,
          }),
        });
        showToast('Service & fee updated!');
      } else {
        await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: srvName,
            fee: srvFee,
            durationMinutes: srvDuration,
          }),
        });
        showToast('New service added!');
      }
      setShowServiceModal(false);
      resetServiceForm();
      fetchClinicData();
    } catch (err) {
      alert('Error saving service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/v1/clinics/${clinic.id}/services/${serviceId}`, {
        method: 'DELETE',
      });
      showToast('Service deleted.');
      fetchClinicData();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setSrvName('');
    setSrvFee('');
    setSrvDuration('15');
  };

  const openEditService = (srv: Service) => {
    setEditingServiceId(srv.id);
    setSrvName(srv.name);
    setSrvFee(srv.fee.toString());
    setSrvDuration(srv.durationMinutes.toString());
    setShowServiceModal(true);
  };

  // 4. Standee Print & Image Download
  const checkInUrl = `${window.location.origin}/check-in/${clinic?.slug || 'city-health'}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const qrCanvas = qrRef.current?.querySelector('canvas');
      if (!qrCanvas) return;

      const width = 800;
      const height = 1200;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Outer Rounded Border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(40, 40, width - 80, height - 80, 48);
      ctx.stroke();

      // 1. Draw Hospital's Custom Logo at Top
      const hospLogoUrl = clinicLogo || clinic?.logoUrl;
      if (hospLogoUrl) {
        const hospImg = new Image();
        hospImg.crossOrigin = 'anonymous';
        hospImg.src = hospLogoUrl;

        await new Promise((resolve) => {
          hospImg.onload = resolve;
          hospImg.onerror = resolve;
        });

        if (hospImg.complete && hospImg.naturalWidth !== 0) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(width / 2 - 50, 85, 100, 100, 24);
          ctx.clip();
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(width / 2 - 50, 85, 100, 100);
          ctx.drawImage(hospImg, width / 2 - 50, 85, 100, 100);
          ctx.restore();

          // Border around hospital logo
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(width / 2 - 50, 85, 100, 100, 24);
          ctx.stroke();
        }
      } else {
        // Fallback Hospital Emblem Badge
        ctx.fillStyle = '#f0f9ff';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 50, 85, 100, 100, 24);
        ctx.fill();
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.font = '54px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏥', width / 2, 155);
      }

      // Hospital Name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(clinic?.name || 'City Health Clinic', width / 2, 235);

      // Hospital Address
      ctx.fillStyle = '#64748b';
      ctx.font = '22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(clinic?.address || 'Metro Towers, MG Road, Bengaluru', width / 2, 275);

      // QR Code Box
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, 325, 400, 400, 36);
      ctx.fill();
      ctx.stroke();

      // Draw QR Code
      ctx.drawImage(qrCanvas, width / 2 - 160, 365, 320, 320);

      // Tagline
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Scan with Phone Camera to Check-In', width / 2, 790);

      // Instruction
      ctx.fillStyle = '#64748b';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Get your digital token instantly & track queue from your phone.', width / 2, 830);

      // URL
      ctx.fillStyle = '#0284c7';
      ctx.font = '600 20px monospace';
      ctx.fillText(checkInUrl, width / 2, 875);

      // Divider
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(120, 930);
      ctx.lineTo(width - 120, 930);
      ctx.stroke();

      // Platform Footer: Powered by Queueless (with Queueless 'Q' Logo)
      const qLogoImg = new Image();
      qLogoImg.crossOrigin = 'anonymous';
      qLogoImg.src = '/logo.png';
      await new Promise((resolve) => {
        qLogoImg.onload = resolve;
        qLogoImg.onerror = resolve;
      });

      if (qLogoImg.complete && qLogoImg.naturalWidth !== 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(width / 2 - 195, 960, 36, 36, 10);
        ctx.clip();
        ctx.drawImage(qLogoImg, width / 2 - 195, 960, 36, 36);
        ctx.restore();
      }

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Powered by Queueless • Smart Clinic OS', width / 2 - 145, 985);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${(clinic?.name || 'Queueless').replace(/\s+/g, '_')}_Standee.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500">Loading Hospital Admin Panel...</div>;
  }

  // Password Authentication Screen for Hospital Business Admin
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 mt-12 pb-24">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-600/25">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-black text-slate-900 tracking-tight">Hospital Business Admin</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter the authorized master password to access hospital settings, doctor cabins, and password controls.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* 1-Click Dev / Quick Autofill Button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                setAdminPasswordInput('admin123');
                submitAdminLogin('admin123');
              }}
              className="w-full py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-300/80 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-xs"
              title="1-Click Quick Autofill and Login"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>⚡ Quick Access: 1-Click Autofill & Login</span>
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Master Admin Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-mono font-bold text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn || !adminPasswordInput.trim()}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loggingIn ? 'Authenticating...' : 'Unlock Business Admin'}</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>Default Password:</span>
            <button
              type="button"
              onClick={() => {
                setAdminPasswordInput('admin123');
                submitAdminLogin('admin123');
              }}
              className="font-mono font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded transition-all cursor-pointer"
              title="Click to autofill & login"
            >
              admin123 (Tap to Fill)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24 print:p-0 print:m-0 print:max-w-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Header (Hidden on Print) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          {clinicLogo || clinic?.logoUrl ? (
            <img
              src={clinicLogo || clinic?.logoUrl}
              alt={clinic?.name}
              className="w-14 h-14 rounded-2xl border border-slate-200 object-contain p-1 bg-white shadow-sm shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-center font-black text-2xl shadow-sm border border-white/20 shrink-0 select-none">
              {clinic?.name ? clinic.name.charAt(0).toUpperCase() : <Building2 className="w-7 h-7" />}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{clinic?.name || 'Hospital Administration'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold uppercase tracking-wider">
                Admin Panel
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage OPD Doctors, Consultation Fees, OPD Timings, Queue Policy & QR Standees.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Admin Active</span>
          </div>

          <button
            onClick={handleAdminLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            title="Lock Console / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>

          <button
            onClick={() => setActiveTab('STANDEE')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Entrance QR Standee</span>
          </button>
        </div>
      </div>

      {/* 👑 HOSPITAL OWNER COMMAND: ROLE SWITCHER & MULTI-SCREEN AUDIT */}
      <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 print:hidden relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30 flex items-center gap-1">
                <span>👑</span>
                <span>Hospital Owner Authority</span>
              </span>
              <span className="text-xs text-indigo-200 font-semibold">• Master Multi-Role Access</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              Switch & Inspect Any Hospital Role Live
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              As the hospital owner, you can switch into any department screen to audit patient flow, calling status, or cashier receipts without getting locked out.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto shrink-0">
            {/* 1. Doctor Cabin */}
            <a
              href={`/doctor/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 group cursor-pointer"
              title="Open Doctor Consultation Cabin Desk"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-bold text-white truncate">Doctor Cabin</span>
                <span className="block text-[10px] text-purple-300 font-mono">1-Tap Call ↗</span>
              </div>
            </a>

            {/* 2. Reception POS */}
            <a
              href={`/reception/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 group cursor-pointer"
              title="Open Frontdesk Reception Cashier & POS"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-bold text-white truncate">Reception POS</span>
                <span className="block text-[10px] text-teal-300 font-mono">Cashier Desk ↗</span>
              </div>
            </a>

            {/* 3. 55" TV Kiosk */}
            <a
              href={`/display/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 group cursor-pointer"
              title="Open Lobby OLED Display & Chimes"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Tv className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-bold text-white truncate">55" TV Display</span>
                <span className="block text-[10px] text-emerald-300 font-mono">Lobby View ↗</span>
              </div>
            </a>

            {/* 4. Patient Mobile Pass */}
            <a
              href={`/check-in/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 group cursor-pointer"
              title="Open Patient Mobile Check-in Pass"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-xs font-bold text-white truncate">Patient Pass</span>
                <span className="block text-[10px] text-blue-300 font-mono">Mobile QR ↗</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Hidden on Print) with Native Horizontal Momentum Scroll on Mobile */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1.5 scrollbar-none print:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Business Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ANALYTICS');
            fetchExecutiveAnalytics();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ANALYTICS'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Rush Heatmap & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCTORS')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'DOCTORS'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctors & OPD Cabins ({clinic?.doctors?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('SERVICES')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'SERVICES'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Services & Fees ({clinic?.services?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'PROFILE'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospital Profile & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('RULES')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'RULES'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Queue & Cash Policy</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('SECURITY');
            fetchSecuritySettings();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'SECURITY'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Staff Passwords & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('STANDEE')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'STANDEE'
              ? 'bg-sky-50 text-sky-700 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100/70'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Print / Download Standee</span>
        </button>
      </div>

      {/* TAB 1: BUSINESS OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 print:hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Total Revenue Today</span>
              <div className="text-3xl font-black text-emerald-600">
                ₹{summary?.totalRevenue || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">From verified online & cash fees</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Total Patient Footfall</span>
              <div className="text-3xl font-black text-slate-800">
                {summary?.totalRegistered || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Registered today via QR & desk</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Active Doctors on Duty</span>
              <div className="text-3xl font-black text-sky-600">
                {clinic?.doctors?.filter((d: any) => d.active).length || 0}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Assigned across cabins</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Avg Patient Waiting Time</span>
              <div className="text-3xl font-black text-amber-600">
                {summary?.avgWaitMinutes || 12} min
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">From arrival to doctor cabin</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('DOCTORS')}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit mb-3 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Manage Doctors & Cabins</h3>
              <p className="text-xs text-slate-500 mt-1">
                Add visiting consultants, assign OPD room numbers, and set active status.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('SERVICES')}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-3 group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Set Consultation Fees</h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure OPD fees per service (General OPD, Pediatrics, Specialist Checkup).
              </p>
            </div>

            <div
              onClick={() => setActiveTab('STANDEE')}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-3 group-hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Download QR Standee</h3>
              <p className="text-xs text-slate-500 mt-1">
                Print or download high-resolution QR standee posters for entrance desks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: EXECUTIVE ANALYTICS & RUSH HEATMAP */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6 print:hidden">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Total Patient Footfall</span>
              <div className="text-3xl font-black text-slate-900">
                {analyticsData?.totalPatients ?? summary?.todayPatients ?? 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Registered in Clinic OS</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Collected OPD Revenue</span>
              <div className="text-3xl font-black text-emerald-600">
                ₹{analyticsData?.totalRevenue?.toLocaleString() ?? summary?.todayRevenue ?? 0}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Verified Cash & UPI</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">SLA Compliance Rate</span>
              <div className="text-3xl font-black text-sky-600">
                {analyticsData?.slaSuccessRate ?? 85}%
              </div>
              <span className="text-[11px] text-sky-700 font-semibold mt-1 block">Seen under 30 minutes</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Active Doctors</span>
              <div className="text-3xl font-black text-slate-900">
                {clinic?.doctors?.length || 0}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Available across OPD Cabins</span>
            </div>
          </div>

          {/* Hourly Rush Distribution Heatmap Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  <span>OPD Hourly Rush Distribution (8:00 AM - 8:00 PM)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Peak hour analysis helps management deploy extra doctors and counter staff during heavy rush hours.
                </p>
              </div>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Live Rush Heatmap
              </span>
            </div>

            <div className="grid grid-cols-13 gap-1.5 pt-6 pb-2 items-end h-48 border-b border-slate-100">
              {analyticsData?.hourlyTrend ? (
                analyticsData.hourlyTrend.map((item: any, idx: number) => {
                  const maxCount = Math.max(...analyticsData.hourlyTrend.map((h: any) => h.count), 1);
                  const heightPct = Math.max(12, Math.round((item.count / maxCount) * 100));
                  const isPeak = item.count > 0 && item.count === maxCount;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {item.count} patients • ₹{item.revenue}
                      </div>

                      <span className="text-[10px] font-bold text-slate-600">{item.count > 0 ? item.count : ''}</span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-lg transition-all ${
                          isPeak
                            ? 'bg-gradient-to-t from-rose-500 to-amber-500 shadow-sm'
                            : item.count > 0
                            ? 'bg-gradient-to-t from-sky-600 to-cyan-500 shadow-sm'
                            : 'bg-slate-100'
                        }`}
                      />
                      <span className="text-[9px] font-semibold text-slate-400 truncate w-full text-center">
                        {item.hour.split(':')[0]}h
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-13 text-center py-12 text-xs text-slate-400">Loading hourly trend data...</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctor Leaderboard */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Doctor OPD Performance Leaderboard</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consultation velocity and patient throughput per physician.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Doctor</th>
                      <th className="py-2.5 px-4">OPD Cabin</th>
                      <th className="py-2.5 px-4 text-center">Queue Handled</th>
                      <th className="py-2.5 px-4 text-center">Completed</th>
                      <th className="py-2.5 px-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {analyticsData?.doctorLeaderboard?.map((doc: any) => (
                      <tr key={doc.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {doc.name}
                          <span className="text-[11px] text-slate-400 block font-normal">{doc.specialty}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono font-semibold">{doc.roomNumber}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">{doc.patientsCount}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {doc.completedCount} Seen
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">₹{doc.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Demographics & Blood Group Registry */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Patient Demographics
                </h4>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Male Patients:</span>
                    <span className="font-black text-slate-900">{analyticsData?.genderSplit?.Male || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Female Patients:</span>
                    <span className="font-black text-slate-900">{analyticsData?.genderSplit?.Female || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Other / Unspecified:</span>
                    <span className="font-black text-slate-900">{analyticsData?.genderSplit?.Other || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Blood Group Distribution
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analyticsData?.bloodGroupDistribution && Object.keys(analyticsData.bloodGroupDistribution).length > 0 ? (
                    Object.entries(analyticsData.bloodGroupDistribution).map(([bg, count]: [string, any]) => (
                      <span key={bg} className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>{bg}: {count}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No blood group records recorded yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR & CABIN MANAGEMENT */}
      {activeTab === 'DOCTORS' && (
        <div className="space-y-6 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Doctors & Assigned Cabins</h2>
              <p className="text-xs text-slate-500">
                Patients will see these doctors during self check-in and queue token issuance.
              </p>
            </div>
            <button
              onClick={() => {
                resetDoctorForm();
                setShowDoctorModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clinic?.doctors?.map((doc: Doctor) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{doc.displayName}</h3>
                      <p className="text-xs text-sky-700 font-semibold">{doc.specialty}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        doc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {doc.active ? 'Active' : 'On Leave'}
                    </span>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Cabin / Room</span>
                    <span className="font-extrabold text-slate-800">{doc.roomNumber || 'General OPD'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditDoctor(doc)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Edit Doctor"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doc.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Doctor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & CONSULTATION FEES */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-6 print:hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">OPD Services & Consultation Fees</h2>
              <p className="text-xs text-slate-500">
                Set fees that patients pay online via UPI or at the reception counter.
              </p>
            </div>
            <button
              onClick={() => {
                resetServiceForm();
                setShowServiceModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service / OPD Fee</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Service Name</th>
                  <th className="py-3.5 px-6">Consultation Fee</th>
                  <th className="py-3.5 px-6">Slot Duration</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clinic?.services?.map((srv: Service) => (
                  <tr key={srv.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-bold text-slate-900 text-sm">{srv.name}</td>
                    <td className="py-3.5 px-6 font-extrabold text-emerald-600 text-sm">
                      ₹{srv.fee}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 font-medium">{srv.durationMinutes} minutes</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditService(srv)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HOSPITAL PROFILE & BRANDING */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hospital Profile & Custom Branding</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Each hospital can upload its own custom logo, address, and OPD consultation policy.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-100">
              Tenant ID: {clinic?.slug}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. Custom Hospital Logo Section */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Hospital / Clinic Official Logo
              </label>
              <p className="text-[11px] text-slate-500 mb-4">
                This logo will appear on your entrance standees, patient mobile check-in screen, TV kiosk banner, and digital token passes.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Logo Preview */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 p-1 flex items-center justify-center overflow-hidden shadow-inner">
                    {clinicLogo ? (
                      <img
                        src={clinicLogo}
                        alt="Hospital Logo"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                        <span className="text-[9px] text-slate-400 font-bold block leading-tight">Default Emblem</span>
                      </div>
                    )}
                  </div>
                  {clinicLogo && (
                    <button
                      type="button"
                      onClick={() => setClinicLogo('')}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-transform hover:scale-110"
                      title="Remove Logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Upload & Choose Controls */}
                <div className="space-y-3 flex-1 text-left w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Hospital Logo</span>
                    </button>

                    {clinicLogo && (
                      <button
                        type="button"
                        onClick={() => setClinicLogo('')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Supported: PNG, JPEG, SVG or WebP (Max 2MB). Transparent background recommended.
                  </span>

                  {/* Preset Quick Logos */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Or Choose a Medical Preset Logo:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_LOGOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPresetLogo(preset.url)}
                          className="flex items-center gap-2 p-1.5 bg-white hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-300 text-left transition-all"
                        >
                          <img src={preset.url} alt="" className="w-6 h-6 rounded-md object-contain shrink-0" />
                          <span className="text-[10px] font-bold text-slate-700 truncate">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Hospital Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Clinic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="e.g. Apollo Multi-Speciality Clinic"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Address / Facility Location <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="e.g. Suite 402, Metro Towers, MG Road, Bengaluru, Karnataka 560001"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={clinicPhone}
                    onChange={(e) => setClinicPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Opening Hours</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM - 08:00 PM"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Free Follow-up Review Window (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={followUpDays}
                    onChange={(e) => setFollowUpDays(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="15"
                  />
                  <p className="text-[10px] text-purple-600 font-semibold mt-1">Configured in detail under Rules tab (₹0 free consultation policy).</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Changes take effect across patient check-in, token passes, standees & kiosk screens.
              </span>
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Profile & Logo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: QUEUE & CASH POLICY SETTINGS */}
      {activeTab === 'RULES' && (
        <div className="max-w-3xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Queue Operations & Cashier Desk Rules</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hospital admins can customize payment options, cashier gatekeeping, follow-up days, and TV kiosk alerts.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Live Enforcement
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* 1. Cash Counter & Gatekeeping Policy */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Cash Payment & Counter Admission Rules</h3>
              </div>

              {/* Toggle 1: Require Desk Cash Verification */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md">
                  <span className="text-xs font-bold text-slate-900 block">
                    Strict Reception Cash Verification (Gatekeeping)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    When enabled, cash patients must visit the reception counter and pay before their name appears in the Doctor's OPD queue. Doctors cannot call unpaid patients.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireDeskAdmission ?? true}
                    onChange={(e) => setSettings({ ...settings, requireDeskAdmission: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 2: Allow Cash at Counter */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md">
                  <span className="text-xs font-bold text-slate-900 block">
                    Accept Cash at Reception Counter
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow patients to choose "Pay at Clinic Counter (Cash)" during self check-in.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowCashAtCounter ?? true}
                    onChange={(e) => setSettings({ ...settings, allowCashAtCounter: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* 2. Digital UPI Payments Policy */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Online UPI & Digital Gateway</h3>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200">
                <div className="max-w-md">
                  <span className="text-xs font-bold text-slate-900 block">
                    Enable Instant UPI / QR Payment at Check-In
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Patients can pay instantly from their phone via Google Pay, PhonePe, Paytm, or BHIM UPI to skip reception billing lines entirely.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowOnlineUPI ?? true}
                    onChange={(e) => setSettings({ ...settings, allowOnlineUPI: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                </label>
              </div>
            </div>

            {/* 3. Follow-up & Booking Window (Hospital Admin Configured) */}
            <div className="p-5 bg-gradient-to-br from-purple-50/60 via-slate-50 to-indigo-50/50 rounded-2xl border border-purple-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-purple-600 text-white rounded-xl shadow-xs">
                    <Clock className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Hospital 15-Day Free Follow-Up & Review Protocol</h3>
                    <p className="text-[11px] text-slate-500">Configure automated recognition, validity window, and consultation pricing for returning OPD patients.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  {settings.isFreeFollowUp ?? true ? '100% Free Follow-Up' : `₹${settings.followUpFeeAmount || 250} Paid Review`}
                </span>
              </div>

              {/* Toggle 1: 100% Free Follow-Up Protocol */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-purple-200/90 shadow-2xs">
                <div className="max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 block">
                      Enable 100% Free Follow-Up (₹0 Fee)
                    </span>
                    <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    When enabled, returning patients within the configured window pay ₹0 consultation fee. They bypass reception billing queues and enter directly into the doctor's waiting lounge.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.isFreeFollowUp ?? true}
                    onChange={(e) => setSettings({ ...settings, isFreeFollowUp: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Validity Window Selection with Quick Presets */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-black text-slate-900">
                      Follow-Up Review Validity Window
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Patient phone numbers visiting within these days from their last consult qualify for this policy.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={followUpDays}
                      onChange={(e) => setFollowUpDays(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 border border-purple-300 rounded-lg text-xs font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Days</span>
                  </div>
                </div>

                {/* Quick Presets Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
                  {[
                    { days: 7, label: '7 Days (Post-op)' },
                    { days: 10, label: '10 Days' },
                    { days: 15, label: '15 Days (NABH Standard)' },
                    { days: 21, label: '21 Days' },
                    { days: 30, label: '30 Days (Chronic)' },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setFollowUpDays(p.days)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        followUpDays === p.days
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Not Free: Custom Follow-up Fee */}
              {!(settings.isFreeFollowUp ?? true) && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-in fade-in">
                  <label className="block text-xs font-bold text-amber-950">
                    Nominal Follow-Up Consultation Fee (₹)
                  </label>
                  <p className="text-[11px] text-amber-800">
                    Charged to returning patients within the review window instead of full consultation rate.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={settings.followUpFeeAmount ?? 250}
                      onChange={(e) => setSettings({ ...settings, followUpFeeAmount: parseInt(e.target.value) || 0 })}
                      className="w-32 px-3 py-1.5 border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                    <span className="text-xs text-slate-500">per follow-up visit</span>
                  </div>
                </div>
              )}

              {/* Sub-Rules: Doctor Auto-Routing & Priority Queue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Auto-Route to Same Doctor
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Locks review token to treating physician's cabin.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.autoRouteSameDoctor ?? true}
                      onChange={(e) => setSettings({ ...settings, autoRouteSameDoctor: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Allow Future Date Pre-Booking
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Allow patients to pre-book tomorrow or upcoming dates.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settings.allowPreBooking ?? true}
                      onChange={(e) => setSettings({ ...settings, allowPreBooking: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Live Enforcement Preview Callout */}
              <div className="p-3.5 bg-purple-100/70 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
                <span>
                  <strong>Active Hospital Policy:</strong> Patients re-visiting within <strong>{followUpDays} days</strong> of initial consultation are automatically admitted with <strong>{settings.isFreeFollowUp ?? true ? '100% Free Consultation (₹0 fee)' : `₹${settings.followUpFeeAmount || 250} review fee`}</strong> and routed directly to their doctor.
                </span>
              </div>
            </div>

            {/* 4. Lobby TV Chime */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Lobby TV Audio Chime Sound
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Plays sound notification in the reception lobby whenever a doctor calls the next token.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.chimeSoundEnabled ?? true}
                    onChange={(e) => setSettings({ ...settings, chimeSoundEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Rules apply in real time across patient check-in, reception, and doctor OPD consoles.
              </span>
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {savingSettings ? 'Saving Rules...' : 'Save Queue & Cash Policy'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: STAFF PASSWORDS & SECURITY CONTROL (BUSINESS ADMIN ONLY) */}
      {activeTab === 'SECURITY' && (
        <div className="max-w-4xl space-y-6 print:hidden">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">Staff Access & Role Passwords</h2>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                    Admin Managed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set and update login passwords for Business Admin, Reception Counter, and Doctor Cabins.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchSecuritySettings}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSecurity ? 'animate-spin' : ''}`} />
                <span>Reload</span>
              </button>
            </div>

            {/* Quick Action: Apply Same Password across All Roles */}
            <div className="mb-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Owner Quick-Sync: Same Password For All Roles</span>
                </div>
                <p className="text-[11px] text-amber-800/80 leading-relaxed max-w-lg">
                  Prefer using a single hospital password everywhere? Set your master password and sync it across Business Admin, Reception Desk, and all Doctor Cabins with 1 click.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <input
                  type="text"
                  value={samePasswordInput}
                  onChange={(e) => setSamePasswordInput(e.target.value)}
                  placeholder="e.g. hospital123"
                  className="px-3 py-2 text-xs font-mono font-bold rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 w-36"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!samePasswordInput.trim()) {
                      alert('Please enter a password to sync.');
                      return;
                    }
                    applySamePasswordToAll(samePasswordInput.trim());
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Sync to All Roles
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSecuritySettings} className="space-y-6">
              {/* 1. Admin Master Password */}
              <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Hospital Business Admin Master Password</h3>
                    <p className="text-[11px] text-slate-500">Unlocks this complete Admin & QR configuration console.</p>
                  </div>
                </div>

                <div className="relative max-w-md mt-3">
                  <input
                    type={showSecPasswords['ADMIN'] ? 'text' : 'password'}
                    value={secAdminPassword}
                    onChange={(e) => setSecAdminPassword(e.target.value)}
                    placeholder="Enter Admin Master Password"
                    className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-indigo-200 bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecPasswords({ ...showSecPasswords, ADMIN: !showSecPasswords['ADMIN'] })}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSecPasswords['ADMIN'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. Reception Desk Password */}
              <div className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Reception Counter & Cashier Password</h3>
                    <p className="text-[11px] text-slate-500">Used by receptionist to manage queues, collect cash, and call tokens.</p>
                  </div>
                </div>

                <div className="relative max-w-md mt-3">
                  <input
                    type={showSecPasswords['RECEPTION'] ? 'text' : 'password'}
                    value={secReceptionPassword}
                    onChange={(e) => setSecReceptionPassword(e.target.value)}
                    placeholder="Enter Reception Password"
                    className="w-full px-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-emerald-200 bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecPasswords({ ...showSecPasswords, RECEPTION: !showSecPasswords['RECEPTION'] })}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSecPasswords['RECEPTION'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. Doctor Cabin Passwords & Quick PINs */}
              <div className="p-5 bg-gradient-to-br from-sky-50/70 to-cyan-50/40 border border-sky-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-sky-600 text-white rounded-xl">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Doctor OPD Passwords & Quick Login PINs</h3>
                    <p className="text-[11px] text-slate-500">Each doctor has their own password and 4-digit quick touch PIN.</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {secDoctorPasswords.map((doc, idx) => (
                    <div
                      key={doc.doctorId}
                      className="bg-white p-4 rounded-xl border border-sky-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-5">
                        <div className="text-xs font-black text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-500">{doc.specialty} • <span className="font-semibold text-sky-700">{doc.roomNumber}</span></div>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doctor Password</label>
                        <div className="relative">
                          <input
                            type={showSecPasswords[doc.doctorId] ? 'text' : 'password'}
                            value={doc.password}
                            onChange={(e) => {
                              const updated = [...secDoctorPasswords];
                              updated[idx].password = e.target.value;
                              setSecDoctorPasswords(updated);
                            }}
                            placeholder="Password"
                            className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 pr-8 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecPasswords({ ...showSecPasswords, [doc.doctorId]: !showSecPasswords[doc.doctorId] })}
                            className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                          >
                            {showSecPasswords[doc.doctorId] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">4-Digit PIN</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={doc.pin}
                          onChange={(e) => {
                            const updated = [...secDoctorPasswords];
                            updated[idx].pin = e.target.value;
                            setSecDoctorPasswords(updated);
                          }}
                          placeholder="PIN e.g. 1234"
                          className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-slate-50 text-center tracking-widest focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSecurity}
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingSecurity ? 'Updating Passwords...' : 'Save & Update All Staff Passwords'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: PRINTABLE / DOWNLOADABLE STANDEE */}
      {activeTab === 'STANDEE' && (
        <div>
          {/* Action Banner (Hidden on Print) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Hospital QR Standee</h2>
              <p className="text-xs text-slate-500">
                Displaying {clinic?.name}'s custom logo and QR code. Download high-res PNG or print directly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPng}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Generating PNG...' : 'Download Standee (PNG)'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Standee (PDF)</span>
              </button>
            </div>
          </div>

          {/* Standee Container (THIS ALONE PRINTS) */}
          <div className="print-standee-container">
            <div
              id="printable-standee"
              className="print-standee-card bg-white p-8 rounded-3xl border-2 border-slate-300 shadow-lg text-center max-w-md mx-auto"
            >
              {/* Hospital's Custom Brand Logo & Identity */}
              <div className="mb-4">
                {clinicLogo || clinic?.logoUrl ? (
                  <div className="flex justify-center mb-2.5">
                    <img
                      src={clinicLogo || clinic?.logoUrl}
                      alt={clinic?.name}
                      className="w-16 h-16 rounded-2xl object-contain shadow-sm border border-slate-200 p-1 bg-white"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-2.5 text-sky-600 shadow-sm">
                    <Building2 className="w-7 h-7" />
                  </div>
                )}

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{clinic?.name || 'City Health Clinic'}</h2>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">{clinic?.address}</p>

                {clinic?.openingHours && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>OPD Hours: {clinic?.openingHours}</span>
                  </div>
                )}
              </div>

              {/* QR Code Container */}
              <div
                ref={qrRef}
                className="my-5 p-6 bg-slate-50 inline-block rounded-3xl border border-slate-200 shadow-inner"
              >
                <QRCodeCanvas value={checkInUrl} size={220} level="H" includeMargin={true} />
              </div>

              <div className="space-y-1">
                <span className="text-base font-extrabold text-slate-800 block">
                  Scan with Phone Camera to Check-In
                </span>
                <p className="text-xs text-slate-500">
                  Get your digital token instantly & track queue live from your phone.
                </p>
                <p className="text-[11px] font-mono text-sky-700 font-semibold pt-2 break-all">
                  {checkInUrl}
                </p>
              </div>

              {/* Platform Provider Footer (Powered by Queueless) */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <img src="/logo.png" alt="Queueless" className="w-4 h-4 rounded-md object-cover shadow-xs" />
                <span>Powered by Queueless • Smart Clinic OS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingDoctorId ? 'Edit Doctor Details' : 'Add New OPD Doctor'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter doctor's full name, medical specialty, and assigned cabin/room.
            </p>

            <form onSubmit={handleSaveDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name & Credentials</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rohan Sharma, MD"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medical Specialty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General Physician, Pediatrician, Orthopedic"
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Cabin / Room Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cabin 101, 1st Floor"
                  value={docRoom}
                  onChange={(e) => setDocRoom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="docActive"
                  checked={docActive}
                  onChange={(e) => setDocActive(e.target.checked)}
                  className="h-4 w-4 text-sky-600 rounded"
                />
                <label htmlFor="docActive" className="text-xs font-semibold text-slate-700">
                  Currently on Duty / Active for OPD
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm"
                >
                  {editingDoctorId ? 'Update Doctor' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingServiceId ? 'Edit Consultation Service' : 'Add OPD Consultation Service'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Define service name and consultation fee charged to patients.
            </p>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General OPD Consultation"
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={srvFee}
                  onChange={(e) => setSrvFee(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Slot Duration (Mins)</label>
                <input
                  type="number"
                  required
                  value={srvDuration}
                  onChange={(e) => setSrvDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                >
                  {editingServiceId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
