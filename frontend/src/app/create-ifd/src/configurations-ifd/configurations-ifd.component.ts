import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';
import { LocalizationService } from '../../../services/localization.service';
import { EstimationType } from '../../../models/estimation-type.model';
import { CreateIfdService } from '../services/create-ifd.service';
import { Ifd } from '../../../models/ifd.model';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { Configuration } from '../../../models/configuration.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-configurations-ifd',
  templateUrl: './configurations-ifd.component.html',
  styleUrls: ['./configurations-ifd.component.scss']
})
export class ConfigurationsIfdComponent implements AfterViewInit, OnDestroy {
  public complexity: number = null;
  public estimationType: EstimationType = null;
  public estimationName: string = '';
  public configurationsParameter: string = '';
  public measureUnit: string = '';
  public configuration: Configuration[];
  public isSaveButtonDisabled: boolean = true;
  private id: number;
  @ViewChild('complexityInput', { read: ElementRef })
  public complexityInput: ElementRef;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private configurationService: ConfigurationService,
    private localizationService: LocalizationService,
    private createIfdService: CreateIfdService
  ) {
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.estimationName = data?.ESTIMATION_NAME;
        this.configurationsParameter = data?.CONFIGURATIONS_PARAMETER;
        this.measureUnit = data?.MEASURE_UNIT;
      });
  }

  public ngAfterViewInit(): void {
    this.configurationService.getConfiguration().subscribe(
      (data: Configuration[]) => {
        if (data && data.length > 0) {
          this.complexity = data[0].complexity;
          this.estimationType = data[0].estimationType;
          this.isSaveButtonDisabled = true;
        } else {
          console.log('No configurations found.');
          this.complexity = null;
          this.estimationType = EstimationType.HOURS;
          this.checkIfSaveShouldBeEnabled();
        }
      },
      error => {
        console.error('Error fetching configuration', error);
      }
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onInputChange(): void {
    this.checkIfSaveShouldBeEnabled();
    if (!this.isSaveButtonDisabled) {
      this.saveEstimation();
    }
  }

  public checkIfSaveShouldBeEnabled(): void {
    if (this.complexity !== null && this.estimationType !== null) {
      this.isSaveButtonDisabled = false;
    } else {
      this.isSaveButtonDisabled = true;
    }
  }

  public saveEstimation(): void {
    this.createIfdService
      .getExistentIfd()
      .pipe(
        switchMap((data: Ifd) => {
          this.id = data.id;
          const estimation = {
            id: this.id,
            estimationType: this.estimationType,
            complexity: this.complexity
          };

          return this.configurationService.saveConfiguration(estimation, estimation.id);
        })
      )
      .subscribe({
        next: () => {
          console.log('Estimation saved successfully');
          this.isSaveButtonDisabled = true;
        },
        error: error => {
          console.error('Error saving estimation', error);
        }
      });
  }

  public checkInput($event: InputEvent) {
    const inputElement: HTMLInputElement = $event.target as HTMLInputElement;
    const value: number = Number(inputElement.value + $event.data);
    const validInputRegex: RegExp = /^[1-5]$|null/;
    if (value < 1 || value > 5 || !validInputRegex.test($event.data)) {
      $event.preventDefault();
    }
  }
}
