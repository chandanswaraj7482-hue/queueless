import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  Tag,
  Share2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Filter,
} from 'lucide-react';
import { CommercialNavbar } from '../components/CommercialNavbar';
import { CommercialFooter } from '../components/CommercialFooter';
import { SeoHead } from '../components/SeoHead';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));
    return ['ALL', ...cats];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'ALL' || post.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.author.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060D1D] text-slate-900 dark:text-slate-100 font-sans relative selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <SeoHead
        title="Clinical Queue Insights, ABDM Compliance & Hospital ROI Blog | Queueless OS"
        description="Authoritative guides on eliminating OPD waiting room crowding, achieving ABDM M1/M2 certification, and replacing hardware token dispensers with smart TV signage."
        keywords="hospital queue management blog, OPD queue automation, ABDM M1 M2 compliance guide, digital hospital token system, patient wait time reduction"
        canonical="https://queueless-os.vercel.app/blog"
        breadcrumbs={[{ name: 'Clinical Blog & Research', item: '/blog' }]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          'name': 'Queueless Healthcare Clinical Operations Blog & ABDM Resource Hub',
          'description': 'Authoritative guides on eliminating OPD waiting room crowding, achieving ABDM M1/M2 certification, and replacing hardware token dispensers with smart TV signage.',
          'url': 'https://queueless-os.vercel.app/blog',
          'publisher': {
            '@type': 'Organization',
            'name': 'Queueless Healthcare Technologies',
            'url': 'https://queueless-os.vercel.app',
            'logo': 'https://queueless-os.vercel.app/logo.png',
          },
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0 bg-dot-matrix opacity-70" />

      {/* Ambient Flares */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-400/15 via-indigo-300/10 to-transparent blur-[160px] rounded-full" />
      </div>

      <CommercialNavbar />

      <main className="relative z-10 pt-28 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Clinical Engineering & Hospital Operations Library</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Insights for Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-400 dark:to-teal-300">
              Zero-Wait Hospital OPDs
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Evidence-based frameworks, ABDM compliance protocols, and operational blueprints for medical superintendents, clinical directors, and hospital administrators.
          </p>

          {/* Search Bar & Filter */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by topic, ABDM, hardware ROI, or keywords..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
              />
            </div>

            {/* Category Pills (Horizontal Sliding Track on Mobile & Responsive) */}
            <div className="w-full max-w-full overflow-x-auto py-2 px-1 touch-pan-x scroll-smooth pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex items-center gap-2 min-w-max mx-auto justify-start sm:justify-center px-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs font-black ring-2 ring-blue-500/20'
                        : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Articles' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Spotlight (Shown when no search query and ALL category selected) */}
        {!searchQuery && selectedCategory === 'ALL' && featuredPost && (
          <div className="mb-14">
            <div className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Editor's Selection</span>
            </div>

            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${featuredPost.categoryColor}`}>
                        {featuredPost.category}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {featuredPost.author.role}
                        </div>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-56 sm:h-72 lg:h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
              {searchQuery ? `Search Results (${filteredPosts.length})` : 'All Clinical Articles'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredPosts.length} articles
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No matching clinical articles found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Try searching for broader keywords like "ABDM", "tokens", "crowding", or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border backdrop-blur-md bg-white/90 dark:bg-slate-900/90 ${post.categoryColor}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-extrabold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed font-normal">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {post.author.name}
                        </span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* High-Conversion Bottom Banner (Centered) */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white relative overflow-hidden shadow-2xl border border-blue-800/50 text-center">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Automate Your Hospital Waiting Room</span>
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-center">
              Ready to eliminate OPD counter crowding forever?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center max-w-xl">
              Join 50+ clinics and OPDs running on Queueless OS. 14-day free pilot, zero hardware capex, and instant vector QR passes.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/signup"
                className="px-6 py-3.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Start 14-Day Free Pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/roi-calculator"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Calculate Hospital Savings</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Commercial Footer */}
      <CommercialFooter />
    </div>
  );
};
export default BlogPage;
