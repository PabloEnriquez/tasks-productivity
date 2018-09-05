import { TasksService } from './../tasks.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from '../task.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-task-productivity',
  templateUrl: './task-productivity.component.html',
  styleUrls: ['./task-productivity.component.css']
})
export class TaskProductivityComponent implements OnInit, OnDestroy {

  tasks: Task[] = [];
  private tasksSub: Subscription;
  isLoading = false;
  tasksPerPage = 10;
  currentPage = 1;
  taskDates = [];
  tasksDurMin = [];
  tasksCompMin = [];
  chart = [];

  constructor(public tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getProductivityTasks(this.tasksPerPage, this.currentPage);
    this.tasksSub = this.tasksService.getTaskUpdateListener()
    .subscribe((taskData: { tasks: Task[], taskCount: number }) => {
      this.isLoading = false;
      this.tasks = taskData.tasks;
      this.tasks.forEach((task) => {
        this.tasksDurMin.push(task.duration.min);
        this.tasksCompMin.push(task.completion.min);

        const dateAux = new Date('' + task.date + '');
        this.taskDates.push(dateAux.toLocaleTimeString('es', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' }));
      });
      this.createChart();
    });
  }

  createChart() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.taskDates,
        datasets: [
          {
            data: this.tasksDurMin,
            label: 'Duración Minutos',
            backgroundColor: '#d83c31',
            fill: false
          },
          {
            data: this.tasksCompMin,
            label: 'Completada Minutos',
            backgroundColor: '#3F51B5',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
  }

}
