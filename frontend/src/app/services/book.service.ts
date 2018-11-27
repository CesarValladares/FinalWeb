import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Book } from '../models/book';

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
    //return this.http.get(this.URL_API + 'Book/5bfae3fd2772781e5b0b2c72');
  }

  postBook(Book: Book) {
    return this.http.post(this.URL_API, Book);
  }

  putBook(Book: Book) {
    //console.log(this.getToken());
    var token = this.getToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token});
    return this.http.put(this.URL_API + 'book/' + `${Book._id}`, Book, {headers: headers});
  }

  deleteBook (_id: string) {
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
