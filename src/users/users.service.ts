import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "./dto/sign-up.dto";

@Injectable()
export class UsersService {
  private readonly logger = new Logger("UsersService");
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}
  /**
   * Check if the provided email is already in use by querying the database.
   *
   * @param email - The email to check for availability.
   * @returns A Promise that resolves with the User object if the email is found otherwise resolves with null.
   * @throws Logs a warning if an error occurs during the database query.
   */
  async ifEmailUsed(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.log("IAM User Not Found", email);
      this.logger.warn(`${error.message}`);
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
  async createUser(
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
}
