import { Task } from './task.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/tasks/';
const BACKEND_URL_COMP = environment.apiUrl + '/tasks/completed/';

@Injectable({providedIn: 'root'})
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<{ tasks: Task[], taskCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTasks(tasksPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${tasksPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, tasks: any, maxTasks: number }>(BACKEND_URL + queryParams)
    .pipe(map(taskData => {
      return {
        tasks: taskData.tasks.map(task => {
          return {
            id: task._id,
            title: task.title,
            content: task.content,
            duration: { min: task.duration.min, sec: task.duration.sec }
          };
        }),
        maxTasks: taskData.maxTasks
      };
    }))
    .subscribe((transformedTaskData) => {
      this.tasks = transformedTaskData.tasks;
      this.tasksUpdated.next({ tasks: [...this.tasks], taskCount: transformedTaskData.maxTasks});
    });
  }

  getCompletedTasks(tasksPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${tasksPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, tasks: any, maxTasks: number }>(BACKEND_URL_COMP + queryParams)
    .pipe(map(taskData => {
      return {
        tasks: taskData.tasks.map(task => {
          return {
            id: task._id,
            title: task.title,
            content: task.content,
            duration: { min: task.duration.min, sec: task.duration.sec },
            completion: { min: task.completion.min, sec: task.completion.sec },
            isCompleted: task.isCompleted
          };
        }),
        maxTasks: taskData.maxTasks
      };
    }))
    .subscribe((transformedTaskData) => {
      this.tasks = transformedTaskData.tasks;
      this.tasksUpdated.next({ tasks: [...this.tasks], taskCount: transformedTaskData.maxTasks});
    });
  }

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  getTask(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      duration: { min: number, sec: number },
      completion: { min: number, sec: number },
      isCompleted: boolean
     }>(BACKEND_URL + id);
  }

  addTask(title: string, content: string, min: number, sec: number ) {
    const task: Task = { id: null, title: title, content: content, duration: { min: min, sec: sec } };
    this.http.post<{message: string, taskId: string}>(BACKEND_URL, task)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updateTask(id: string, title: string, content: string, min: number, sec: number ) {
    const task: Task = { id: id, title: title, content: content, duration: { min: min, sec: sec } };
    this.http.put(BACKEND_URL + id, task)
    .subscribe(response => {
      this.router.navigate(['/']);
    });
  }

  addCompletedTask(id: string, title: string, content: string, durMin: number, durSec: number,
    compMin: number, compSec: number ) {
    const task: Task = { id: id, title: title, content: content,
    duration: { min: durMin, sec: durSec }, completion: { min: compMin, sec: compSec } };
    this.http.put(BACKEND_URL_COMP + id, task)
    .subscribe(response => {
      this.router.navigate(['/completed']);
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete(BACKEND_URL + taskId);
  }

}
