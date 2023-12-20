import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/Book';
import { environment } from '../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './tokenStorage.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private dataSource: Subject<Book[]> = new Subject<Book[]>();
  bookList$ = this.dataSource.asObservable();
  private baseUrl = environment.endpoint + '/book';
   options = {
    headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token.getToken())
  };
  constructor( private token: TokenStorageService,private http: HttpClient) {

   }

  getBookList() {
    this.http.get<Book[]>(this.baseUrl,this.options).subscribe(data => {
      this.dataSource.next(data.filter(book => book.isDeleted === false || book.isDeleted === null));
    });
  }
  getBookListDelete() {
    this.http.get<Book[]>(this.baseUrl,this.options).subscribe(data => {
      this.dataSource.next(data.filter(book => book.isDeleted === true));
    });
  }
  getBook(id: number) {
    return this.http.get<Book>(this.baseUrl + '/' + id,this.options);
  }
  addBook(book: Book) {
    return this.http.post(this.baseUrl, book, this.options);
  }
  updateBook(book: Book) {
    return this.http.put(this.baseUrl + '/' + book.id, book, this.options);
  }
  deleteBook(book: Book) {
    return this.http.put(this.baseUrl + '/delete/' + book.id,book,this.options);
  }
  restoreBook(book: Book) {
    return this.http.put(this.baseUrl + '/restore/' + book.id,book,this.options);
  }
  searchBook(searchValue: string) {
    this.http.get<Book[]>(this.baseUrl + '/search/' + searchValue,this.options).subscribe(data => {
      this.dataSource.next(data);
    });
  }


}
