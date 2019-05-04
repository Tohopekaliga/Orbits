import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimSpeedBarComponent } from './sim-speed-bar/sim-speed-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    SimSpeedBarComponent
  ],
  imports: [
    BrowserModule//,
  //  AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
