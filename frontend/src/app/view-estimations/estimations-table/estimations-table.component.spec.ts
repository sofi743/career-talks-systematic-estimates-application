import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationsTableComponent } from './estimations-table.component';

describe('EstimationsTableComponent', () => {
  let component: EstimationsTableComponent;
  let fixture: ComponentFixture<EstimationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
