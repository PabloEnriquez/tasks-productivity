import { TasksService } from './../tasks.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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
  tasksPerPage = 4;
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
      // console.log(taskData);
      this.isLoading = false;
      this.tasks = taskData.tasks;
      // console.log(this.tasks);
      this.tasks.forEach((task) => {
        this.tasksDurMin.push(task.duration.min);
        this.tasksCompMin.push(task.completion.min);
        // console.log(task.date);

        const dateAux = new Date('' + task.date + '');
        this.taskDates.push(dateAux.toLocaleTimeString('es', { year: 'numeric', month: 'short', day: 'numeric' }));
        // console.log('dates: ' + this.taskDates );
        // console.log('short: ' + this.shortTasks );
        // console.log('med: ' + this.medTasks );
        // console.log('long: ' + this.longTasks );
      });

      this.createChart();

    });

  }

  createChart() {

    console.log('dates: ' + this.taskDates );
    console.log('durmin: ' + this.tasksDurMin );
    console.log('compmin: ' + this.tasksCompMin );

    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.taskDates,
        datasets: [
          {
            data: this.tasksDurMin,
            label: 'Duración Minutos',
            borderColor: '#3cba9f',
            fill: false
          },
          {
            data: this.tasksCompMin,
            label: 'Completado Minutos',
            borderColor: '#251187',
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
