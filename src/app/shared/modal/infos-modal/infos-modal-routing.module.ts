import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfosModalPage } from './infos-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InfosModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfosModalPageRoutingModule {}
