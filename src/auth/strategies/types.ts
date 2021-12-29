export enum PassportStrategyName {
  JWT = 'jwt',
  JWT_REFRESH = 'jwt-refresh',
}

export type JWTValidatePayload = {
  sub: string;
  email: string;
};
