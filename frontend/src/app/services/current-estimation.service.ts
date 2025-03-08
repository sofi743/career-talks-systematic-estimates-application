import { Injectable } from '@angular/core';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import {CurrentInfoModel} from "../models/current-info.model";
import {Ifd} from "../models/ifd.model";
import {TaskType} from "../models/task-type.model";
import {CreateIfdService} from "../create-ifd/src/services/create-ifd.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentEstimationService {
  private _currentInfos: CurrentInfoModel[] = [];
  private _currentIndex: number = 0;
  private currentIndexChanged$: Subject<void> = new Subject<void>();

  constructor(private createIfdService: CreateIfdService) {}

  public currentIndexChanged(): Observable<void> {
    return this.currentIndexChanged$.asObservable();
  }

  private getCurrentInfos(): Observable<CurrentInfoModel[]> {
    return this.createIfdService.getExistentIfd().pipe(
      map((ifd: Ifd) => {
        return ifd.mvps.flatMap(mvp =>
          mvp.tasks.map(
            task =>
              ({
                mvpId: mvp.id,
                mvpName: mvp.name,
                task: {
                  name: task.name,
                  id: task.id,
                  type: task.type,
                  taskFields: task.taskFields
                }
              } as CurrentInfoModel)
          )
        );
      })
    );
  }

  private sortCurrentInfos(currentInfos: CurrentInfoModel[]): CurrentInfoModel[] {
    return currentInfos.sort((a, b) => {
      if (a.mvpId !== b.mvpId) {
        return a.mvpId - b.mvpId;
      }
      if (a.task.type === TaskType.STORY && b.task.type !== TaskType.STORY) {
        return -1;
      }
      if (a.task.type !== TaskType.STORY && b.task.type === TaskType.STORY) {
        return 1;
      }
      return 0;
    });
  }

  public populateTaskArray(): Observable<CurrentInfoModel[]> {
    return this.getCurrentInfos().pipe(
      switchMap(currentInfos => {
        this._currentInfos = this.sortCurrentInfos(currentInfos);
        this._currentIndex = 0;
        return of(this._currentInfos);
      })
    );
  }

  public refreshTaskArray(id: number): Observable<CurrentInfoModel[]> {
    return this.populateTaskArray().pipe(
      switchMap(data => {
        this._currentInfos = this.sortCurrentInfos(data);
        this._currentIndex = data.indexOf(this._currentInfos.find(currentInfo => currentInfo.task.id === id));
        this.currentIndexChanged$.next();
        return of(this._currentInfos);
      })
    );
  }

  /**
   * Gets the current task
   * Increments the index
   * Returns null if there are no tasks left
   */
  public getCurrentTask(): CurrentInfoModel {
    if (this._currentIndex < this._currentInfos.length) {
      return this._currentInfos[this._currentIndex];
    }
    return null;
  }

  public goToNextTask(): void {
    this._currentIndex++;
    this.currentIndexChanged$.next();
  }
}
