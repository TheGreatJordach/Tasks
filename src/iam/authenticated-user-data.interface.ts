export interface AuthUserData {
  /**
   * The "subject" of the token. The value of this property is the user ID
   * that granted this token
   */
  sub: number;

  /**
   * the subject's (user) email.
   * */
  email: string;
}
