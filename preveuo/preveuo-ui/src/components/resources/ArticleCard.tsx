import React from 'react';
import Link from 'next/link';
import { ResourceArticle } from '@/types/resources';
import { Card, Badge } from '@/components/ui';
import { ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: ResourceArticle;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card hoverEffect className="group flex flex-col justify-between">
      <div>
        {/* Banner with watermarked number */}
        <div
          className={`h-48 relative overflow-hidden ${article.bgTint} flex items-center justify-center p-6 border-b border-border-light`}
        >
          <span
            className={`absolute -right-2 -bottom-6 text-[120px] font-black tracking-tighter select-none pointer-events-none ${article.watermarkColor}`}
          >
            {article.number}
          </span>

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-white/60">
            <svg
              className="w-8 h-8 text-brand-purple"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
              <path d="m13 13 6 6" />
            </svg>
          </div>
        </div>

        {/* Article Details */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="purple" size="sm">
              {article.category}
            </Badge>
          </div>

          <h3 className="text-[17px] font-bold text-heading leading-snug group-hover:text-brand-purple transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-[13.5px] text-body leading-relaxed mt-2.5 line-clamp-2">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 pt-0 border-t border-border-light mt-auto flex items-center justify-between text-[12.5px] text-muted">
        <span>{article.date} · {article.readTime}</span>
        <Link
          href={`/resources/${article.id}`}
          className="inline-flex items-center gap-1 font-semibold text-brand-purple group-hover:translate-x-1 transition-transform"
        >
          Read <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
};
