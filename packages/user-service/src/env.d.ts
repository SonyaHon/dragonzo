declare namespace NodeJs {
  interface ProcessEnv {
    JWT_SIGN_SECRET: string;
    JWT_EXPIRATION: string;
    REFRESH_TOKEN_LIFETIME: string;
  }
}
