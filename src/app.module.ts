import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AppConfigModule } from "./app-config/app.config.module";
import { IamModule } from "./iam/iam.module";
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [UsersModule, AuthModule, AppConfigModule, IamModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
