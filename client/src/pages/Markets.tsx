import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { marketsTranslations } from '@/lib/marketsTranslations';
import Navigation from '@/components/Navigation';

export default function Markets() {
  const { language } = useLanguage();
  const t = marketsTranslations[language as keyof typeof marketsTranslations];
  const [, navigate] = useLocation();

  const marketStack = [
    {
      title: t.stackLayer1Title,
      desc: t.stackLayer1Desc,
    },
    {
      title: t.stackLayer2Title,
      desc: t.stackLayer2Desc,
    },
    {
      title: t.stackLayer3Title,
      desc: t.stackLayer3Desc,
    },
  ];

  const marketObjects = [
    {
      title: t.object1Title,
      desc: t.object1Desc,
    },
    {
      title: t.object2Title,
      desc: t.object2Desc,
    },
    {
      title: t.object3Title,
      desc: t.object3Desc,
    },
    {
      title: t.object4Title,
      desc: t.object4Desc,
    },
  ];

  const participants = [
    {
      title: t.participant1Title,
      desc: t.participant1Desc,
    },
    {
      title: t.participant2Title,
      desc: t.participant2Desc,
    },
    {
      title: t.participant3Title,
      desc: t.participant3Desc,
    },
    {
      title: t.participant4Title,
      desc: t.participant4Desc,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="markets" />

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

        {/* Market Stack Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t.marketStackTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marketStack.map((layer, idx) => (
              <div key={idx} className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] mb-6 mx-auto">
                  <span className="text-[#F3BA2F] font-bold">{idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold mb-3 text-center text-white">{layer.title}</h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Market Objects Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.marketObjectsTitle}</h2>
            <p className="text-gray-400">{t.marketObjectsDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {marketObjects.map((obj, idx) => (
              <div key={idx} className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                <h3 className="text-lg font-bold mb-3 text-[#F3BA2F]">{obj.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Participants Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t.participantsTitle}</h2>
            <p className="text-gray-400">{t.participantsDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {participants.map((participant, idx) => (
              <div key={idx} className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                <h3 className="text-lg font-bold mb-3 text-[#F3BA2F]">{participant.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{participant.desc}</p>
              </div>
            ))}
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
                onClick={() => navigate('/indices')}
                className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors"
              >
                {t.viewIndices}
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
