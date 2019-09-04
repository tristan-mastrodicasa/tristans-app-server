/**
 * Very rough type definitions for passport-google-authcode, not complete by any measure
 * @author Tristan Mastrodicasa
 */
declare module 'passport-google-authcode' {

  import * as oauth2 from 'passport-oauth2';

  /** @todo add types and interfaces for the passport-google-authcode module */

  /** Rough strategy class definition */
  export class Strategy extends oauth2.Strategy {

    constructor(
      options: { clientID: string, clientSecret: string, callbackURL: string },
      verifyFunction: (accessToken: string, refreshToken: string, profile: any, done: any) => void,
    );

  }

}
