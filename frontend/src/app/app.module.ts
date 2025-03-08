import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AppComponent } from './app.component';
import { MatCommonModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationStompService } from './services/notifications/notification-stomp.service';
import { InitializationService } from './services/initialization.service';
import { LocalizationService } from './services/localization.service';
import { TaskJsonService } from './services/task-categories.service';
import { JoinService } from './services/join.service';

@NgModule({
  declarations: [AppComponent],
  imports: [MatCommonModule, BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private notificationStompService: NotificationStompService,
    private initializationService: InitializationService,
    private localizationService: LocalizationService,
    private taskCategoriesService: TaskJsonService,
    private joinService: JoinService,
    @Optional() @SkipSelf() parentModule?: AppModule
  ) {
    if (parentModule) {
      throw new Error('AppModule is already loaded');
    }
    this.initializationService.start();
    this.notificationStompService.startSocket();
    this.localizationService.start();
    this.taskCategoriesService.start();
    this.joinService.start();
  }
}
