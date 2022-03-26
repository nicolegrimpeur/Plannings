import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjoutGoogleCalendarPage } from './ajout-google-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: AjoutGoogleCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjoutGoogleCalendarPageRoutingModule {}
