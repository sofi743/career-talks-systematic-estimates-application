import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { HttpUtils } from '../../../utils/http.utils';
import { Configuration } from '../../../models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly configurationUrl: string = 'configuration';
  private readonly saveEndpoint: string = 'save';
  private readonly getEndpoint: string = 'find-all';
  private readonly port: number = 8080;

  private _configuration$: BehaviorSubject<Configuration> = new BehaviorSubject(null);
  public get configuration$() {
    return this._configuration$.asObservable();
  }

  constructor(private http: HttpClient) {
    this.getConfiguration().subscribe(config => this._configuration$.next(config?.[0]));
  }

  public saveConfiguration(configuration: Configuration, id: number): Observable<Configuration> {
    return this.http
      .post<Configuration>(
        `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.configurationUrl}/${this.saveEndpoint}`,
        configuration,
        { params: { id } }
      )
      .pipe(
        take(1),
        tap(configuration => this._configuration$.next(configuration))
      );
  }

  public getConfiguration(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.configurationUrl}/${this.getEndpoint}`
    );
  }
}
