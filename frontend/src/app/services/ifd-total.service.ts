import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpUtils } from '../utils/http.utils';

@Injectable({
  providedIn: 'root'
})
export class IfdTotalService {
  private totalEstimationUrl: string = 'total-estimations';
  private saveIfdTotalsEndpoint: string = 'save-ifd-total';
  constructor(private http: HttpClient) {}

  public saveIfdTotals() {
    return this.http.post<void>(
      `http://${HttpUtils.HOSTNAME_URL}:8080/${this.totalEstimationUrl}/${this.saveIfdTotalsEndpoint}`,
      null
    );
  }
}
