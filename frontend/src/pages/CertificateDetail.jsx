import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { certificateService } from '../services/certificateService';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const CertificateDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await certificateService.getCertificateById(id);
        setCertificate(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Гэрчилгээ олдсонгүй');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const result = await certificateService.downloadCertificate(id);
      if (result.pdfUrl) {
        window.open(result.pdfUrl, '_blank');
      } else {
        alert('PDF бэлэн болоогүй байна. Удахгүй бэлэн болно.');
      }
    } catch (err) {
      alert('Татахад алдаа гарлаа');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/certificates/verify/${certificate.verificationCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Миний гэрчилгээ - E-Med',
          text: `${certificate.courseId?.title || certificate.courseTitle} хичээлийг амжилттай дуусгасан гэрчилгээ`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Холбоос хуулагдлаа!');
      } catch (err) {
        alert('Холбоос хуулахад алдаа гарлаа');
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/certificates')}>Буцах</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/certificates')}>
            ← Буцах
          </Button>
        </div>

        {/* Certificate Display */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-300">
            {/* Certificate Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-8 text-white text-center relative">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-full" />
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-white rounded-full" />
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-wider mb-2">ГЭРЧИЛГЭЭ</h1>
                <p className="text-amber-100 text-lg">Certificate of Completion</p>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 md:p-12 text-center">
              <p className="text-gray-600 mb-4">Энэхүү гэрчилгээг</p>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 border-b-2 border-amber-300 pb-4 inline-block">
                {certificate.userId?.firstName} {certificate.userId?.lastName}
              </h2>

              <p className="text-gray-600 mb-6">
                нь дараах хичээлийг амжилттай дуусгасныг гэрчилнэ:
              </p>

              <h3 className="text-xl md:text-2xl font-semibold text-amber-600 mb-8 bg-amber-50 rounded-lg py-4 px-6 inline-block">
                {certificate.courseId?.title || certificate.courseTitle}
              </h3>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Гэрчилгээний дугаар</p>
                  <p className="font-mono font-semibold text-gray-800">{certificate.certificateNumber}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Олгосон огноо</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(certificate.issuedAt).toLocaleDateString('mn-MN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Баталгаажуулах код</p>
                  <p className="font-mono font-semibold text-gray-800">{certificate.verificationCode}</p>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="mt-8 flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">QR Code</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={handleDownload} disabled={isDownloading}>
                  {isDownloading ? (
                    'Татаж байна...'
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF татах
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Хуваалцах
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => window.print()}
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Хэвлэх
                </Button>
              </div>
            </div>
          </div>

          {/* Verification Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Энэ гэрчилгээг баталгаажуулахын тулд{' '}
              <a 
                href={`/certificates/verify/${certificate.verificationCode}`}
                className="text-amber-600 hover:underline"
              >
                энд дарна уу
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail;

