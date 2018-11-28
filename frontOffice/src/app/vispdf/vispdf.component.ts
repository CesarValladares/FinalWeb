import { Component, OnInit } from '@angular/core';
import { Book } from './../models/book';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Book } from './../../models/book';
import { BookService } from './../services/bookServices'

@Component({
  selector: 'app-vispdf',
  templateUrl: './vispdf.component.html',
  styleUrls: ['./vispdf.component.css']
})
export class VispdfComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


}
