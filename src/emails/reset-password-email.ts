import { BaseEmail } from './base-email';

export class ResetPasswordEmail extends BaseEmail {
  protected template: string = 'password-reset';
  protected subject: string =
    'Your password reset token (value for only 15 minutes)';
}
