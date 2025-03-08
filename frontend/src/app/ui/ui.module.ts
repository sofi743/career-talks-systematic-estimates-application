import { NgModule } from '@angular/core';
import { DetailsScreenComponent } from './src/details-screen/details-screen.component';
import { MasterScreenComponent } from './src/master-screen/master-screen.component';
import { MainContainerComponent } from './src/main-container/main-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { UiRoutingModule } from './ui-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DetailsScreenComponent, MasterScreenComponent, MainContainerComponent],
  imports: [
    MatIconModule,
    MatCommonModule,
    UiRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ]
})
export class UiModule {}
