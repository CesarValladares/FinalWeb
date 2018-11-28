import { Component, OnInit } from '@angular/core';
import { RentService } from '../../services/rent.service';
import { NgForm } from '@angular/forms';
import { Rent } from 'src/app/models/rent';

@Component({
  selector: 'app-rents',
  templateUrl: './rents.component.html',
  styleUrls: ['./rents.component.css'],
  providers: [RentService]
})
export class RentsComponent implements OnInit {

  constructor(private rentService: RentService) { }

  ngOnInit() {
    this.getRents();
  }

  getRents(){
    this.rentService.getRents()
      .subscribe(
        response => {
        this.rentService.rents = response as Rent[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  getOnLoanRents(){
    this.rentService.getOnLoanRents()
      .subscribe(
        response => {
        this.rentService.rents = response as Rent[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }

  getReturnedRents(){
    this.rentService.getReturnedRents()
      .subscribe(
        response => {
        this.rentService.rents = response as Rent[];
        console.log(response);
      } , error => {
        console.log(error);
      });
  }
}
