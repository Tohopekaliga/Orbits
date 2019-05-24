import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSpeedBarComponent } from './sim-speed-bar.component';

describe('SimSpeedBarComponent', () => {
  let component: SimSpeedBarComponent;
  let fixture: ComponentFixture<SimSpeedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimSpeedBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSpeedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
