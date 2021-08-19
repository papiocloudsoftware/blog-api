import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

import { AppConfig } from "../config";
import { GetPostResponse, ListPostsResponse } from "../model/api";
import { BlogService, PostNotFoundError } from "../service";

/**
 * Example controller for overnightjs
 */
@Controller("api")
export class BlogApiController {
  readonly service: BlogService;

  constructor(service: BlogService = new BlogService(AppConfig.fromEnvironment())) {
    this.service = service;
  }

  @Get("posts")
  async listPosts(req: Request, res: Response) {
    try {
      const posts = await this.service.listAllBlogPosts();
      const response: ListPostsResponse = { posts };
      return res.json(response).send();
    } catch (e) {
      return res.status(500).send();
    }
  }

  @Get("posts/latest")
  async getLatestPost(req: Request, res: Response) {
    try {
      const post = await this.service.getLatestBlogPost();
      const response: GetPostResponse = { post };
      return res.json(response).send();
    } catch (e) {
      console.error(e.message, e);
      return res.status(500).send();
    }
  }

  @Get("post/:id")
  async getPost(req: Request, res: Response) {
    console.log("Getting post by id!");
    const id = req.params.id;
    if (!id) {
      return res.status(400).send();
    }
    try {
      const post = await this.service.getBlogPost(id);
      const response: GetPostResponse = { post };
      return res.json(response).send();
    } catch (e) {
      if (e instanceof PostNotFoundError) {
        return res.status(404).send();
      }
      console.error(e.message, e);
      return res.status(500).send();
    }
  }

  @Get("post/:id/content")
  async getPostContent(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send();
    }
    try {
      const content = await this.service.getBlogContent(id);
      return res.contentType("text/html").send(content);
    } catch (e) {
      if (e instanceof PostNotFoundError) {
        return res.status(404).send();
      }
      console.error(e.message, e);
      return res.status(500).send();
    }
  }
}
