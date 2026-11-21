import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Bookmark,
  Building2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { SeoHead } from '../components/SeoHead';
import { BLOG_POSTS } from '../data/blogPosts';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = React.useState(false);

  const post = useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === slug);
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060D1D] text-slate-900 dark:text-slate-100 font-sans relative selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <SeoHead
        title={`${post.seoTitle}`}
        description={post.metaDescription}
        keywords={post.tags.join(', ')}
        canonical={`https://queueless-os.vercel.app/blog/${post.slug}`}
        ogImage={post.featuredImage}
        ogType="article"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.metaDescription,
          'image': post.featuredImage,
          'datePublished': post.publishedAt,
          'dateModified': post.updatedAt,
          'author': {
            '@type': 'Person',
            'name': post.author.name,
            'jobTitle': post.author.role,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Queueless Healthcare Technologies',
            'url': 'https://queueless-os.vercel.app',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://queueless-os.vercel.app/logo.png',
            },
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://queueless-os.vercel.app/blog/${post.slug}`,
          },
          'keywords': post.tags.join(', '),
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0 bg-dot-matrix opacity-70" />

      {/* Ambient Flares */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-400/15 via-indigo-300/10 to-transparent blur-[160px] rounded-full" />
      </div>

      <CommercialNavbar />

      <main className="relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Breadcrumb Nav */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 truncate max-w-xs">
            {post.category}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${post.categoryColor}`}>
              {post.category}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author Card & Actions Bar */}
          <div className="pt-4 border-t border-b border-slate-200 dark:border-slate-800 py-3 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
              />
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white">
                  {post.author.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {post.author.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image Banner */}
        <div className="mb-10 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 sm:h-96 object-cover"
          />
        </div>

        {/* Key Takeaways Box */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-blue-900 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Key Clinical & Operational Takeaways</span>
          </div>
          <ul className="space-y-2">
            {post.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rich Article Content Body */}
        <article
          className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base space-y-5
            [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-950 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-slate-100 [&_h3]:mt-6 [&_h3]:mb-2
            [&_p]:leading-relaxed [&_p]:text-slate-600 dark:[&_p]:text-slate-300 [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:text-slate-600 dark:[&_ul]:text-slate-300
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:text-slate-600 dark:[&_ol]:text-slate-300
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-700 dark:[&_blockquote]:text-slate-300 [&_blockquote]:my-6 [&_blockquote]:bg-slate-100/50 dark:[&_blockquote]:bg-slate-900/50 [&_blockquote]:p-3 [&_blockquote]:rounded-r-xl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Tags */}
        <div className="pt-8 mt-10 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500">Tags:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950 dark:text-white">
              Related Clinical Insights
            </h3>
            <Link
              to="/blog"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View all articles</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                to={`/blog/${rPost.slug}`}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-4 shadow-xs hover:border-blue-500/40 transition-all"
              >
                <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={rPost.featuredImage}
                    alt={rPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 mb-1">
                  {rPost.category}
                </span>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {rPost.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800/40">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-xl font-black">Transform your clinic OPD with Queueless OS</h4>
            <p className="text-xs text-slate-300">
              Zero setup fees • 14-day free pilot • Active in 450+ hospitals.
            </p>
          </div>
          <Link
            to="/signup"
            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Start Free Pilot ➔
          </Link>
        </div>
      </main>
    </div>
  );
};
export default BlogPostPage;
