'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'promotions' | 'sponsorships' | 'collaborations'>('contact')
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('✅ Thanks for reaching out! We’ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 md:px-12 lg:px-20 py-8">
      {/* Page Header */}
      <section className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Connect with us for queries, sponsorships, or collaborations — we’d love to hear from you.
        </p>
      </section>

      {/* Tabs Navigation */}
      <div className="flex justify-center border-b border-gray-200 mb-8">
        {[
          { id: 'contact', label: 'Contact' },
          { id: 'promotions', label: 'Promotions' },
          { id: 'sponsorships', label: 'Sponsorships' },
          { id: 'collaborations', label: 'Collaborations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto">
        {/* CONTACT FORM */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col space-y-4"
            >
              <h2 className="text-xl font-semibold">Send a Message</h2>

              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none outline-none"
              ></textarea>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-all duration-200"
              >
                Send Message
              </button>
            </form>

            <div className="flex flex-col justify-center space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="text-lg font-semibold mb-1">Contact Info</h3>
                <p>Email: <span className="text-blue-600">contact@yourblog.com</span></p>
                <p>Phone: +91 98765 43210</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">Follow Us</h3>
                <div className="flex space-x-4 text-gray-500">
                  <a href="#" className="hover:text-blue-600">Twitter</a>
                  <a href="#" className="hover:text-blue-600">LinkedIn</a>
                  <a href="#" className="hover:text-blue-600">Instagram</a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-1">Location</h3>
                <p>123, Innovation Avenue<br />Bangalore, India</p>
              </div>
            </div>
          </div>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Promote with Us</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Reach a highly engaged tech audience through banners, sponsored articles, and social promotions.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm text-left max-w-md mx-auto space-y-1">
              <li>Homepage or sidebar banner placements</li>
              <li>Sponsored blog posts</li>
              <li>Cross-platform content promotions</li>
            </ul>
            <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm">
              View Ad Packages
            </a>
          </div>
        )}

        {/* SPONSORSHIPS TAB */}
        {activeTab === 'sponsorships' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Become a Sponsor</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Support events, campaigns, and series that connect with developers and creators.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm text-left max-w-md mx-auto space-y-1">
              <li>Event sponsorships</li>
              <li>Co-branded projects</li>
              <li>Podcast or newsletter features</li>
            </ul>
            <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm">
              Explore Sponsorships
            </a>
          </div>
        )}

        {/* COLLABORATIONS TAB */}
        {activeTab === 'collaborations' && (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600">Collaborate with Us</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Partner with us for workshops, content collaborations, and developer programs.
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm text-left max-w-md mx-auto space-y-1">
              <li>Guest blogging or joint videos</li>
              <li>Hackathon partnerships</li>
              <li>Community growth campaigns</li>
            </ul>
            <a href="#" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm">
              Start Collaboration
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
