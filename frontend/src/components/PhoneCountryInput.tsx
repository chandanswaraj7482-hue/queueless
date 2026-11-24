import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface CountryData {
  iso: string;
  name: string;
  code: string;
  flag: string;
  placeholder: string;
  patternLength?: number;
}

export const POPULAR_COUNTRIES: CountryData[] = [
  { iso: 'IN', name: 'India', code: '+91', flag: '🇮🇳', placeholder: '98765 43210', patternLength: 10 },
  { iso: 'US', name: 'United States', code: '+1', flag: '🇺🇸', placeholder: '(555) 000-0000', patternLength: 10 },
  { iso: 'GB', name: 'United Kingdom', code: '+44', flag: '🇬🇧', placeholder: '7911 123456', patternLength: 10 },
  { iso: 'AE', name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', placeholder: '50 123 4567', patternLength: 9 },
  { iso: 'SA', name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', placeholder: '50 123 4567', patternLength: 9 },
  { iso: 'CA', name: 'Canada', code: '+1', flag: '🇨🇦', placeholder: '(555) 000-0000', patternLength: 10 },
  { iso: 'AU', name: 'Australia', code: '+61', flag: '🇦🇺', placeholder: '412 345 678', patternLength: 9 },
  { iso: 'SG', name: 'Singapore', code: '+65', flag: '🇸🇬', placeholder: '8123 4567', patternLength: 8 },
  { iso: 'QA', name: 'Qatar', code: '+974', flag: '🇶🇦', placeholder: '3312 3456', patternLength: 8 },
  { iso: 'KW', name: 'Kuwait', code: '+965', flag: '🇰🇼', placeholder: '5123 4567', patternLength: 8 },
  { iso: 'OM', name: 'Oman', code: '+968', flag: '🇴🇲', placeholder: '9123 4567', patternLength: 8 },
  { iso: 'BH', name: 'Bahrain', code: '+973', flag: '🇧🇭', placeholder: '3612 3456', patternLength: 8 },
  { iso: 'DE', name: 'Germany', code: '+49', flag: '🇩🇪', placeholder: '151 12345678', patternLength: 11 },
  { iso: 'FR', name: 'France', code: '+33', flag: '🇫🇷', placeholder: '6 12 34 56 78', patternLength: 9 },
  { iso: 'ZA', name: 'South Africa', code: '+27', flag: '🇿🇦', placeholder: '71 123 4567', patternLength: 9 },
  { iso: 'NG', name: 'Nigeria', code: '+234', flag: '🇳🇬', placeholder: '802 123 4567', patternLength: 10 },
  { iso: 'KE', name: 'Kenya', code: '+254', flag: '🇰🇪', placeholder: '712 345678', patternLength: 9 },
  { iso: 'BD', name: 'Bangladesh', code: '+880', flag: '🇧🇩', placeholder: '1712 345678', patternLength: 10 },
  { iso: 'NP', name: 'Nepal', code: '+977', flag: '🇳🇵', placeholder: '981 2345678', patternLength: 10 },
  { iso: 'PH', name: 'Philippines', code: '+63', flag: '🇵🇭', placeholder: '917 123 4567', patternLength: 10 },
];

export interface PhoneCountryInputProps {
  value: string;
  onChange: (value: string, fullWithDialCode?: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  variant?: 'light' | 'dark' | 'transparent';
  id?: string;
  name?: string;
  allowAlphaOrEmail?: boolean;
}

export const PhoneCountryInput: React.FC<PhoneCountryInputProps> = ({
  value,
  onChange,
  countryCode = '+91',
  onCountryCodeChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  variant = 'light',
  id,
  name,
  allowAlphaOrEmail = false,
}) => {
  const isDark = variant === 'dark';

  const [selectedCountry, setSelectedCountry] = useState<CountryData>(() => {
    return POPULAR_COUNTRIES.find((c) => c.code === countryCode) || POPULAR_COUNTRIES[0];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync if external countryCode changes
  useEffect(() => {
    if (countryCode && countryCode !== selectedCountry.code) {
      const match = POPULAR_COUNTRIES.find((c) => c.code === countryCode);
      if (match) setSelectedCountry(match);
    }
  }, [countryCode]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    if (onCountryCodeChange) {
      onCountryCodeChange(country.code);
    }
    // Also trigger onChange with updated full dial code
    const cleanNum = value.replace(/\D/g, '');
    onChange(value, cleanNum ? `${country.code} ${cleanNum}` : '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    if (!allowAlphaOrEmail) {
      // Only keep digits and spaces/hyphens
      raw = raw.replace(/[^\d\s-]/g, '');
      if (selectedCountry.patternLength && raw.replace(/\D/g, '').length > selectedCountry.patternLength) {
        raw = raw.slice(0, selectedCountry.patternLength);
      }
    }
    const cleanNum = raw.replace(/\D/g, '');
    onChange(raw, cleanNum ? `${selectedCountry.code} ${cleanNum}` : '');
  };

  const filteredCountries = POPULAR_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search) ||
      c.iso.toLowerCase().includes(search.toLowerCase())
  );

  const buttonStyle = isDark
    ? `h-10 sm:h-11 px-2.5 sm:px-3 bg-white/10 hover:bg-white/15 border border-r-0 border-white/20 rounded-l-xl flex items-center gap-1.5 transition-all text-xs font-bold text-white cursor-pointer select-none ${buttonClassName}`
    : `h-10 sm:h-11 px-2.5 sm:px-3 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-xl flex items-center gap-1.5 transition-all text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none ${buttonClassName}`;

  const inputStyle = isDark
    ? `flex-1 h-10 sm:h-11 px-3.5 rounded-r-xl border border-white/20 bg-white/10 text-xs font-bold text-white placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all ${inputClassName}`
    : `flex-1 h-10 sm:h-11 px-3.5 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all ${inputClassName}`;

  return (
    <div className={`relative flex items-center w-full ${className}`} ref={dropdownRef}>
      {/* Country Flag & Dial Code Selector Button */}
      <div className="relative shrink-0">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={buttonStyle}
          title={`Selected country: ${selectedCountry.name} (${selectedCountry.code})`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-base leading-none select-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="font-mono font-bold text-xs">{selectedCountry.code}</span>
          <ChevronDown className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-500'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Floating Country Picker Popover Dropdown */}
        {isOpen && (
          <div className={`absolute left-0 top-full mt-1.5 w-64 sm:w-72 ${
            isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
          } border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100`}>
            {/* Quick Country Search */}
            <div className={`p-2 border-b ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70'
            }`}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                  } border rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
              </div>
            </div>

            {/* Country List Options */}
            <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
              {filteredCountries.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">No country found</div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = c.code === selectedCountry.code && c.iso === selectedCountry.iso;
                  return (
                    <button
                      key={`${c.iso}-${c.code}`}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-sky-950/80 text-sky-200 font-bold'
                            : 'bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 font-bold'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base select-none">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{c.code}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Phone Number Input */}
      <input
        id={id}
        name={name}
        type={allowAlphaOrEmail ? 'text' : 'tel'}
        required={required}
        disabled={disabled}
        placeholder={placeholder || selectedCountry.placeholder}
        value={value}
        onChange={handleInputChange}
        className={inputStyle}
      />
    </div>
  );
};
