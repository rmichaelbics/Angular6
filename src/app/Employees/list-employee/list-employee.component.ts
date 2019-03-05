import { Component, OnInit } from '@angular/core';
import { Router, Route } from '@angular/router';
import { IEmployee } from '../IEmployee';
import { EmployeeService } from '../employee.services';


@Component({
  selector: 'app-list-employee',
  templateUrl: './list-employee.component.html',
  styleUrls: ['./list-employee.component.css']
})
export class ListEmployeeComponent implements OnInit {

  employees: IEmployee[];
  constructor(private empService: EmployeeService, private router: Router ) { }

  ngOnInit() {
    this.empService.getEmployee().subscribe( (employeeList) => this.employees = employeeList, (error) => console.log(error));
  }

  editEmployeeById(employeeId: number) {
    this.router.navigate(['/edit', employeeId]);
  }

}

