import { Component, OnDestroy } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationService } from '../../../services/navigation.service';
import { JoinService } from '../../../services/join.service';

@Component({
  selector: 'app-details-screen',
  templateUrl: './details-screen.component.html',
  styleUrls: ['./details-screen.component.scss']
})
export class DetailsScreenComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private navigationService: NavigationService, private joinService: JoinService) {
    this.navigationService
      .getNavigateChanged$()
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe(navModel => {
        if (!!navModel) {
          this.navigationService.navigate(navModel);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
