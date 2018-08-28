import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { TasksService } from '../tasks.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-execute',
  templateUrl: './task-execute.component.html',
  styleUrls: ['./task-execute.component.css']
})
export class TaskExecuteComponent {

  constructor(public tasksService: TasksService, public route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public task: Task) {}

}
