import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-navigation-tabs',
  templateUrl: './navigation-tabs.component.html',
  styleUrls: ['./navigation-tabs.component.scss']
})
export class NavigationTabsComponent implements OnChanges {
  @Input('tasks')
  public tasks: Task[];

  @Input('selectedTaskId')
  selectedTaskId: number;

  @Input('disabled')
  disabled: boolean;

  public selectedIndex: number = 0;

  @Output() private changeCurrentTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks'] || changes['selectedTaskId']) {
      this.setSelectedTask();
    }
  }

  public selectTask(task: Task, index: number): void {
    if (!this.isTabDisabled(task)) {
      this.selectedIndex = index;
      this.changeCurrentTask.emit(task);
    }
  }

  public isTabDisabled(task: Task): boolean {
    return this.disabled || (!task.estimated && task.id !== this.selectedTaskId);
  }

  private setSelectedTask() {
    this.selectedIndex = this.tasks.findIndex(task => task.id === this.selectedTaskId);
  }
  public getSelectedTask() {
    return this.tasks.find(task => task.id === this.selectedTaskId);
  }
}
