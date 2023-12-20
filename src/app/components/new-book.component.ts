import { BookService } from './../services/book.service';
import { Component } from '@angular/core';
import { Book } from '../models/Book';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { User } from '../models/user';
import { TokenStorageService } from '../services/tokenStorage.service';
import { MatIconModule } from '@angular/material/icon';

/**
 * Represents the component for adding a new book.
 */

@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [ ReactiveFormsModule ,MatIconModule, RouterModule,MatFormFieldModule, MatDialogModule],
  template: `
 <mat-dialog-content class="container-book">
 <div class="">
  <div class="container-trip">
  <form #myForm id="myForm" [formGroup]="bookForm" >
      <h1 class="title">Ciao {{ currentUser?.username }}! Aggiungi il tuo libro.</h1>
      <!-- inscerisci il nome del tuo libro -->
      <div class="">
        <label for="title">Inserisci il nome del libro</label>
        <div class="d-flex">
          <input
            type="text"
            class="input-create"
            placeholder="Nome libro"
            formControlName="title"
          />
        </div>
      </div>
      <hr />

      <!-- inserisci l'autore del tuo libro -->
      <div class="">
        <label for="author">Inserisci l'autore del libro</label>
        <div class="d-flex">
          <input
            type="text"
            class="input-create"
            placeholder="Autore"
            formControlName="author"
          />
        </div>
      </div>
      <hr />
      <!-- inserisci l'isbn del tuo libro -->
      <div class="">
        <label for="isbn">Inserisci l'isbn del libro</label>
        <div class="d-flex">
          <input
            type="text"
            class="input-create"
            placeholder="ISBN"
            formControlName="isbn"
          />
        </div>
      </div>

      <hr />
      <!-- inserisci la trama del tuo libro -->
      <div class="">
        <label for="plot">Inserisci la trama del libro</label>
        <div class="d-flex">
          <input
            type="text"
            class="input-create"
            placeholder="Trama"
            formControlName="plot"
          />
        </div>
      </div>
      <hr />
      <!-- inserisci url immagine del tuo libro -->
      <div class="">
        <label for="img">Inserisci url immagine del libro</label>
        <div class="d-flex">
          <input
            type="text"
            class="input-create"
            placeholder="Url immagine"
            formControlName="img"
          />
        </div>
      </div>

  </form>
  </div>
</div>
 </mat-dialog-content>

<!-- Buttons back and save-->
<mat-dialog-actions class="d-flex flex-row justify-content-center">
  <button mat-raised-button  mat-dialog-close  class="previous previous-button action-button-previous">
    Indietro
  </button>
  <button
  class="next action-button next-button"
    (click)="onSubmit()"
  >
    salva
  </button>
</mat-dialog-actions>

  `,
  styles: `
  .container-book{
  height:90vh;
  width: 79vw;
  background-color: #f5f5f5;

}
.container-trip{
  width: 80%;
  margin: 0 auto;
}
.sticky{
  position: fixed;
  top: 0 !important;
  padding-top:10px;
}
hr{
  width: calc(90% + 50px);
  color: #9e9e9e;
}
.next-button{
  float: right;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 18px;
  background-color: #2cacd6;
  color: #fff;
  margin-right: 20%;
  width: 10%;
}
.next-button:hover{
  background-color: #1e7a98;
  color: #fff;
}
.previous-button{
  float: left;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 18px;
  background-color: #8c1aec;
  color: #fff;
  margin-left: 20%;
  width: 10%;
}
.previous-button:hover{
  background-color: #6a0ebc;
  color: #fff;
}

  `
})
export class NewBookComponent {

  imageUpload = document.getElementById('imageUpload');

 todayDate = new Date();
  book$: Observable<Book[]> | undefined;
  currentUser?: User;
  // form add new book
  bookForm = this.fb.group({
    id: [],
    title: ['', Validators.required],
    author: ['', Validators.required],
    isbn: ['', Validators.required],
    addedDate: [ this.todayDate, Validators.required],
    deleteBookDate: ['', Validators.required],
    plot: ['', Validators.required],
    img: ['', Validators.required],
  });

  constructor(
    public _dialogRef: MatDialogRef<NewBookComponent>,
    private fb: FormBuilder,
    private bookService: BookService,
    private token: TokenStorageService,
  ) { }

  ngOnInit(): void {
    // get user
    this.currentUser = this.token.getUser();
    this.bookService.getBookList()
    this.book$=this.bookService.bookList$

  }

  // add new book
  onSubmit() {
    const formData = Object.assign({});
      this.bookService
        .addBook(
          Object.assign(formData, this.bookForm.value)
        )
        .subscribe({
          next: (contact) => {
            this._dialogRef.close(contact);
            // this.reloadData();
          },
          error: () => {

          }
        });
    }

    // reload data
    reloadData() {
      this.bookService.getBookList();
    }
}

