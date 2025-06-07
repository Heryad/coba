'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

function InfoPageContent() {
  const searchParams = useSearchParams();
  const { isDark } = useTheme();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Us Section */}
        <section id="about" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>About Us</h2>
          <div className="prose prose-lg max-w-none">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>What is Coba T-shirts?</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              We are a print-on-demand company that offers high-quality t-shirts, sweaters, hoodies, tote bags, and many more products with custom designs. You can choose from our wide range of designs or upload your own to create unique and personalized products.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>How does print-on-demand work?</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Print-on-demand means that we only print and ship your products when you order them. This way, we avoid waste and overstock, and we can offer you more variety and flexibility. You can order as many or as few products as you want, and we will deliver them to you in a timely manner.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>What are the benefits of print-on-demand?</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Print-on-demand has many benefits for both customers and sellers. Some of them are:
            </p>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 space-y-2`}>
              <li>You can create your own products with your own designs, logos, slogans, etc.</li>
              <li>You can access a large catalog of products and designs without having to invest in inventory or storage space.</li>
              <li>You can save money on production and shipping costs, as you only pay for what you sell.</li>
              <li>You can reduce your environmental impact, as you avoid waste and emissions from mass production and transportation.</li>
            </ul>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>What printing methods do you use?</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              We use different printing methods depending on the product and the design. Some of the most common ones are:
            </p>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
              <li>
                <span className="font-medium">DTF (Direct to Film):</span> This method uses a special film that transfers the design onto the fabric using heat and pressure. It produces vibrant colors and high-resolution images that last long and feel soft on the skin.
              </li>
              <li>
                <span className="font-medium">DTG (Direct to Garment):</span> This method uses a printer that applies ink directly onto the fabric. It allows for more detail and color variation than other methods, and it works well on cotton and cotton-blend fabrics.
              </li>
              <li>
                <span className="font-medium">Sublimation:</span> This method uses heat to transfer dye onto synthetic fabrics. It creates durable and fade-resistant prints that cover the entire surface of the product. It is ideal for printing on curved or irregular shapes.
              </li>
              <li>
                <span className="font-medium">Screen Printing:</span> This method uses a screen mesh and plastisol-based inks to press the design onto the fabric. It produces crisp and opaque images that can withstand multiple washes. It is ideal for high-volume orders and simple designs with few colors.
              </li>
              <li>
                <span className="font-medium">Embroidery:</span> This method uses a needle and thread to stitch the design onto the fabric. It produces textured and elegant images that add value to the garment. It is ideal for logos, monograms, and small details.
              </li>
              <li>
                <span className="font-medium">Vinyl:</span> This method uses a vinyl cutter to cut out the design from a sheet of vinyl material. The design is then transferred onto the fabric using heat and pressure. It produces smooth and glossy images that are suitable for outdoor use. It is ideal for lettering, numbers, and shapes.
              </li>
            </ul>
          </div>
        </section>

        {/* Return Policy Section */}
        <section id="returns" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Return Policy</h2>
          <div className="prose prose-lg max-w-none">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Last updated July 15, 2023</p>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reasons, you may return it to us for an exchange only. Please see below for more information on our return policy.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Returns</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              All returns must be postmarked within five (5) days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Return Process</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              To return an item, please email customer service at <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>customersupport@cobatshirts.com</a> to obtain a Return Merchandise Authorization (RMA) number. After receiving a RMA number, place the item securely in its original packaging and include your proof of purchase, then mail your return to the following address:
            </p>
            <div className={`${isDark ? 'bg-[#2A2A2A]' : 'bg-gray-50'} p-6 rounded-lg mb-6`}>
              <p className={`${isDark ? 'text-gray-200' : 'text-gray-600'} font-medium`}>Coba Printing and Advertising PLC</p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Attn: Returns</p>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Addis Ababa, Ethiopia</p>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Please note, you will be responsible for all return shipping charges. We strongly recommend that you use a trackable method to mail your return.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Refunds</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              After receiving your return and inspecting the condition of your item, we will process your exchange. Please allow at least seven (7) days from the receipt of your item to process your exchange. We will notify you by email when your return has been processed.
            </p>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Exceptions</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
            </p>

            <h4 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Please Note</h4>
            <ul className={`list-disc pl-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6 space-y-2`}>
              <li>A 25% restocking fee will be charged for all returns.</li>
              <li>Sale items are FINAL SALE and cannot be returned.</li>
            </ul>

            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Questions</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              If you have any questions concerning our return policy, please contact us at{' '}
              <a href="tel:+251938613544" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>+251938613544</a> or{' '}
              <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>customersupport@cobatshirts.com</a>
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 scroll-mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Get in Touch</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Have questions about our products or services? We're here to help. Reach out to us through any of the following channels:
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Phone</h4>
                    <a href="tel:+251938613544" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                      +251 938 61 35 44
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <svg className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>Email</h4>
                    <a href="mailto:customersupport@cobatshirts.com" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}>
                      customersupport@cobatshirts.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`${isDark ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-lg p-6`}>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className={`w-full px-4 py-2 rounded-md transition-colors duration-200 ${
                      isDark 
                        ? 'bg-[#333] border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20' 
                        : 'bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20'
                    }`}
                    placeholder="Your message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-md transition-colors duration-200 ${
                    isDark
                      ? 'bg-white text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20'
                      : 'bg-black text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20'
                  }`}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function InfoPage() {
  const { isDark } = useTheme();
  
  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-[#222]' : 'bg-white'}`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}`}></div>
      </div>
    }>
      <InfoPageContent />
    </Suspense>
  );
} 