// components/ContactCTA.jsx
import { Mail } from "lucide-react"; // or replace with any icon

export default function ContactCTA() {
  return (
    <section className=" flex justify-center mt-20 bg-white text-black dark:bg-neutral-950 dark:text-white rounded-xl  overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 justify-center gap-8 p-8">
        {/* Text Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Create Something Amazing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Whether you're starting fresh or improving an existing project,
            we're here to bring your ideas to life with creativity, skill, and
            attention to detail. From first concept to final delivery, our focus
            is on crafting work that reflects your vision and makes an impact.
            Great collaborations start with a simple conversation — and we'd
            love to hear from you.
          </p>

          <a
            href="/contact"
            className="inline-flex shadow-md items-center justify-center gap-2 px-6 py-3 bg-[#EF4444] hover:bg-red-600 text-white font-medium rounded-lg transition-transform transform hover:scale-105 "
          >
            <Mail size={18} /> Contact Us
          </a>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" // replace with actual image path in public/
            alt="Contact"
            className="rounded-lg shadow-lg max-h-72 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
