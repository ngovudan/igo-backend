import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUserCreds(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email)

    console.log('user', user)

    if (!user) throw new BadRequestException()

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException()

    return user
  }

  async generateToken(loginDto: any) {
    console.log('loginDto', loginDto)

    const { email, password } = loginDto
    const user: any = await this.userService.getUserByEmail(email)

    console.log('user', user)

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        email: user.email,
        sub: user._id,
        role: user.role
      }
      return {
        access_token: this.jwtService.sign(payload)
      }
    }
    return null
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
