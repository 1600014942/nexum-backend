import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { API_ENDPOINTS, fetchAPI, AccessRequestPayload } from "@/lib/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AccessRequest() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    email: "",
    role: "",
    interest: "Product Access",
    requested_product_slug: "qwen-standard-token-package-next-month",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetchAPI(API_ENDPOINTS.accessRequests, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        name: "",
        company_name: "",
        email: "",
        role: "",
        interest: "Product Access",
        requested_product_slug: "qwen-standard-token-package-next-month",
        message: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit access request");
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
            REQUEST ACCESS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-accent drop-shadow-lg" style={{ textShadow: "0 0 10px rgba(0, 255, 0, 0.5)" }}>Get Access to Nexum</h1>
          <p className="text-lg text-muted-foreground">
            Request access to our pricing infrastructure, indices, and market data.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section container max-w-2xl">
        {submitted ? (
          <Card className="card-glow text-center py-12">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Request Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in Nexum. We'll review your request and get back to you shortly.
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
            {/* Personal Information */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role *</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Founder, CTO, Engineer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Access Details */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Access Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Interest *</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                  >
                    <option>Product Access</option>
                    <option>Index Data</option>
                    <option>Market Data</option>
                    <option>API Integration</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Requested Product</label>
                  <select
                    name="requested_product_slug"
                    value={formData.requested_product_slug}
                    onChange={handleChange}
                  >
                    <option value="qwen-standard-token-package-next-month">
                      Qwen Standard Token Package
                    </option>
                    <option value="qwen-priority-token-package">
                      Qwen Priority Token Package
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your use case and requirements..."
                  rows={5}
                />
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
                "Request Access"
              )}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
