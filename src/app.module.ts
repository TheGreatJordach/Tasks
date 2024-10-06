import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AppConfigModule } from "./app-config/app.config.module";
import { IamModule } from "./iam/iam.module";
import { TasksModule } from "./tasks/tasks.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [UsersModule, AppConfigModule, IamModule, TasksModule, SearchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
