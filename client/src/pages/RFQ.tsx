import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_ENDPOINTS, fetchAPI, RFQPayload } from "@/lib/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function RFQ() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    request_type: "token_package",
    product_slug: "qwen-standard-token-package-next-month",
    company_name: "",
    contact_name: "",
    contact_email: "",
    contact_channel: "",
    model_name: "Qwen3.5-32B",
    package_quantity: 1,
    input_tokens_per_month: 100000000,
    output_tokens_per_month: 20000000,
    region: "Global",
    budget_usd: 1000,
    use_case: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("_") && !isNaN(Number(value)) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchAPI(API_ENDPOINTS.rfq, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        request_type: "token_package",
        product_slug: "qwen-standard-token-package-next-month",
        company_name: "",
        contact_name: "",
        contact_email: "",
        contact_channel: "",
        model_name: "Qwen3.5-32B",
        package_quantity: 1,
        input_tokens_per_month: 100000000,
        output_tokens_per_month: 20000000,
        region: "Global",
        budget_usd: 1000,
        use_case: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit RFQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero container">
        <div className="max-w-2xl">
          <div className="text-accent text-sm font-semibold uppercase tracking-wider mb-4">
            REQUEST FOR QUOTE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-accent drop-shadow-lg" style={{ textShadow: "0 0 10px rgba(0, 255, 0, 0.5)" }}>Request a Token Package Quote</h1>
          <p className="text-lg text-muted-foreground">
            Tell us about your token requirements and we'll provide a customized quote.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section container max-w-2xl">
        {submitted ? (
          <Card className="card-glow text-center py-12">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quote Request Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest. We'll review your request and get back to you shortly.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="button-primary"
            >
              Submit Another Request
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Your company name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name *</label>
                    <input
                      type="text"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Channel</label>
                  <input
                    type="text"
                    name="contact_channel"
                    value={formData.contact_channel}
                    onChange={handleChange}
                    placeholder="Telegram: @username or Discord: username"
                  />
                </div>
              </div>
            </div>

            {/* Token Requirements */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Token Requirements</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <select
                    name="model_name"
                    value={formData.model_name}
                    onChange={handleChange}
                  >
                    <option>Qwen3.5-32B</option>
                    <option>Qwen3.5-14B</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Input Tokens per Month
                    </label>
                    <input
                      type="number"
                      name="input_tokens_per_month"
                      value={formData.input_tokens_per_month}
                      onChange={handleChange}
                      placeholder="100000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Output Tokens per Month
                    </label>
                    <input
                      type="number"
                      name="output_tokens_per_month"
                      value={formData.output_tokens_per_month}
                      onChange={handleChange}
                      placeholder="20000000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Region</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option>Global</option>
                      <option>US</option>
                      <option>EU</option>
                      <option>Asia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (USD)</label>
                    <input
                      type="number"
                      name="budget_usd"
                      value={formData.budget_usd}
                      onChange={handleChange}
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Use Case Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Use Case *</label>
                  <input
                    type="text"
                    name="use_case"
                    value={formData.use_case}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Production inference workload"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Error submitting request</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="button-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Quote Request"
              )}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
