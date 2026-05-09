import { useState } from 'react';
import { useLocation } from 'wouter';
import { quoteTranslations } from '@/lib/quoteTranslations';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';

export default function Quote() {
  const { language } = useLanguage();
  const t = quoteTranslations[language as keyof typeof quoteTranslations] || quoteTranslations.en;
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    productType: 'standard',
    selectedProduct: 'Qwen Standard Token Package — Next Month',
    model: 'Qwen',
    contextWindow: '128k',
    serviceClass: 'standard',
    inputTokenVolume: '100M',
    outputTokenVolume: '20M',
    packageQuantity: '1',
    usagePattern: 'stable',
    useCase: 'product',
    deliveryWindow: 'next-month',
    region: 'global',
    currency: 'usd',
    overagePricing: 'no',
    additionalRequirements: '',
    name: '',
    organization: '',
    email: '',
    role: 'founder',
    howDidYouHear: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t.required;
    if (!formData.organization.trim()) newErrors.organization = t.required;
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Here you would typically send the form data to a server
      console.log('Form submitted:', formData);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-[#F3BA2F] rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">{t.requestReceived}</h1>
            <p className="text-gray-300 text-lg mb-8">{t.successMessage}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/product')}
              className="px-6 py-3 bg-[#F3BA2F] text-black font-medium hover:bg-yellow-500 transition-colors"
            >
              {t.backToProduct}
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-[#F3BA2F] text-[#F3BA2F] font-medium hover:bg-[#F3BA2F] hover:text-black transition-colors"
            >
              {t.exploreIndices}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="quote" />

      {/* Vertical stripe background */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8">
        {/* Top Intro */}
        <div className="mb-12 max-w-3xl">
          <h1 className="text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-gray-300 mb-4">{t.subtitle}</p>
          <p className="text-gray-400">{t.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Form */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Selection */}
              <div className="border border-dashed border-[#F3BA2F] p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#F3BA2F]">{t.productSelection}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.productType}</label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="standard">{t.standardPackage}</option>
                      <option value="priority">{t.priorityPackage}</option>
                      <option value="custom">{t.customPackage}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.selectedProduct}</label>
                    <input
                      type="text"
                      value={formData.selectedProduct}
                      onChange={(e) => setFormData({ ...formData, selectedProduct: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.model}</label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t.contextWindow}</label>
                      <input
                        type="text"
                        value={formData.contextWindow}
                        onChange={(e) => setFormData({ ...formData, contextWindow: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.serviceClass}</label>
                    <select
                      value={formData.serviceClass}
                      onChange={(e) => setFormData({ ...formData, serviceClass: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="standard">{t.standard}</option>
                      <option value="priority">{t.priority}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Usage Requirements */}
              <div className="border border-dashed border-[#F3BA2F] p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#F3BA2F]">{t.usageRequirements}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.inputTokenVolume}</label>
                    <input
                      type="text"
                      value={formData.inputTokenVolume}
                      onChange={(e) => setFormData({ ...formData, inputTokenVolume: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.inputTokenVolumeHelper}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.outputTokenVolume}</label>
                    <input
                      type="text"
                      value={formData.outputTokenVolume}
                      onChange={(e) => setFormData({ ...formData, outputTokenVolume: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.outputTokenVolumeHelper}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.packageQuantity}</label>
                    <input
                      type="number"
                      value={formData.packageQuantity}
                      onChange={(e) => setFormData({ ...formData, packageQuantity: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t.packageQuantityHelper}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.expectedUsagePattern}</label>
                    <select
                      value={formData.usagePattern}
                      onChange={(e) => setFormData({ ...formData, usagePattern: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="stable">{t.stable}</option>
                      <option value="front-loaded">{t.frontLoaded}</option>
                      <option value="back-loaded">{t.backLoaded}</option>
                      <option value="bursty">{t.bursty}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.primaryUseCase}</label>
                    <select
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="product">{t.productUsage}</option>
                      <option value="internal">{t.internalTooling}</option>
                      <option value="evaluation">{t.modelEvaluation}</option>
                      <option value="batch">{t.batchProcessing}</option>
                      <option value="agent">{t.agentWorkflow}</option>
                      <option value="other">{t.otherUseCase}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery & Settlement */}
              <div className="border border-dashed border-[#F3BA2F] p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#F3BA2F]">{t.deliverySettlement}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.deliveryWindow}</label>
                    <select
                      value={formData.deliveryWindow}
                      onChange={(e) => setFormData({ ...formData, deliveryWindow: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="next-month">{t.nextMonth}</option>
                      <option value="next-30">{t.next30Days}</option>
                      <option value="custom">{t.customWindow}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.region}</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="global">{t.global}</option>
                      <option value="cn">{t.cnCompatible}</option>
                      <option value="us">{t.us}</option>
                      <option value="apac">{t.apac}</option>
                      <option value="custom">{t.customRegion}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.settlementCurrency}</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="usd">{t.usd}</option>
                      <option value="rmb">{t.rmb}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.overagePricing}</label>
                    <select
                      value={formData.overagePricing}
                      onChange={(e) => setFormData({ ...formData, overagePricing: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="yes">{t.yes}</option>
                      <option value="no">{t.no}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.additionalRequirements}</label>
                    <textarea
                      value={formData.additionalRequirements}
                      onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                      placeholder={t.additionalRequirementsHelper}
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <div className="border border-dashed border-[#F3BA2F] p-6">
                <h2 className="text-2xl font-bold mb-6 text-[#F3BA2F]">{t.buyerInformation}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t.name}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full bg-gray-900 border px-4 py-2 text-white ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.organization}</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className={`w-full bg-gray-900 border px-4 py-2 text-white ${
                        errors.organization ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full bg-gray-900 border px-4 py-2 text-white ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{t.role}</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    >
                      <option value="founder">{t.founder}</option>
                      <option value="product">{t.product}</option>
                      <option value="engineering">{t.engineering}</option>
                      <option value="procurement">{t.procurement}</option>
                      <option value="research">{t.research}</option>
                      <option value="other">{t.otherUseCase}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.howDidYouHear} <span className="text-gray-500 text-xs">{t.howDidYouHearHelper}</span>
                    </label>
                    <input
                      type="text"
                      value={formData.howDidYouHear}
                      onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border border-dashed border-[#F3BA2F] p-6">
                <p className="text-sm text-gray-400 mb-6">{t.submitDisclaimer}</p>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#F3BA2F] text-black font-bold py-3 hover:bg-yellow-500 transition-colors"
                  >
                    {t.requestQuote}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    className="flex-1 border border-[#F3BA2F] text-[#F3BA2F] font-bold py-3 hover:bg-[#F3BA2F] hover:text-black transition-colors"
                  >
                    {t.talkToUs}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Quote Summary - Sticky */}
          <div className="col-span-1">
            <div className="sticky top-32 border border-dashed border-[#F3BA2F] p-6 bg-gray-950">
              <h3 className="text-xl font-bold mb-6 text-[#F3BA2F]">{t.quoteSummary}</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">{t.productLabel}</p>
                  <p className="font-medium">{formData.selectedProduct}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.model}</p>
                  <p className="font-medium">{formData.model}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.window}</p>
                  <p className="font-medium">{formData.contextWindow}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.class}</p>
                  <p className="font-medium capitalize">{formData.serviceClass}</p>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-500">{t.includedUsage}</p>
                  <p className="font-medium">{formData.inputTokenVolume} input</p>
                  <p className="font-medium">{formData.outputTokenVolume} output</p>
                </div>
                <div>
                  <p className="text-gray-500">{t.deliveryWindow}</p>
                  <p className="font-medium capitalize">
                    {formData.deliveryWindow === 'next-month' ? t.nextMonth : formData.deliveryWindow}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">{t.settlementCurrency}</p>
                  <p className="font-medium uppercase">{formData.currency}</p>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-[#F3BA2F] font-bold text-lg">{t.indicativePrice}</p>
                  <p className="text-2xl font-bold text-[#F3BA2F]">$X,XXX</p>
                </div>
                <p className="text-xs text-gray-500 border-t border-gray-700 pt-4">{t.priceNote}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
