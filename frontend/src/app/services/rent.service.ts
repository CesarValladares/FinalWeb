import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Rent } from '../models/rent';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  rents: Rent[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';

  constructor(private http: HttpClient){}

  getRents() {
   let headers = new HttpHeaders({'Authorization': this.getToken(),
                                  'Content-Type': 'application/json'});
   return this.http.get(this.URL_API + 'rents/',{headers: headers});
  }

  getOnLoanRents(){
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.get(this.URL_API + 'rents-onloan/',{headers: headers});
  }

  getReturnedRents(){
    let headers = new HttpHeaders({'Authorization': this.getToken(),
                                   'Content-Type': 'application/json'});
    return this.http.get(this.URL_API + 'rents-returned/',{headers: headers});
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
