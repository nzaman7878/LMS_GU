import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error("Web3Forms Access Key is missing from .env file");
      setSubmitStatus({ type: 'error', message: "Configuration error. Please contact support." });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: "Thank you! Your message has been sent successfully." });
        setFormData({ name: '', email: '', subject: '', message: '' }); 
      } else {
        setSubmitStatus({ type: 'error', message: "Something went wrong. Please try again later." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({ type: 'error', message: "A network error occurred. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans bg-gradient-to-b from-cyan-100/70 to-white min-h-screen pb-20">
      
      <div className="flex flex-col items-center justify-center w-full pt-20 md:pt-36 px-7 md:px-0 space-y-7 text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
          Get in <span className="text-blue-600">Touch</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed px-4">
          Have questions about our digital learning platform? Our support team is here to help you navigate your educational journey at Gauhati University.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 md:gap-12">
          
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 h-full">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">Contact Information</h2>
              
              <div className="space-y-8">
            
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mr-4 flex-shrink-0 border border-cyan-100">
                    📍
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">University Campus</h4>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      Gopinath Bordoloi Nagar,<br />
                      Jalukbari, Guwahati,<br />
                      Assam 781014, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mr-4 flex-shrink-0 border border-cyan-100">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email Us</h4>
                    <p className="text-gray-600 text-sm md:text-base mb-1">support@lms.gauhati.ac.in</p>
                    <p className="text-gray-500 text-xs">For technical support</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mr-4 flex-shrink-0 border border-cyan-100">
                    📞
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600 text-sm md:text-base mb-1">+91 (361) 2570415</p>
                    <p className="text-gray-500 text-xs">Mon - Fri, 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Send a Message</h2>
              <p className="text-gray-500 mb-6">We usually respond within 24 hours.</p>

              {submitStatus && (
                <div className={`p-4 mb-6 rounded-xl text-sm font-medium ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nuruz"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="nuruz@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-gray-800"
                  />
                </div>

             
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-colors text-gray-800 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm flex justify-center items-center gap-2 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <span className="text-lg">✈️</span>}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;