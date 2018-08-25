import { Task } from './task.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/tasks/';

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
            title: task.title,
            content: task.content,
            id: task._id
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
    return this.http.get<{ _id: string, title: string, content: string }>(BACKEND_URL + id);
  }

  addTask(title: string, content: string) {
    const task: Task = {id: null, title: title, content: content};
    this.http.post<{message: string, taskId: string}>(BACKEND_URL, task)
    .subscribe((responseData) => {

      this.router.navigate(['/']);
    });
  }

  updateTask(id: string, title: string, content: string) {
    const task: Task = { id: id, title: title, content: content };
    this.http.put(BACKEND_URL + id, task)
    .subscribe(response => {

      this.router.navigate(['/']);
    });
  }

  deleteTask(taskId: string) {
    return this.http.delete(BACKEND_URL + taskId);
  }

}
