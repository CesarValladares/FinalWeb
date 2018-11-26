import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  selectedEmployee: Employee;
  employees: Employee[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';

  constructor(private http: HttpClient) {
    this.selectedEmployee = new Employee();
   }

   signup(user_to_login, gethash = null){
     console.log('hola desde signup');
     if(gethash != null){
       user_to_login.gethash = gethash;
     }
     let json = JSON.stringify(user_to_login);
     let params = json;
     console.log(params);

     let headers = new HttpHeaders({'Content-Type': 'application/json'});
     return this.http.post(this.URL_API + 'employee-login', params, {headers: headers});
  }

  getEmployees() {
    console.log('Conectar a BD --------');
    return this.http.get(this.URL_API + 'employees');
    //return this.http.get(this.URL_API + 'employee/5bfae3fd2772781e5b0b2c72');
  }

  postEmployee(employee: Employee) {
    return this.http.post(this.URL_API, employee);
  }

  putEmployee(employee: Employee) {
    return this.http.put(this.URL_API + `/${employee._id}`, employee);
  }

  deleteEmployee (_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }

  getIdentity(){
  let identity = JSON.parse(localStorage.getItem('identity'));

  if(identity != "undefined"){
    this.identity = identity;
  } else {
    this.identity = null;
  }
  return this.identity;
}

getToken(){
  let token = localStorage.getItem('token');

  if(token != "undefined"){
    this.token = token;
  } else {
    this.token = null;
  }
  return this.token;
}
}
