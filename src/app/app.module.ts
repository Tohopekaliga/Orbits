import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimSpeedBarComponent } from './sim-speed-bar/sim-speed-bar.component';
import { ExpandingSearchBoxComponent } from './expanding-search-box/expanding-search-box.component';
import { ScaleIndicatorComponent } from './scale-indicator/scale-indicator.component';
import { SystemDisplayComponent } from './system-display/system-display.component';

@NgModule({
  declarations: [
    AppComponent,
    SimSpeedBarComponent,
    ExpandingSearchBoxComponent,
    ScaleIndicatorComponent,
    SystemDisplayComponent
  ],
  imports: [
    BrowserModule//,
  //  AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
