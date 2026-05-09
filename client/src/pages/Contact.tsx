import { useState } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactTranslations } from '@/lib/contactTranslations';
import Navigation from '@/components/Navigation';

export default function Contact() {
  const { language } = useLanguage();
  const t = contactTranslations[language as keyof typeof contactTranslations];
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    topic: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.emailInvalid;
    }

    if (!formData.message) {
      newErrors.message = t.messageRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
        <Navigation activePage="contact" />

        {/* Success State */}
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-32 text-center">
          <div className="mb-12">
            <div className="inline-block mb-8">
              <div className="w-16 h-16 rounded-full bg-[#0ECB81] bg-opacity-10 border border-[#0ECB81] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0ECB81]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.successTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              {t.successBody}
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate('/')} className="bg-[#F3BA2F] text-black px-8 py-3 font-bold hover:bg-yellow-400 transition-colors">
              {t.backHome}
            </button>
            <button onClick={() => navigate('/product')} className="border border-[#F3BA2F] text-[#F3BA2F] px-8 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors">
              {t.viewProducts}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <Navigation activePage="contact" />

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
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-gray-300 leading-relaxed">{t.introBody1}</p>
              <p className="text-gray-300 leading-relaxed">{t.introBody2}</p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t.formTitle}</h2>
              <p className="text-gray-400">{t.formDescription}</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-12 rounded-lg space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold mb-3 text-white">{t.emailLabel}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  placeholder={t.emailPlaceholder}
                  className={`w-full bg-black border rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F3BA2F] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Topic Field */}
              <div>
                <label className="block text-sm font-bold mb-3 text-white">{t.topicLabel}</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full bg-black border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:border-[#F3BA2F] transition-colors cursor-pointer"
                >
                  <option value="">{t.topicPlaceholder}</option>
                  <option value="product-access">{t.topicProductAccess}</option>
                  <option value="pricing">{t.topicPricing}</option>
                  <option value="token-packages">{t.topicTokenPackages}</option>
                  <option value="indices">{t.topicIndices}</option>
                  <option value="markets">{t.topicMarkets}</option>
                  <option value="partnerships">{t.topicPartnerships}</option>
                  <option value="integration">{t.topicIntegration}</option>
                  <option value="general">{t.topicGeneralInquiry}</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-bold mb-3 text-white">{t.messageLabel}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) {
                      setErrors({ ...errors, message: '' });
                    }
                  }}
                  placeholder={t.messagePlaceholder}
                  rows={6}
                  className={`w-full bg-black border rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#F3BA2F] transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                )}
              </div>

              {/* Form Footer */}
              <p className="text-gray-500 text-xs leading-relaxed pt-4 border-t border-gray-800">
                {t.formFooter}
              </p>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#F3BA2F] text-black px-6 py-3 font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.submitting : t.sendMessage}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/quote')}
                  className="flex-1 border border-[#F3BA2F] text-[#F3BA2F] px-6 py-3 font-bold hover:bg-[#F3BA2F] hover:text-black transition-colors"
                >
                  {t.requestQuote}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* What Happens Next Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t.whatNextTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] mb-6 mx-auto">
                <span className="text-[#F3BA2F] font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-center text-white">{t.step1Title}</h3>
              <p className="text-gray-400 text-sm text-center">{t.step1Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] mb-6 mx-auto">
                <span className="text-[#F3BA2F] font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-center text-white">{t.step2Title}</h3>
              <p className="text-gray-400 text-sm text-center">{t.step2Desc}</p>
            </div>
            <div className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#F3BA2F] bg-opacity-10 border border-[#F3BA2F] mb-6 mx-auto">
                <span className="text-[#F3BA2F] font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-center text-white">{t.step3Title}</h3>
              <p className="text-gray-400 text-sm text-center">{t.step3Desc}</p>
            </div>
          </div>
        </section>

        {/* Alternative Paths Section */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{t.altPathsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button
              onClick={() => navigate('/quote')}
              className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors text-left group"
            >
              <h3 className="text-lg font-bold mb-3 text-[#F3BA2F] group-hover:text-yellow-400 transition-colors">{t.altPath1Title}</h3>
              <p className="text-gray-400 text-sm">{t.altPath1Desc}</p>
            </button>
            <button
              onClick={() => navigate('/product')}
              className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors text-left group"
            >
              <h3 className="text-lg font-bold mb-3 text-[#F3BA2F] group-hover:text-yellow-400 transition-colors">{t.altPath2Title}</h3>
              <p className="text-gray-400 text-sm">{t.altPath2Desc}</p>
            </button>
            <button
              onClick={() => navigate('/methodology')}
              className="border border-gray-800 p-8 hover:border-[#F3BA2F] hover:border-opacity-50 transition-colors text-left group"
            >
              <h3 className="text-lg font-bold mb-3 text-[#F3BA2F] group-hover:text-yellow-400 transition-colors">{t.altPath3Title}</h3>
              <p className="text-gray-400 text-sm">{t.altPath3Desc}</p>
            </button>
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
