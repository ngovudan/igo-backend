import { UserService } from './../user/user.service'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as SendGrid from '@sendgrid/mail'
import VerificationTokenPayload from './verificationTokenPayload.interface'
import { EmailConfirmationService } from './email-confirmation.service'
import ConfirmEmailDto from './dtos'

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  @Post('confirm')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token
    )
    await this.emailConfirmationService.confirmEmail(email)
  }

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request: any) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }

  
}
