import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClientsComponent } from './components/clients/clients.component';
import { BookComponent } from './components/book/book.component';
import { VispdfComponent } from './vispdf/vispdf.component';



@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    BookComponent,
    VispdfComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
