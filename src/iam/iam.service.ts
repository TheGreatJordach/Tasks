import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { BcryptProvider } from "./password/bcrypt.provider";
import { SignUpDto } from "../users/dto/sign-up.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entity/user.entity";
import { Repository } from "typeorm";
import { LogInDto } from "../users/dto/log-in.dto";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../app-config/jwt/jwt.config";
import { ConfigType } from "@nestjs/config";

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
    private readonly bcryptProvider: BcryptProvider,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  private async hassPassword(data: string | Buffer): Promise<string> {
    return await this.bcryptProvider.hash(data);
  }
  private async comparePassword(
    data: string | Buffer,
    encryptedPassword: string
  ): Promise<boolean> {
    return await this.bcryptProvider.compare(data, encryptedPassword);
  }

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
    const storedUser = await this.ifEmailUsed(signUpDto.email);
    if (storedUser) {
      throw new ConflictException();
    }

    const hashedPassword = await this.bcryptProvider.hash(signUpDto.password);
    if (!hashedPassword) {
      this.logger.log("IAM Failed with hash Provider");
      throw new InternalServerErrorException();
    }

    const savedUser = await this.createUser(signUpDto, hashedPassword);

    if (!savedUser) {
      this.logger.log("IAM Failed to save new User");
      throw new InternalServerErrorException("Database error");
    }

    return await this.generateToken(savedUser);
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
  async login(logInDto: LogInDto): Promise<{ message: string }> {
    const storedUser = await this.ifEmailUsed(logInDto.email);
    if (!storedUser) {
      this.logger.log("IAM-SignUp Failed to signIn");
      throw new UnauthorizedException();
    }
    const isSamePassword: boolean = await this.bcryptProvider.compare(
      logInDto.password,
      storedUser.password
    );
    if (!isSamePassword) {
      this.logger.log("IAM-SignUp Failed to signIn");
      throw new UnauthorizedException();
    }

    return {
      message: "You are logged in",
    };
  }

  /**
   * Check if the provided email is already in use by querying the database.
   *
   * @param email - The email to check for availability.
   * @returns A Promise that resolves with the User object if the email is found otherwise resolves with null.
   * @throws Logs a warning if an error occurs during the database query.
   */
  private async ifEmailUsed(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.log("IAM User Not Found", email);
      this.logger.warn(`${error.code}`);
      return null;
    }
  }

  /**
   * Asynchronously creates a new user in the system.
   *
   * This function takes a sign-up data transfer object (DTO) and an encrypted password,
   * creates a new user entity, and saves it to the user repository. If the operation
   * fails, it logs the error and throws an InternalServerErrorException.
   *
   * @param signUpDto - An object containing the user's sign-up information.
   * @param encryptedPassword - The user's password, encrypted for security.
   * @returns A promise that resolves to the newly created User object.
   * @throws InternalServerErrorException if the user creation fails.
   */
  private async createUser(
    signUpDto: SignUpDto,
    encryptedPassword: string
  ): Promise<User> {
    try {
      const newUser: User = this.userRepository.create({
        ...signUpDto,
        password: encryptedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.log("IAM Failed to create new user", error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Asynchronously generates a JWT access token for a given user.
   *
   * This method creates a JSON Web Token (JWT) using the user's ID and email as the payload.
   * The token is signed with the specified secret and includes additional configuration
   * such as audience, issuer, and expiration time. If token generation fails, an error is logged
   * and an InternalServerErrorException is thrown.
   *
   * @param {User} user - The user object containing the user's ID and email.
   * @returns {Promise<{ token: string }>} A promise that resolves to an object containing the generated access token.
   * @throws {InternalServerErrorException} If token generation fails.
   */
  private async generateToken(user: User): Promise<{ token: string }> {
    try {
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl,
        }
      );
      return { token: accessToken };
    } catch (error) {
      this.logger.log("Failed to generate token", error);
      throw new InternalServerErrorException();
    }
  }
}
