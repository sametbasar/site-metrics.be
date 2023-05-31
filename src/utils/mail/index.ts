/* eslint-disable import/no-extraneous-dependencies */
import handlebars from 'handlebars';
import {  createTransport } from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { MailTemplates } from '../../@types/enums/mail-templates';
import { getConfigration } from '../api/store/configration';

class Mailer { 

  private async createTransport() {
    const transporter = createTransport({
      host: 'webmail.retodi.com',
      port: 587,
      secure: false, 
      tls:{
        rejectUnauthorized:false,
      },
      auth: {
        user: 'vercel@retodi.com',
        pass: process.env.MAIL_PASSWORD ?? '',
      },
    });

    const verify = await transporter.verify();
    if (verify) return transporter;

    return null;
  }

  private async getMailList() {
    return getConfigration('MailSenderList');
  }

  private async getHTMLTemplate({ templateName, message, reportLink }:{ templateName:MailTemplates, message:string, reportLink:string }) {
    const filePath = path.join(process.cwd(), `src/templates/${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      message,
      reportLink,
    };
    const htmlToSend = template(replacements);

    return htmlToSend;
  }

  public async sendMail({ templateName, message, reportLink }:{ templateName:MailTemplates, message:string, reportLink:string }) {
    const transporter = await this.createTransport();
    if (transporter) {
      const info = await transporter.sendMail({
        from: '"Retodi Team" <vercel@retodi.com>',
        to: await this.getMailList(),
        subject: 'Retodi <Alert>',
        text:'Retodi Alert',
        html: await this.getHTMLTemplate({ templateName, message, reportLink }),
      });

      console.log('messageId', info.messageId); 
    }
  }
}

export const mailer = new Mailer();
