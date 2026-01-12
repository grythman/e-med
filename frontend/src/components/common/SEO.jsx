import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
}) => {
  const siteName = 'e-med - Эмчийн Сургалтын Платформ';
  const defaultTitle = 'e-med - Монголын #1 Эмч нарын сургалтын платформ';
  const defaultDescription = 'Монголын эмч, эрүүл мэндийн мэргэжилтнүүдэд зориулсан онлайн сургалтын платформ. Чанартай боловсрол, хаанаас ч хүртээмжтэй.';
  const defaultImage = '/og-image.jpg';
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://emed.mn';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="e-med" />
      <meta name="language" content="Mongolian" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="mn_MN" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={fullImage} />

      {/* Additional */}
      <link rel="canonical" href={fullUrl} />
      <meta name="theme-color" content="#3b82f6" />
    </Helmet>
  );
};

export default SEO;

