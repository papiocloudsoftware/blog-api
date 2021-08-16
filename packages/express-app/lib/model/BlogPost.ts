/**
 * Interface representing a blog post
 */
export interface BlogPost {
  readonly id: string;
  readonly author: string;
  readonly created: number;
  readonly updated: number;
  readonly comment: string;
  readonly excerpt: string;
}
