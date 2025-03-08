import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { LocalizationService } from '../../../services/localization.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-offline-user-dialog',
  templateUrl: './offline-user-dialog.component.html',
  styleUrls: ['./offline-user-dialog.component.scss']
})
export class OfflineUserDialogComponent implements OnDestroy {
  @ViewChild('callsignInput', { read: ElementRef })
  public callsignInput: ElementRef;
  public callsignInputControl: UntypedFormControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(5),
    Validators.pattern(/^[a-zA-Z]+$/)
  ]);
  public errors: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<OfflineUserDialogComponent>,
    private localizationService: LocalizationService
  ) {
    this.localizationService
      .getLocalizationValues$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => (this.errors = data));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    if (this.callsignInputControl.valid) {
      const callsign = this.callsignInput.nativeElement.value;

      this.dialogRef.close({
        callsign: callsign
      });
    } else {
      this.callsignInputControl.markAllAsTouched();
    }
  }
}
