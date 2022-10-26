import { Body, Controller, Post } from '@nestjs/common';
import { SendgridService } from './sendgrid.service';

@Controller('email')
export class EmailController {
  constructor(private readonly sendgridService: SendgridService) {}

  @Post('send-email')
  async sendEmail(@Body() payload) {
    const mail = {
      to: payload.toemail,
      subject: 'Hello from sendgrid',
      templateId: 'd-5ed53cb5c36b4ee5a75f96b1f9999296',
      from: 'danngo2000@gmail.com', // Fill it with your validated email on SendGrid account
      dynamicTemplateData: {
        name: 'Some One',
        city: 'Denver'
      }
    }

    return await this.sendgridService.send(mail)
  }
}
