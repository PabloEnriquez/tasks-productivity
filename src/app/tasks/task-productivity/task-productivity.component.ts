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
export class TaskProductivityComponent implements OnInit, OnDestroy, AfterViewInit {

  tasks: Task[] = [];
  private tasksSub: Subscription;
  isLoading = false;
  tasksPerPage = 4;
  currentPage = 1;
  taskDates = [];
  shortTasks = [];
  medTasks = [];
  longTasks = [];
  chart = [];

  constructor(public tasksService: TasksService) {}

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getProductivityTasks(this.tasksPerPage, this.currentPage);
    this.tasksSub = this.tasksService.getTaskUpdateListener()
    .subscribe((taskData: { tasks: Task[], taskCount: number }) => {
      console.log(taskData);
      this.isLoading = false;
      this.tasks = taskData.tasks;
      console.log(this.tasks);
      this.tasks.forEach((task) => {
        if (task.duration.min <= 30) {
          this.shortTasks.push(task.duration.min);
        } else if (task.duration.min > 30 && task.duration.min <= 60) {
          this.medTasks.push(task.duration.min);
        } else if (task.duration.min > 60) {
          this.longTasks.push(task.duration.min);
        }
        console.log(task.date);

        this.taskDates.push(task.date.toLocaleTimeString('es', { year: 'numeric', month: 'short', day: 'numeric' }));
      });
    });



    // console.log('dates: ' + this.taskDates );
    // console.log('short: ' + this.shortTasks );
    // console.log('med: ' + this.medTasks );
    // console.log('long: ' + this.longTasks );

    // this.createChart();
  }

  ngAfterViewInit() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.taskDates,
        datasets: [
          {
            data: this.shortTasks,
            label: 'Tareas Cortas',
            borderColor: '#3cba9f',
            fill: false
          },
          {
            data: this.medTasks,
            label: 'Tareas Medias',
            borderColor: '#251187',
            fill: false
          },
          {
            data: this.longTasks,
            label: 'Tareas Largas',
            borderColor: '#ffcc00',
            fill: false
          },
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
