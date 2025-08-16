"use client";
import {
  Shield,
  Eye,
  Users,
  Lock,
  Mail,
  Calendar,
  Globe,
  Download,
} from "lucide-react";

export default function PrivacyPolicyContent() {
  const lastUpdated = "January 15, 2025";
  const effectiveDate = "January 1, 2025";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At <strong className="text-blue-600">Buuuk</strong>, we are committed
          to protecting your privacy and being transparent about how we collect,
          use, and safeguard your personal information.
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

      {/* Quick Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Quick Summary
        </h2>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>
            • We collect only necessary information to provide our services
          </li>
          <li>• We never sell your personal data to third parties</li>
          <li>
            • You have full control over your data and can request deletion
            anytime
          </li>
          <li>
            • We use industry-standard security measures to protect your
            information
          </li>
        </ul>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              1. Information We Collect
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Personal Information You Provide
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Name, email address, and phone number</li>
                <li>Account credentials and profile information</li>
                <li>Payment and billing information</li>
                <li>Communications and feedback you send to us</li>
                <li>Any other information you choose to provide</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Information Collected Automatically
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>IP address and location data</li>
                <li>Browser type, version, and operating system</li>
                <li>Device information and unique identifiers</li>
                <li>Usage patterns and interaction data</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Referral sources and search terms</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              2. How We Use Your Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Service Provision
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                <li>Provide and maintain our services</li>
                <li>Process transactions and payments</li>
                <li>Authenticate users and prevent fraud</li>
                <li>Provide customer support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Communication & Marketing
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                <li>Send service-related notifications</li>
                <li>Respond to inquiries and requests</li>
                <li>Send promotional materials (with consent)</li>
                <li>Conduct surveys and gather feedback</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Analytics & Improvement
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                <li>Analyze usage patterns and trends</li>
                <li>Improve our services and user experience</li>
                <li>Develop new features and offerings</li>
                <li>Conduct research and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Legal & Security
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                <li>Comply with legal obligations</li>
                <li>Protect against fraud and abuse</li>
                <li>Enforce our terms of service</li>
                <li>Resolve disputes and investigate issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              3. Information Sharing & Security
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                When We Share Information
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  <strong>Service Providers:</strong> Trusted third parties who
                  help us operate our services (payment processors, hosting
                  providers, analytics services)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or government request
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with
                  mergers, acquisitions, or sale of assets
                </li>
                <li>
                  <strong>Consent:</strong> With your explicit consent for
                  specific purposes
                </li>
                <li>
                  <strong>Safety:</strong> To protect the rights, property, or
                  safety of Buuuk, our users, or others
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                What We Don't Do
              </h3>
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <ul className="list-disc list-inside space-y-1 text-red-800 text-sm ml-4">
                  <li>We never sell your personal data to third parties</li>
                  <li>
                    We don't share your data for advertising purposes without
                    consent
                  </li>
                  <li>We don't rent or lease your information to marketers</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Security Measures
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>
                  Industry-standard encryption for data transmission and storage
                </li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>
                  Access controls and employee training on data protection
                </li>
                <li>
                  Secure data centers with physical and digital safeguards
                </li>
                <li>Incident response procedures for potential breaches</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Download className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              4. Your Privacy Rights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Access</h4>
                <p className="text-sm text-gray-600">
                  Request a copy of the personal information we have about you
                </p>
              </div>

              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Correction</h4>
                <p className="text-sm text-gray-600">
                  Update or correct inaccurate personal information
                </p>
              </div>

              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Deletion</h4>
                <p className="text-sm text-gray-600">
                  Request deletion of your personal information (subject to
                  legal requirements)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Portability</h4>
                <p className="text-sm text-gray-600">
                  Receive your data in a structured, machine-readable format
                </p>
              </div>

              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Opt-out</h4>
                <p className="text-sm text-gray-600">
                  Unsubscribe from marketing communications and non-essential
                  emails
                </p>
              </div>

              <div className="border border-gray-200 rounded p-3">
                <h4 className="font-medium text-gray-800">Restriction</h4>
                <p className="text-sm text-gray-600">
                  Limit how we process your personal information
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Additional Information
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Data Retention</h3>
              <p className="text-gray-700">
                We retain your personal information only as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and enforce our agreements. Specific retention periods
                vary based on the type of information and applicable legal
                requirements.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                International Transfers
              </h3>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data during international
                transfers, including adequacy decisions and standard contractual
                clauses.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Children's Privacy
              </h3>
              <p className="text-gray-700">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If we become aware of such collection, we
                will take steps to delete the information promptly.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Changes to This Policy
              </h3>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will
                notify you of material changes by posting the new policy on our
                website and updating the "Last Updated" date. Your continued use
                of our services after changes become effective constitutes
                acceptance of the updated policy.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          </div>

          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, want to
            exercise your privacy rights, or need to report a privacy concern,
            please contact us:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-800">Email:</p>
              <p className="text-blue-600">privacy@buuuk.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Response Time:</p>
              <p className="text-gray-700">Within 30 days of your request</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">
                Data Protection Officer:
              </p>
              <p className="text-blue-600">dpo@buuuk.com</p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Mailing Address:</p>
              <p className="text-gray-700">Available upon request</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            By using our website and services, you acknowledge that you have
            read, understood, and agree to be bound by this Privacy Policy.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            This policy is governed by applicable privacy laws including GDPR,
            CCPA, and other relevant regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
