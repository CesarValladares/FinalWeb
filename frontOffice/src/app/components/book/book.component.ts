import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/bookServices/book.service';
import { NgForm, EmailValidator } from '@angular/forms';
import { Book } from 'src/app/models/book';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  constructor(public bookService: BookService) { }

  ngOnInit() {
  }

}
