import { Injectable} from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EmployeeService {
    baseUrl = 'http://localhost:3000/employees';

    constructor(private httpClient: HttpClient) {
        console.log('Called Employees method');
    }

    getEmployee(): Observable<IEmployee[]> {
       return  this.httpClient.get<IEmployee[]>(this.baseUrl).pipe(catchError(this.handleError));
    }

    getEmployeeById(employeeId: number): Observable<IEmployee> {
        return this.httpClient.get<IEmployee>(`${this.baseUrl}/${employeeId}`).pipe(catchError(this.handleError));
    }

    addEmployee(employee: IEmployee): Observable<IEmployee> {
       return this.httpClient.post<IEmployee>(this.baseUrl, employee , {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    updateEmployee(employee: IEmployee, employeeId: number): Observable<void> {
        console.log(`${this.baseUrl}/${employeeId}`);
        return this.httpClient.put<void>(`${this.baseUrl}/${employeeId}`, employee , {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError));
    }

    deleteEmployee(empId: number): void {
        this.httpClient.delete(`${this.baseUrl}/${empId}`).pipe(catchError(this.handleError));
    }

    handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.log('Client Side Error :', errorResponse.error.message);
        } else {
            console.log('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}
