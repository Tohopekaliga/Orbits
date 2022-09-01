import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { SimSpeedBarComponent } from './sim-speed-bar/sim-speed-bar.component';
import { StarSystemDisplayComponent } from './star-system-display/star-system-display.component';
import { ScaleIndicatorComponent } from './scale-indicator/scale-indicator.component';
import { ExpandingSearchBoxComponent } from './expanding-search-box/expanding-search-box.component';
import { GameComponent } from './game/game.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [AppComponent, SimSpeedBarComponent, StarSystemDisplayComponent, ScaleIndicatorComponent, ExpandingSearchBoxComponent, GameComponent],
          imports: [HttpClientTestingModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
