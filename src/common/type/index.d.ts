import IAuthPayload from 'src/common/interface/auth-payload.interface';

declare global {
  namespace Express {
    export interface Request {
      headers: { authorization: string };
      user: IAuthPayload;
    }
  }
}
