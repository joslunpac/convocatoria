export class ApiConstants {
  // General
  public static API_HOST: string = 'http://localhost:';
  public static API_PORT: string = '8081';
  public static API_ENDPOINT: string = '/api';
  public static API_URL_ENDPOINT: string = this.API_HOST + this.API_PORT + this.API_ENDPOINT;

  // Auth
  public static API_URI_AUTH: string = '/auth';
  public static API_URL_AUTH: string = this.API_URL_ENDPOINT + this.API_URI_AUTH;
  public static API_METHOD_SIGNIN: string = '/signin';
  public static API_METHOD_SIGNUP: string = '/signup';
  public static API_METHOD_REFRESH: string = '/refresh';
  public static API_ROL_ADMINISTRADOR = 'ROLE_ADMINISTRADOR';
  public static API_ROL_MODERADOR = 'ROLE_MODERADOR';
  public static API_ROL_USUARIO = 'ROLE_USUARIO';
  public static TOKEN_EXPIRADO = 'Sesión caducada';

  // Cuenta
  public static API_URI_CUENTA: string = '/cuenta';
  public static API_URL_CUENTA: string = this.API_URL_ENDPOINT + this.API_URI_CUENTA;

  // Métodos
  public static API_URI_PRIVATE: string = '/private';
  public static API_METHOD_CARACTERES: string = '/caracteres';
  public static API_METHOD_ENTIDADES: string = '/entidades';
  public static API_METHOD_EVENTOS: string = '/eventos';
  public static API_METHOD_LUGARES: string = '/lugares';
  public static API_METHOD_PERSONAS: string = '/personas';
  public static API_METHOD_ROLES: string = '/roles';
  public static API_METHOD_TIPOS_ACTO_CULTO: string = '/tiposActoCulto';
  public static API_METHOD_TIPOS_BANDA: string = '/tiposBanda';
  public static API_METHOD_TIPOS_ENTIDAD: string = '/tiposEntidad';
  public static API_METHOD_TITULARES: string = '/titulares';
  public static API_METHOD_USUARIOS: string = '/usuarios';
  public static API_METHOD_BY_CRITERIA: string = 'ByCriteria';
}
