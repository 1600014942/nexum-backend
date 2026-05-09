import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { productTranslations } from '@/lib/productTranslations';
import { ChevronDown } from 'lucide-react';
import Navigation from '@/components/Navigation';

/**
 * Product Page - Qwen Standard Token Package
 * Design Philosophy: Mature B2B infrastructure product page
 * - Deep black background with yellow accents (Binance style)
 * - Balanced two-column layout with proper whitespace
 * - Right sidebar fixed package summary (sticky on desktop)
 * - Strong typography with Microsoft YaHei
 */

export default function Product() {
  const { language } = useLanguage();
  const t = productTranslations[language as keyof typeof productTranslations];
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [, navigate] = useLocation();

  const faqItems = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
    { q: t.faq.q5, a: t.faq.a5 },
    { q: t.faq.q6, a: t.faq.a6 },
  ];

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="product" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <section className="mb-16">
              <div className="mb-8">
                <div className="inline-block border border-[#F3BA2F] px-4 py-2 mb-6 text-sm">
                  <span className="text-[#F3BA2F]">{t.hero.tagline}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg text-gray-300 mb-4">
                  {t.hero.subtitle}
                </p>
                <p className="text-base text-gray-400 mb-8 leading-relaxed">
                  {t.hero.description}
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <button onClick={() => navigate('/quote')} className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors">
                  {t.hero.requestQuote}
                </button>
                <button onClick={() => navigate('/quote')} className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors">
                  {t.hero.requestAccess}
                </button>
              </div>
            </section>

            {/* Product Overview */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-6">{t.overview.title}</h2>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {t.overview.description}
              </div>
            </section>

            {/* Product Specifications */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-8">{t.specifications.title}</h2>
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left column */}
                <div className="space-y-6">
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.model}</div>
                    <div className="text-lg font-bold">{t.specifications.modelValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.contextWindow}</div>
                    <div className="text-lg font-bold">{t.specifications.contextWindowValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.serviceClass}</div>
                    <div className="text-lg font-bold">{t.specifications.serviceClassValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.deliveryWindow}</div>
                    <div className="text-lg font-bold">{t.specifications.deliveryWindowValue}</div>
                  </div>
                </div>
                {/* Right column */}
                <div className="space-y-6">
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.includedInputTokens}</div>
                    <div className="text-lg font-bold">{t.specifications.includedInputTokensValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.includedOutputTokens}</div>
                    <div className="text-lg font-bold">{t.specifications.includedOutputTokensValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.settlementCurrency}</div>
                    <div className="text-lg font-bold">{t.specifications.settlementCurrencyValue}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.region}</div>
                    <div className="text-lg font-bold">{t.specifications.regionValue}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 mb-6">
                <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.specifications.deliveryFormat}</div>
                <div className="text-lg font-bold mb-4">{t.specifications.deliveryFormatValue}</div>
                <div className="text-gray-400 text-xs mb-3 uppercase tracking-wide">{t.specifications.exclusions}</div>
                <div className="flex flex-wrap gap-2">
                  {t.specifications.exclusionsList.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gray-800 px-3 py-1 text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{t.specifications.disclaimer}</p>
            </section>

            {/* Pricing & Settlement */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-8">{t.pricing.title}</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#F3BA2F]">{t.pricing.referencePrice}</h3>
                  <p className="text-gray-300 text-base">{t.pricing.referencePriceDescription}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#F3BA2F]">{t.pricing.packageQuote}</h3>
                  <p className="text-gray-300 text-base">{t.pricing.packageQuoteDescription}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#F3BA2F]">{t.pricing.settlement}</h3>
                  <p className="text-gray-300 text-base">{t.pricing.settlementDescription}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-[#F3BA2F]">{t.pricing.overagePolicy}</h3>
                  <p className="text-gray-300 text-base">{t.pricing.overagePolicyDescription}</p>
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-6">{t.delivery.title}</h2>
              <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line mb-6">
                {t.delivery.description}
              </div>
              <p className="text-gray-400 text-sm">{t.delivery.disclaimer}</p>
            </section>

            {/* Use Cases */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-8">{t.useCases.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-800 p-6 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                  <h3 className="text-lg font-bold mb-4 text-[#F3BA2F]">{t.useCases.case1Title}</h3>
                  <p className="text-gray-300 text-sm">{t.useCases.case1Description}</p>
                </div>
                <div className="border border-gray-800 p-6 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                  <h3 className="text-lg font-bold mb-4 text-[#F3BA2F]">{t.useCases.case2Title}</h3>
                  <p className="text-gray-300 text-sm">{t.useCases.case2Description}</p>
                </div>
                <div className="border border-gray-800 p-6 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
                  <h3 className="text-lg font-bold mb-4 text-[#F3BA2F]">{t.useCases.case3Title}</h3>
                  <p className="text-gray-300 text-sm">{t.useCases.case3Description}</p>
                </div>
              </div>
            </section>

            {/* Ordering Process */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-8">{t.orderingProcess.title}</h2>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#F3BA2F] text-black font-bold">
                        {step}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{t.orderingProcess[`step${step}Title` as keyof typeof t.orderingProcess]}</h3>
                      <p className="text-gray-300 text-sm">{t.orderingProcess[`step${step}Description` as keyof typeof t.orderingProcess]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16 pb-12 border-b border-gray-800">
              <h2 className="text-3xl font-bold mb-8">{t.faq.title}</h2>
              <div className="space-y-4">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="border border-gray-800 p-6">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between hover:text-[#F3BA2F] transition-colors"
                    >
                      <h3 className="text-lg font-bold text-left">{item.q}</h3>
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 transition-transform ${
                          expandedFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <p className="text-gray-300 text-sm mt-4 pt-4 border-t border-gray-800">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom CTA */}
            <section className="mb-12">
              <div className="bg-gray-900 border border-gray-800 p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">{t.bottomCta.title}</h2>
                <p className="text-gray-300 text-lg mb-8">{t.bottomCta.description}</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button onClick={() => navigate('/quote')} className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors">
                    {t.bottomCta.requestQuote}
                  </button>
                  <button onClick={() => navigate('/methodology')} className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors">
                    {t.bottomCta.requestCustom}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar - Package Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gray-900 border border-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-6 text-[#F3BA2F]">{t.packageSummary.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.model}</div>
                  <div className="text-lg font-bold">{t.packageSummary.modelValue}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.window}</div>
                  <div className="text-lg font-bold">{t.packageSummary.windowValue}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.class}</div>
                  <div className="text-lg font-bold">{t.packageSummary.classValue}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.deliveryWindow}</div>
                  <div className="text-lg font-bold">{t.packageSummary.deliveryWindowValue}</div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.includedUsage}</div>
                  <div className="space-y-2">
                    <div className="text-sm">{t.packageSummary.inputTokens}</div>
                    <div className="text-sm">{t.packageSummary.outputTokens}</div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.settlement}</div>
                  <div className="text-lg font-bold">{t.packageSummary.settlementValue}</div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <div className="text-gray-400 text-xs mb-2 uppercase tracking-wide">{t.packageSummary.referencePrice}</div>
                  <div className="text-2xl font-bold text-[#F3BA2F]">{t.packageSummary.referencePriceValue}</div>
                </div>
              </div>

              <button onClick={() => navigate('/quote')} className="w-full bg-[#F3BA2F] text-black px-6 py-3 font-bold hover:bg-yellow-400 transition-colors mt-8">
                Request Quote
              </button>
            </div>
          </div>
        </div>
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
