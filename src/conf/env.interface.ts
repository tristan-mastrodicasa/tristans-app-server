/**
 * Interface defining how to structure your environment objects
 * @author Tristan Mastrodicasa
 */
export interface IEnv {
  production: boolean;
  host: string;
  database_host: string;
  database_port: number;
  database_username: string;
  database_password: string;
  google_redirect_url: string;
  google_client_id: string;
  google_client_secret: string;
  facebook_app_id: string;
  facebook_app_secret: string;
  rebuild_database: boolean;
  jwt_key: string;
}
