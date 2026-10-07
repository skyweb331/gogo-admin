import { gql } from "@/__generated__";

export const LOGIN = gql(`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
      mfaRequired
      mfaToken
      totpSetupRequired
    }
  }
`);

export const VERIFY_ADMIN_TOTP = gql(`
  mutation VerifyAdminTotp($data: TotpInput!) {
    verifyAdminTotp(data: $data) {
      accessToken
    }
  }
`);

export const BEGIN_TOTP_SETUP = gql(`
  mutation BeginTotpSetup($mfaToken: String!) {
    beginTotpSetup(mfaToken: $mfaToken) {
      secret
      otpauthUrl
    }
  }
`);

export const CONFIRM_TOTP_SETUP = gql(`
  mutation ConfirmTotpSetup($data: TotpInput!) {
    confirmTotpSetup(data: $data) {
      accessToken
    }
  }
`);

export const REQUEST_PASSWORD_RESET = gql(`
  mutation RequestPasswordReset($data: RequestPasswordResetInput!) {
    requestPasswordReset(data: $data) {
      success
    }
  }
`);

export const RESET_PASSWORD = gql(`
  mutation ResetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data) {
      success
    }
  }
`);
