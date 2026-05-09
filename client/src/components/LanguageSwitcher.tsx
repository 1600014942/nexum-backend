import { useLanguage, type Language } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
  ];

  return (
    <div className="flex items-center border border-white/15">
      {languages.map((lang, idx) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 text-xs font-medium transition-all ${
            language === lang.code
              ? 'bg-white text-black'
              : 'bg-transparent text-white/60 hover:bg-white/[0.05] hover:text-white'
          } ${
            idx < languages.length - 1 ? 'border-r border-white/15' : ''
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
