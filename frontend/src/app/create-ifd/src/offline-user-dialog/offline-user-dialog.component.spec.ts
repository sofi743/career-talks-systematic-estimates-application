import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineUserDialogComponent } from './offline-user-dialog.component';

describe('OfflineUserDialogComponent', () => {
  let component: OfflineUserDialogComponent;
  let fixture: ComponentFixture<OfflineUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
