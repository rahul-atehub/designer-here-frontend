// src/app/privacy-policy/page.jsx

"use client";
import { useEffect, useState, useRef } from "react";
import {
  Shield,
  Eye,
  Users,
  Lock,
  Mail,
  Download,
  ArrowUp,
  FileText,
  ArrowLeft,
} from "lucide-react";

const sections = [
  { id: "information-we-collect", label: "Information We Collect", icon: Eye },
  { id: "how-we-use", label: "How We Use Your Information", icon: Users },
  { id: "sharing-security", label: "Sharing & Security", icon: Lock },
  { id: "your-rights", label: "Your Privacy Rights", icon: Download },
  { id: "additional", label: "Additional Information", icon: FileText },
  { id: "contact", label: "Contact Us", icon: Mail },
];

export default function PrivacyPolicyContent() {
  const [activeSection, setActiveSection] = useState("information-we-collect");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
        <section id="information-we-collect" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              1. Information We Collect
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Personal Information You Provide
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Name, email address, and phone number",
                  "Account credentials and profile information",
                  "Payment and billing information",
                  "Communications and feedback you send to us",
                  "Any other information you choose to provide",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Information Collected Automatically
              </h3>
              <ul className="space-y-2.5">
                {[
                  "IP address and location data",
                  "Browser type, version, and operating system",
                  "Device information and unique identifiers",
                  "Usage patterns and interaction data",
                  "Cookies and similar tracking technologies",
                  "Referral sources and search terms",
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
          </div>
        </section>

        {/* Section 2 */}
        <section id="how-we-use" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              2. How We Use Your Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Service Provision",
                items: [
                  "Provide and maintain our services",
                  "Process transactions and payments",
                  "Authenticate users and prevent fraud",
                  "Provide customer support",
                ],
              },
              {
                title: "Communication & Marketing",
                items: [
                  "Send service-related notifications",
                  "Respond to inquiries and requests",
                  "Send promotional materials (with consent)",
                  "Conduct surveys and gather feedback",
                ],
              },
              {
                title: "Analytics & Improvement",
                items: [
                  "Analyze usage patterns and trends",
                  "Improve our services and user experience",
                  "Develop new features and offerings",
                  "Conduct research and analytics",
                ],
              },
              {
                title: "Legal & Security",
                items: [
                  "Comply with legal obligations",
                  "Protect against fraud and abuse",
                  "Enforce our terms of service",
                  "Resolve disputes and investigate issues",
                ],
              },
            ].map((card, i) => (
              <div
                key={i}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5"
              >
                <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                  {card.title}
                </h3>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="sharing-security" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              3. Information Sharing & Security
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                When We Share Information
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    label: "Service Providers",
                    desc: "Trusted third parties who help us operate our services (payment processors, hosting providers, analytics services)",
                  },
                  {
                    label: "Legal Requirements",
                    desc: "When required by law, court order, or government request",
                  },
                  {
                    label: "Business Transfers",
                    desc: "In connection with mergers, acquisitions, or sale of assets",
                  },
                  {
                    label: "Consent",
                    desc: "With your explicit consent for specific purposes",
                  },
                  {
                    label: "Safety",
                    desc: "To protect the rights, property, or safety of Designer Here, our users, or others",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium text-black dark:text-white">
                        {item.label}:
                      </span>{" "}
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                What We Never Do
              </h3>
              <ul className="space-y-2.5">
                {[
                  "We never sell your personal data to third parties",
                  "We don't share your data for advertising purposes without consent",
                  "We don't rent or lease your information to marketers",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Security Measures
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Industry-standard encryption for data transmission and storage",
                  "Regular security audits and vulnerability assessments",
                  "Access controls and employee training on data protection",
                  "Secure data centers with physical and digital safeguards",
                  "Incident response procedures for potential breaches",
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
          </div>
        </section>

        {/* Section 4 */}
        <section id="your-rights" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              4. Your Privacy Rights
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Access",
                desc: "Request a copy of the personal information we have about you",
              },
              {
                title: "Correction",
                desc: "Update or correct inaccurate personal information",
              },
              {
                title: "Deletion",
                desc: "Request deletion of your personal information (subject to legal requirements)",
              },
              {
                title: "Portability",
                desc: "Receive your data in a structured, machine-readable format",
              },
              {
                title: "Opt-out",
                desc: "Unsubscribe from marketing communications and non-essential emails",
              },
              {
                title: "Restriction",
                desc: "Limit how we process your personal information",
              },
            ].map((right, i) => (
              <div
                key={i}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5"
              >
                <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                  {right.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {right.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section id="additional" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              5. Additional Information
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            {[
              {
                title: "Data Retention",
                body: "We retain your personal information only as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Specific retention periods vary based on the type of information and applicable legal requirements.",
              },
              {
                title: "International Transfers",
                body: "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including adequacy decisions and standard contractual clauses.",
              },
              {
                title: "Children's Privacy",
                body: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information promptly.",
              },
              {
                title: "Changes to This Policy",
                body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.',
              },
            ].map((item, i) => (
              <div key={i} className="p-6">
                <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 - Contact */}
        <section id="contact" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              6. Contact Us
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              If you have any questions about this Privacy Policy, want to
              exercise your privacy rights, or need to report a privacy concern,
              please contact us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Email", value: "designerheredev@gmail.com" },
                {
                  label: "Response Time",
                  value: "Within 30 days of your request",
                },
                {
                  label: "Data Protection Officer",
                  value: "designerheredev@gmail.com",
                },
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
              { label: "Terms of Service", href: "/terms-services" },
              { label: "Cookie Policy", href: "/cookie-policy" },
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
          By using our services, you acknowledge that you have read, understood,
          and agree to be bound by this Privacy Policy. This policy is governed
          by applicable privacy laws including GDPR, CCPA, and other relevant
          regulations.
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
