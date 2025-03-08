import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Ifd } from '../../../models/ifd.model';
import { HttpUtils } from '../../../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class CreateIfdService {
  private readonly ifdUrl: string = 'ifds';
  private readonly saveIfdEndpoint: string = 'save';
  private readonly findOneIfdEndpoint: string = 'find-one';
  private ifd$: BehaviorSubject<Ifd> = new BehaviorSubject<Ifd>(null);

  constructor(private http: HttpClient) {}

  public getAndInitializeIfd(): Observable<Ifd> {
    return this.insertIfd().pipe(
      tap(ifd => {
        this.ifd$.next(ifd);
      }),
      take(1),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * inserts an Ifd in the database or gets the existent one
   * @param ifd
   */
  public insertIfd(): Observable<Ifd> {
    const ifd: Ifd = {
      mvps: [],
      totalEstimation: { best: 0, likely: 0, worst: 0, riskBuffer: 0 }
    };
    return this.http.post<Ifd>(`http://${HttpUtils.HOSTNAME_URL}:8080/${this.ifdUrl}/${this.saveIfdEndpoint}`, ifd);
  }

  /**
   * finds the one ifd in the table. If none, returns null
   */
  public getExistentIfd(): Observable<Ifd> {
    return this.http.get<Ifd>(`http://${HttpUtils.HOSTNAME_URL}:8080/${this.ifdUrl}/${this.findOneIfdEndpoint}`);
  }
}
