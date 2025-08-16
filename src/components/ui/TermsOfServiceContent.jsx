"use client";
import {
  Scale,
  User,
  Copyright,
  Shield,
  AlertTriangle,
  Calendar,
  Globe,
  Mail,
  FileText,
  Ban,
  Gavel,
} from "lucide-react";

export default function TermsOfServiceContent() {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 1, 2025";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <Scale className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Welcome to <strong className="text-blue-600">Buuuk</strong>. These
          Terms of Service govern your use of our website, services, and
          products. Please read them carefully.
        </p>
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Last Updated: {lastUpdated}</span>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            <span>Effective: {effectiveDate}</span>
          </div>
        </div>
      </div>

      {/* Agreement Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Important Notice
            </h2>
            <p className="text-amber-800 text-sm">
              By accessing or using our services, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any part of these terms, you may not use our
              services.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1 - Acceptance and Definitions */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              1. Acceptance of Terms and Definitions
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Acceptance</h3>
              <p className="text-gray-700 mb-3">
                These Terms of Service ("Terms", "Agreement") constitute a
                legally binding agreement between you ("User", "you", "your")
                and Buuuk ("Company", "we", "us", "our"). By accessing,
                browsing, or using our services, you acknowledge that you have
                read, understood, and agree to be bound by these Terms.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Key Definitions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-medium text-gray-800 text-sm">
                    Services
                  </h4>
                  <p className="text-xs text-gray-600">
                    All products, services, features, and functionality offered
                    by Buuuk
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-medium text-gray-800 text-sm">Content</h4>
                  <p className="text-xs text-gray-600">
                    All text, graphics, images, music, software, and other
                    materials on our platform
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-medium text-gray-800 text-sm">Account</h4>
                  <p className="text-xs text-gray-600">
                    Your registered user account with Buuuk
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-3">
                  <h4 className="font-medium text-gray-800 text-sm">
                    Platform
                  </h4>
                  <p className="text-xs text-gray-600">
                    Our website, mobile applications, and related services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Use of Services */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              2. Use of Services
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Eligibility Requirements
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  You must be at least 18 years old or the age of majority in
                  your jurisdiction
                </li>
                <li>
                  You must have the legal capacity to enter into binding
                  contracts
                </li>
                <li>
                  You must not be prohibited from using our services under
                  applicable laws
                </li>
                <li>
                  You must provide accurate and complete registration
                  information
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Permitted Uses</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  Access and use our services for personal or business purposes
                </li>
                <li>
                  Create an account and maintain accurate profile information
                </li>
                <li>
                  Communicate with other users in accordance with community
                  guidelines
                </li>
                <li>
                  Use our services in compliance with all applicable laws and
                  regulations
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Prohibited Activities
              </h3>
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-800 font-medium text-sm mb-2">
                  You may not:
                </p>
                <ul className="list-disc list-inside space-y-1 text-red-700 text-sm ml-4">
                  <li>
                    Violate any local, state, national, or international law or
                    regulation
                  </li>
                  <li>
                    Transmit or distribute malicious software, viruses, or
                    harmful code
                  </li>
                  <li>Engage in fraudulent activities or impersonate others</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services or servers</li>
                  <li>
                    Use automated systems to access our services without
                    permission
                  </li>
                  <li>Collect or harvest user information without consent</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Account Management */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              3. Account Management and Security
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Account Creation and Maintenance
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  You are responsible for maintaining accurate and up-to-date
                  account information
                </li>
                <li>
                  You must choose a secure password and keep it confidential
                </li>
                <li>You may not share your account credentials with others</li>
                <li>
                  You must notify us immediately of any unauthorized use of your
                  account
                </li>
                <li>
                  You are liable for all activities that occur under your
                  account
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Account Suspension and Termination
              </h3>
              <p className="text-gray-700 mb-2">
                We reserve the right to suspend or terminate your account if:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>You violate these Terms of Service</li>
                <li>You engage in fraudulent or illegal activities</li>
                <li>Your account poses security risks to our platform</li>
                <li>You fail to pay applicable fees (if any)</li>
                <li>
                  We are required to do so by law or regulatory requirements
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 - Content and Intellectual Property */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Copyright className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              4. Content and Intellectual Property Rights
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Our Intellectual Property
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  All content, trademarks, logos, and intellectual property are
                  owned by Buuuk
                </li>
                <li>
                  Our services are protected by copyright, trademark, and other
                  intellectual property laws
                </li>
                <li>
                  You may not copy, modify, distribute, or create derivative
                  works without written permission
                </li>
                <li>
                  Any unauthorized use of our intellectual property is strictly
                  prohibited
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                User-Generated Content
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  You retain ownership of content you create and submit to our
                  platform
                </li>
                <li>
                  By submitting content, you grant us a license to use, display,
                  and distribute it
                </li>
                <li>
                  You represent that your content does not infringe third-party
                  rights
                </li>
                <li>
                  We may remove content that violates these terms or applicable
                  laws
                </li>
                <li>
                  You are solely responsible for your content and its
                  consequences
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                DMCA and Copyright Protection
              </h3>
              <p className="text-gray-700">
                We respect intellectual property rights and comply with the
                Digital Millennium Copyright Act (DMCA). If you believe your
                copyrighted work has been infringed, please contact our
                designated copyright agent with detailed information about the
                alleged infringement.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 - Privacy and Data Protection */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-teal-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              5. Privacy and Data Protection
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Privacy Policy Integration
              </h3>
              <p className="text-gray-700">
                Your privacy is important to us. Our Privacy Policy, which is
                incorporated into these Terms by reference, explains how we
                collect, use, and protect your personal information. By using
                our services, you also agree to our Privacy Policy.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Data Collection and Use
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  We collect only necessary information to provide and improve
                  our services
                </li>
                <li>
                  We use industry-standard security measures to protect your
                  data
                </li>
                <li>
                  We do not sell your personal information to third parties
                </li>
                <li>
                  You have rights regarding your personal data as described in
                  our Privacy Policy
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6 - Disclaimers and Warranties */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              6. Disclaimers and Warranties
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-medium text-yellow-800 mb-2">
                "As Is" Service
              </h3>
              <p className="text-yellow-700 text-sm">
                Our services are provided "as is" and "as available" without
                warranties of any kind, either express or implied, including but
                not limited to implied warranties of merchantability, fitness
                for a particular purpose, or non-infringement.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Service Availability
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>
                  Services may be temporarily unavailable due to maintenance or
                  technical issues
                </li>
                <li>
                  We reserve the right to modify or discontinue services at any
                  time
                </li>
                <li>
                  We are not responsible for third-party service interruptions
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Content Accuracy
              </h3>
              <p className="text-gray-700">
                While we strive to provide accurate and up-to-date information,
                we make no representations or warranties about the accuracy,
                completeness, or reliability of any content on our platform.
                Users should verify information independently before making
                decisions based on it.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 - Limitation of Liability */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Ban className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              7. Limitation of Liability
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-medium text-red-800 mb-2">
                Important Liability Limitations
              </h3>
              <p className="text-red-700 text-sm mb-2">
                To the fullest extent permitted by law, Buuuk shall not be
                liable for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-red-700 text-sm ml-4">
                <li>
                  Indirect, incidental, special, consequential, or punitive
                  damages
                </li>
                <li>
                  Loss of profits, revenue, data, or business opportunities
                </li>
                <li>
                  Damages resulting from your use or inability to use our
                  services
                </li>
                <li>Third-party actions or content on our platform</li>
                <li>Unauthorized access to or alteration of your data</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">Damage Cap</h3>
              <p className="text-gray-700">
                In no event shall our total liability to you exceed the amount
                you have paid us in the twelve (12) months preceding the event
                giving rise to the claim, or $100, whichever is greater.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Indemnification
              </h3>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless Buuuk, its officers,
                directors, employees, and agents from any claims, damages,
                losses, or expenses arising from your use of our services,
                violation of these terms, or infringement of any third-party
                rights.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 - Termination */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Ban className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              8. Termination
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Termination by You
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  You may terminate your account at any time by contacting us
                </li>
                <li>
                  You remain liable for all activities under your account prior
                  to termination
                </li>
                <li>Some provisions of these terms will survive termination</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Termination by Us
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  We may terminate or suspend your access immediately for cause
                </li>
                <li>We may terminate with notice for convenience</li>
                <li>
                  Upon termination, your right to use our services ceases
                  immediately
                </li>
                <li>
                  We may delete your account and data in accordance with our
                  data retention policies
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Effect of Termination
              </h3>
              <p className="text-gray-700">
                Upon termination, all rights and licenses granted to you will
                immediately cease. Provisions regarding intellectual property,
                disclaimers, limitation of liability, and dispute resolution
                shall survive termination.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 - Legal and Dispute Resolution */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Gavel className="h-6 w-6 text-slate-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              9. Legal Provisions and Dispute Resolution
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Governing Law and Jurisdiction
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  These Terms are governed by the laws of [Your State/Country],
                  without regard to conflict of law principles
                </li>
                <li>
                  Any disputes shall be resolved in the courts of [Your
                  Jurisdiction]
                </li>
                <li>You consent to the personal jurisdiction of such courts</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Dispute Resolution Process
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  <strong>Informal Resolution:</strong> Contact us first to
                  resolve disputes informally
                </li>
                <li>
                  <strong>Mediation:</strong> If informal resolution fails,
                  disputes may be subject to mediation
                </li>
                <li>
                  <strong>Arbitration:</strong> Binding arbitration may be
                  required for certain disputes
                </li>
                <li>
                  <strong>Class Action Waiver:</strong> You waive the right to
                  participate in class action lawsuits
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Severability and Waiver
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  If any provision is unenforceable, the remainder shall remain
                  in effect
                </li>
                <li>
                  Our failure to enforce any right does not waive that right
                </li>
                <li>These Terms constitute the entire agreement between us</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 10 - Modifications and Updates */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            10. Modifications to Terms
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Right to Modify
              </h3>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. When we
                make changes, we will post the updated Terms on our website and
                update the "Last Updated" date at the top of this document.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Notice of Changes
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  Material changes will be communicated via email or website
                  notice
                </li>
                <li>
                  You will have 30 days to review changes before they take
                  effect
                </li>
                <li>Continued use after changes constitutes acceptance</li>
                <li>
                  If you disagree with changes, you may terminate your account
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Contact Information
            </h2>
          </div>

          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, need
            clarification on any provision, or want to report a violation,
            please contact us:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">General Inquiries:</p>
              <p className="text-blue-600">legal@buuuk.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Response Time:</p>
              <p className="text-gray-700">Within 3-5 business days</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Legal Department:</p>
              <p className="text-blue-600">terms@buuuk.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Customer Support:</p>
              <p className="text-blue-600">support@buuuk.com</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-100 rounded">
            <p className="text-blue-800 text-sm">
              <strong>Important:</strong> For legal notices, DMCA takedown
              requests, or formal disputes, please use our legal contact email
              and include "LEGAL NOTICE" in the subject line.
            </p>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-2">
            By using our services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
          <p className="text-gray-500 text-xs">
            These Terms are effective as of the date listed above and will
            remain in effect until modified or terminated.
          </p>
        </div>
      </div>
    </div>
  );
}
