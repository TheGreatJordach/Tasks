import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>("APP_PORT");
  const prefix: string = configService.get<string>("APP_PREFIX");

  app.setGlobalPrefix(prefix);
  await app.listen(port);
}
bootstrap();
