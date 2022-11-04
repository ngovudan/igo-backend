import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config, ConfigDocument } from 'src/core/schemas/config.schema';
import { Model } from 'mongoose';
import { CreateConfigDto } from './dtos';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectModel(Config.name)
    private configModel: Model<ConfigDocument>,
  ) {}
  async createOrUpdateMany(createConfigDtoArray: CreateConfigDto[]) {
    const promises = [];
    for (const createConfigDto of createConfigDtoArray) {
      promises.push(this.createOrUpdate(createConfigDto));
    }
    return Promise.all(promises);
  }

  public async createOrUpdate(createConfigDto: CreateConfigDto) {
    let config = await this.configModel.findOne({ key: createConfigDto.key });

    if (!config) config = new this.configModel(createConfigDto);
    else {
      config.set(createConfigDto);
    }

    return config.save();
  }

  async getMany(keys: string[]): Promise<Config[]> {
    return this.configModel.find({ key: keys }).lean();
  }
}
