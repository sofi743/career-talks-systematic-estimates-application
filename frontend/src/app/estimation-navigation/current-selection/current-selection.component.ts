import { Component, OnDestroy, OnInit } from '@angular/core';
import { JoinService } from '../../services/join.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { EstimationNavigationService } from '../services/estimation-navigation.service';
import { ConfigurationService } from '../../create-ifd/src/services/configuration.service';
import { EstimationType } from '../../models/estimation-type.model';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.scss']
})
export class CurrentSelectionComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public selectedMvp: string;
  public selectedTask: string;
  public currentConfiguration: string;

  constructor(
    private estimationNavigationService: EstimationNavigationService,
    private configurationService: ConfigurationService
  ) {}

  public ngOnInit() {
    this.setCurrentMVP();
    this.setCurrentTask();
    this.setCurrentConfiguration();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setCurrentMVP(): void {
    this.estimationNavigationService
      .getSelectedMvp$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedMvp = value;
      });
  }

  private setCurrentTask(): void {
    this.estimationNavigationService
      .getSelectedTask$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedTask = value;
      });
  }

  private setCurrentConfiguration(): void {
    this.configurationService
      .getConfiguration()
      .pipe(
        takeUntil(this.destroy$),
        filter(configurations => !!configurations)
      )
      .subscribe(configurations => {
        const estimationType = configurations[0]?.estimationType;
        switch (estimationType) {
          case EstimationType.DAYS: {
            this.currentConfiguration = '3PEst - days';
            break;
          }
          case EstimationType.HOURS: {
            this.currentConfiguration = '3PEst - hours';
            break;
          }
          default:
            break;
        }
      });
  }
}
