import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjoutGoogleCalendarPageRoutingModule } from './ajout-google-calendar-routing.module';

import { AjoutGoogleCalendarPage } from './ajout-google-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjoutGoogleCalendarPageRoutingModule
  ],
  declarations: [AjoutGoogleCalendarPage]
})
export class AjoutGoogleCalendarPageModule {}
