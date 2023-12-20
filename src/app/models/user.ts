import { Role } from "./Role";

export class  User{
  id?: number;
  username?: string;
  email?: string;
  roles?: Role[];
  nome?: string;
  cognome?: string;
  dataNascita?: Date;
  indirizzo?: string;
  telefono?: string;
  cap?: string;
  citta?: string;

  constructor(id?: number, username?: string, email?: string, roles?: Role[], nome?: string, cognome?: string, dataNascita?: Date, indirizzo?: string, telefono?: string, cap?: string, citta?: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
    this.nome = nome;
    this.cognome = cognome;
    this.dataNascita = dataNascita;
    this.indirizzo = indirizzo;
    this.telefono = telefono;
    this.cap = cap;
    this.citta = citta;
  }
}
