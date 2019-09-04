/**
 * Interfaces used to format data correctly between client and server
 * @todo Sometime in the future implement standard REST API responses
 * https://jsonapi.org/examples/
 * https://jsonapi.org/examples/#pagination
 */

/* An interface to implement later when we follow strict RESTful API's
export interface Response<D, I = {}> {
  data: D;
  links?: {};
  meta?: {};
  included?: I;
}
*/

/**
 * Error interface
 * https://jsonapi.org/examples/#error-objects
 */
export interface Error {
  status?: number;
  source?: { pointer?: string };
  title?: string;
  detail: string;
}

/** How the jwt will be sent to the client */
export interface Token { token: string; }

/** How the jwt will be formatted */
export interface JwtContent { id: number; }
