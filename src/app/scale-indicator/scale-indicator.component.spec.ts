import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScaleIndicatorComponent } from './scale-indicator.component';

describe('ScaleIndicatorComponent', () => {
  let component: ScaleIndicatorComponent;
  let fixture: ComponentFixture<ScaleIndicatorComponent>;

  beforeEach(waitForAsync(() => {
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
