import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';

import { Book } from './../../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  selectedBook: Book;
  books: Book[];
  public identity;
  public token;
  readonly URL_API = 'http://localhost:3977/api/';


  constructor(private http: HttpClient) {
    this.selectedBook = new Book();
  }

  getBooks() {
    console.log('Conectar a BD --------');
    return this.http.get(this.URL_API + 'books');

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
