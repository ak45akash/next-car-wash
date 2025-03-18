import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <div className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">Book Your Car Wash</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Schedule your car wash appointment at your preferred time. 
              We offer various services to keep your vehicle in pristine condition.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 