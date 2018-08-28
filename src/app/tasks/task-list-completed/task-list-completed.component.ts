import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-task-list-completed',
  templateUrl: './task-list-completed.component.html',
  styleUrls: ['./task-list-completed.component.css']
})
export class TaskListCompletedComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksSub: Subscription;
  isLoading = false;
  totalTasks = 0;
  tasksPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getCompletedTasks(this.tasksPerPage, this.currentPage);
    this.tasksSub = this.tasksService.getTaskUpdateListener()
    .subscribe((taskData: { tasks: Task[], taskCount: number }) => {
      this.isLoading = false;
      this.totalTasks = taskData.taskCount;
      this.tasks = taskData.tasks;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.tasksService.getCompletedTasks(this.tasksPerPage, this.currentPage);
  }

  onDelete(taskId: string) {
    this.isLoading = true;
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasksService.getCompletedTasks(this.tasksPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }

}
