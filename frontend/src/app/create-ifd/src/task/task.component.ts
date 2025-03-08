import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Task } from '../../../models/task.model';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { LocalizationService } from '../../../services/localization.service';
import { CreateIfdComponent } from '../create-ifd/create-ifd.component';
import { Dialog } from '@angular/cdk/dialog';
import { CdkContextMenuTrigger } from '@angular/cdk/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnDestroy {
  public isInEditMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public editTaskInput: UntypedFormControl = this.formBuilder.control('', [Validators.required]);
  public sourceUrl: string;
  @Input() parentComponent: CreateIfdComponent;
  @Output() public taskDeleted: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() public taskIsUpdating: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public taskUpdated: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  @ViewChild('editTask', { read: ElementRef }) public editTask: ElementRef;
  @ViewChild(MatMenuTrigger) private contextMenu!: MatMenuTrigger;
  private _datasource: Task;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private localizationService: LocalizationService
  ) {}

  public get datasource(): Task {
    return this._datasource;
  }

  @Input()
  public set datasource(value: Task) {
    this._datasource = value;
    this.isInEditMode$.next(this._datasource?.name.length === 0 || !this._datasource.name);
    this.editTaskInput.setValue(this._datasource.name);
    this.sourceUrl =
      this.datasource?.type.toString() === 'STORY' ? './assets/storyavatar.svg' : './assets/taskavatar.svg';
  }

  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }

  public set isLoading(value: boolean) {
    this._isLoading$.next(value);
  }

  public delete(): void {
    this.localizationService
      .getLocalizationValues$()
      .pipe(
        switchMap(data => {
          const title = data.DELETE_DIALOG_HEADER_TASK;
          const message = data.DELETE_DIALOG_CONTENT_TASK;

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
            this.isLoading = true;
            return this.taskService.deleteTask(this.datasource);
          }
          return throwError(() => new Error('Error when deleting task, dialog data is broken '));
        }),
        catchError(error => {
          console.error(error.message);
          this.isLoading = false;
          return EMPTY;
        })
      )
      .subscribe(
        () => {
          this.isLoading = false;
          this.taskDeleted.emit(this.datasource);
        },
        error => {
          this.isLoading = false;
          console.error(error.message);
        }
      );
  }

  public startEdit(): void {
    this.isInEditMode$.next(true);
    this.clearControl();
  }

  public cancelEdit(): void {
    this.taskIsUpdating.emit(true);
    this._datasource.name = this.editTask.nativeElement.value;
    this.taskService.updateTask(this._datasource, this._datasource.id).subscribe(
      task => {
        this._datasource = task;
        this.taskIsUpdating.emit(false);
        this.clearControl();
        if (this._datasource.name?.length > 0) {
          this.isInEditMode$.next(false);
        }
        this.taskUpdated.emit(this._datasource?.name?.length > 0);
      },
      () => {
        this.taskUpdated.emit(this._datasource?.name?.length > 0);
        this.taskIsUpdating.emit(false);
      }
    );
  }

  public clearControl(): void {
    this.editTaskInput?.markAsPristine();
    this.editTaskInput?.markAsUntouched();
  }

  public showContextMenu() {
    this.contextMenu.openMenu();
  }

  ngOnDestroy(): void {
    this.isInEditMode$.complete();
    this._isLoading$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
