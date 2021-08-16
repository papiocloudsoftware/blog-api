import { BlogPost } from "../BlogPost";

/**
 * API Response for getting a blog post
 */
export interface GetPostResponse {
  readonly post: BlogPost;
}
