import { Controller, Delete, Post } from "@overnightjs/core";
import { Request, Response } from "express";

import { CaptchaService, SubscriberService } from "../service";

/**
 * API Controller for subscription handling for the blog.  Listing and emailing
 * subscribers should be handled by a separate service that is not publicly accessible.
 */
@Controller("api")
export class SubscriptionController {
  readonly subscriberService: SubscriberService;
  readonly captchaService: CaptchaService;

  constructor(subscriberService = new SubscriberService(), captchaService = new CaptchaService()) {
    this.subscriberService = subscriberService;
  }

  @Post("subscribers")
  async subscribe(req: Request, res: Response) {
    const email = req.body.email;
    if (!email) {
      return res.status(400).send();
    }
    const captcha = req.body.captcha;
    if (!captcha) {
      return res.status(400).send();
    }
    try {
      const valid = await this.captchaService.validate(captcha);
      if (!valid) {
        // TODO: Better code for invalid captcha?
        return res.status(400);
      }

      await this.subscriberService.subscribe(email);
      return res.status(200).send();
    } catch (e) {
      console.error(e.message, e);
      return res.status(500).send();
    }
  }

  @Delete("subscribers/:id")
  async unsubscribe(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send();
    }
    try {
      await this.subscriberService.unsubscribe(id);
      return res.status(200).send();
    } catch (e) {
      console.error(e.message, e);
      return res.status(500).send();
    }
  }

  @Post("subscribers/:id/confirm")
  async confirm(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send();
    }
    try {
      await this.subscriberService.confirm(id);
      return res.status(200).send();
    } catch (e) {
      console.error(e.message, e);
      return res.status(500).send();
    }
  }
}
