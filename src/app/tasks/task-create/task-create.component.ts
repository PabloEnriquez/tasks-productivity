import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent {

  enteredContent = '';
  enteredTitle = '';

  constructor(public tasksService: TasksService) {}

  onAddTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.tasksService.addTask(form.value.title, form.value.content);
  }
}
