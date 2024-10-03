import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AppConfigModule } from "./app-config/app.config.module";
import { IamModule } from "./iam/iam.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [UsersModule, AppConfigModule, IamModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
