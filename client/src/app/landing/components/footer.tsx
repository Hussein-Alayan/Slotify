import Image from "next/image";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

export function Footer() {
  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/business-hub" },
    { name: "Contact", href: "mailto:support@slotify.com" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  return (
    <footer className="bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand & Statement */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/logos/Dark-noText.svg"
                alt="Slotify Logo"
                width={32}
                height={32}
                className="w-8 h-8"
                priority
              />
              <span className="text-lg font-semibold text-primary-foreground">
                Slotify
              </span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Slotify helps modern businesses automate and personalize
              appointment booking using AI and social platforms. Our mission is
              to make scheduling effortless for you and your clients.
            </p>
          </div>

          {/* Real Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="WhatsApp"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <FaWhatsapp className="text-primary-foreground w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <FaInstagram className="text-primary-foreground w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <FaFacebook className="text-primary-foreground w-6 h-6" />
              </a>
            </div>
            <div className="mt-4 text-sm text-primary-foreground/80">
              Contact:{" "}
              <a href="mailto:support@slotify.com" className="underline">
                support@slotify.com
              </a>
            </div>
            <div className="text-xs text-primary-foreground/60 mt-2">
              <a href="/privacy" className="underline mr-2">
                Privacy Policy
              </a>
              <a href="/terms" className="underline">
                Terms
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-base font-semibold text-primary-foreground">
            © 2025 Slotify. All rights reserved.
          </p>
          <p className="text-xs text-primary-foreground/60 mt-2">
            Platform fully developed by{" "}
            <a
              href="https://github.com/Hussein-Alayan"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Hussein Alayan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
