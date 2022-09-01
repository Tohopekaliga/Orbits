import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StarSystemDisplayComponent } from './star-system-display.component';
import { Vector2 } from 'src/engine/math3d';

describe('StarSystemDisplayComponent', () => {
  let component: StarSystemDisplayComponent;
  let fixture: ComponentFixture<StarSystemDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StarSystemDisplayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarSystemDisplayComponent);
    component = fixture.componentInstance;
    component.area = new Vector2();
    component.center = new Vector2();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
