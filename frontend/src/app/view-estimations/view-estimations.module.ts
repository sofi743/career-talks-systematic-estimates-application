import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationsTableComponent } from './estimations-table/estimations-table.component';
import { ViewEstimationsRoutingModule } from './view-estimations-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateIfdModule } from '../create-ifd/create-ifd.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [EstimationsTableComponent],
  imports: [
    CommonModule,
    ViewEstimationsRoutingModule,
    MatIconModule,
    ScrollingModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    CreateIfdModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class ViewEstimationsModule {}
