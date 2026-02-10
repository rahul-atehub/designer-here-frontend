// src/app/cookie-policy/page.jsx

"use client";
import { useEffect, useState, useRef } from "react";
import {
  Cookie,
  Settings,
  BarChart2,
  Globe,
  Shield,
  RefreshCw,
  Mail,
  ArrowUp,
  ArrowLeft,
} from "lucide-react";

const sections = [
  { id: "what-are-cookies", label: "What Are Cookies", icon: Cookie },
  { id: "how-we-use", label: "How We Use Cookies", icon: Settings },
  { id: "types", label: "Types of Cookies", icon: BarChart2 },
  { id: "third-party", label: "Third-Party Cookies", icon: Globe },
  { id: "managing", label: "Managing Cookies", icon: Shield },
  { id: "changes", label: "Changes to Policy", icon: RefreshCw },
  { id: "contact", label: "Contact Us", icon: Mail },
];

export default function CookiePolicyContent() {
  const [activeSection, setActiveSection] = useState("what-are-cookies");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="flex gap-12 relative">
      {/* Sticky TOC Sidebar */}
      <aside className="hidden xl:block w-56 shrink-0">
        <div className="sticky top-8 space-y-1">
          <div className="flex items-center gap-2 mb-4 px-3">
            <button
              onClick={() => window.history.back()}
              className="text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-medium">
              Contents
            </p>
          </div>
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                activeSection === id
                  ? "text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 font-medium"
                  : "text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="leading-snug">{label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 mt-10 min-w-0 space-y-16">
        {/* Section 1 */}
        <section id="what-are-cookies" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              What Are Cookies
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Cookies are small text files that are placed on your device when
              you visit our website. They help us provide you with a better
              experience by remembering your preferences and understanding how
              you use our site.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-we-use" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              How We Use Cookies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Essential Cookies",
                desc: "Required for the website to function properly. These cannot be disabled.",
              },
              {
                title: "Preference Cookies",
                desc: "Remember your settings and preferences across sessions.",
              },
              {
                title: "Analytics Cookies",
                desc: "Help us understand how visitors interact with our website.",
              },
              {
                title: "Marketing Cookies",
                desc: "Used to deliver relevant advertisements and track campaign effectiveness.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5"
              >
                <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="types" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <BarChart2 className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Types of Cookies We Use
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Session Cookies
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Temporary cookies that expire when you close your browser. These
                help us track your journey through our website during a single
                visit and maintain your session state.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Persistent Cookies
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cookies that remain on your device for a set period or until you
                delete them. These help us remember you when you return to our
                website and maintain your preferences across sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="third-party" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Third-Party Cookies
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
              We may use third-party services that set cookies on your device.
              These include:
            </p>
            <ul className="space-y-2.5">
              {[
                "Google Analytics for website analytics and performance monitoring",
                "Social media platforms for content sharing and engagement",
                "Payment processors for secure transaction handling",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="managing" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Managing Cookies
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Your Options
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Most browsers allow you to refuse or accept cookies through their settings",
                  "You can delete cookies that have already been set on your device",
                  "You can set your browser to notify you when you receive a cookie",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Please note that disabling cookies may affect the
                  functionality of our website and your user experience. Some
                  features may not work as intended without cookies enabled.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="changes" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Changes to This Policy
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes
              will be posted on this page with an updated revision date. We
              encourage you to review this policy periodically to stay informed
              about how we use cookies.
            </p>
          </div>
        </section>

        {/* Section 7 - Contact */}
        <section id="contact" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Contact Us
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              If you have any questions about our use of cookies, please contact
              us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Email", value: "designerheredev@gmail.com" },
                { label: "Phone", value: "(+65) 89735984" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
                >
                  <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-black dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <p className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
            Related Documents
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms of Service", href: "/terms-of-service" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-xs px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center pb-4">
          By continuing to use our website, you consent to our use of cookies as
          described in this policy. Last updated: January 29, 2024.
        </p>
      </div>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-lg flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all shadow-sm z-50 animate-in fade-in duration-300"
        >
          <ArrowUp className="w-4 h-4 text-black dark:text-white" />
        </button>
      )}
    </div>
  );
}
