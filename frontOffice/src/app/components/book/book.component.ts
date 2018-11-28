import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/bookServices/book.service';
import { NgForm, EmailValidator } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { TouchSequence } from 'selenium-webdriver';
import { Rent } from 'src/app/models/rent';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  constructor(public bookService: BookService) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks() {
    this.bookService.getBooks()
      .subscribe(
        response => {
        this.bookService.books = response as Book[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  registerRent(_id: string){

  }
}
