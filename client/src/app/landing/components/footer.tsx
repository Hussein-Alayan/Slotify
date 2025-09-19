import { Calendar } from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "API"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact", "Status"],
    },
    {
      title: "Company",
      links: ["About", "Privacy", "Terms"],
    },
  ];

  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-primary-foreground">
                Slotify
              </span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Smart appointment booking via Socials AI for modern businesses.
            </p>
          </div>

          {/* Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-primary-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/80">
            © 2025 Slotify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
