import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-accent mb-4" style={{ textShadow: "0 0 10px rgba(0, 255, 0, 0.5)" }}>
              NEXUM
            </h3>
            <p className="text-sm text-muted-foreground">
              Open model pricing infrastructure for the AI compute economy.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/indices">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Indices
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/rfq">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Token Packages
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Markets
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-accent transition-colors">
                    Contact
                  </a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Nexum. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Discord
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
