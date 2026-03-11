import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
  _id?: string;
  orgId?: string;
  title: string;
  required: boolean;
  uploadRequired: boolean;
  isRelated: boolean;
  hasDocuments: boolean;
  perSite: boolean;
  isDeleted?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api =  'https://task-manegement.onrender.com/api/documents';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.api);
  }

  getById(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.api}/${id}`);
  }

  add(doc: Document): Observable<Document> {
    return this.http.post<Document>(this.api, doc);
  }

  update(id: string, doc: Document): Observable<Document> {
    return this.http.put<Document>(`${this.api}/${id}`, doc);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}