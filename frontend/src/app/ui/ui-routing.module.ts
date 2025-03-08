import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainContainerComponent } from './src/main-container/main-container.component';

// TODO ex 1.b. add all routes to redirect to each module
const routes: Routes = [
  {
    path: '',
    component: MainContainerComponent,
    children: [
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
