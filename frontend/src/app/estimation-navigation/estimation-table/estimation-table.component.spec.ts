import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationTableComponent } from './estimation-table.component';

describe('EstimationTableComponent', () => {
  let component: EstimationTableComponent;
  let fixture: ComponentFixture<EstimationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
