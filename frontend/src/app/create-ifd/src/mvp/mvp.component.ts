import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Mvp } from '../../../models/mvp.model';
import { MvpService } from '../services/mvp.service';
import { TaskService } from '../services/task.service';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { DefaultsUtils } from '../../../utils/defaults.utils';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { LocalizationService } from '../../../services/localization.service';
import { TaskJsonService } from '../../../services/task-categories.service';
import { TaskFieldDescriptor } from '../../../models/task-field-descriptor.model';
import { Task } from '../../../models/task.model';
import { TaskComponent } from '../task/task.component';
import { CreateIfdComponent } from '../create-ifd/create-ifd.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-mvp',
  templateUrl: './mvp.component.html',
  styleUrls: ['./mvp.component.scss']
})
export class MvpComponent implements OnInit, OnDestroy {
  public currentIcon: string | undefined;
  private _datasource: Mvp;
  private _isLoadingAdd$ = new BehaviorSubject<boolean>(false);
  private _isLoadingDelete$ = new BehaviorSubject<boolean>(false);
  public isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public destroy$: Subject<void> = new Subject<void>();
  private iconMap: Map<boolean, string> = new Map([
    [true, 'keyboard_arrow_down'],
    [false, 'keyboard_arrow_right']
  ]);
  public editMvpInput: UntypedFormControl = this.formBuilder.control('', [
    Validators.required,
    Validators.minLength(1)
  ]);
  @ViewChild('editMvp', { read: ElementRef, static: false })
  public editMvp: ElementRef;
  @Output()
  public isUpdating: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() mvpUpdated: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @Input() parentComponent: CreateIfdComponent;
  @ViewChild(MatMenuTrigger) private contextMenu!: MatMenuTrigger;
  @ViewChildren(TaskComponent) taskComponents: QueryList<TaskComponent>;

  constructor(
    private taskJsonService: TaskJsonService,
    private mvpService: MvpService,
    private taskService: TaskService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private localizationService: LocalizationService
  ) {
    this.expansionChange().subscribe((key: boolean) => this.setCurrentIcon(key));
  }

  ngOnInit(): void {
    this.taskJsonService.loadStoryTask().subscribe(storyDescriptors => {
      if (storyDescriptors.length > 0) {
        const storyTask = this.mapDescriptorToTask(storyDescriptors[0]);
        DefaultsUtils.updateDefaultTaskFields(storyTask);
      }
    });
  }

  public ngOnDestroy(): void {
    this.isInEditMode$.complete();
    this.isExpanded$.complete();
    this._isLoadingAdd$.complete();
    this._isLoadingDelete$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get datasource(): Mvp {
    return this._datasource;
  }

  @Input()
  public set datasource(value: Mvp) {
    this._datasource = value;
    this.isInEditMode$.next(this._datasource?.name.length === 0 || !this._datasource.name);
    this.editMvpInput.setValue(this._datasource.name);
  }

  public get isLoadingAdd$(): Observable<boolean> {
    return this._isLoadingAdd$.asObservable();
  }

  public get isLoadingDelete$(): Observable<boolean> {
    return this._isLoadingDelete$.asObservable();
  }

  public set isLoadingAdd(value: boolean) {
    this._isLoadingAdd$.next(value);
  }

  public set isLoadingDelete(value: boolean) {
    this._isLoadingDelete$.next(value);
  }

  public changeExpansion(): void {
    this.isExpanded$.next(!this.isExpanded$.value);
    this.setCurrentIcon(this.isExpanded$.value);
  }

  public expand(): void {
    this.isExpanded$.next(true);
    this.setCurrentIcon(this.isExpanded$.value);
  }

  public collapse(): void {
    this.isExpanded$.next(false);
    this.setCurrentIcon(this.isExpanded$.value);
  }

  public expansionChange(): Observable<boolean> {
    return this.isExpanded$.asObservable();
  }

  private mapDescriptorToTask(descriptor: TaskFieldDescriptor): Task {
    return {
      id: -1,
      name: descriptor.label,
      type: descriptor.type,
      estimated: false,
      taskFields: descriptor.taskFieldInfo.map(field => ({
        id: -1,
        keyName: field.keyName,
        description: field.description,
        important: field.important,
        taskFieldEstimations: []
      }))
    };
  }

  public addStoryTask(): void {
    this.isExpanded$.next(true);
    this.setCurrentIcon(this.isExpanded$.value);
    this.isLoadingAdd = true;
    this.taskService
      .addTask(DefaultsUtils.DEFAULT_TASK, this.datasource.id)
      .pipe(
        switchMap(() => this.updateMvp(this.datasource.id)),
        tap(() => {
          this.isLoadingAdd = false;
          this.mvpUpdated.emit();
        })
      )
      .subscribe(
        () => {},
        () => {
          this.isLoadingAdd = false;
          console.error('Error adding task');
        }
      );
  }

  public taskDeleted(): void {
    this.updateMvp(this.datasource.id).subscribe(() => {
      this.mvpUpdated.emit();
    });
  }

  /**
   * Function that emits a boolean value: true if the element is updating and false if it's not
   * used by parent components to show loading screen
   * @param value
   */
  public emitUpdate(value: boolean): void {
    this.isUpdating.emit(value);
  }

  public updateMvp(id: number): Observable<Mvp> {
    return this.mvpService.findMvp(id).pipe(tap(mvp => (this._datasource = mvp)));
  }

  public deleteMvp(mvp: Mvp): void {
    this.localizationService
      .getLocalizationValues$()
      .pipe(
        switchMap(data => {
          const title = data.DELETE_DIALOG_HEADER_MVP;
          const message = data.DELETE_DIALOG_CONTENT_MVP;

          return this.dialog
            .open(DeleteDialogComponent, {
              data: {
                title: title,
                message: message
              }
            })
            .afterClosed()
            .pipe(takeUntil(this.destroy$));
        }),
        switchMap(result => {
          if (result) {
            this.isLoadingDelete = true;
            return this.mvpService.deleteMvp(mvp).pipe(
              switchMap(() => this.updateMvp(this.datasource.id)),
              tap(() => {
                this.isLoadingDelete = false;
                this.mvpUpdated.emit(this._datasource?.name?.length > 0);
              })
            );
          }
          return throwError(() => new Error('Error when deleting MVP, dialog data is broken '));
        }),
        catchError(error => {
          console.error(error.message);
          this.isLoadingDelete = false;
          return EMPTY;
        })
      )
      .subscribe(
        () => {
          this.isLoadingDelete = false;
        },
        error => {
          this.isLoadingDelete = false;
          console.error(error.message);
        }
      );
  }

  public startEdit() {
    this.isInEditMode$.next(true);
    this.clearControl();
  }

  public stopEdit(): void {
    this.emitUpdate(true);
    this._datasource.name = this.editMvp.nativeElement.value;
    this.mvpService
      .update(this._datasource, this._datasource.id)
      .pipe(
        switchMap(() => this.updateMvp(this.datasource.id)),
        tap(() => {
          this.emitUpdate(false);
          this.clearControl();
          if (this._datasource.name?.length > 0) {
            this.isInEditMode$.next(false);
          }
          this.mvpUpdated.emit(this._datasource?.name?.length > 0);
        })
      )
      .subscribe(
        () => {},
        () => {
          this.emitUpdate(false);
          console.error('Error updating MVP');
        }
      );
  }

  public clearControl(): void {
    this.editMvpInput.markAsPristine();
    this.editMvpInput.markAsUntouched();
  }

  private setCurrentIcon(key: boolean): void {
    this.currentIcon = this.iconMap.get(key);
  }

  public showContextMenu() {
    this.contextMenu.openMenu();
  }

  public emitTaskUpdated() {
    this.mvpUpdated.emit(true);
  }
}
