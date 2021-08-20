import { Application } from "express";
import * as request from "supertest";

import { App } from "../lib/app";
import { BlogPost } from "../lib/model";

process.env.BLOG_TABLE = "MockTable";

const getLatestBlogPostMock = jest.fn();
jest.mock("../lib/service", () => {
  return {
    BlogService: class {
      getLatestBlogPost = getLatestBlogPostMock;
    }
  };
});

describe("app", () => {
  let app: Application;

  beforeEach(() => {
    app = App.createApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("/api/posts/latest returns latest post", async () => {
    const mockPost: BlogPost = {
      id: "mock-id",
      title: "Mock Post",
      author: "Jest",
      comment: "no comment",
      created: 1234567890,
      updated: 1234567890,
      excerpt: "<p>Mock excerpt</p>"
    };
    getLatestBlogPostMock.mockImplementation(() => mockPost);
    const res = await request(app).get("/api/posts/latest");
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ post: mockPost });
  });
});
