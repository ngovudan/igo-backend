import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/user/user.schema'
import { Model } from 'mongoose'
import { CreateAndUpdateUserDto } from './dtos'
import * as bcrypt from 'bcrypt'
const saltOrRounds = 10

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async listUsers(options: any): Promise<any> {
    const { page = 1, limit = 16 } = options

    const [docs, total] = await Promise.all([
      this.userModel
        .find()
        .select('-__v')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .select('-__v'),
      this.userModel.countDocuments()
    ])

    return {
      docs,
      $metadata: { total, page, limit }
    }
  }

  async createUser(createUserDto: CreateAndUpdateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds)
    createUserDto.password = hash
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }

  async getUserById(id: string): Promise<any> {
    const user = this.userModel.findById(id).select('-__v')
    return user
  }

  async updateUser(id: string, updateuserDto: any): Promise<User> {
    const user = await this.userModel.findById(id)
    const hash = await bcrypt.hash(updateuserDto.password, saltOrRounds)
    user.set(updateuserDto)
    user.password = hash
    await user.save()

    return user
  }

  async updateBulk(bulkUserDto: any): Promise<string> {
    const { userIds, enabled } = bulkUserDto

    await this.userModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { enabled } }
    )
    return 'Success'

    return
  }

  async deleteUser(id: string): Promise<string> {
    await this.userModel.findByIdAndDelete(id)
    return 'Success'
  }

  async deleteBulk(bulkUserDto: any): Promise<any> {
    try {
      const { userIds } = bulkUserDto
      const promises = []

      for (const userId of userIds) {
        promises.push(this.deleteUser(userId))
      }
      await Promise.all(promises)

      return 'Success'
    } catch (error) {
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email })
  }

  async getUserByName(username: any): Promise<any> {
    return this.userModel.findOne({ username })
  }

  async markEmailAsConfirmed(email: string) {
    return this.userModel.update(
      { email },
      {
        isEmailConfirmed: true
      }
    )
  }
}
