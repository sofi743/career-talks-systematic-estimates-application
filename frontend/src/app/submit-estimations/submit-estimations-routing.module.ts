import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubmitTableComponent } from './submit-table/submit-table.component';
import { MasterSubmitComponent } from './master-submit/master-submit.component';

const routes: Routes = [
  { path: '', component: SubmitTableComponent, outlet: 'detail' },
  { path: '', component: MasterSubmitComponent, outlet: 'master' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitEstimationsRoutingModule {}
