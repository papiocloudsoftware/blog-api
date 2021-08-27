import * as AWS from "aws-sdk";
import * as axios from "axios";
import * as FormData from "form-data";

import { AppConfig } from "../config";

/**
 * Service for validating captcha responses
 */
export class CaptchaService {
  static readonly VALIDATION_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";

  readonly config: AppConfig;
  readonly axios: axios.AxiosInstance;
  readonly secretsManager: AWS.SecretsManager;

  constructor(
    config = AppConfig.fromEnvironment(),
    client: axios.AxiosInstance = axios.default,
    secretsManager = new AWS.SecretsManager()
  ) {
    this.config = config;
    this.secretsManager = secretsManager;
  }

  private get secretId() {
    return this.config.recaptchaSecretId;
  }

  async validate(clientValue: string): Promise<boolean> {
    const secretResponse = await this.secretsManager.getSecretValue({ SecretId: this.secretId }).promise();
    const secretValue = secretResponse.SecretBinary;
    const formData = new FormData();
    formData.append("secret", secretValue);
    formData.append("response", clientValue);
    const response = await this.axios.post(CaptchaService.VALIDATION_ENDPOINT, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data.success;
  }
}
