import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/clientServices/client.service';
import { NgForm, EmailValidator } from '@angular/forms';
import { Client } from 'src/app/models/client';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { TouchSequence } from 'selenium-webdriver';

declare var M: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./../../app.component.css']
})
export class ClientsComponent implements OnInit {

  constructor(public clientService: ClientService) {}

  ngOnInit() {

  }


  addClient(form: NgForm) {
    if (form.value._id) {
      console.log('UPDATE');
      this.clientService.putClient(form.value)
      .subscribe( res => {
        console.log('UPDATE2');
        this.resetForm(form);

      });
    } else {
      console.log('CREATE');
      this.clientService.postClient(form.value)
      .subscribe( res => {
        this.resetForm(form);

      }, err => {
        alert('El cliente no esta creado correctamente');
      });
    }
  }



  editClient(client: Client) {
    this.clientService.selectedClient = client;
  }

  deleteClient(_id: string) {
    if (confirm('Are you sure you want to delte it?')) {
      this.clientService.deleteClient(_id)
      .subscribe( res => {
        M.toast({html: 'Client deleted'});

      });
    }
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.clientService.selectedClient = new Client;
    }
  }

}
