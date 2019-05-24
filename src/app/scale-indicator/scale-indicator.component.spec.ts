import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleIndicatorComponent } from './scale-indicator.component';

describe('ScaleIndicatorComponent', () => {
  let component: ScaleIndicatorComponent;
  let fixture: ComponentFixture<ScaleIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScaleIndicatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
