import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  schema?: Record<string, any>;
}

const DEFAULT_TITLE = 'Queueless | Zero-Wait Clinical Queue Operating System for Hospitals & OPDs';
const DEFAULT_DESC =
  'Queueless eliminates hospital waiting room chaos with instant QR check-in, 55" smart TV waiting kiosks, ABDM M1/M2 certification, and 1-tap doctor consoles. Trusted by 450+ hospitals.';
const DEFAULT_IMAGE = 'https://queueless-os.vercel.app/logo.png';
const BASE_URL = 'https://queueless-os.vercel.app';

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  schema,
}) => {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    const finalTitle = title ? `${title} | Queueless OS` : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description || DEFAULT_DESC);
    }

    // 3. Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }
    }

    // 4. Update Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', canonical || currentUrl);
    }

    // 5. Update OpenGraph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', finalTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || DEFAULT_DESC);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical || currentUrl);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', ogImage || DEFAULT_IMAGE);

    // 6. Update Twitter Tags
    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', finalTitle);

    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description || DEFAULT_DESC);

    const twImg = document.querySelector('meta[property="twitter:image"]');
    if (twImg) twImg.setAttribute('content', ogImage || DEFAULT_IMAGE);

    // 7. Dynamic Schema Injection
    let schemaScript = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, keywords, canonical, ogImage, ogType, schema, currentUrl]);

  return null;
};
