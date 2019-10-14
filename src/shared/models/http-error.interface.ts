/**
 * Error interface
 * https://jsonapi.org/examples/#error-objects
 */
export interface IHttpError {
  status?: number;
  source?: { pointer?: string };
  title?: string;
  detail: string;
}
