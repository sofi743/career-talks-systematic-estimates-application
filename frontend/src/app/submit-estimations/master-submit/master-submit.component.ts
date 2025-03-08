import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalizationService } from '../../services/localization.service';
import { CurrentInfoModel } from '../../models/current-info.model';
import { Subject, takeUntil } from 'rxjs';
import {CurrentEstimationService} from "../../services/current-estimation.service";

@Component({
  selector: 'app-master-submit',
  templateUrl: './master-submit.component.html',
  styleUrls: ['./master-submit.component.scss']
})
export class MasterSubmitComponent implements OnInit, OnDestroy {
  public currentlyEstimating: string = '';
  protected _currentInfo: CurrentInfoModel = null;
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private currentEstimationService: CurrentEstimationService,
    private localizationService: LocalizationService
  ) {
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this._destroy$))
      .subscribe(data => {
        this.currentlyEstimating = data?.CURRENTLY_ESTIMATING;
      });
  }

  public ngOnInit(): void {
    if (this._currentInfo === null) {
      this._currentInfo = this.currentEstimationService.getCurrentTask();
    }
    this.currentEstimationService
      .currentIndexChanged()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => (this._currentInfo = this.currentEstimationService.getCurrentTask()));
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
