import { useState, useEffect } from 'react';
import { Category, CategoryType } from '../types';
import { CATEGORIES } from '../constants';

const CATEGORY_FILES: Record<CategoryType, string> = {
  PROJECTS: '/data/projects.json',
  RESEARCH: '/data/research.json',
  SOCIALS: '/data/socials.json',
  INTERESTS: '/data/interests.json',
  ABOUT: '/data/about.json',
  LEADERSHIP: '/data/leadership.json'
};

export const usePortfolioData = () => {
  const [categories, setCategories] = useState<Record<CategoryType, Category>>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all category files in parallel
        const categoryKeys = Object.keys(CATEGORY_FILES) as CategoryType[];
        const promises = categoryKeys.map(async (key) => {
          try {
            const response = await fetch(CATEGORY_FILES[key]);
            if (response.ok) {
              const data = await response.json();
              return { key, data };
            }
            return { key, data: CATEGORIES[key] };
          } catch {
            return { key, data: CATEGORIES[key] };
          }
        });

        const results = await Promise.all(promises);
        
        // Build categories object
        const loadedCategories: Record<CategoryType, Category> = {} as Record<CategoryType, Category>;
        results.forEach(({ key, data }) => {
          loadedCategories[key] = data;
        });

        setCategories(loadedCategories);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
        setCategories(CATEGORIES);
        setError('Using default data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { categories, isLoading, error };
};
