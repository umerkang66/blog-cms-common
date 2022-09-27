import path from 'path';
import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';

interface ToUser {
  name: string;
  email: string;
}

export abstract class BaseEmail {
  private toSend: string;
  private firstName: string;
  private from: string;
  protected abstract template: string;
  protected abstract subject: string;
  protected abstract templatePath: string;

  constructor(toUser: ToUser, private url: string) {
    this.toSend = toUser.email;
    this.firstName = toUser.name.split(' ')[0];
    this.from = `Umer Gulzar <${process.env.EMAIL_FROM}>`;
  }

  // create the transporter
  // transporter is the server that will send the emails, because it is not node js that send the emails in development it is mail trap, and in production it is sendGrid
  private createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      // @ts-ignore
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  public async send(): Promise<void> {
    const html = pug.renderFile(this.templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject: this.subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.toSend,
      subject: this.subject,
      html,
      text: htmlToText(html),
    };

    const transporter = this.createTransport();
    await transporter.sendMail(mailOptions);
  }
}
