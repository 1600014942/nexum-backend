import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';

interface NavigationProps {
  activePage?: 'home' | 'product' | 'indices' | 'markets' | 'methodology' | 'contact' | 'quote' | 'app';
}

export default function Navigation({ activePage = 'home' }: NavigationProps) {
  const [, navigate] = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const isActive = (page: string) => activePage === page;

  return (
    <nav className="border-b border-[#F3BA2F] border-opacity-20 sticky top-0 z-50 bg-black bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative h-8 w-8 flex items-center justify-center">
            <div className="absolute h-8 w-8 border-2 border-[#F3BA2F]" />
            <div className="absolute h-5 w-5 border-2 border-[#F3BA2F]" />
          </div>
          <span className="text-[#F3BA2F] font-bold">NEXUM</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <a
            onClick={() => navigate('/product')}
            className={`cursor-pointer transition-colors ${
              isActive('product') ? 'text-[#F3BA2F] font-semibold' : 'hover:text-[#F3BA2F]'
            }`}
          >
            {t.nav.product}
          </a>
          <a
            onClick={() => navigate('/indices')}
            className={`cursor-pointer transition-colors ${
              isActive('indices') ? 'text-[#F3BA2F] font-semibold' : 'hover:text-[#F3BA2F]'
            }`}
          >
            {t.nav.indices}
          </a>
          <a
            onClick={() => navigate('/markets')}
            className={`cursor-pointer transition-colors ${
              isActive('markets') ? 'text-[#F3BA2F] font-semibold' : 'hover:text-[#F3BA2F]'
            }`}
          >
            {t.nav.markets}
          </a>
          <a
            onClick={() => navigate('/methodology')}
            className={`cursor-pointer transition-colors ${
              isActive('methodology') ? 'text-[#F3BA2F] font-semibold' : 'hover:text-[#F3BA2F]'
            }`}
          >
            {t.nav.methodology}
          </a>
          <a href="https://www.notion.so/TOKEN-v0-1-3504637e44a780b498e0eca421352863" target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:text-[#F3BA2F] transition-colors">
            {t.nav.docs}
          </a>
          <a
            onClick={() => navigate('/contact')}
            className={`cursor-pointer transition-colors ${
              isActive('contact') ? 'text-[#F3BA2F] font-semibold' : 'hover:text-[#F3BA2F]'
            }`}
          >
            {t.nav.contact}
          </a>
        </div>

        {/* Language & CTA */}
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent border border-[#F3BA2F] border-opacity-30 text-white px-2 py-1 rounded text-sm cursor-pointer"
          >
            <option value="en" className="bg-black">EN</option>
            <option value="zh" className="bg-black">中文</option>
            <option value="ko" className="bg-black">한국어</option>
          </select>
          <button
            onClick={() => window.open('https://3000-iz2wsrltyzfpy6feydwbz-99421e5c.sg1.manus.computer', '_blank')}
            className="border border-[#F3BA2F] text-[#F3BA2F] px-4 py-2 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors"
          >
            {t.nav.launchApp}
          </button>
          <button
            onClick={() => navigate('/quote')}
            className="bg-[#F3BA2F] text-black px-4 py-2 font-bold hover:bg-yellow-400 transition-colors"
          >
            {t.nav.requestAccess}
          </button>
        </div>
      </div>
    </nav>
  );
}
