import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErreurPage } from './erreur.page';

const routes: Routes = [
  {
    path: '',
    component: ErreurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErreurPageRoutingModule {}
