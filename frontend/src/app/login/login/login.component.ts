import { Component, ElementRef, ViewChild } from '@angular/core';
import { Role } from '../../models/role.model';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { NavigationActionsEnum } from '../../models/navigation/navigation-actions.enum';
import { JoinService } from '../../services/join.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('callsignInput', { read: ElementRef })
  public callsignInput: ElementRef;
  public role: Role;
  public callsignInputControl: UntypedFormControl = this.fb.control('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(5),
    Validators.pattern(/^[a-zA-Z]+$/)
  ]);
  public roleControl: UntypedFormControl = this.fb.control('', [Validators.required]);
  public formGroup: UntypedFormGroup;

  constructor(public fb: FormBuilder, private navigationService: NavigationService, private joinService: JoinService) {
    this.formGroup = fb.group({
      callsign: this.callsignInputControl,
      role: this.roleControl
    });
  }

  public onJoin(): void {
    const callsign = this.formGroup.get('callsign')?.value;
    const role = this.formGroup.get('role')?.value;

    this.joinService.registerUser(callsign, role).subscribe(_ => {
      this.navigationService.navigate({ navigationActions: NavigationActionsEnum.SUBMIT_ESTIMATION });
    });
  }

  protected readonly Role = Role;
}
