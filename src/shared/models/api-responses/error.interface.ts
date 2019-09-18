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
