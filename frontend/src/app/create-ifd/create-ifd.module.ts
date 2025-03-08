import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIfdComponent } from './src/create-ifd/create-ifd.component';
import { MvpComponent } from './src/mvp/mvp.component';
import { TaskComponent } from './src/task/task.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import { CreateIfdRoutingModule } from './create-ifd-routing.module';
import { ConfigurationsIfdComponent } from './src/configurations-ifd/configurations-ifd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteDialogComponent } from './src/delete-dialog/delete-dialog.component';
import { OfflineUserDialogComponent } from './src/offline-user-dialog/offline-user-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { LoadingScreenComponent } from './src/loading-screen/loading-screen.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    CreateIfdComponent,
    MvpComponent,
    TaskComponent,
    ConfigurationsIfdComponent,
    DeleteDialogComponent,
    OfflineUserDialogComponent,
    LoadingScreenComponent
  ],
  exports: [ConfigurationsIfdComponent, LoadingScreenComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatCommonModule,
    CreateIfdRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    MatSelectModule,
    MatMenuModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule
  ]
})
export class CreateIfdModule {}
