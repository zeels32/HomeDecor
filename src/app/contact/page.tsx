'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-forest font-semibold">
          Customer Concierge
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
          We Are Here to Assist You
        </h1>
        <p className="text-xs sm:text-sm text-muted-gray">
          Whether you need styling guidance, corporate gift curation, or delivery updates, our concierge team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft space-y-6">
          <h2 className="font-serif text-xl font-medium text-charcoal border-b border-subtle-border pb-3">
            Atelier & Studio
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Design Atelier</p>
                <p className="text-muted-gray leading-relaxed">
                  Terra & Form Studio, 402 Lotus Grandeur<br />
                  14th Road, Khar West, Mumbai 400052, India
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Email Concierge</p>
                <p className="text-muted-gray">concierge@terraandform.com</p>
                <p className="text-[11px] text-muted-gray">Replies within 12 business hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Telephone Assistance</p>
                <p className="text-muted-gray">+91 (080) 4123-8899</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Operating Hours</p>
                <p className="text-muted-gray">Monday – Saturday: 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-subtle-border shadow-soft">
          {isSent ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest-50 text-forest mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-charcoal">
                Message Dispatched
              </h3>
              <p className="text-xs text-muted-gray max-w-sm mx-auto">
                Thank you, {name}. Our client concierge has received your inquiry and will respond to {email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h2 className="font-serif text-xl font-medium text-charcoal border-b border-subtle-border pb-3">
                Send an Inquiry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Zeel Solanki"
                    className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-charcoal">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                >
                  <option value="Product Inquiry">Product & Dimensions Inquiry</option>
                  <option value="Order Tracking">Order & Tracking Assistance</option>
                  <option value="Interior Trade">Trade & Interior Designer Sourcing</option>
                  <option value="Corporate Gifting">Curated Corporate Gifting Sets</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-charcoal">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="w-full p-2.5 bg-ivory border border-subtle-border rounded-xs focus:outline-none focus:border-forest"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-forest text-white text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-forest-600 transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
