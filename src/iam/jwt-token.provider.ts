import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { User } from "../users/entity/user.entity";
import { JwtService } from "@nestjs/jwt";
import jwtConfig from "../app-config/jwt/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class JwtTokenProvider {
  private readonly logger = new Logger("JwtTokenProvider");
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

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
  async generateToken(user: User): Promise<{ token: string }> {
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
