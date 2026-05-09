import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { indicesTranslations } from '@/lib/indicesTranslations';
import Navigation from '@/components/Navigation';

export default function Indices() {
  const { language } = useLanguage();
  const t = indicesTranslations[language as keyof typeof indicesTranslations];
  const [, navigate] = useLocation();
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const indices = [
    {
      id: 'input-price',
      title: t.index1Title,
      desc: t.index1Desc,
    },
    {
      id: 'output-price',
      title: t.index2Title,
      desc: t.index2Desc,
    },
    {
      id: 'token-package',
      title: t.index3Title,
      desc: t.index3Desc,
    },
    {
      id: 'forward-curve',
      title: t.index4Title,
      desc: t.index4Desc,
    },
    {
      id: 'provider-basket',
      title: t.index5Title,
      desc: t.index5Desc,
    },
    {
      id: 'volatility-surface',
      title: t.index6Title,
      desc: t.index6Desc,
    },
  ];

  const reasons = [
    {
      title: t.reason1Title,
      desc: t.reason1Desc,
    },
    {
      title: t.reason2Title,
      desc: t.reason2Desc,
    },
    {
      title: t.reason3Title,
      desc: t.reason3Desc,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="indices" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 pb-20">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              {t.heroSubtitle}
            </p>
            <p className="text-gray-400 max-w-3xl mx-auto">
              {t.heroDescription}
            </p>
          </div>
        </section>

        {/* Intro Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8">{t.introTitle}</h2>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t.introBody}
            </p>
          </div>
        </section>

        {/* Index Family Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.indexFamilyTitle}</h2>
            <p className="text-gray-400">{t.indexFamilyDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indices.map((index) => (
              <button
                key={index.id}
                onClick={() => setSelectedIndex(selectedIndex === index.id ? null : index.id)}
                className={`border p-8 rounded-lg text-left transition-all duration-300 ${
                  selectedIndex === index.id
                    ? 'border-[#F3BA2F] bg-[#F3BA2F] bg-opacity-5'
                    : 'border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50'
                }`}
              >
                <h3 className={`text-lg font-bold mb-3 transition-colors ${
                  selectedIndex === index.id ? 'text-[#F3BA2F]' : 'text-white'
                }`}>
                  {index.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {index.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Why Indices Matter Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t.whyMatterTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, idx) => (
              <div key={idx} className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] mb-6 mx-auto">
                  <span className="text-[#F3BA2F] font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-center text-white">{reason.title}</h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">{reason.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Teaser Section */}
        <section className="mb-20">
          <div className="bg-gray-900 border border-gray-800 p-12 rounded-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t.methodologyTitle}</h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                {t.methodologyBody}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => navigate('/methodology')}
                  className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors"
                >
                  {t.viewMethodology}
                </button>
                <button
                  onClick={() => navigate('/product')}
                  className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors"
                >
                  {t.viewProducts}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 p-12 text-center rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              {t.ctaBody}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/product')}
                className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors"
              >
                {t.viewProducts}
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors"
              >
                {t.contact}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-12">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2026 Nexum. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
