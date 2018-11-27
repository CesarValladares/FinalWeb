import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {Client} from '../../models/client';

@Injectable ({
  providedIn: 'root'
})

export class ClientService {

  selectedClient: Client;
  clients: Client[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';

  constructor(private http: HttpClient) {
    this.selectedClient = new Client();
  }

  signup(user_to_login, gethash = null) {

    if (gethash != null) {
      user_to_login.gethash = gethash;
    }
    const json = JSON.stringify(user_to_login);
    const params = json;
    console.log(params);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.URL_API + 'client-login', params, {headers: headers});
  }

  getClients() {
    const headers = new HttpHeaders({'Authorization': this.getToken(), 'Content-Type': 'application/json'});
    return this.http.get(this.URL_API + 'clients', {headers: headers});
  }

  postClient(client: Client) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(this.URL_API + 'client', client, {headers: headers});
  }

  putClient(client: Client) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(this.URL_API + `/${client._id}`, client, {headers: headers});
  }

  deleteClient (_id: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete(this.URL_API + `client/${_id}`, {headers: headers});
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));

    if (identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }
    return this.identity;
  }

  getToken() {
    const token = localStorage.getItem('token');

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }
}
