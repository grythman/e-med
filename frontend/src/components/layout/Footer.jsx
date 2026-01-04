import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">e-med</h3>
            <p className="text-gray-400">
              Эмчийн сургалтын онлайн платформ
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Холбоос</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/courses" className="hover:text-white">Хичээлүүд</a></li>
              <li><a href="/about" className="hover:text-white">Бидний тухай</a></li>
              <li><a href="/contact" className="hover:text-white">Холбогдох</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Дэмжлэг</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white">Тусламж</a></li>
              <li><a href="/faq" className="hover:text-white">Түгээмэл асуулт</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 e-med. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

