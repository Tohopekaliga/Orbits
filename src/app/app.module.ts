import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimSpeedBarComponent } from './sim-speed-bar/sim-speed-bar.component';
import { ExpandingSearchBoxComponent } from './expanding-search-box/expanding-search-box.component';
import { ScaleIndicatorComponent } from './scale-indicator/scale-indicator.component';
import { StarSystemDisplayComponent } from './star-system-display/star-system-display.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    SimSpeedBarComponent,
    ExpandingSearchBoxComponent,
    ScaleIndicatorComponent,
    StarSystemDisplayComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
  //  AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
