import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Book } from '../models/Book';
import { BookService } from '../services/book.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EditBookComponent } from './edit-book.component';
/**
 * Component for displaying the details of a book.
 */
@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [ ReactiveFormsModule ,CommonModule ,MatIconModule, RouterModule,MatFormFieldModule, MatDialogModule],
  template: `
    <!-- detail book  -->
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card mb-4 mt-4">
            <div class="card-header">
              <h3 class="card-title">Dettagli libro</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <img  *ngIf="book.img" class="img" src="{{book?.img}}" alt="{{book?.title}}" class="img-fluid">
                  <img
            *ngIf="!book.img"
            class="img"
              mat-card-image
              src="https://media.istockphoto.com/id/628925698/vector/pile-of-hardcover-books.jpg?s=612x612&w=0&k=20&c=UskxzCZAQ4LXrgMhgW3M8Q5jdtWFPZ8WxwosF6h6euI="
              alt="Photo of a Shiba Inu"
            />
                </div>
                <div class="col-md-9">
                  <h3 *ngIf="book?.title">{{book?.title}}</h3>
                  <p *ngIf="book?.author">Autore: {{book?.author}}</p>
                  <p *ngIf="book?.isbn">ISBN: {{book?.isbn}}</p>
                  <p *ngIf="book?.addedDate">Data di aggiunta: {{book?.addedDate}}</p>
                  <p *ngIf="book?.deleteBookDate">Data di eliminazione: {{book?.deleteBookDate}}</p>
                  <p *ngIf="book?.plot">Trama: {{book?.plot}}</p>
                  <p *ngIf="book?.completeReads > 0">Numero di letture: {{book?.completeReads}}</p>
                  <p *ngIf="book?.isDeleted == true">Questo libro è stato eliminato</p>
                </div>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-around">
              <button [routerLink]="['/bookList']" routerLinkActive="router-link-active"  class="previous-button">Indietro</button>
               <button *ngIf="book?.isDeleted == false || !book?.isDeleted" class="next-button" (click)="swallDelete(book?.id)">Elimina</button>
                <button *ngIf="book?.isDeleted == true" class="next-button" (click)="restore()">Ripristina</button>
               <button class="next-button" (click)="editBook()">Modifica</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
  .img{
    width: 100%;
    height: 100%;
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
export class BookDetailComponent {

  private _dialogSubscription: Subscription = new Subscription();
  book: any = {};
  routeParams = this.route.snapshot.paramMap;

 todayDate = new Date();
 bookForm = this.fb.group({
 id: [Number(this.routeParams.get('id')), Validators.required],
 deleteBookDate: [this.todayDate, Validators.required],
 isDeleted: [true, Validators.required],

 });
  constructor(
    private bookService: BookService,
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // get book
    this.bookService.getBook(Number(this.routeParams.get('id')
    )).subscribe(
      (book:Book) => {
        this.book = book;
      });
  }

  // delete book
  deleteBook(id: number) {
    const formData = Object.assign({});
    this.bookService.deleteBook(Object.assign(formData, this.bookForm.value)).subscribe(
      (book: any) => {
        this.book = book;
      }
    );
  }

  // open edit dialog and pass id
  editBook() {
    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = this.dialog
      .open(EditBookComponent, {
        data: { id: this.book.id }
      })
      .afterClosed()
      .subscribe({
        next: (result) => {
          if (result) {
            this.reload();
          }
        },
        error: (e) => {
        }
      });
  }

  // reload data
  reload(){
    this.bookService.getBook(Number(this.routeParams.get('id')
    )).subscribe(
      (book:Book) => {
        this.book = book;
      });
  }

  // restore book
  restore(){
    const formData = Object.assign({});
    this.bookService.restoreBook(Object.assign(formData, this.bookForm.value)).subscribe(
      (book: any) => {
        this.book = book;
      }
      );
      this.successNotification()
  }

  // delete book with swal
  swallDelete(id:number){
    Swal.fire({
      title: 'Sei sicuro di voler eliminare ' + this.book.title +  '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, elimina',
      cancelButtonText: 'No, Cancella',

    }).then((result)=>{
      if (result.isConfirmed) {
        this.deleteBook(id)
        this.successNotification()
      } else if (result.isDenied) {
        Swal.fire('')
      }
    })
  }


  successNotification() {
    Swal.fire('Operazione completata con successo').then((result)=>{
      });

  }

  errorNotification(){
    Swal.fire('Errore', 'Qualcosa è andato storto', 'error')
  }
}
