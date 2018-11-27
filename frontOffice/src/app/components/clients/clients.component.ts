import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/clientServices/client.service';
import { NgForm } from '@angular/forms';
import { Client } from 'src/app/models/client';
import { toBase64String } from '@angular/compiler/src/output/source_map';

declare var M: any;

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./../../app.component.css']
})
export class ClientsComponent implements OnInit {

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.getClients();
  }

  addClient(form: NgForm) {
    if (form.value._id) {
      this.clientService.putClient(form.value)
      .subscribe( res => {
        this.resetForm(form);
        M.toast({html: 'Updated successfully'});
        this.getClients();
      });
    } else {
      this.clientService.postClient(form.value)
      .subscribe( res => {
        this.resetForm(form);
        M.toast({html: 'Save Successfully'});
        this.getClients();
      });
    }
  }

  getClients() {
    this.clientService.getClients()
    .subscribe( res => {
      this.clientService.clients = res as Client[];
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

  editClient(client: Client) {
    this.clientService.selectedClient = client;
  }

  deleteClient(_id: string) {
    if (confirm('Are you sure you want to delte it?')) {
      this.clientService.deleteClient(_id)
      .subscribe( res => {
        M.toast({html: 'Client deleted'});
        this.getClients();
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
