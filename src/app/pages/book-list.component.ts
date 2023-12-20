import { BookService } from './../services/book.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, map } from 'rxjs';
import { NewBookComponent } from '../components/new-book.component';
import { Book } from '../models/Book';
import { EditBookComponent } from '../components/edit-book.component';
import { MatIconModule } from '@angular/material/icon';

/**
 * Represents the component for displaying a list of books.
 */

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule,MatDialogModule, RouterModule, FormsModule, MatCardModule,MatIconModule],
  template: `
    <div class="container-library d-flex">
      <div class="col-2">
        <div class="d-flex flex-column">
          <div>
          <button  matTooltip="add book" mat-fab class="next-button add mb-1 mt-3"(click)="openAddDialog()" >
            <!-- icon add -->
            <mat-icon class="pt-1">add</mat-icon>
            Aggiundi libro
          </button>
          </div>
          <!-- filter  search-->
          <div class="search-container d-flex">
            <input  type="text" placeholder="Search.."  name="Cerca libro" [(ngModel)]="searchText" (keyup)="Search()">
            <button type="submit" class="next-button search"><mat-icon>search</mat-icon></button>
          </div>
        </div>
        <!-- delete books  -->
        <div *ngIf="!deleteToggle" class="d-flex flex-column">
          <div class="d-flex flex-column">
            <button matTooltip="delete book" mat-fab class="next-button add mb-1 mt-3" (click)="deletedBooks()">
              <!-- icon delete -->
              <mat-icon class="pt-1">delete</mat-icon>
             Libri eliminati
            </button>
          </div>
        </div>
        <div *ngIf="deleteToggle" class="d-flex flex-column">
          <div class="d-flex flex-column">
            <button matTooltip="delete book" mat-fab class="next-button add mb-1 mt-3" (click)="deletedBooks()">
            Elimina filtro
            </button>
          </div>
        </div>
      </div>
      <div class="col-10 row">
        <!-- save array from async  -->
      <div class="col-4 p-3" *ngFor="let item of book$ | async">
          <mat-card class="example-card">
            <mat-card-header>
              <div mat-card-avatar class="example-header-image"></div>
              <mat-card-title class="titleCard">{{item.title}}</mat-card-title>
              <mat-card-subtitle>{{item.author}}</mat-card-subtitle>
            </mat-card-header>
            <img
            class="img"
            *ngIf="item.img"
              mat-card-image
              [src]="item.img"
              alt="Photo of a Shiba Inu"
            />
            <img
            *ngIf="!item.img"
            class="img"
              mat-card-image
              src="https://media.istockphoto.com/id/628925698/vector/pile-of-hardcover-books.jpg?s=612x612&w=0&k=20&c=UskxzCZAQ4LXrgMhgW3M8Q5jdtWFPZ8WxwosF6h6euI="
              alt="Photo of a Shiba Inu"
            />
            <mat-card-content>
              <p class="desc">
                {{item.plot}}
              </p>
            </mat-card-content>
            <mat-card-actions class="d-flex justify-content-end">
              <button class="next-button" [routerLink]="['/book/', item.id]" mat-button>Visualizza</button>
              <button class="next-button " (click)="editBook(item.id)" mat-button>Modifica</button>
            </mat-card-actions>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: `
  .add{
    height: 40px!important;
  }
  .search{
    height: 30px!important;
    float: right!important;
    margin: 0px!important;

  }
  .container-library{
    width: 90%;
    margin: 0 auto;
  }
  .desc{
    height: 150px;
    overflow: scroll;
  }
  .titleCard{
    width: 100%!important;
  }
  .next-button{
  float: right;
  height: 30px;
  border-radius: 5px;
  border: none;
  font-size: 18px;
  background-color: #2cacd6;
  color: #fff;
  margin-right: 20%;
}
.next-button:hover{
  background-color: #1e7a98;
  color: #fff;
}
  .img{
    height: 200px;
    min-width: 100%;
    object-fit: cover;
  }
.search-container{
 margin-top: 20px;

}
  `,
})
export class BookListComponent {
  /**
   * Subscription to the dialog.
   */
  private _dialogSubscription: Subscription = new Subscription();

  /**
   * Observable of the book list.
   */
  book$: Observable<Book[]> | undefined;

  /**
   * The search text entered by the user.
   */
  searchText: string = '';

   /**
   * toggle delete books
   */
   deleteToggle: boolean = false;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
  ) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.book$ = this.bookService.bookList$;
    this.bookService.getBookList();
  }

  /**
   * Opens the add book dialog.
   */
  openAddDialog() {
    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = this.dialog
      .open(NewBookComponent)
      .afterClosed()
      .subscribe({
        next: (result) => {
          this.reloadData();
        },
        error: (e) => {
        }
      });
  }

  /**
   * Reloads the book list.
   */
  reloadData() {
    this.bookService.getBookList();
  }

  /**
   * Opens the edit book dialog.
   * @param id The ID of the book to edit.
   */
  editBook(id: number) {
    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = this.dialog
      .open(EditBookComponent, {
        data: { id: id }
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

  /**
   * Reloads the book list.
   */
  reload() {
    this.bookService.getBookList();
  }

  /**
   * Performs a search based on the entered search text.
   */
  Search() {
    if(this.searchText.length > 0){
      this.bookService.searchBook(this.searchText);
    }else{
      this.bookService.getBookList();
    }
  }

  deletedBooks(){
    if(this.deleteToggle){
      this.deleteToggle = false;
      this.bookService.getBookList();
    }else{
      this.deleteToggle = true;
      this.bookService.getBookListDelete();
    }
  }
}
