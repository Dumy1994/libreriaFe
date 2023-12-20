
import { BookService } from './../services/book.service';
import { Component, Inject } from '@angular/core';
import { Book } from '../models/Book';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { User } from '../models/user';
import { TokenStorageService } from '../services/tokenStorage.service';
import { MatIconModule } from '@angular/material/icon';

//  Represents the EditBookComponent class.
//  This component is responsible for editing a book's details.


@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ ReactiveFormsModule ,MatIconModule, RouterModule,MatFormFieldModule, MatDialogModule],
  template: `
 <mat-dialog-content class="container-book">
 <div class="">
  <div class="container-trip">
  <form #myForm id="myForm" [formGroup]="bookForm" >
      <h1 class="title">Ciao ! Modifica il tuo libro.</h1>
      <!-- add name book -->
      <div class="">
        <label for="title">Inserisci il nome del libro</label>
        <div class="d-flex">
          <input
            type="text"
            value="{{book.title}}"
            class="input-create"
            placeholder="Nome libro"
            formControlName="title"
          />
        </div>
      </div>
      <hr />

      <!-- add author -->
      <div class="">
        <label for="author">Inserisci l'autore del libro</label>
        <div class="d-flex">
          <input
            type="text"
            value="{{book.author}}"
            class="input-create"
            placeholder="Autore"
            formControlName="author"
          />
        </div>
      </div>
      <hr />
      <!-- add isbn -->
      <div class="">
        <label for="isbn">Inserisci l'isbn del libro</label>
        <div class="d-flex">
          <input
            type="text"
            value="{{book.isbn}}"
            class="input-create"
            placeholder="ISBN"
            formControlName="isbn"
          />
        </div>
      </div>

      <hr />
      <!-- add plot -->
      <div class="">
        <label for="plot">Inserisci la trama del libro</label>
        <div class="d-flex">
          <input
            type="text"
            value="{{book.plot}}"
            class="input-create"
            placeholder="Trama"
            formControlName="plot"
          />
        </div>
      </div>
      <hr />
      <!-- add completereads -->
      <div class="">
        <label for="completeReads">Inserisci il numero di letture del libro</label>
        <div class="d-flex">
          <input
            type="number"
            value="{{book.completeReads}}"
            class="input-create"
            placeholder="Numero di letture"
            formControlName="completeReads"
          />
        </div>
      </div>


  </form>
  </div>
</div>
 </mat-dialog-content>
  <!-- Buttons back and save -->
  <mat-dialog-actions class="d-flex flex-row justify-content-center">
    <button mat-raised-button  mat-dialog-close  class="previous previous-button ">
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
export class EditBookComponent {

  book: any = {};

 todayDate = new Date();
  book$: Observable<Book[]> | undefined;
  currentUser?: User;

  // form for edit book
  bookForm = this.fb.group({
    id: [Number(this.data.id)],
    title: [this.book.title, Validators.required],
    author: [this.book.author, Validators.required],
    isbn: [this.book.isbn, Validators.required],
    plot: [this.book.plot, Validators.required],
    completeReads: [this.book.completeReads, Validators.required],
  });

  constructor(
    public _dialogRef: MatDialogRef<EditBookComponent>,
    private fb: FormBuilder,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: {id: string}
  ) { }

  ngOnInit(): void {
    // get book
    this.bookService.getBook(Number(this.data.id
    )).subscribe(
      (book:Book) => {
        this.book = book;
      });
    // get book list
    this.bookService.getBookList()
    this.book$=this.bookService.bookList$

  }

  // update book
  onSubmit() {
    const formData = Object.assign({});
      this.bookService
        .updateBook(
          Object.assign(formData, this.bookForm.value)
        )
        .subscribe({
          next: (contact) => {
            this._dialogRef.close(contact);
            this.reloadData();
          },
          error: () => {

          }
        });
    }

    // reload data
    reloadData() {
      this.bookService.getBook(Number(this.data.id
        )).subscribe(
          (book:Book) => {
            this.book = book;
          }
          );
    }
}

