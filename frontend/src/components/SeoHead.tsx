import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SeoBreadcrumb {
  name: string;
  item: string;
}

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  breadcrumbs?: SeoBreadcrumb[];
  schema?: Record<string, any>;
}

const DEFAULT_TITLE = 'Queueless OS | Zero-Wait Clinical Queue Operating System for Hospitals & OPDs';
const DEFAULT_DESC =
  'Queueless OS eliminates hospital waiting room chaos with instant QR check-in, 55" smart TV waiting kiosks, ABDM M1/M2 certification, and 1-tap doctor consoles. Trusted by 50+ clinics and healthcare facilities.';
const DEFAULT_KEYWORDS =
  'Queueless OS, hospital queue system, clinic token system, ABDM certified queue, OPD queue management, zero wait hospital OS, clinical workflow software, NABH wait time compliance, smart TV queue kiosk, doctor OPD calling software';
const DEFAULT_IMAGE = 'https://queueless-os.vercel.app/logo.png';
const BASE_URL = 'https://queueless-os.vercel.app';

export const SeoHead: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  breadcrumbs,
  schema,
}) => {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Update Title (ensures Queueless OS is the primary site name for Google Site Name extraction)
    const finalTitle = title
      ? (title.includes('Queueless OS') ? title : `${title} | Queueless OS`)
      : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to get or create meta tags
    const getOrCreateMeta = (attr: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      return el;
    };

    // 2. Update Meta Description
    const metaDesc = getOrCreateMeta('name', 'description');
    metaDesc.setAttribute('content', description || DEFAULT_DESC);

    // 3. Update Meta Keywords
    const metaKeywords = getOrCreateMeta('name', 'keywords');
    metaKeywords.setAttribute('content', keywords || DEFAULT_KEYWORDS);

    // 4. Update Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonical || currentUrl);

    // 5. Update OpenGraph Tags
    getOrCreateMeta('property', 'og:site_name').setAttribute('content', 'Queueless OS');
    getOrCreateMeta('property', 'og:type').setAttribute('content', ogType);
    getOrCreateMeta('property', 'og:title').setAttribute('content', finalTitle);
    getOrCreateMeta('property', 'og:description').setAttribute('content', description || DEFAULT_DESC);
    getOrCreateMeta('property', 'og:url').setAttribute('content', canonical || currentUrl);
    getOrCreateMeta('property', 'og:image').setAttribute('content', ogImage || DEFAULT_IMAGE);
    getOrCreateMeta('property', 'og:image:secure_url').setAttribute('content', ogImage || DEFAULT_IMAGE);

    // 6. Update Twitter Tags
    getOrCreateMeta('property', 'twitter:card').setAttribute('content', 'summary_large_image');
    getOrCreateMeta('property', 'twitter:site').setAttribute('content', '@queueless_os');
    getOrCreateMeta('property', 'twitter:title').setAttribute('content', finalTitle);
    getOrCreateMeta('property', 'twitter:description').setAttribute('content', description || DEFAULT_DESC);
    getOrCreateMeta('property', 'twitter:image').setAttribute('content', ogImage || DEFAULT_IMAGE);

    // 7. Dynamic Schema & Breadcrumb Injection
    let combinedSchema: Record<string, any> | null = schema || null;

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': BASE_URL,
          },
          ...breadcrumbs.map((b, idx) => ({
            '@type': 'ListItem',
            'position': idx + 2,
            'name': b.name,
            'item': b.item.startsWith('http') ? b.item : `${BASE_URL}${b.item}`,
          })),
        ],
      };

      if (!combinedSchema) {
        combinedSchema = breadcrumbSchema;
      } else {
        // If combinedSchema is already a graph or object, nest properly
        combinedSchema = {
          '@context': 'https://schema.org',
          '@graph': [
            ...(combinedSchema['@graph'] ? combinedSchema['@graph'] : [combinedSchema]),
            breadcrumbSchema,
          ],
        };
      }
    }

    let schemaScript = document.getElementById('dynamic-seo-schema') as HTMLScriptElement | null;
    if (combinedSchema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-seo-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(combinedSchema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, keywords, canonical, ogImage, ogType, breadcrumbs, schema, currentUrl]);

  return null;
};
