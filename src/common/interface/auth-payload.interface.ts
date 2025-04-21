export interface IAuthPayload {
  email: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
