import api from './api';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentType: 'markdown' | 'external' | 'video';
  bodyMarkdown: string | null;
  externalUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  coverPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResult {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const literasikService = {
  async getArticles(params?: {
    category?: string;
    contentType?: string;
    published?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ArticleListResult> {
    const response = await api.get<ArticleListResult>('/content/articles', {
      params: {
        ...params,
        published: params?.published ?? true, // Default to published only
      },
    });
    return response.data;
  },

  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await api.get<Article>(`/content/articles/${slug}`);
    return response.data;
  },
};
