import { Component, OnInit } from '@angular/core';
import { ClientService } from './services/clientServices/client.service';
import { Client } from './models/client';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ClientService]
})
export class AppComponent implements OnInit {
  title = 'backOffice';

  public client: Client;
  public client_register: Client;
  public identity: Client;
  public token;
  public errorMessage;
  public alertRegister;

  constructor (
    private clientService: ClientService
  ) {
    this.client = new Client('', '', '', '', '', '' , '', 'ROLE_CLIENT', '');
    this.client_register = new Client('', '', '', '', '', '' , '', 'ROLE_CLIENT', '');
  }

  // MANTENER LA SESIÓN ABIERTA
  ngOnInit() {
    this.identity = this.clientService.getIdentity();
    this.token = this.clientService.getToken();
  }

  public onSubmit() {
    this.clientService.signup(this.client)
    .subscribe( res => {
      const myJSON = JSON.stringify(res);
      const iden = JSON.parse(myJSON);
      const identity = iden.client;
      this.identity = identity;

      if (!this.identity._id) {
        alert('El usuario no está correctamente identificado');
      } else {
        console.log(this.identity._id);
        // Crear elemento en el local storage para tener al usuario en sesion
        localStorage.setItem('identity', JSON.stringify(this.identity));

        // Conseguir token para enviarselo a cada petición
        this.clientService.signup(this.client, 'true').subscribe(
          response => {
            const myJSON2 = JSON.stringify(response);
            const iden2 = JSON.parse(myJSON2);
            const token = iden2.token;
            this.token = token;

            if (this.token.length <= 1) {
              alert('El token no se ha generado');
            } else {
              // Crear elemento en el local storage para tener el token disponible
              localStorage.setItem('token', token);
              this.client = new Client('', '', '', '', '', '', '', 'ROLE_CLIENT', '');
              console.log(this.clientService.getIdentity());
              console.log(this.clientService.getToken());
            }
          },
          error => {
            const errorMessage = <any>error;

            if (errorMessage != null) {
              const body = JSON.parse(error._body);
              this.errorMessage = body.message;
              console.log(error);
            }
          }
        );
      }
    });
  }

  public logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }
}
