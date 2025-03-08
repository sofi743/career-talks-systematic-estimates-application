import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstimationNavigationComponent } from './estimation-navigation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NavigationTabsComponent } from './navigation-tabs/navigation-tabs.component';
import { EstimationTableComponent } from './estimation-table/estimation-table.component';
import { CurrentSelectionComponent } from './current-selection/current-selection.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { EstimationNavigationRoutingModule } from './estimation-navigation-routing.module';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { ViewCommentsDialogComponent } from './view-comments-dialog/view-comments-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateIfdModule } from '../create-ifd/create-ifd.module';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    EstimationNavigationComponent,
    NavigationTabsComponent,
    EstimationTableComponent,
    CurrentSelectionComponent,
    CommentDialogComponent,
    ViewCommentsDialogComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    FormsModule,
    EstimationNavigationRoutingModule,
    MatProgressSpinnerModule,
    CreateIfdModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class EstimationNavigationModule {}
