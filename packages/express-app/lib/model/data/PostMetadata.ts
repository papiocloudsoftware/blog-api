import { BlogPost } from "../BlogPost";

/**
 * Metadata for a BlogPost
 */
export interface PostMetadata extends BlogPost {
  readonly contentBucket: string;
  readonly contentKey: string;
}
