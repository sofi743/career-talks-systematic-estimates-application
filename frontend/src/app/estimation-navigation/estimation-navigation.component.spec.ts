import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationNavigationComponent } from './estimation-navigation.component';

describe('EstimationNavigationComponent', () => {
  let component: EstimationNavigationComponent;
  let fixture: ComponentFixture<EstimationNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimationNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
