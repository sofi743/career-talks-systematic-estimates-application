import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpUtils } from '../utils/http.utils';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {
  private readonly dashboardServiceUrl: string = HttpUtils.SERVICE_URL;
  private readonly getLobbyEndpoint: string = `${this.dashboardServiceUrl}/lobby-launcher/get-port`;
  private portSubject$: ReplaySubject<number> = new ReplaySubject<number>(1);

  constructor(private http: HttpClient) {}

  public start(): void {
    this.setPort(8080);
  }

  public getPort$(): Observable<number> {
    return this.portSubject$.asObservable();
  }

  private setPort(port: number) {
    return this.portSubject$.next(port);
  }
}
