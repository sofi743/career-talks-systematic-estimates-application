import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitTableComponent } from './submit-table.component';

describe('SubmitTableComponent', () => {
  let component: SubmitTableComponent;
  let fixture: ComponentFixture<SubmitTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
