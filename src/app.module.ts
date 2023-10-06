import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {Provider} from "./provider";
import {UserRepo} from "./user-repo";

@Module({
  imports: [],
  controllers: [AppController, Provider],
  providers: [AppService, UserRepo],
})
export class AppModule {}
