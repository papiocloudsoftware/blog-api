import { BlogPost } from "../BlogPost";

/**
 * API Response for listing blog posts
 */
export interface ListPostsResponse {
  readonly posts: BlogPost[];
}
