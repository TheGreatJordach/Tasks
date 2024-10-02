import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { HashAlgoInterface } from "./hash-algo.interface";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

/**
 * Asynchronously generates a bcrypt hash for the provided data.
 *
 * @param data - The data to be hashed, can be a string or a Buffer.
 * @returns A Promise that resolves to the generated bcrypt hash.
 * @throws InternalServerErrorException if an error occurs during the hashing process.
 */
@Injectable()
export class BcryptProvider implements HashAlgoInterface {
  private readonly logger = new Logger("IAMHashProvider");
  constructor(private readonly configService: ConfigService) {}

  /**
   * Asynchronously generates a bcrypt hash for the provided data.
   *
   * @param data - The data to be hashed, can be a string or a Buffer.
   * @returns A Promise that resolves to the generated bcrypt hash.
   * @throws InternalServerErrorException if an error occurs during the hashing process.
   */
  async hash(data: string | Buffer): Promise<string> {
    try {
      const saltRounds =
        this.configService.getOrThrow<number>("SALT_ROUND") || 12;
      this.logger.log(`IAM-Hash: saltRounds i${saltRounds} `);
      const salt = await bcrypt.genSalt(saltRounds);
      this.logger.log(`IAM-Hash: salt i${salt} `);
      return await bcrypt.hash(data, salt);
    } catch (error) {
      this.logger.log("IAM-HashProvider hash failed", error.message);
      this.logger.log(`Code error, ${error.code}`);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Asynchronously compares the provided data with an encrypted string using bcrypt.
   *
   * @param data - The data to compare, can be a string or a Buffer.
   * @param encrypted - The encrypted string to compare the data against.
   * @returns A Promise that resolves to true if the data matches the encrypted string, false otherwise.
   * @throws UnauthorizedException if an error occurs during the comparison process.
   */
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    try {
      return await bcrypt.compare(data, encrypted);
    } catch (error) {
      this.logger.log("IAM-HashProvider compare", error.message);
      this.logger.log(`Code error, ${error.code}`);
      throw new UnauthorizedException();
    }
  }
}
