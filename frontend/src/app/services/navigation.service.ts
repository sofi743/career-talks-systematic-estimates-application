import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';
import { NavigationModel } from '../models/navigation/navigation.model';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { NavigationActionsEnum } from '../models/navigation/navigation-actions.enum';
import { NotificationStompService } from './notifications/notification-stomp.service';
import { NotificationTopicsUtils } from '../utils/notification-topics.utils';
import { Notification } from '../models/notifications/notification';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private navigateChanged$ = new BehaviorSubject<NavigationModel>(null);

  constructor(
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationStompService
  ) {
    this.notificationService
      .isSocketReady()
      .pipe(
        take(1),
        switchMap(() =>
          this.notificationService.subscribeToTopic<NavigationModel>(
            NotificationTopicsUtils.RETURNED_NAVIGATION_NOTIFICATION_TOPIC
          )
        )
      )
      .subscribe(
        message => {
          this.setNavigateChanged$(message.data);
        },
        error => console.log(error)
      );
  }

  public prepareToNavigate(navigation: NavigationModel): void {
    this.notificationService.sendData<Notification<NavigationModel>>(
      NotificationTopicsUtils.NAVIGATION_NOTIFICATION_TOPIC,
      {
        data: navigation,
        state: 'FULL',
        topic: NotificationTopicsUtils.NAVIGATION_NOTIFICATION_TOPIC
      }
    );
  }

  public navigate(navigation: NavigationModel): void {
    switch (navigation.navigationActions.toString()) {
      case NavigationActionsEnum.CREATE_IFD.toString(): {
        this.router.navigate(['ifd']);
        break;
      }
      case NavigationActionsEnum.START_ESTIMATION.toString(): {
        const taskId = navigation.taskId;
        const reest = navigation.reestimation;
        this.router.navigate(['submit'], { queryParams: { taskId, reest } });
        break;
      }
      case NavigationActionsEnum.SUBMIT_ESTIMATION.toString(): {
        const taskId = navigation.taskId;
        const mvpId = navigation.mvpId;
        this.router.navigate(['wait'], {
          queryParams: { mvpId, taskId }
        });
        break;
      }
      case NavigationActionsEnum.WAIT_ESTIMATION.toString(): {
        const taskId = navigation.taskId;
        const mvpId = navigation.mvpId;
        this.router.navigate(['estimation'], {
          queryParams: { mvpId, taskId }
        });
        break;
      }
      case NavigationActionsEnum.FINISH_ESTIMATION.toString(): {
        this.router.navigate(['view']);
        break;
      }
    }
  }

  public setNavigateChanged$(data: NavigationModel): void {
    if (!!data) {
      this.navigateChanged$.next(data);
    }
  }

  public getNavigateChanged$(): Observable<NavigationModel> {
    return this.navigateChanged$.asObservable();
  }
}
