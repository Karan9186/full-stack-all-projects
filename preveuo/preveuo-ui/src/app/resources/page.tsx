'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { EmptyState } from '@/components/ui';
import { ResourceCategoryTab } from '@/types/resources';
import { RESOURCE_CATEGORIES, RESOURCE_ARTICLES } from '@/lib/resourcesData';
import {
  ResourcesHero,
  CategoryFilter,
  ArticleCard,
  NewsletterSection,
} from '@/components/resources';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategoryTab>('All articles');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = RESOURCE_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All articles' || art.tabCategory === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-[#0f0f1a] flex flex-col font-sans selection:bg-[#5B5CE2] selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <ResourcesHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="max-w-[1140px] mx-auto px-6">
          <CategoryFilter
            categories={RESOURCE_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {filteredArticles.length === 0 ? (
            <div className="py-16">
              <EmptyState
                title="No articles found"
                description={`We couldn't find any articles matching "${searchQuery}". Try a different search term or category.`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <NewsletterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
