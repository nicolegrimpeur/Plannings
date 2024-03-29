import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TabsPage} from './tabs.page';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'infos-modal',
    loadChildren: () => import('../shared/modal/infos-modal/infos-modal.module').then(m => m.InfosModalPageModule)
  },
  {
    path: 'ajout-google-calendar',
    loadChildren: () => import('../shared/modal/ajout-google-calendar/ajout-google-calendar.module').then(m => m.AjoutGoogleCalendarPageModule)
  },
  {
    path: 'planning',
    loadChildren: () => import('../planning/planning.module').then(m => m.PlanningPageModule)
  },
  {
    path: 'historique',
    loadChildren: () => import('../historique/historique.module').then(m => m.HistoriquePageModule)
  },
  {
    path: 'erreur',
    loadChildren: () => import('../erreur/erreur.module').then(m => m.ErreurPageModule)
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'liste',
        loadChildren: () => import('../liste/liste.module').then(m => m.ListePageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
