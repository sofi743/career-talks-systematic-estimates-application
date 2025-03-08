import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EstimationNavigationComponent} from "./estimation-navigation.component";
import {CurrentSelectionComponent} from "./current-selection/current-selection.component";


const routes: Routes = [
  { path: '', component: EstimationNavigationComponent, outlet: 'detail' },
  { path: '', component: CurrentSelectionComponent, outlet: 'master' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstimationNavigationRoutingModule {}
