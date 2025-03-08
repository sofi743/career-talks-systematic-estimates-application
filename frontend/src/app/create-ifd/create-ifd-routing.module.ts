import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateIfdComponent } from './src/create-ifd/create-ifd.component';
import { ConfigurationsIfdComponent } from './src/configurations-ifd/configurations-ifd.component';

const routes: Routes = [
  { path: '', component: CreateIfdComponent, outlet: 'detail' },
  { path: '', component: ConfigurationsIfdComponent, outlet: 'master' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateIfdRoutingModule {}
