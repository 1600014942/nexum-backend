/**
 * Nexum | Open Model Pricing Infrastructure
 * 
 * Design Philosophy: Blackstone-Style Luxury Financial Platform
 * - Black background (#000000) with gold (#D4AF37) accents
 * - Vertical bar patterns for data visualization aesthetic
 * - Gold dashed borders for emphasis and important sections
 * - Bold typography with Space Mono for display, Inter for body
 * - Minimalist layout with high contrast and terminal-like feel
 * - Full i18n support: English, Chinese, Korean
 */

import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { translations } from '@/lib/translations';
import { useLocation } from 'wouter';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const [, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const nav = [
    t.nav.product,
    t.nav.indices,
    t.nav.markets,
    t.nav.methodology,
    t.nav.docs,
    t.nav.contact,
  ];

  const heroCards = [
    {
      title: t.heroCards.qwenPackage,
      body: t.heroCards.qwenBody,
      tag: t.heroCards.featuredPackage,
    },
    {
      title: t.heroCards.inputIndex,
      body: t.heroCards.inputIndexBody,
      tag: t.heroCards.index,
    },
    {
      title: t.heroCards.outputIndex,
      body: t.heroCards.outputIndexBody,
      tag: t.heroCards.index,
    },
    {
      title: t.heroCards.forwardCurve,
      body: t.heroCards.forwardCurveBody,
      tag: t.heroCards.marketSignal,
    },
  ];

  const marketGap = [
    {
      title: t.marketGap.buyers,
      body: t.marketGap.buyersBody,
    },
    {
      title: t.marketGap.providers,
      body: t.marketGap.providersBody,
    },
    {
      title: t.marketGap.markets,
      body: t.marketGap.marketsBody,
    },
  ];

  const stack = [
    {
      title: t.productStack.referencePrices,
      body: t.productStack.referencePricesBody,
      number: '01',
    },
    {
      title: t.productStack.tokenPackages,
      body: t.productStack.tokenPackagesBody,
      number: '02',
    },
    {
      title: t.productStack.structuredMarkets,
      body: t.productStack.structuredMarketsBody,
      number: '03',
    },
  ];

  const products = [
    {
      title: t.featuredProducts.packageContent === '100M input tokens + 20M output tokens' 
        ? t.heroCards.qwenPackage 
        : t.heroCards.qwenPackage,
      fields: [
        [t.featuredProducts.model, 'Qwen3.5-32B'],
        [t.featuredProducts.window, '128k'],
        [t.featuredProducts.class, 'Standard'],
        [t.featuredProducts.delivery, t.featuredProducts.nextMonth],
        [t.featuredProducts.package, t.featuredProducts.packageContent],
        [t.featuredProducts.settlement, t.featuredProducts.usdSettlement],
      ],
      note: t.featuredProducts.packageNote,
    },
    {
      title: t.featuredProducts.standardPackage,
      description: t.featuredProducts.standardPackageDesc,
    },
    {
      title: t.featuredProducts.priorityPackage,
      description: t.featuredProducts.priorityPackageDesc,
    },
    {
      title: t.featuredProducts.customPackage,
      description: t.featuredProducts.customPackageDesc,
    },
  ];

  const indices = [
    {
      title: t.indexFamily.inputPriceIndex,
      body: t.indexFamily.inputPriceIndexBody,
    },
    {
      title: t.indexFamily.outputPriceIndex,
      body: t.indexFamily.outputPriceIndexBody,
    },
    {
      title: t.indexFamily.standardTokenIndex,
      body: t.indexFamily.standardTokenIndexBody,
    },
    {
      title: t.indexFamily.forwardTokenCurve,
      body: t.indexFamily.forwardTokenCurveBody,
    },
    {
      title: t.indexFamily.providerBasket,
      body: t.indexFamily.providerBasketBody,
    },
    {
      title: t.indexFamily.volatilitySurface,
      body: t.indexFamily.volatilitySurfaceBody,
    },
  ];

  const structure = [
    {
      title: t.marketStructure.reference,
      body: t.marketStructure.referenceBody,
    },
    {
      title: t.marketStructure.quoting,
      body: t.marketStructure.quotingBody,
    },
    {
      title: t.marketStructure.structuring,
      body: t.marketStructure.structuringBody,
    },
  ];

  const participants = [
    {
      title: t.participants.modelProviders,
      body: t.participants.modelProvidersBody,
    },
    {
      title: t.participants.aiTeams,
      body: t.participants.aiTeamsBody,
    },
    {
      title: t.participants.brokers,
      body: t.participants.brokersBody,
    },
    {
      title: t.participants.marketMakers,
      body: t.participants.marketMakersBody,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#F3BA2F]/20 selection:text-white">
      {/* Background Effects - Ornn-style vertical bars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Vertical bars pattern - data visualization style */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_12px,rgba(255,255,255,0.03)_13px,transparent_14px)] bg-[size:14px_100%] opacity-50" />
        
        {/* Horizontal scan lines */}
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(243, 186, 47,0.02)_50%,transparent_100%)] pointer-events-none" />
        
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 flex items-center justify-center">
              <div className="absolute h-8 w-8 border-2 border-[#F3BA2F]" />
              <div className="absolute h-5 w-5 border-2 border-[#F3BA2F]" />
            </div>
            <div>
              <div className="text-sm tracking-[0.3em] font-bold text-[#F3BA2F]" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>NEXUM</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-white/60 lg:flex whitespace-nowrap">
            {nav.map((item) => {
              let href = '#';
              if (item === t.nav.product) href = '/product';
              if (item === t.nav.methodology) href = '/methodology';
              if (item === t.nav.contact) href = '/contact';
              if (item === t.nav.indices) href = '/indices';
              if (item === t.nav.markets) href = '/markets';
              if (item === t.nav.docs) href = 'https://www.notion.so/TOKEN-v0-1-3504637e44a780b498e0eca421352863';
              return (
                <a key={item} href={href} className="transition hover:text-[#F3BA2F] hover:tracking-wider flex-shrink-0">
                  {item}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => handleExternalLink('https://nexumtrade-77xjmcdm.manus.space')} className="border-2 border-[#D4AF37] bg-transparent px-5 py-2 text-sm font-bold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_20px_rgba(212, 175, 55,0.3)]">
              {language === 'en' ? 'Launch APP' : language === 'zh' ? '启动应用' : '앱 실행'}
            </button>
            <button onClick={() => handleNavigation('/quote')} className="border-2 border-[#F3BA2F] bg-[#F3BA2F] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#F3BA2F] hover:border-[#F3BA2F] hover:shadow-[0_0_20px_rgba(243, 186, 47,0.3)]">
              {t.nav.requestAccess}
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="grid items-end gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-8 inline-flex items-center border-2 border-[#F3BA2F] bg-[#F3BA2F]/10 px-4 py-2 text-xs tracking-[0.3em] text-[#F3BA2F] font-bold">
                {t.hero.tagline}
              </div>
              <h1 className="w-full text-4xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif', lineHeight: '1.2' }}>
                {t.hero.title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75 lg:text-xl">
                {t.hero.subtitle}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">
                {t.hero.description}
              </p>
              <div className="mt-12 flex flex-wrap gap-4">
                <button onClick={() => handleNavigation('/product')} className="border-2 border-[#F3BA2F] bg-[#F3BA2F] px-8 py-3 text-sm font-bold text-black transition hover:bg-[#F3BA2F] hover:border-[#F3BA2F] hover:shadow-[0_0_30px_rgba(243, 186, 47,0.4)]">
                  {t.hero.exploreProducts}
                </button>
                <button onClick={() => handleNavigation('/indices')} className="border-2 border-[#F3BA2F] bg-transparent px-8 py-3 text-sm font-bold text-[#F3BA2F] transition hover:bg-[#F3BA2F]/10 hover:shadow-[0_0_20px_rgba(243, 186, 47,0.2)]">
                  {t.hero.viewIndices}
                </button>
              </div>
            </div>

            {/* Hero Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {heroCards.map((card, idx) => (
                <div
                  key={card.title}
                  className="border-2 border-white/20 bg-black/50 p-6 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5 hover:shadow-[0_0_20px_rgba(243, 186, 47,0.2)]"
                >
                  <div className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{card.tag}</div>
                  <div className="text-base font-bold leading-6 text-white">{card.title}</div>
                  <div className="mt-3 text-sm leading-6 text-white/60">{card.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Gap Section */}
        <section className="border-y-2 border-[#F3BA2F]/30 bg-black/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.marketGap.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.marketGap.title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">
                {t.marketGap.description}
              </p>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {marketGap.map((item) => (
                <div key={item.title} className="border-2 border-dashed border-[#F3BA2F]/40 bg-black/30 p-7 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                  <div className="text-xl font-bold text-white">{item.title}</div>
                  <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Stack Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.productStack.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.productStack.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65">
                {t.productStack.description}
              </p>
            </div>
      
            <div className="grid gap-5">
              {stack.map((item) => (
                <div key={item.title} className="border-2 border-white/15 bg-black/40 p-8 lg:p-9 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-bold text-white">{item.title}</div>
                    <div className="text-sm tracking-[0.3em] text-[#F3BA2F] font-bold" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>{item.number}</div>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="border-y-2 border-[#F3BA2F]/30 bg-black/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.featuredProducts.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.featuredProducts.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65">
                {t.featuredProducts.description}
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {/* Featured Package - Full Width with Red Dashed Border */}
              <div className="border-2 border-dashed border-[#F3BA2F] bg-black/40 p-8 lg:col-span-2 lg:p-10 transition hover:bg-[#F3BA2F]/5">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.featuredProducts.featuredPackageLabel}</div>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                      {products[0].title}
                    </h3>
                    <p className="mt-5 text-sm leading-7 text-white/60">{products[0].note}</p>
                  </div>
                  <div className="grid min-w-[300px] gap-4 border-2 border-[#F3BA2F]/30 bg-black/60 p-5 sm:grid-cols-2">
                    {products[0].fields?.map(([label, value]) => (
                      <div key={label} className="border border-[#F3BA2F]/20 bg-[#F3BA2F]/5 p-4">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{label}</div>
                        <div className="mt-2 text-sm font-bold leading-6 text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Product Cards */}
              {products.slice(1).map((product) => (
                <div key={product.title} className="border-2 border-white/15 bg-black/40 p-7 lg:p-8 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                  <div className="text-xl font-bold text-white">{product.title}</div>
                  <p className="mt-4 text-sm leading-7 text-white/60">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Index Family Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.indexFamily.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.indexFamily.title}
              </h2>
            <p className="mt-5 text-base leading-7 text-white/65">
              {t.indexFamily.description}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {indices.map((index) => (
              <div key={index.title} className="border-2 border-white/15 bg-black/40 p-7 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                <div className="text-lg font-bold leading-7 text-white">{index.title}</div>
                <p className="mt-4 text-sm leading-7 text-white/60">{index.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Market Structure Section */}
        <section className="border-y-2 border-[#F3BA2F]/30 bg-black/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="max-w-xl">
                <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.marketStructure.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.marketStructure.title}
              </h2>
                <p className="mt-5 text-base leading-7 text-white/65">
                  {t.marketStructure.description}
                </p>
              </div>
              <div className="grid gap-5">
                {structure.map((item) => (
                  <div key={item.title} className="border-2 border-dashed border-[#F3BA2F]/40 bg-black/30 p-7 lg:p-8 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                    <div className="text-xl font-bold text-white">{item.title}</div>
                    <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Participants Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.participants.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.participants.title}
              </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {participants.map((item) => (
              <div key={item.title} className="border-2 border-white/15 bg-black/40 p-7 transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/5">
                <div className="text-lg font-bold leading-7 text-white">{item.title}</div>
                <p className="mt-4 text-sm leading-7 text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology Section */}
        <section className="border-y-2 border-[#F3BA2F]/30 bg-black/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.methodology.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.methodology.title}
              </h2>
                <p className="mt-5 text-base leading-7 text-white/65">
                  {t.methodology.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => handleNavigation('/methodology')} className="border-2 border-white/30 bg-black/40 px-6 py-3 text-sm font-bold text-white transition hover:border-[#F3BA2F] hover:bg-[#F3BA2F]/10">
                  {t.methodology.viewMethodology}
                </button>
                <button onClick={() => handleExternalLink('https://www.notion.so/TOKEN-v0-1-3504637e44a780b498e0eca421352863')} className="border-2 border-[#F3BA2F] bg-[#F3BA2F] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F3BA2F] hover:border-[#F3BA2F] hover:shadow-[0_0_20px_rgba(243, 186, 47,0.3)]">
                  {t.methodology.readDocs}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="border-2 border-[#F3BA2F] bg-black/60 p-10 lg:p-14 hover:shadow-[0_0_40px_rgba(243, 186, 47,0.15)]">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.3em] text-[#F3BA2F] font-bold">{t.cta.tagline}</div>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl lg:text-5xl" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>
                {t.cta.title}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65 lg:text-lg">
                {t.cta.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => handleNavigation('/quote')} className="border-2 border-[#F3BA2F] bg-[#F3BA2F] px-8 py-3 text-sm font-bold text-black transition hover:bg-[#F3BA2F] hover:border-[#F3BA2F] hover:shadow-[0_0_30px_rgba(243, 186, 47,0.4)]">
                  {t.cta.requestAccess}
                </button>
                <button onClick={() => handleNavigation('/contact')} className="border-2 border-[#F3BA2F] bg-transparent px-8 py-3 text-sm font-bold text-[#F3BA2F] transition hover:bg-[#F3BA2F]/10 hover:shadow-[0_0_20px_rgba(243, 186, 47,0.2)]">
                  {t.cta.talkToUs}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-sm tracking-[0.3em] text-[#F3BA2F] font-bold" style={{ fontFamily: 'Microsoft YaHei, 微软雅黑, sans-serif' }}>NEXUM</div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">
              {t.footer.tagline}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/30 font-bold">
              {t.footer.keywords}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
            {nav.map((item) => (
              <a key={item} href="#" className="transition hover:text-[#F3BA2F]">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
