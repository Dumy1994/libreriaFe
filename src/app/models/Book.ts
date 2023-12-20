export class  Book{
  id: number;
  title: string;
  author: string;
  isbn: string;
  addedDate: Date;
  deleteBookDate: Date;
  plot: string;
  completeReads: number;
  isDeleted: boolean;
  img : File;


  constructor(id: number, title: string, img: File, author: string, isbn: string, addedDate: Date, deleteBookDate: Date, plot: string, completeReads: number, isDeleted: boolean) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.addedDate = addedDate;
    this.deleteBookDate = deleteBookDate;
    this.plot = plot;
    this.completeReads = completeReads;
    this.isDeleted = isDeleted;
    this.img = img;
  }
}
