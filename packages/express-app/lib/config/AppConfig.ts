/**
 * Configuration for the application
 */
export class AppConfig {
  readonly metadataTable: string;

  static fromEnvironment(): AppConfig {
    const metadataTable = process.env.BLOG_TABLE;
    if (!metadataTable) {
      throw new Error("BLOG_TABLE not configured in environment");
    }
    return new AppConfig(metadataTable);
  }

  constructor(metadataTable: string) {
    this.metadataTable = metadataTable;
  }
}
