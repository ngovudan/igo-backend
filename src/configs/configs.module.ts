import { Module } from '@nestjs/common';
import { ConfigsService } from './configs.service';
import { ConfigsController } from './configs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/core/schemas/config.schema';

@Module({
  controllers: [ConfigsController],
  providers: [ConfigsService],
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
  ],
})
export class ConfigsModule {}
