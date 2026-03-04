import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api = 'https://task-manegement.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  getById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.api}/${id}`);
  }

  add(task: Omit<Task, '_id'>): Observable<Task> {
    return this.http.post<Task>(this.api, task);
  }

  update(id: string, task: Omit<Task, '_id'>): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, task);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
// ```

// **What changed?**
// ```
// Before → data stored in memory array (lost on refresh)
// Now    → data stored in MongoDB via HTTP calls