"use client";
import { useState } from "react";
import axios from "axios";
import { API } from "@/config";
import Head from "next/head";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Package,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactSupport() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    issueType: "technical",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const showSuccess = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const showError = (message) => {
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 3000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        API.EMAIL, // Same endpoint as contact page
        {
          name: contactForm.name,
          email: contactForm.email,
          issueType: contactForm.issueType,
          subject: contactForm.subject,
          message: contactForm.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Simulated success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Email sent successfully!");
      setContactForm({
        name: "",
        email: "",
        subject: "",
        issueType: "technical",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      showError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqData = [
    {
      id: 1,
      question: "How do I save designs I like?",
      answer:
        "Click the heart icon on any design to save it to your collection. You can view all your saved designs by visiting your profile and clicking on the 'Saved' tab.",
    },
    {
      id: 2,
      question: "How does the chat/messaging system work?",
      answer:
        "Click the message icon on any design or go to the Messages section in your navigation. You can start a conversation with the admin to discuss custom work or ask questions about specific designs.",
    },
    {
      id: 3,
      question: "How do I request custom design work?",
      answer:
        "Find a design style you like and click 'Message Admin' or use the chat feature. Describe your requirements, and the admin will guide you through the custom order process.",
    },
    {
      id: 4,
      question: "What happens after I send a design request?",
      answer:
        "After you send a request via chat, the admin will review your requirements and discuss the project details with you. Once you agree on the scope, the ordering and payment process will be handled externally via email, WhatsApp, or another platform.",
    },
    {
      id: 5,
      question: "Can I see my saved designs later?",
      answer:
        "Yes! All your saved designs are stored in your profile. Navigate to your profile page and click on the 'Saved' section to view all designs you've liked or saved.",
    },
    {
      id: 6,
      question: "How do I manage my account and notifications?",
      answer:
        "Go to Settings > Notifications to customize your email alerts and preferences. You can control notifications for new posts, messages, and weekly summaries.",
    },
  ];

  const tabs = [
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "contact", label: "Contact Support", icon: MessageSquare },
    { id: "orders", label: "Custom Orders", icon: Package },
  ];

  return (
    <>
      <Head>
        <title>Support - DesignStudio</title>
      </Head>

      <div className="min-h-screen bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-light text-black dark:text-white mb-3">
              Support Center
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Get help with technical issues, learn about custom orders, or find
              answers to common questions.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-black dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* FAQ Tab */}
          {activeTab === "faq" && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 animate-in fade-in duration-300">
              <h2 className="text-lg font-light text-black dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {faqData.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                      }
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      <span className="text-sm font-medium text-black dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <div
                        className={`transform transition-transform duration-200 ${
                          expandedFaq === faq.id ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        expandedFaq === faq.id ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 pb-4 pt-2">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === "contact" && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 animate-in fade-in duration-300">
              <h2 className="text-lg font-light text-black dark:text-white mb-2">
                Contact Support
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Having issues with the platform? Report technical problems or
                ask general questions.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your name"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your.email@example.com"
                      className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Issue Type */}
                <div>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-2 uppercase tracking-wide font-medium">
                    Issue Type
                  </label>
                  <select
                    value={contactForm.issueType}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        issueType: e.target.value,
                      }))
                    }
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  >
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Brief description of your issue"
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-3 uppercase tracking-wide font-medium">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Describe your issue or question in detail..."
                    rows="6"
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Custom Orders Tab */}
          {activeTab === "orders" && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 animate-in fade-in duration-300">
              <h2 className="text-lg font-light text-black dark:text-white mb-2">
                How Custom Orders Work
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Interested in custom design work? Here's how the process works:
              </p>

              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                    <span className="text-sm font-medium text-black dark:text-white">
                      1
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                      Browse & Connect
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Explore our design portfolio and save designs you like.
                      When you're ready, use the chat feature to start a
                      conversation with the admin about your custom project.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                    <span className="text-sm font-medium text-black dark:text-white">
                      2
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                      Discuss Requirements
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      Share your vision, requirements, and any reference designs
                      through our chat system. The admin will ask questions to
                      understand your needs and provide initial feedback.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                    <span className="text-sm font-medium text-black dark:text-white">
                      3
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                      External Order Process
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                      Once the scope is clear, the admin will guide you to
                      complete the order outside this platform. This may
                      include:
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <li className="flex items-start gap-2">
                        <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Email communication for detailed requirements
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>WhatsApp or other messaging platforms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ExternalLink className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>External payment and delivery coordination</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 bg-white dark:bg-zinc-900">
                    <span className="text-sm font-medium text-black dark:text-white">
                      4
                    </span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-sm font-medium text-black dark:text-white mb-2">
                      Timeline & Delivery
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      The admin will provide an estimated timeline and keep you
                      updated throughout the design process. Final delivery
                      methods will be discussed based on your project type.
                    </p>
                  </div>
                </div>

                {/* Note */}
                <div className="mt-8 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <span className="font-medium text-black dark:text-white">
                      Note:
                    </span>{" "}
                    Response times typically range from 24-48 hours. For urgent
                    requests, please mention this in your initial message.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-neutral-950 text-black dark:text-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
