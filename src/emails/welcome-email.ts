import { BaseEmail } from './base-email';

export class WelcomeEmail extends BaseEmail {
  protected subject: string = 'Welcome to Blog cms family';
  protected template: string = 'welcome';
}
