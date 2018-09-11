# PruebaAbx

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.4.

Task productivity and management application using MEAN stack. Deployed using AWS Elastic Beanstalk.
Live application: http://taskproductivity-env.mewgvynzy4.us-east-2.elasticbeanstalk.com/

## Instructions

* The user can create new Tasks; providing a title, content/description and duration of the tasks in minutes and seconds (which cannot be more than 2 hours: 120 minutes).
* In the My Tasks page the tasks "to do" are shown. There is a button to start working on the current task (first on the list). The user can modify the list; re-order the tasks.
* When the user starts working on the current task, the countdown (considering the task duration which the user set) can be started; a timer will show the progress. The timer can be set to play, pause, stop and restart. When the task is completed it will be marked as completed and the user will be taken to the completed tasks page.
* In the My Completed Tasks page, the user can see a history of the completed tasks. 
  > If there database is empty, an option to pre-fill the application with 50 tasks will appear in the completed tasks page.
* In the same page, there is an option to see the productivity of the tasks completed during the past week. There a graph will compare duration to completion of the tasks.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
