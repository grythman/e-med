import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { paymentService } from '../services/paymentService';
import { courseService } from '../services/courseService';
import useAuthStore from '../store/authStore';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadCourse = async () => {
      try {
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error('Error loading course:', error);
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

      // Handle payment gateway response
      if (result.gatewayData) {
        if (paymentMethod === 'stripe' && result.gatewayData.clientSecret) {
          // Redirect to Stripe checkout or handle client secret
          // In production, use Stripe.js to handle payment
          console.log('Stripe client secret:', result.gatewayData.clientSecret);
        } else if (paymentMethod === 'qpay' && result.gatewayData.qrCode) {
          // Show QPay QR code
          console.log('QPay QR Code:', result.gatewayData.qrCode);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error.response?.data?.error || 'Төлбөр амжилтгүй');
    } finally {
      setIsProcessing(false);
    }
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">{t('payment.title')}</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
          <p className="text-2xl font-bold text-blue-600">
            {course.price.toLocaleString()} ₮
          </p>
        </div>

        <form onSubmit={handlePayment}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('payment.method')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>Stripe (Карт)</span>
              </label>
              <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="qpay"
                  checked={paymentMethod === 'qpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>QPay</span>
              </label>
            </div>
          </div>

          {paymentData?.gatewayData?.qrCode && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">QPay QR Code:</p>
              <img
                src={paymentData.gatewayData.qrImage}
                alt="QPay QR Code"
                className="mx-auto"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? t('common.loading') : 'Төлбөр төлөх'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;

