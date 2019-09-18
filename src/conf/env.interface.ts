/**
 * Interface defining how to structure your environment objects
 * @author Tristan Mastrodicasa
 */
export interface Env {
  host: string;
  database_username: string;
  database_password: string;
  google_redirect_url: string;
  google_client_id: string;
  google_client_secret: string;
  rebuild_database: boolean;
  jwt_key: string;
}
