import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIfdComponent } from './create-ifd.component';

describe('IfdComponent', () => {
  let component: CreateIfdComponent;
  let fixture: ComponentFixture<CreateIfdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIfdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIfdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
