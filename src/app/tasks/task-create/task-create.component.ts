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
  isLoading = false;
  maxMin = 120;
  showMaxHourErrorMessage = false;
  showSecErrorMessage = false;
  showCeroMessage = false;

  constructor(public tasksService: TasksService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.isLoading = true;
        this.tasksService.getTask(this.taskId).subscribe(taskData => {
          this.isLoading = false;
          this.task = {id: taskData._id, title: taskData.title, content: taskData.content,
          duration: taskData.duration, completion: taskData.completion, isCompleted: taskData.isCompleted};
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
    if ((form.value.dur_min + (form.value.dur_sec / 60)) > 120) {
      form.resetForm();
      this.showMaxHourErrorMessage = true;
      this.showCeroMessage = false;
      this.showSecErrorMessage = false;
    } else if (form.value.dur_sec > 60) {
      form.resetForm();
      this.showSecErrorMessage = true;
      this.showMaxHourErrorMessage = false;
      this.showCeroMessage = false;
    } else if ( form.value.dur_min <= 0 && form.value.dur_sec <= 0 ) {
      form.resetForm();
      this.showCeroMessage = true;
      this.showSecErrorMessage = false;
      this.showMaxHourErrorMessage = false;
    } else {
      this.isLoading = true;
      if (this.mode === 'create') {
        this.tasksService.addTask(form.value.title, form.value.content, form.value.dur_min, form.value.dur_sec);
      } else {
        this.tasksService.updateTask(this.taskId, form.value.title, form.value.content, form.value.dur_min, form.value.dur_sec);
      }
      form.resetForm();
    }
  }
}
