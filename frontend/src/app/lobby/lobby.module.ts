import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LobbyComponent } from './src/lobby/lobby.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { LobbyRoutingModule } from './lobby-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [LobbyComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatCommonModule,
        LobbyRoutingModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule
    ]
})
export class LobbyModule {}
