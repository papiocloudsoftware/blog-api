import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { AppConfig } from "../config";
import { BlogPost } from "../model";
import { PostMetadata } from "../model/data";
import { PostNotFoundError } from "./PostNotFoundError";

/**
 * Service for accessing blog posts
 */
export class BlogService {
  readonly config: AppConfig;
  readonly dynamoClient: DocumentClient;
  readonly s3Client: AWS.S3;

  constructor(config: AppConfig, dynamoClient = new DocumentClient(), s3Client = new AWS.S3()) {
    this.config = config;
    this.dynamoClient = dynamoClient;
    this.s3Client = s3Client;
  }

  private get tableName() {
    return this.config.metadataTable;
  }

  /**
   * List all blog posts
   *
   * TODO: Support pagination
   *
   * @returns {Promise<BlogPost[]>} - the posts
   */
  async listAllBlogPosts(): Promise<BlogPost[]> {
    const posts: BlogPost[] = [];
    let key: DocumentClient.Key | undefined = undefined;
    do {
      const response: DocumentClient.ScanOutput = await this.dynamoClient
        .scan({
          TableName: this.tableName,
          ExclusiveStartKey: key
        })
        .promise();
      key = response.LastEvaluatedKey;
      posts.push(...(response.Items as BlogPost[]));
    } while (key);
    // Sort using latest first
    return posts.sort((a, b) => {
      return b.created - a.created;
    });
  }

  async getLatestBlogPost(): Promise<BlogPost> {
    const posts = await this.listAllBlogPosts();
    return posts[0];
  }

  /**
   * Given the id of a post, return the post metadata or undefined if post does
   * not exist
   *
   * @param {string} id - id of the post to return
   * @returns {Promise<PostMetadata | undefined>} the post
   */
  private async findBlogPost(id: string): Promise<PostMetadata | undefined> {
    const response = await this.dynamoClient
      .get({
        TableName: this.tableName,
        Key: { id }
      })
      .promise();
    return response.Item as unknown as PostMetadata;
  }

  /**
   * Given the id of a post, return the post metadata
   *
   * @param {string} id - id of the post to return
   * @returns {Promise<BlogPost>} the post
   */
  async getBlogPost(id: string): Promise<BlogPost> {
    const record = await this.findBlogPost(id);
    if (!record) {
      throw new PostNotFoundError(id);
    }
    return {
      ...record
    };
  }

  /**
   * Given the id of a post, return the full content for it
   *
   * @param {string} id - id of the post to return
   * @returns {string} the post content
   */
  async getBlogContent(id: string): Promise<string> {
    const post = await this.findBlogPost(id);
    if (!post) {
      throw new PostNotFoundError(id);
    }
    const content = await this.s3Client
      .getObject({
        Bucket: post.contentBucket,
        Key: post.contentKey
      })
      .promise();
    return content.Body!.toString();
  }
}
