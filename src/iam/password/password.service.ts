import { Injectable, Logger } from "@nestjs/common";
import { BcryptProvider } from "./bcrypt.provider";

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);
  constructor(private readonly bcryptProvider: BcryptProvider) {}

  async hasPassword(data: string | Buffer): Promise<string> {
    return await this.bcryptProvider.hash(data);
  }
  async comparePassword(
    data: string | Buffer,
    encryptedPassword: string
  ): Promise<boolean> {
    return await this.bcryptProvider.compare(data, encryptedPassword);
  }
}
