import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mvp } from '../../../models/mvp.model';
import { HttpUtils } from '../../../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class MvpService {
  private readonly mvpUrl: string = 'mvps';
  private readonly saveEndpoint: string = 'save';
  private readonly deleteEndpoint: string = 'delete';
  private readonly findEndpoint: string = 'find';
  private readonly updateEndpoint: string = 'update';
  private readonly port: string = '8080'; // Hardcoded port

  constructor(private http: HttpClient) {}

  public addMvp(mvp: Mvp): Observable<Mvp> {
    return this.http.post<Mvp>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.mvpUrl}/${this.saveEndpoint}`,
      mvp
    );
  }

  public deleteMvp(mvp: Mvp): Observable<void> {
    return this.http.delete<void>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.mvpUrl}/${this.deleteEndpoint}`,
      {
        params: { id: mvp.id }
      }
    );
  }

  public findMvp(id: number): Observable<Mvp> {
    return this.http.get<Mvp>(`http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.mvpUrl}/${this.findEndpoint}`, {
      params: { id }
    });
  }

  public update(mvp: Mvp, id: number): Observable<Mvp> {
    return this.http.put<Mvp>(
      `http://${HttpUtils.HOSTNAME_URL}:${this.port}/${this.mvpUrl}/${this.updateEndpoint}`,
      mvp,
      {
        params: { id }
      }
    );
  }
}
