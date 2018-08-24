import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TasksService } from '../tasks.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  enteredContent = '';
  enteredTitle = '';
  private mode = 'create';
  private taskId: string;
  task: Task;

  constructor(public tasksService: TasksService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.tasksService.getTask(this.taskId).subscribe(taskData => {
        this.task = {id: taskData._id, title: taskData.title, content: taskData.content};
        });
      } else {
        this.mode = 'create';
        this.taskId = null;
      }
    });
  }

  onSaveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.tasksService.addTask(form.value.title, form.value.content);
    } else {
      this.tasksService.updateTask(this.taskId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
