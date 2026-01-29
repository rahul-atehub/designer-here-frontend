import React from "react";

const CookiePolicyContent = () => {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <p className="text-sm text-gray-500 mb-6">
        Last updated: January 29, 2024
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Cookies are small text files that are placed on your device when you
          visit our website. They help us provide you with a better experience
          by remembering your preferences and understanding how you use our
          site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">How We Use Cookies</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We use cookies for the following purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            <strong>Essential Cookies:</strong> Required for the website to
            function properly
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and
            preferences
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            interact with our website
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant
            advertisements
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Types of Cookies We Use</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Session Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Temporary cookies that expire when you close your browser. These
              help us track your journey through our website during a single
              visit.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Persistent Cookies
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Cookies that remain on your device for a set period or until you
              delete them. These help us remember you when you return to our
              website.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Third-Party Cookies</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We may use third-party services that set cookies on your device. These
          include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
          <li>Google Analytics for website analytics</li>
          <li>Social media platforms for content sharing</li>
          <li>Payment processors for secure transactions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Managing Cookies</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You can control and manage cookies in various ways:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            Most browsers allow you to refuse or accept cookies through their
            settings
          </li>
          <li>You can delete cookies that have already been set</li>
          <li>
            You can set your browser to notify you when you receive a cookie
          </li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Please note that disabling cookies may affect the functionality of our
          website and your user experience.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We may update this Cookie Policy from time to time. Any changes will
          be posted on this page with an updated revision date. We encourage you
          to review this policy periodically.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-300">
          If you have any questions about our use of cookies, please contact us
          at:
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Email: john@example.com
          <br />
          Phone: (+65) 89735984
        </p>
      </section>
    </div>
  );
};

export default CookiePolicyContent;
