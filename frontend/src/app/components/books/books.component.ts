import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { NgForm } from '@angular/forms';
import { Book } from 'src/app/models/book';

declare var M: any;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  providers: [BookService]
})
export class BooksComponent implements OnInit {

  constructor(private bookService: BookService) { }

  ngOnInit() {
    console.log('INICIANDO LIBROS');
    this.getBooks();
  }

  getBooks(){
    this.bookService.getBooks()
      .subscribe(
        response => {
        this.bookService.books = response as Books[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  getBooks(){
    this.bookService.getBooks()
      .subscribe(
        response => {
        this.bookService.books = response as Book[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

}
