import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { EmailController } from './email.controller'
import { SendgridService } from './sendgrid.service'

@Module({
  controllers: [EmailController],
  providers: [EmailService, SendgridService]
})
export class EmailModule {}
