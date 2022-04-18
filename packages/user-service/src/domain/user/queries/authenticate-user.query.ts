export class AuthenticateUserQuery {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
