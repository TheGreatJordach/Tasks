import { Body, Controller, Logger, Post } from "@nestjs/common";
import { IamService } from "../iam.service";
import { SignUpDto } from "../../users/dto/sign-up.dto";
import { LogInDto } from "../../users/dto/log-in.dto";
import { AuthType } from "./enum/auth-type.enum";
import { Auth } from "./decorators/auth.decorators";

@Auth(AuthType.None)
@Controller("")
export class AuthenticationController {
  private readonly logger = new Logger("AuthenticationController");
  constructor(private readonly iamService: IamService) {}

  @Post("register")
  async registration(@Body() signUpDto: SignUpDto) {
    return await this.iamService.registration(signUpDto);
  }

  @Post("login")
  async login(@Body() logInDto: LogInDto) {
    return await this.iamService.login(logInDto);
  }
}
