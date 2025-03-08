import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private readonly localizationJsonUrl = '../../assets/jsons/localization.json';
  private localizationValues$: ReplaySubject<any> = new ReplaySubject<any>();

  constructor(private http: HttpClient) {}

  public start() {
    this.getLocalizationValues().subscribe(values => this.localizationValues$.next(values));
  }

  private getLocalizationValues(): Observable<any> {
    return this.http.get<any>(this.localizationJsonUrl);
  }

  public getLocalizationValues$() {
    return this.localizationValues$.asObservable();
  }
}
