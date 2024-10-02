import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { BcryptProvider } from "./password/bcrypt.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { AuthenticationController } from "./authentication/authentication.controller";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "../app-config/jwt/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { AccessTokenGuard } from "./authentication/guards/access-token.guard";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";
import { PasswordService } from "./password/password.service";
import { JwtTokenProvider } from "./jwt-token.provider";
import { UsersService } from "../users/users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UsersService,
  ],
  providers: [
    JwtTokenProvider,
    PasswordService,
    AuthenticationService,
    BcryptProvider,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
  controllers: [AuthenticationController],
  exports: [],
})
export class IamModule {}
