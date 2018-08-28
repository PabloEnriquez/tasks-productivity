import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { TaskListCompletedComponent } from './tasks/task-list-completed/task-list-completed.component';
import { TaskExecuteComponent } from './tasks/task-execute/task-execute.component';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'create', component: TaskCreateComponent },
  { path: 'edit/:taskId', component: TaskCreateComponent },
  { path: 'completed', component: TaskListCompletedComponent },
  { path: 'execute/:taskID', component: TaskExecuteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
