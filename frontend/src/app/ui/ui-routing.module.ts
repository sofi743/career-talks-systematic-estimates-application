import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainContainerComponent } from './src/main-container/main-container.component';

// TODO ex 1.b. add all routes to redirect to each module
const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
      {
        path: 'submit',
        loadChildren: () =>
          import('../submit-estimations/submit-estimations.module').then(m => m.SubmitEstimationsModule)
      },
      { path: 'wait', loadChildren: () => import('../lobby/lobby.module').then(m => m.LobbyModule) },
      { path: 'ifd', loadChildren: () => import('../create-ifd/create-ifd.module').then(m => m.CreateIfdModule) },
      { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
      {
        path: 'estimation',
        loadChildren: () =>
          import('../estimation-navigation/estimation-navigation.module').then(m => m.EstimationNavigationModule)
      },
      {
        path: 'view',
        loadChildren: () => import('../view-estimations/view-estimations.module').then(m => m.ViewEstimationsModule)
      },

      { path: 'login', loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiRoutingModule {}
