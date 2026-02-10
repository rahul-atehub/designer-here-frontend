// src/app/terms-services/page.jsx

"use client";
import { useEffect, useState, useRef } from "react";
import {
  Scale,
  User,
  Copyright,
  Shield,
  AlertTriangle,
  Mail,
  FileText,
  Ban,
  Gavel,
  ArrowUp,
  ScrollText,
  ArrowLeft,
} from "lucide-react";

const sections = [
  { id: "acceptance", label: "Acceptance & Definitions", icon: FileText },
  { id: "use-of-services", label: "Use of Services", icon: User },
  { id: "account-management", label: "Account Management", icon: Shield },
  {
    id: "intellectual-property",
    label: "Intellectual Property",
    icon: Copyright,
  },
  { id: "privacy-data", label: "Privacy & Data", icon: Shield },
  { id: "disclaimers", label: "Disclaimers", icon: AlertTriangle },
  { id: "liability", label: "Limitation of Liability", icon: Ban },
  { id: "termination", label: "Termination", icon: Ban },
  { id: "legal", label: "Legal & Disputes", icon: Gavel },
  { id: "modifications", label: "Modifications", icon: ScrollText },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function TermsOfServiceContent() {
  const [activeSection, setActiveSection] = useState("acceptance");
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
        {/* Important Notice Banner */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex items-start gap-4">
          <AlertTriangle className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            By accessing or using our services, you agree to be bound by these
            Terms of Service and all applicable laws. If you do not agree with
            any part of these terms, you may not use our services.
          </p>
        </div>

        {/* Section 1 */}
        <section id="acceptance" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              1. Acceptance of Terms and Definitions
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Acceptance
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                These Terms of Service ("Terms", "Agreement") constitute a
                legally binding agreement between you ("User", "you", "your")
                and Designer Here ("Company", "we", "us", "our"). By accessing,
                browsing, or using our services, you acknowledge that you have
                read, understood, and agree to be bound by these Terms.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Key Definitions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    term: "Services",
                    def: "All products, services, features, and functionality offered by Designer Here",
                  },
                  {
                    term: "Content",
                    def: "All text, graphics, images, software, and other materials on our platform",
                  },
                  {
                    term: "Account",
                    def: "Your registered user account with Designer Here",
                  },
                  {
                    term: "Platform",
                    def: "Our website, mobile applications, and related services",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
                  >
                    <p className="text-xs font-medium text-black dark:text-white mb-1">
                      {item.term}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.def}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="use-of-services" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              2. Use of Services
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Eligibility Requirements
              </h3>
              <ul className="space-y-2.5">
                {[
                  "You must be at least 18 years old or the age of majority in your jurisdiction",
                  "You must have the legal capacity to enter into binding contracts",
                  "You must not be prohibited from using our services under applicable laws",
                  "You must provide accurate and complete registration information",
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
                Permitted Uses
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Access and use our services for personal or business purposes",
                  "Create an account and maintain accurate profile information",
                  "Communicate with other users in accordance with community guidelines",
                  "Use our services in compliance with all applicable laws and regulations",
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
                Prohibited Activities
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Violate any local, state, national, or international law or regulation",
                  "Transmit or distribute malicious software, viruses, or harmful code",
                  "Engage in fraudulent activities or impersonate others",
                  "Harass, abuse, or harm other users",
                  "Attempt to gain unauthorized access to our systems",
                  "Interfere with or disrupt our services or servers",
                  "Use automated systems to access our services without permission",
                  "Collect or harvest user information without consent",
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

        {/* Section 3 */}
        <section id="account-management" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              3. Account Management and Security
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Account Creation and Maintenance
              </h3>
              <ul className="space-y-2.5">
                {[
                  "You are responsible for maintaining accurate and up-to-date account information",
                  "You must choose a secure password and keep it confidential",
                  "You may not share your account credentials with others",
                  "You must notify us immediately of any unauthorized use of your account",
                  "You are liable for all activities that occur under your account",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Account Suspension and Termination
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                We reserve the right to suspend or terminate your account if:
              </p>
              <ul className="space-y-2.5">
                {[
                  "You violate these Terms of Service",
                  "You engage in fraudulent or illegal activities",
                  "Your account poses security risks to our platform",
                  "We are required to do so by law or regulatory requirements",
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
        <section id="intellectual-property" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Copyright className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              4. Content and Intellectual Property Rights
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Our Intellectual Property
              </h3>
              <ul className="space-y-2.5">
                {[
                  "All content, trademarks, logos, and intellectual property are owned by Designer Here",
                  "Our services are protected by copyright, trademark, and other intellectual property laws",
                  "You may not copy, modify, distribute, or create derivative works without written permission",
                  "Any unauthorized use of our intellectual property is strictly prohibited",
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
                User-Generated Content
              </h3>
              <ul className="space-y-2.5">
                {[
                  "You retain ownership of content you create and submit to our platform",
                  "By submitting content, you grant us a license to use, display, and distribute it",
                  "You represent that your content does not infringe third-party rights",
                  "We may remove content that violates these terms or applicable laws",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                DMCA and Copyright Protection
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We respect intellectual property rights and comply with the
                Digital Millennium Copyright Act (DMCA). If you believe your
                copyrighted work has been infringed, please contact our
                designated copyright agent with detailed information about the
                alleged infringement.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="privacy-data" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              5. Privacy and Data Protection
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Privacy Policy Integration
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy, which is
                incorporated into these Terms by reference, explains how we
                collect, use, and protect your personal information. By using
                our services, you also agree to our Privacy Policy.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Data Collection and Use
              </h3>
              <ul className="space-y-2.5">
                {[
                  "We collect only necessary information to provide and improve our services",
                  "We use industry-standard security measures to protect your data",
                  "We do not sell your personal information to third parties",
                  "You have rights regarding your personal data as described in our Privacy Policy",
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

        {/* Section 6 */}
        <section id="disclaimers" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              6. Disclaimers and Warranties
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                "As Is" Service
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our services are provided "as is" and "as available" without
                warranties of any kind, either express or implied, including but
                not limited to implied warranties of merchantability, fitness
                for a particular purpose, or non-infringement.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Service Availability
              </h3>
              <ul className="space-y-2.5">
                {[
                  "We do not guarantee uninterrupted or error-free service",
                  "Services may be temporarily unavailable due to maintenance or technical issues",
                  "We reserve the right to modify or discontinue services at any time",
                  "We are not responsible for third-party service interruptions",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Content Accuracy
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                While we strive to provide accurate and up-to-date information,
                we make no representations or warranties about the accuracy,
                completeness, or reliability of any content on our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="liability" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Ban className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              7. Limitation of Liability
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Liability Limitations
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                To the fullest extent permitted by law, Designer Here shall not
                be liable for:
              </p>
              <ul className="space-y-2.5">
                {[
                  "Indirect, incidental, special, consequential, or punitive damages",
                  "Loss of profits, revenue, data, or business opportunities",
                  "Damages resulting from your use or inability to use our services",
                  "Third-party actions or content on our platform",
                  "Unauthorized access to or alteration of your data",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Damage Cap
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                In no event shall our total liability to you exceed the amount
                you have paid us in the twelve (12) months preceding the event
                giving rise to the claim, or $100, whichever is greater.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Indemnification
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                You agree to indemnify and hold harmless Designer Here, its
                officers, directors, employees, and agents from any claims,
                damages, losses, or expenses arising from your use of our
                services, violation of these terms, or infringement of any
                third-party rights.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="termination" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Ban className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              8. Termination
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Termination by You
              </h3>
              <ul className="space-y-2.5">
                {[
                  "You may terminate your account at any time by contacting us",
                  "You remain liable for all activities under your account prior to termination",
                  "Some provisions of these terms will survive termination",
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
                Termination by Us
              </h3>
              <ul className="space-y-2.5">
                {[
                  "We may terminate or suspend your access immediately for cause",
                  "We may terminate with notice for convenience",
                  "Upon termination, your right to use our services ceases immediately",
                  "We may delete your account and data in accordance with our data retention policies",
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
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Effect of Termination
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Upon termination, all rights and licenses granted to you will
                immediately cease. Provisions regarding intellectual property,
                disclaimers, limitation of liability, and dispute resolution
                shall survive termination.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section id="legal" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Gavel className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              9. Legal Provisions and Dispute Resolution
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Governing Law and Jurisdiction
              </h3>
              <ul className="space-y-2.5">
                {[
                  "These Terms are governed by applicable laws, without regard to conflict of law principles",
                  "Any disputes shall be resolved in the appropriate courts of jurisdiction",
                  "You consent to the personal jurisdiction of such courts",
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
                Dispute Resolution Process
              </h3>
              <div className="space-y-3">
                {[
                  {
                    step: "01",
                    label: "Informal Resolution",
                    desc: "Contact us first to resolve disputes informally",
                  },
                  {
                    step: "02",
                    label: "Mediation",
                    desc: "If informal resolution fails, disputes may be subject to mediation",
                  },
                  {
                    step: "03",
                    label: "Arbitration",
                    desc: "Binding arbitration may be required for certain disputes",
                  },
                  {
                    step: "04",
                    label: "Class Action Waiver",
                    desc: "You waive the right to participate in class action lawsuits",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 pt-0.5 shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 10 */}
        <section id="modifications" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <ScrollText className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              10. Modifications to Terms
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                Right to Modify
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We reserve the right to modify these Terms at any time. When we
                make changes, we will post the updated Terms on our website and
                update the "Last Updated" date at the top of this document.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xs uppercase tracking-wide font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Notice of Changes
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Material changes will be communicated via email or website notice",
                  "You will have 30 days to review changes before they take effect",
                  "Continued use after changes constitutes acceptance",
                  "If you disagree with changes, you may terminate your account",
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

        {/* Section 11 - Contact */}
        <section id="contact" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-black dark:text-white" />
            </div>
            <h2 className="text-lg font-light text-black dark:text-white">
              Contact Information
            </h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
              If you have any questions about these Terms of Service, need
              clarification on any provision, or want to report a violation,
              please contact us:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "General Inquiries",
                  value: "designerheredev@gmail.com",
                },
                { label: "Response Time", value: "Within 3–5 business days" },
                {
                  label: "Legal Department",
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
              { label: "Privacy Policy", href: "/privacy-policy" },
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
          and agree to be bound by these Terms of Service. These Terms are
          effective as of the date listed above.
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
