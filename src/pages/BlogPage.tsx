import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';
import { BookOpen, Calendar, Clock, User, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface BlogPageProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ currentPath, navigate }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const slugMatch = currentPath.split('/blog/')[1];
    if (slugMatch) {
      const found = BLOG_POSTS.find(p => p.slug === slugMatch);
      setSelectedPost(found || null);
    } else {
      setSelectedPost(null);
    }
  }, [currentPath]);

  // Single Article View
  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <button
          onClick={() => navigate('/blog')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resources
        </button>

        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div className="space-y-3">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
              {selectedPost.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">{selectedPost.title}</h1>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {selectedPost.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedPost.readTime}</span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-200/80 text-slate-800">
            {selectedPost.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={idx} className="text-xl font-extrabold text-slate-900 mt-6 mb-2">{paragraph.replace('# ', '')}</h2>;
              }
              if (paragraph.startsWith('## ')) {
                return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">{paragraph.replace('## ', '')}</h3>;
              }
              if (paragraph.startsWith('> ')) {
                return <blockquote key={idx} className="p-4 bg-emerald-50/70 border-l-4 border-emerald-500 rounded-r-xl text-xs text-slate-700 italic">{paragraph.replace('> ', '')}</blockquote>;
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>
        </div>
      </div>
    );
  }

  // Blog Index View
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>SEO Knowledge Base & Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Articles & Tutorials</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Learn how to connect Google Search Console, diagnose technical errors, and optimize your Core Web Vitals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                {post.category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-600 transition leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 mt-6 text-[11px] text-slate-400">
              <span>{post.date}</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold group-hover:translate-x-1 transition">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
