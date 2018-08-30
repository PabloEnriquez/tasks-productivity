import { EventEmitter } from '@angular/core';
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TasksService } from '../tasks.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-execute',
  templateUrl: './task-execute.component.html',
  styleUrls: ['./task-execute.component.css']
})
export class TaskExecuteComponent {

  timer_is_on = 0;
  timeout;
  endTime = 0;
  initialMin;
  initialSec;
  compMin = 0;
  compSec = 0;
  minPass = 0;
  secPass = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public task: Task, public dialogRef: MatDialogRef<TaskExecuteComponent>) {
    this.initialMin = this.task.duration.min;
    this.initialSec = this.task.duration.sec;
    console.log(task);
  }

  updateTimer() {

    function twoDigits( n: number ) {
      return (n <= 9 ? '0' + n : n);
    }

    let hours, mins, msLeft, time;

    msLeft = this.endTime - (+new Date);

    if ( msLeft < 1000 ) {
      clearTimeout(this.timeout);
      this.dialogRef.close(this.task);
    } else {
        time = new Date( msLeft );
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        (<HTMLInputElement>document.getElementById('dur_min')).value = (hours ? hours + ':' + twoDigits( mins ) : mins);
        (<HTMLInputElement>document.getElementById('dur_sec')).value = '' + twoDigits( time.getUTCSeconds() ) ;
        this.task.duration.min = mins;
        this.task.duration.sec = time.getUTCSeconds();

        this.compSec++;
        if (this.compSec >= 60) {
          this.compSec = 0;
          this.compMin++;
          if (this.compMin >= 60) {
            this.compMin = 0;
          }
        }

        this.timeout = setTimeout(() => { this.updateTimer(); } , time.getUTCMilliseconds() + 500);
    }

  }

  restartCountdown() {
    this.endTime = (+new Date) + 1000 * (60 * this.initialMin + this.initialSec) + 500;
    if (!this.timer_is_on) {
      this.timer_is_on = 1;
      this.updateTimer();
    }
  }

  playCount() {
    this.endTime = (+new Date) + 1000 * (60 * this.task.duration.min + this.task.duration.sec) + 500;
    if (!this.timer_is_on) {
      this.timer_is_on = 1;
      this.updateTimer();
    }
  }

  pauseCount() {
    // this.task.duration.min -= this.minPass;
    // this.task.duration.sec -= this.secPass;
    clearTimeout(this.timeout);
    this.timer_is_on = 0;
  }

  stopCount() {
    clearTimeout(this.timeout);
  }

  saveTask() {
    this.dialogRef.close({
      durMin: this.initialMin,
      durSec: this.initialSec,
      compMin: this.compMin,
      compSec: this.compSec
    } );
  }

}
