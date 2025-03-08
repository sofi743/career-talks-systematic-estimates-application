import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { Role } from '../../../models/role.model';

@Component({
  selector: 'app-master-screen',
  templateUrl: './master-screen.component.html',
  styleUrls: ['./master-screen.component.scss']
})
export class MasterScreenComponent implements OnInit, OnDestroy {
  public callsign: string = '';
  public role: Role;
  public readonly message: string = 'lobby-loaded';
  private destroy$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit() {}
}
