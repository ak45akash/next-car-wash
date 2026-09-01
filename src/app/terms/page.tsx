'use client';

import { Metadata } from 'next';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using our car washing services ("Service"), you accept and agree to be bound by the terms and provision of this agreement. These Terms and Conditions govern your use of our website and services provided by our car washing business.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                We provide professional car washing and detailing services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Exterior car washing and waxing</li>
                <li>Interior cleaning and detailing</li>
                <li>Steam washing services</li>
                <li>Ceramic coating applications</li>
                <li>Paint protection film (PPF) installation</li>
                <li>Premium detailing packages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Booking and Payment</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>3.1 Booking:</strong> All services must be booked in advance through our website or by phone. We reserve the right to refuse service at our discretion.
                </p>
                <p>
                  <strong>3.2 Payment:</strong> Payment is due at the time of service completion unless other arrangements have been made. We accept cash, credit cards, and digital payments.
                </p>
                <p>
                  <strong>3.3 Pricing:</strong> All prices are subject to change without notice. The price quoted at the time of booking will be honored.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cancellation and Rescheduling</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>4.1 Customer Cancellation:</strong> Customers may cancel or reschedule appointments up to 24 hours before the scheduled service time without penalty.
                </p>
                <p>
                  <strong>4.2 Late Cancellation:</strong> Cancellations made less than 24 hours before the scheduled service may be subject to a cancellation fee.
                </p>
                <p>
                  <strong>4.3 No-Show Policy:</strong> Customers who fail to show up for their scheduled appointment may be charged the full service fee.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Liability and Insurance</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>5.1 Vehicle Condition:</strong> Customers must inform us of any pre-existing damage to their vehicle before service begins. We are not responsible for damage that was present before our service.
                </p>
                <p>
                  <strong>5.2 Limitation of Liability:</strong> Our liability is limited to the cost of the service provided. We are not liable for any indirect, incidental, or consequential damages.
                </p>
                <p>
                  <strong>5.3 Insurance:</strong> We maintain appropriate insurance coverage for our operations. However, customers are advised to maintain their own comprehensive vehicle insurance.
                </p>
                <p>
                  <strong>5.4 Personal Items:</strong> We are not responsible for personal items left in vehicles. Please remove all valuables and personal belongings before service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Service Guarantee</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>6.1 Quality Assurance:</strong> We guarantee the quality of our work. If you are not satisfied with our service, please notify us within 24 hours for a re-service at no additional charge.
                </p>
                <p>
                  <strong>6.2 Weather Conditions:</strong> Services may be delayed or rescheduled due to adverse weather conditions for the safety of our staff and the quality of service.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Customer Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate contact information and vehicle details</li>
                <li>Remove all personal items from the vehicle</li>
                <li>Inform us of any special requirements or concerns</li>
                <li>Be present at the agreed-upon time or arrange for authorized representation</li>
                <li>Ensure the vehicle is accessible and keys are available</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                We respect your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                All content on our website, including text, graphics, logos, and images, is the property of our business and is protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Modifications to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which we operate. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the local courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> info@diamondsteamwash.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 9646616419</p>
                <p className="text-gray-700"><strong>Address:</strong> Plot number 589, near bestech mall and business towers, Sector 66, Sahibzada Ajit Singh Nagar, Punjab 160062</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms and Conditions constitute the entire agreement between you and our business regarding the use of our services and supersede all prior agreements and understandings.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 