import { UserService } from 'src/user/user.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { EmailService } from 'src/email/email.service'
import * as SendGrid from '@sendgrid/mail'
import VerificationTokenPayload from './verificationTokenPayload.interface'

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'))
  }

  async sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email }
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME'
      )}s`
    })

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL'
    )}?token=${token}`

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`

    const mail = {
      to: payload.email,
      subject: 'Hello from sendgrid',
      templateId: 'd-ad032cc5743841f390edf287c0d39c60',
      from: 'danngo2000@gmail.com', // Fill it with your validated email on SendGrid account
      dynamicTemplateData: {
        name: 'Vu Dan',
        text: `Welcome to the application. To confirm the email address, click here: ${url}`
      }
    }

    const transport = await SendGrid.send(mail)

    return transport
  }

  public async confirmEmail(email: string) {
    const user = await this.userService.getUserByEmail(email)
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed')
    }
    await this.userService.markEmailAsConfirmed(email)
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET')
      })

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email
      }
      throw new BadRequestException()
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired')
      }
      throw new BadRequestException('Bad confirmation token')
    }
  }

  public async resendConfirmationLink(userId: string) {
    const user = await this.userService.getUserById(userId)
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed')
    }
    await this.sendVerificationLink(user.email)
  }
}
