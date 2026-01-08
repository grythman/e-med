import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { paymentService } from '../services/paymentService';
import { courseService } from '../services/courseService';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('qpay');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadCourse = async () => {
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // If already enrolled, redirect
        if (courseData.isEnrolled) {
          toast.success('Та энэ хичээлд аль хэдийн бүртгүүлсэн байна');
          navigate(`/courses/${courseId}`);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Хичээл ачаалахад алдаа гарлаа');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, isAuthenticated, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await paymentService.createPayment({
        courseId,
        amount: course.price,
        currency: 'MNT',
        paymentMethod,
      });

      setPaymentData(result);
      toast.success('Төлбөр үүсгэгдлээ');

      // Start checking payment status for QPay
      if (paymentMethod === 'qpay') {
        startPaymentCheck(result.payment._id || result.payment.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Төлбөр үүсгэхэд алдаа гарлаа');
    } finally {
      setIsProcessing(false);
    }
  };

  // Check payment status periodically
  const startPaymentCheck = (paymentId) => {
    setCheckingPayment(true);
    
    const checkInterval = setInterval(async () => {
      try {
        const payment = await paymentService.getPaymentById(paymentId);
        setPaymentStatus(payment.status);

        if (payment.status === 'completed') {
          clearInterval(checkInterval);
          setCheckingPayment(false);
          toast.success('🎉 Төлбөр амжилттай! Хичээлд бүртгэгдлээ.');
          setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 2000);
        } else if (payment.status === 'failed' || payment.status === 'cancelled') {
          clearInterval(checkInterval);
          setCheckingPayment(false);
          toast.error('Төлбөр амжилтгүй боллоо');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
      }
    }, 5000); // Check every 5 seconds

    // Stop checking after 10 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      setCheckingPayment(false);
    }, 600000);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Хичээл олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Буцах
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Захиалгын мэдээлэл</h2>
            
            {/* Course Info */}
            <div className="flex gap-4 mb-6 pb-6 border-b">
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                {course.instructorId && (
                  <p className="text-sm text-gray-500">
                    {course.instructorId.firstName} {course.instructorId.lastName}
                  </p>
                )}
                {course.level && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {course.level}
                  </span>
                )}
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Хичээлийн үнэ</span>
                <span>{course.price.toLocaleString()} ₮</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Хөнгөлөлт</span>
                <span className="text-green-600">0 ₮</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Нийт</span>
                  <span className="text-blue-600">{course.price.toLocaleString()} ₮</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Багтсан зүйлс:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Бүх хичээлүүдэд хандах эрх
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Насан туршийн хандалт
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Гэрчилгээ авах боломж
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Төлбөрийн хэлбэр</h2>

            {!paymentData ? (
              <form onSubmit={handlePayment}>
                {/* Payment Methods */}
                <div className="space-y-3 mb-6">
                  {/* QPay */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'qpay' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qpay"
                      checked={paymentMethod === 'qpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                        Q
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">QPay</p>
                        <p className="text-sm text-gray-500">Монгол банкны апп</p>
                      </div>
                    </div>
                    {paymentMethod === 'qpay' && (
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>

                  {/* Card */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'stripe' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Карт</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard</p>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 text-lg"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Боловсруулж байна...
                    </span>
                  ) : (
                    `${course.price.toLocaleString()} ₮ төлөх`
                  )}
                </Button>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Таны төлбөрийн мэдээлэл аюулгүй хадгалагдана
                </p>
              </form>
            ) : (
              /* Payment Created - Show QR or Card Form */
              <div>
                {paymentMethod === 'qpay' && paymentData.gatewayData?.qrImage && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      QPay апп-аар QR кодыг уншуулна уу
                    </p>
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-4">
                      <img
                        src={paymentData.gatewayData.qrImage}
                        alt="QPay QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                    
                    {checkingPayment && (
                      <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Төлбөр хүлээж байна...</span>
                      </div>
                    )}

                    {paymentStatus === 'completed' && (
                      <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
                        ✓ Төлбөр амжилттай!
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => {
                        setPaymentData(null);
                        setPaymentStatus(null);
                        setCheckingPayment(false);
                      }}
                      className="w-full"
                    >
                      Өөр төлбөрийн хэлбэр сонгох
                    </Button>
                  </div>
                )}

                {paymentMethod === 'stripe' && paymentData.gatewayData?.clientSecret && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Stripe төлбөрийн хуудас руу шилжиж байна...
                    </p>
                    {/* In production, integrate Stripe Elements here */}
                    <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                      <p className="text-sm">
                        Stripe Elements integration шаардлагатай.
                        Одоогоор тест горимд ажиллаж байна.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
