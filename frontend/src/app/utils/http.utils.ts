export class HttpUtils {
  static readonly HOSTNAME_URL: string = window.location.hostname;
  static readonly SERVICE_URL: string = `http://${HttpUtils.HOSTNAME_URL}:8080`;
  static readonly USER_STORAGE_KEY = 'savedUser';
}
