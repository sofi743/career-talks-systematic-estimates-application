import { Injectable } from '@angular/core';
import { Ifd } from '../../models/ifd.model';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { HttpUtils } from '../../utils/http.utils';
import { InitializationService } from '../../services/initialization.service';

@Injectable({
  providedIn: 'root'
})
export class IfdTotalService {
  private totalEstimationUrl: string = 'total-estimations';
  private updateTotalsEndpoint: string = 'update-totals-and-comments';

  constructor(private http: HttpClient, private initializationService: InitializationService) {}

  public updateTotalsAndComments(ifd: Ifd) {
    return this.initializationService.getPort$().pipe(
      switchMap(port => {
        return this.http.put<Ifd>(
          `http://${HttpUtils.HOSTNAME_URL}:${port}/${this.totalEstimationUrl}/${this.updateTotalsEndpoint}`,
          ifd
        );
      })
    );
  }
}
