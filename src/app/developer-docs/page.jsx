// src/app/developer-docs/page.jsx

"use client";
import { useState } from "react";
import {
  Code,
  Book,
  Zap,
  Key,
  Database,
  Globe,
  FileText,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Boxes,
  Webhook,
  Shield,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function DeveloperDocs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Book },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "api-reference", label: "API Reference", icon: Code },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "rate-limits", label: "Rate Limits", icon: Shield },
    { id: "sdk", label: "SDKs & Libraries", icon: Boxes },
  ];

  const codeExamples = {
    auth: `// Authentication Example
const API_KEY = 'your_api_key_here';

fetch('https://api.designstudio.com/v1/profile', {
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,

    profile: `// Get User Profile
GET /api/v1/profile/me

// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "bio": "Designer & Developer",
    "profilePicture": "https://..."
  }
}`,

    updateProfile: `// Update Profile
PUT /api/v1/profile/me

// Request Body
{
  "name": "John Doe",
  "bio": "Updated bio",
  "gender": "male"
}

// Response
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}`,

    webhook: `// Webhook Payload Example
{
  "event": "user.created",
  "timestamp": "2024-02-10T12:00:00Z",
  "data": {
    "userId": "user_123",
    "email": "john@example.com",
    "username": "johndoe"
  },
  "signature": "sha256_signature_here"
}`,

    webhookVerify: `// Verify Webhook Signature (Node.js)
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}`,

    sdk: `// Install SDK
npm install @designstudio/sdk

// Initialize
import { DesignStudio } from '@designstudio/sdk';

const client = new DesignStudio({
  apiKey: 'your_api_key_here'
});

// Get Profile
const profile = await client.profile.get();
console.log(profile);`,
  };

  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/v1/profile/me",
      description: "Get current user profile",
    },
    {
      method: "PUT",
      path: "/api/v1/profile/me",
      description: "Update user profile",
    },
    {
      method: "PUT",
      path: "/api/v1/profile/picture",
      description: "Upload profile picture",
    },
    {
      method: "DELETE",
      path: "/api/v1/profile/picture",
      description: "Remove profile picture",
    },
    {
      method: "PUT",
      path: "/api/v1/user/change-password",
      description: "Change user password",
    },
    {
      method: "POST",
      path: "/api/v1/admin/users",
      description: "Get all users (Admin only)",
    },
    {
      method: "POST",
      path: "/api/v1/admin/make-admin",
      description: "Promote user to admin",
    },
    {
      method: "POST",
      path: "/api/v1/admin/block-user",
      description: "Block a user",
    },
  ];

  const webhookEvents = [
    { event: "user.created", description: "New user registered" },
    { event: "user.updated", description: "User profile updated" },
    { event: "user.deleted", description: "User account deleted" },
    { event: "user.blocked", description: "User was blocked" },
    { event: "user.unblocked", description: "User was unblocked" },
    { event: "admin.promoted", description: "User promoted to admin" },
  ];

  const rateLimits = [
    { tier: "Free", requests: "100 req/hour", burst: "10 req/min" },
    { tier: "Pro", requests: "1,000 req/hour", burst: "50 req/min" },
    { tier: "Team", requests: "10,000 req/hour", burst: "200 req/min" },
    { tier: "Enterprise", requests: "Unlimited", burst: "Custom" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 border-r border-zinc-200 dark:border-zinc-800 sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => window.history.back()}
                className="text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Terminal className="w-6 h-6 text-black dark:text-white" />
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Developer Docs
              </h2>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                      activeSection === section.id
                        ? "bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 lg:p-12">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    Developer Documentation
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Welcome to the DesignStudio API documentation. This guide
                    will help you integrate our platform into your applications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: Zap,
                      title: "Quick Start",
                      desc: "Get up and running in minutes",
                    },
                    {
                      icon: Key,
                      title: "Authentication",
                      desc: "Secure your API requests",
                    },
                    {
                      icon: Code,
                      title: "API Reference",
                      desc: "Complete endpoint documentation",
                    },
                    {
                      icon: Webhook,
                      title: "Webhooks",
                      desc: "Real-time event notifications",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group"
                      onClick={() => {
                        if (item.title === "Authentication")
                          setActiveSection("authentication");
                        if (item.title === "API Reference")
                          setActiveSection("api-reference");
                        if (item.title === "Webhooks")
                          setActiveSection("webhooks");
                      }}
                    >
                      <item.icon className="w-6 h-6 text-black dark:text-white mb-3" />
                      <h3 className="text-sm font-medium text-black dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {item.desc}
                      </p>
                      <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mt-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 bg-zinc-50 dark:bg-zinc-900/50">
                  <h3 className="text-sm font-medium text-black dark:text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Base URL
                  </h3>
                  <code className="text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-black px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 block">
                    https://api.designstudio.com/v1
                  </code>
                </div>
              </div>
            )}

            {/* Authentication Section */}
            {activeSection === "authentication" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    Authentication
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    All API requests require authentication using Bearer tokens.
                  </p>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-white">
                      Authentication Example
                    </span>
                    <button
                      onClick={() => copyToClipboard(codeExamples.auth, "auth")}
                      className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      {copiedCode === "auth" ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-xs text-zinc-600 dark:text-zinc-400">
                      {codeExamples.auth}
                    </code>
                  </pre>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Getting Your API Key
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside text-xs text-zinc-600 dark:text-zinc-400">
                    <li>Navigate to Settings → Account Center</li>
                    <li>Click on "API Keys" tab</li>
                    <li>Generate a new API key</li>
                    <li>Store it securely - it won't be shown again</li>
                  </ol>
                </div>

                <div className="border-l-2 border-yellow-500 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-r">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    <strong>Security Note:</strong> Never expose your API key in
                    client-side code. Always make API calls from your backend.
                  </p>
                </div>
              </div>
            )}

            {/* API Reference Section */}
            {activeSection === "api-reference" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    API Reference
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Complete reference for all available endpoints.
                  </p>
                </div>

                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, idx) => (
                    <div
                      key={idx}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                            endpoint.method === "GET"
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                              : endpoint.method === "POST"
                                ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                                : endpoint.method === "PUT"
                                  ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                                  : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <div className="flex-1">
                          <code className="text-xs text-black dark:text-white font-mono">
                            {endpoint.path}
                          </code>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                            {endpoint.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Example: Get Profile
                  </h3>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-black dark:text-white">
                        Request & Response
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(codeExamples.profile, "profile")
                        }
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedCode === "profile" ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-xs text-zinc-600 dark:text-zinc-400">
                        {codeExamples.profile}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks Section */}
            {activeSection === "webhooks" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    Webhooks
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Receive real-time notifications when events occur in your
                    application.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Available Events
                  </h3>
                  <div className="grid gap-2">
                    {webhookEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 flex items-start gap-3"
                      >
                        <Webhook className="w-4 h-4 text-zinc-600 dark:text-zinc-400 mt-0.5" />
                        <div>
                          <code className="text-xs text-black dark:text-white font-mono">
                            {event.event}
                          </code>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Webhook Payload
                  </h3>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-black dark:text-white">
                        Example Payload
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(codeExamples.webhook, "webhook")
                        }
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedCode === "webhook" ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-xs text-zinc-600 dark:text-zinc-400">
                        {codeExamples.webhook}
                      </code>
                    </pre>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Verifying Webhooks
                  </h3>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-black dark:text-white">
                        Signature Verification
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            codeExamples.webhookVerify,
                            "webhookVerify",
                          )
                        }
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedCode === "webhookVerify" ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-xs text-zinc-600 dark:text-zinc-400">
                        {codeExamples.webhookVerify}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Rate Limits Section */}
            {activeSection === "rate-limits" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    Rate Limits
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    API rate limits are enforced to ensure fair usage and system
                    stability.
                  </p>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-900">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-black dark:text-white">
                          Plan
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-black dark:text-white">
                          Requests/Hour
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-black dark:text-white">
                          Burst Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateLimits.map((limit, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-zinc-200 dark:border-zinc-800"
                        >
                          <td className="px-4 py-3 text-xs text-black dark:text-white font-medium">
                            {limit.tier}
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                            {limit.requests}
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
                            {limit.burst}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Rate Limit Headers
                  </h3>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <code className="text-xs text-zinc-600 dark:text-zinc-400 block space-y-1">
                      <div>X-RateLimit-Limit: 1000</div>
                      <div>X-RateLimit-Remaining: 999</div>
                      <div>X-RateLimit-Reset: 1644508800</div>
                    </code>
                  </div>
                </div>

                <div className="border-l-2 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-r">
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    <strong>Pro Tip:</strong> Use exponential backoff when
                    handling rate limit errors (HTTP 429).
                  </p>
                </div>
              </div>
            )}

            {/* SDKs Section */}
            {activeSection === "sdk" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-light text-black dark:text-white mb-4">
                    SDKs & Libraries
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    Official SDKs to simplify integration with DesignStudio API.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "JavaScript/Node.js",
                      status: "Available",
                      install: "npm install @designstudio/sdk",
                    },
                    {
                      name: "Python",
                      status: "Available",
                      install: "pip install designstudio",
                    },
                    {
                      name: "Ruby",
                      status: "Coming Soon",
                      install: "gem install designstudio",
                    },
                    {
                      name: "PHP",
                      status: "Coming Soon",
                      install: "composer require designstudio/sdk",
                    },
                  ].map((sdk, idx) => (
                    <div
                      key={idx}
                      className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-black dark:text-white">
                          {sdk.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            sdk.status === "Available"
                              ? "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400"
                              : "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {sdk.status}
                        </span>
                      </div>
                      <code className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded block">
                        {sdk.install}
                      </code>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-black dark:text-white">
                    Quick Start with SDK
                  </h3>
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-xs font-medium text-black dark:text-white">
                        JavaScript SDK Example
                      </span>
                      <button
                        onClick={() => copyToClipboard(codeExamples.sdk, "sdk")}
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedCode === "sdk" ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-xs text-zinc-600 dark:text-zinc-400">
                        {codeExamples.sdk}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
