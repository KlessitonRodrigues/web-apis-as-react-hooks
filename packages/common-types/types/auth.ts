export namespace Auth {
  export interface AuthUser {
    userId?: string;
    email?: string;
    userName?: string;
    password?: string;
    recoveryCode?: string;
    recoveryCodeExpiry?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface SignInRequest {
    email?: string;
    password?: string;
  }

  export interface GoogleSignInRequest {
    token?: string;
  }

  export interface GithubSignInRequest {
    code?: string;
  }

  export interface SignUpRequest {
    email?: string;
    userName?: string;
    password?: string;
  }

  export interface SendRecoveryCodeRequest {
    email?: string;
  }

  export interface VerifyRecoveryCodeRequest {
    email?: string;
    code?: string;
  }

  export interface ResetPasswordRequest {
    newPassword?: string;
    token?: string;
  }
}
