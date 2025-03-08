import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitTableComponent } from './submit-table/submit-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MasterSubmitComponent } from './master-submit/master-submit.component';
import { SubmitEstimationsRoutingModule } from './submit-estimations-routing.module';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateIfdModule } from '../create-ifd/create-ifd.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [SubmitTableComponent, MasterSubmitComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    SubmitEstimationsRoutingModule,
    MatIconModule,
    FormsModule,
    MatProgressSpinnerModule,
    CreateIfdModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class SubmitEstimationsModule {}
