import { COMMON } from "../types/common";

export const dictionaries = {
  en: {
    REQUIRED: "Required field",
    INVALID_EMAIL: "Invalid email address",
    PASSWORD_MIN: "Password must be at least 6 characters",
    USERNAME_MIN: "Username must be at least 3 characters",
    CODE_MIN: "Code must be at least 6 characters",
    MUST_BE_POSITIVE: "Value must be a positive number",
    INVALID_REQUEST_BODY: "Invalid request body",
    USER_NOT_FOUND: "User not found",
    NO_ACCESS_TOKEN: "No access token received",
    NO_VERIFIED_EMAIL: "No verified email",
    INTERNAL_SERVER_ERROR: "Internal server error",
    FAILED_TO_FETCH_USER_INFO: "Failed to fetch user information",
    FAILED_TO_FETCH_ACCESS_TOKEN: "Failed to fetch access token",
    MISSING_TOKEN: "Missing token",
    INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
    SIGNED_OUT_SUCCESSFULLY: "Signed out successfully",
    ERROR_CREATING_USER: "Error creating user",
    USER_REGISTERED_SUCCESSFULLY: "User registered successfully",
    INVALID_RECOVERY_CODE: "Invalid recovery code",
    EXPIRED_RECOVERY_CODE: "Expired recovery code",
    MISSING_EMAIL_OR_CODE: "Missing email or code",
  },
  pt: {
    REQUIRED: "Campo obrigatório",
    INVALID_EMAIL: "Endereço de email inválido",
    PASSWORD_MIN: "A senha deve ter pelo menos 6 caracteres",
    USERNAME_MIN: "O nome de usuário deve ter pelo menos 3 caracteres",
    CODE_MIN: "O código deve ter pelo menos 6 caracteres",
    MUST_BE_POSITIVE: "O valor deve ser um número positivo",
    INVALID_REQUEST_BODY: "Corpo da requisição inválido",
    USER_NOT_FOUND: "Usuário não encontrado",
    NO_ACCESS_TOKEN: "Nenhum token de acesso recebido",
    NO_VERIFIED_EMAIL: "Nenhum email verificado",
    INTERNAL_SERVER_ERROR: "Erro interno do servidor",
    FAILED_TO_FETCH_USER_INFO: "Falha ao obter informações do usuário",
    FAILED_TO_FETCH_ACCESS_TOKEN: "Falha ao obter token de acesso",
    MISSING_TOKEN: "Token ausente",
    INVALID_EMAIL_OR_PASSWORD: "Email ou senha inválidos",
    SIGNED_OUT_SUCCESSFULLY: "Desconectado com sucesso",
    ERROR_CREATING_USER: "Erro ao criar usuário",
    USER_REGISTERED_SUCCESSFULLY: "Usuário registrado com sucesso",
    INVALID_RECOVERY_CODE: "Código de recuperação inválido",
    EXPIRED_RECOVERY_CODE: "Código de recuperação expirado",
    MISSING_EMAIL_OR_CODE: "Email ou código ausente",
  },
};

export const getDictionary = (lang?: COMMON.Language) => {
  return {
    lang: lang || "en",
    dictionary: dictionaries[lang || "en"],
  };
};
