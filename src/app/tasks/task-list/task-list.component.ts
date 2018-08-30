import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { PageEvent, MatDialog } from '@angular/material';
import { TaskExecuteComponent } from '../task-execute/task-execute.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private tasksSub: Subscription;
  isLoading = false;
  totalTasks = 0;
  tasksPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public tasksService: TasksService, private dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
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
    this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
  }

  onDelete(taskId: string) {
    this.isLoading = true;
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasksService.getTasks(this.tasksPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(TaskExecuteComponent, {data: this.tasks[0]});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Dialog result: ${result.compMin} ` + result.compSec);
      } else {
        console.log('Closed normally');
      }
    });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }

}
