import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsIfdComponent } from './configurations-ifd.component';

describe('ConfigurationsIfdComponent', () => {
  let component: ConfigurationsIfdComponent;
  let fixture: ComponentFixture<ConfigurationsIfdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationsIfdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationsIfdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
