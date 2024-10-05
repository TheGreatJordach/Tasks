import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

import { SignUpDto } from "../users/dto/sign-up.dto";
import { LogInDto } from "../users/dto/log-in.dto";
import { PasswordService } from "./password/password.service";
import { JwtTokenProvider } from "./jwt-token.provider";
import { UsersService } from "../users/users.service";

/**
 * Service handling user authentication and registration operations.
 *
 * Provides methods for user registration, login, checking email availability,
 * creating new users, and generating JWT access tokens.
 */
@Injectable()
export class IamService {
  private readonly logger = new Logger("IAMService");
  constructor(
    private readonly userService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenProvider: JwtTokenProvider
  ) {}

  /**
   * Registers a new user by creating a user entity with the provided sign-up information.
   *
   * Checks if the email is already in use, hashes the password, saves the user to the repository,
   * and generates a token for the new user. Throws ConflictException if email is in use,
   * InternalServerErrorException if hashing fails or saving the user fails.
   *
   * @param signUpDto - The data transfer object containing the user's sign-up information.
   * @returns A promise that resolves to an object with a token for the newly registered user.
   */
  async registration(signUpDto: SignUpDto): Promise<{ token: string }> {
    const storedUser = await this.userService.ifEmailUsed(signUpDto.email);
    if (storedUser) {
      throw new ConflictException();
    }

    const hashedPassword = await this.passwordService.hasPassword(
      signUpDto.password
    );
    if (!hashedPassword) {
      this.logger.log("IAM Failed with hash Provider");
      throw new InternalServerErrorException();
    }

    const savedUser = await this.userService.createUser(
      signUpDto,
      hashedPassword
    );

    if (!savedUser) {
      this.logger.log("IAM Failed to save new User");
      throw new InternalServerErrorException("Database error");
    }

    return await this.jwtTokenProvider.generateToken(savedUser);
  }

  /**
   * Asynchronously logs in a user by verifying the provided login credentials.
   *
   * This method checks if the email exists in the database, then compares the provided password
   * with the stored encrypted password. If the credentials are valid, it returns a success message.
   *
   * @param logInDto - The data transfer object containing the user's login information.
   * @returns A promise that resolves to an object with a success message upon successful login.
   * @throws UnauthorizedException if the login credentials are invalid.
   */
  async login(logInDto: LogInDto): Promise<{ token: string }> {
    const storedUser = await this.userService.ifEmailUsed(logInDto.email);
    if (!storedUser) {
      this.logger.log("IAM-SignUp Failed to signIn");
      throw new UnauthorizedException();
    }
    const isSamePassword: boolean = await this.passwordService.comparePassword(
      logInDto.password,
      storedUser.password
    );
    if (!isSamePassword) {
      this.logger.log("IAM-SignUp Failed to signIn");
      throw new UnauthorizedException();
    }

    return await this.jwtTokenProvider.generateToken(storedUser);
  }
}
