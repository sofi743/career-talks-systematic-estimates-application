import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EstimationsTableComponent } from './estimations-table/estimations-table.component';

const routes: Routes = [
  { path: '', component: EstimationsTableComponent, outlet: 'detail' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewEstimationsRoutingModule {}
