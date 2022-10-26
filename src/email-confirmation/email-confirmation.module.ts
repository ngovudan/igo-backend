import { Module } from '@nestjs/common'
import { EmailConfirmationService } from './email-confirmation.service'
import { EmailConfirmationController } from './email-confirmation.controller'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'core/schemas/user.schema'

@Module({
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, JwtService, UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ]
})
export class EmailConfirmationModule {}
