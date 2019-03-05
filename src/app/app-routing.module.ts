import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { ListEmployeeComponent } from './Employees/list-employee/list-employee.component';
import { CreateEmployeeComponent } from './Employees/create-employee/create-employee.component';


const routes: Routes = [
  { path: 'list', component: ListEmployeeComponent },
{ path: 'create', component: CreateEmployeeComponent },
{ path: 'edit/:id', component: CreateEmployeeComponent },
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/list', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
