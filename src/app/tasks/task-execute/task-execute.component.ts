import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Task } from '../task.model';

@Component({
  selector: 'app-task-execute',
  templateUrl: './task-execute.component.html',
  styleUrls: ['./task-execute.component.css']
})
export class TaskExecuteComponent {

  timerIsOn = 0;
  timerIsOnStop = 0;
  timeout;
  endTime = 0;
  initialMin;
  initialSec;
  compMin = 0;
  compSec = 0;
  isCompleteDisabled = true;

  constructor(@Inject(MAT_DIALOG_DATA) public task: Task, public dialogRef: MatDialogRef<TaskExecuteComponent>) {
    this.initialMin = this.task.duration.min;
    this.initialSec = this.task.duration.sec;
    console.log(task);
    dialogRef.disableClose = true;
  }

  updateTimer() {

    function twoDigits( n: number ) {
      return (n <= 9 ? '0' + n : n);
    }

    let hours, mins, msLeft, time;

    msLeft = this.endTime - (+new Date);

    if ( msLeft < 1000 ) {
      clearTimeout(this.timeout);
      this.dialogRef.close({
        durMin: this.initialMin,
        durSec: this.initialSec,
        compMin: this.compMin,
        compSec: this.compSec
      });
    } else {
        time = new Date( msLeft );
        hours = time.getUTCHours();
        mins = time.getUTCMinutes();
        (<HTMLInputElement>document.getElementById('dur_min')).value = (hours ? hours + ' : '
         + twoDigits( mins ) : mins) + ' : ' + twoDigits( time.getUTCSeconds() );
        this.task.duration.min = mins + (hours * 60);
        this.task.duration.sec = time.getUTCSeconds();

        this.compSec++;
        if (this.compSec >= 60) {
          this.compSec = 0;
          this.compMin++;
        }

        this.timeout = setTimeout(() => { this.updateTimer(); } , time.getUTCMilliseconds() + 500);
    }

  }

  restartCountdown() {
    this.isCompleteDisabled = true;
    this.endTime = (+new Date) + 1000 * (60 * this.initialMin + this.initialSec) + 500;
    if (!this.timerIsOn || !this.timerIsOnStop) {
      this.timerIsOn = 1;
      this.timerIsOnStop = 1;
      this.updateTimer();
    }
  }

  playCount() {
    this.isCompleteDisabled = true;
    this.endTime = (+new Date) + 1000 * (60 * this.task.duration.min + this.task.duration.sec) + 500;
    if (!this.timerIsOn) {
      this.timerIsOn = 1;
      this.updateTimer();
    }
  }

  pauseCount() {
    this.isCompleteDisabled = false;
    clearTimeout(this.timeout);
    this.timerIsOn = 0;
  }

  stopCount() {
    this.isCompleteDisabled = false;
    clearTimeout(this.timeout);
    this.timerIsOnStop = 0;
  }

  saveCompletedTask() {
    clearTimeout(this.timeout);
    this.dialogRef.close({
      durMin: this.initialMin,
      durSec: this.initialSec,
      compMin: this.compMin,
      compSec: this.compSec
    } );
  }

}
