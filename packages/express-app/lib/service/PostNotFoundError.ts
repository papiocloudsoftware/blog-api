/**
 * Error for a post not found
 */
export class PostNotFoundError extends Error {
  readonly postId: string;

  constructor(postId: string) {
    super(`Post '${postId}' not found`);
    this.name = this.constructor.name;
    this.postId = postId;
  }
}
