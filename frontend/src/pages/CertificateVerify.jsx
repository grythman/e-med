import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { certificateService } from '../services/certificateService';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const CertificateVerify = () => {
  const { t } = useTranslation();
  const { code } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const data = await certificateService.verifyCertificate(code);
        setResult(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Гэрчилгээ олдсонгүй. Код буруу байна.');
        } else {
          setError(err.response?.data?.error || 'Баталгаажуулахад алдаа гарлаа');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (code) {
      verifyCertificate();
    }
  }, [code]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Гэрчилгээ баталгаажуулах
            </h1>
            <p className="text-gray-600">
              Verification Code: <span className="font-mono font-semibold">{code}</span>
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {result?.isValid ? (
              <>
                {/* Valid Certificate */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">БАТАЛГААЖСАН</h2>
                  <p className="text-green-100">Энэ гэрчилгээ хүчинтэй байна</p>
                </div>

                <div className="p-8">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <p className="text-sm text-gray-500 mb-1">Гэрчилгээ эзэмшигч</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.certificate.userName}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <p className="text-sm text-gray-500 mb-1">Хичээлийн нэр</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {result.certificate.courseTitle}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <p className="text-sm text-gray-500 mb-1">Гэрчилгээний дугаар</p>
                      <p className="font-mono font-semibold text-gray-900">
                        {result.certificate.certificateNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Олгосон огноо</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(result.certificate.issuedAt).toLocaleDateString('mn-MN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex items-center justify-center gap-2 text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-medium">E-Med сургалтын системээр баталгаажсан</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Invalid Certificate */}
                <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">ОЛДСОНГҮЙ</h2>
                  <p className="text-red-100">Энэ код бүртгэлд байхгүй байна</p>
                </div>

                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-6">
                    {error || 'Таны оруулсан баталгаажуулах код буруу эсвэл хүчингүй болсон байна.'}
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Санамж:</strong> Гэрчилгээний кодыг зөв оруулсан эсэхийг шалгана уу. 
                      Код нь том жижиг үсэгт мэдрэмтгий байдаг.
                    </p>
                  </div>

                  <Button onClick={() => navigate('/')}>
                    Нүүр хуудас руу буцах
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              E-Med - Эмчийн сургалтын систем
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerify;

