/* eslint-disable */
declare global {
  namespace Express {
    interface Request {
      user?: any;
      auth?: any;
    }
  }
}

export {};
