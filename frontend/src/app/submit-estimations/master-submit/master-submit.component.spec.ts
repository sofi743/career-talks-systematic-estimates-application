import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSubmitComponent } from './master-submit.component';

describe('CurrentlyComponent', () => {
  let component: MasterSubmitComponent;
  let fixture: ComponentFixture<MasterSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterSubmitComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
