/**
 * Configuration for the application
 */
export class AppConfig {
  readonly domainName: string;
  readonly metadataTable: string;
  readonly subscribersTable: string;
  readonly recaptchaSecretId: string;

  static fromEnvironment(env = process.env): AppConfig {
    const domainName = env.DOMAIN_NAME;
    if (!domainName) {
      throw new Error("DOMAIN_NAME not configured in environment");
    }
    const metadataTable = env.BLOG_TABLE;
    if (!metadataTable) {
      throw new Error("BLOG_TABLE not configured in environment");
    }
    const subscribersTable = env.SUBSCRIBERS_TABLE;
    if (!subscribersTable) {
      throw new Error("SUBSCRIBERS_TABLE not configured in environment");
    }
    const recaptchaSecretId = env.RECAPTCHA_SECRET_ID;
    if (!recaptchaSecretId) {
      throw new Error("RECAPTCHA_SECRET_ID not configured in environment");
    }
    return new AppConfig(domainName, metadataTable, subscribersTable, recaptchaSecretId);
  }

  constructor(domainName: string, metadataTable: string, subscribersTable: string, recaptchaSecretId: string) {
    this.domainName = domainName;
    this.metadataTable = metadataTable;
    this.subscribersTable = subscribersTable;
    this.recaptchaSecretId = recaptchaSecretId;
  }
}
