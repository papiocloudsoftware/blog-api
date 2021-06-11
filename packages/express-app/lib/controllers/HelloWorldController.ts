import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

interface HelloResponse {
  readonly message: string;
}

/**
 * Example controller for overnightjs
 */
@Controller("api")
export class HelloWorldController {
  @Get("hello")
  hello(req: Request, res: Response) {
    return res
      .json({
        message: "Hello, World!"
      })
      .send();
  }
}
