import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { methodologyTranslations } from '@/lib/methodologyTranslations';
import Navigation from '@/components/Navigation';

export default function Methodology() {
  const { language } = useLanguage();
  const t = methodologyTranslations[language as keyof typeof methodologyTranslations];
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="methodology" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16 pb-20">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Section 1: A methodology for standardized AI usage objects */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.section1Title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{t.section1Body1}</p>
              <p className="text-gray-300 leading-relaxed">{t.section1Body2}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-[#F3BA2F]">{t.corePrinciplesTitle}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.principle1Desc}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Core Principles */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12">{t.corePrinciplesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.principle1Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.principle1Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.principle2Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.principle2Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.principle3Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.principle3Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.principle4Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.principle4Desc}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Object Definition Layer */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.objectDefinitionTitle}</h2>
          <div className="bg-gray-900 border border-gray-800 p-12 rounded-lg">
            <p className="text-gray-300 leading-relaxed mb-8">{t.objectDefinitionBody}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionModel}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionModelDesc}</p>
              </div>
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionContextWindow}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionContextWindowDesc}</p>
              </div>
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionServiceClass}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionServiceClassDesc}</p>
              </div>
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionDeliveryWindow}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionDeliveryWindowDesc}</p>
              </div>
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionPackageStructure}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionPackageStructureDesc}</p>
              </div>
              <div className="bg-black p-6 rounded border border-gray-800">
                <h4 className="text-lg font-bold mb-3 text-[#F3BA2F]">{t.dimensionSettlementTerms}</h4>
                <p className="text-gray-300 text-sm">{t.dimensionSettlementTermsDesc}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-8 italic">{t.objectDefinitionFootnote}</p>
          </div>
        </section>

        {/* Section 4: Standardized Token Packages */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.standardizedPackagesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{t.standardizedPackagesBody}</p>
              <div>
                <p className="text-[#F3BA2F] font-bold mb-4">{t.packageIncludes}</p>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem1}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem2}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem3}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem4}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem5}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem6}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.packageItem7}</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-400 text-sm italic">{t.packageStructureNote}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#F3BA2F] border-opacity-20 p-8 rounded-lg hover:border-opacity-40 transition-all duration-300">
              <div className="mb-6 pb-6 border-b border-[#F3BA2F] border-opacity-20">
                <h3 className="text-lg font-bold text-[#F3BA2F]">{t.examplePackageTitle}</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-200 font-semibold text-base leading-relaxed">{t.examplePackageContent}</p>
                </div>
                <div className="pt-4 border-t border-[#F3BA2F] border-opacity-10">
                  <p className="text-gray-400 text-xs italic">{t.examplePackageNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Reference Pricing Layer */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.referencePricingTitle}</h2>
          <div className="space-y-8">
            <p className="text-gray-300 leading-relaxed text-lg">{t.referencePricingBody1}</p>
            
            {/* The Core Question */}
            <div className="bg-gradient-to-r from-[#F3BA2F] from-0% via-[#F3BA2F] via-1% to-transparent to-40% p-0.5 rounded-lg">
              <div className="bg-black p-8 rounded-lg">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-3 font-semibold">{t.referencePricingQuestion}</p>
                <p className="text-white text-xl leading-relaxed font-semibold">{t.referencePricingQuestionText}</p>
              </div>
            </div>
            
            {/* Pricing Factors */}
            <div>
              <p className="text-[#F3BA2F] font-bold mb-6 text-lg">{t.referencePricingDeterminedBy}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] border-opacity-30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F3BA2F] font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.referencePricingItem1}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] border-opacity-30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F3BA2F] font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.referencePricingItem2}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] border-opacity-30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F3BA2F] font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.referencePricingItem3}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] border-opacity-30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F3BA2F] font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.referencePricingItem4}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg lg:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] border-opacity-30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#F3BA2F] font-bold text-sm">5</span>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.referencePricingItem5}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Insight */}
            <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 p-6 rounded-lg">
              <p className="text-blue-300 font-semibold mb-2 text-sm uppercase tracking-wider">💡 Key Insight</p>
              <p className="text-gray-200 leading-relaxed">{t.referencePricingNote1}</p>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed italic">{t.referencePricingNote2}</p>
            </div>
          </div>
        </section>

        {/* Section 6: Package Quote */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.packageQuoteTitle}</h2>
          <div className="space-y-8">
            <p className="text-gray-300 leading-relaxed text-lg">{t.packageQuoteBody1}</p>
            
            {/* Quote Components */}
            <div>
              <p className="text-[#F3BA2F] font-bold mb-6 text-lg">{t.packageQuoteIncludes}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem1}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem2}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem3}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem4}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem5}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-[#F3BA2F] hover:border-opacity-50 transition-all duration-300 p-6 rounded-lg group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#F3BA2F] bg-opacity-20 border border-[#F3BA2F] border-opacity-50 flex items-center justify-center flex-shrink-0 group-hover:bg-opacity-30 transition-all">
                      <svg className="w-4 h-4 text-[#F3BA2F]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-200 font-semibold text-sm leading-relaxed">{t.quoteItem6}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Why It Matters */}
            <div className="bg-emerald-900 bg-opacity-20 border border-emerald-500 border-opacity-30 p-6 rounded-lg">
              <p className="text-emerald-300 font-semibold mb-2 text-sm uppercase tracking-wider">✨ Why This Matters</p>
              <p className="text-gray-200 leading-relaxed">{t.packageQuoteNote}</p>
            </div>
          </div>
        </section>

        {/* Section 7: Delivery Logic */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.deliveryLogicTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{t.deliveryLogicBody1}</p>
              <div>
                <p className="text-[#F3BA2F] font-bold mb-3">{t.deliveryLogicProvides}</p>
                <ul className="space-y-2">
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.deliveryItem1}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.deliveryItem2}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.deliveryItem3}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#F3BA2F] font-bold">•</span>
                    <span className="text-gray-300">{t.deliveryItem4}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">{t.deliveryLogicNote}</p>
              <p className="text-gray-300 text-sm leading-relaxed">{t.deliveryLogicFinal}</p>
            </div>
          </div>
        </section>

        {/* Section 8: Market Progression */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.marketProgressionTitle}</h2>
          <p className="text-gray-300 leading-relaxed mb-8">{t.marketProgressionBody}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.marketLayer1Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.marketLayer1Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.marketLayer2Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.marketLayer2Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-[#F3BA2F]">{t.marketLayer3Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.marketLayer3Desc}</p>
            </div>
          </div>
        </section>

        {/* Section 9: Scope and Boundaries */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8">{t.scopeTitle}</h2>
          <div className="bg-gray-900 border border-gray-800 p-12 rounded-lg">
            <p className="text-gray-300 leading-relaxed mb-6">{t.scopeBody1}</p>
            <div>
              <p className="text-[#F3BA2F] font-bold mb-4">{t.scopeExcludes}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <li className="flex gap-3">
                  <span className="text-[#F3BA2F] font-bold">•</span>
                  <span className="text-gray-300">{t.scopeItem1}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F3BA2F] font-bold">•</span>
                  <span className="text-gray-300">{t.scopeItem2}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F3BA2F] font-bold">•</span>
                  <span className="text-gray-300">{t.scopeItem3}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F3BA2F] font-bold">•</span>
                  <span className="text-gray-300">{t.scopeItem4}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F3BA2F] font-bold">•</span>
                  <span className="text-gray-300">{t.scopeItem5}</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-400 text-sm italic">{t.scopeNote}</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mb-12">
          <div className="bg-gray-900 border border-gray-800 p-12 text-center rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{t.bottomCTATitle}</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">{t.bottomCTABody}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => navigate('/product')} className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors">
                {t.viewProducts}
              </button>
              <button onClick={() => navigate('/')} className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors">
                {t.exploreIndices}
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
