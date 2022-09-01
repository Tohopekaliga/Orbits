import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { SimSpeedBarComponent } from './../sim-speed-bar/sim-speed-bar.component';
import { StarSystemDisplayComponent } from './../star-system-display/star-system-display.component';
import { ScaleIndicatorComponent } from './../scale-indicator/scale-indicator.component';
import { ExpandingSearchBoxComponent } from './../expanding-search-box/expanding-search-box.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent, SimSpeedBarComponent, StarSystemDisplayComponent, ScaleIndicatorComponent, ExpandingSearchBoxComponent],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
