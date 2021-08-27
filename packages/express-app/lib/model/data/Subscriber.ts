/**
 * Data model for a blog subscriber
 */
export interface Subscriber {
  readonly id: string;
  readonly email: string;
  readonly validated: boolean;
}
