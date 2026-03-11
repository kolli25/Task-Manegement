import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./task/task-module').then(m => m.TaskModule)
  },
  // ✅ Add this!
  {
    path: 'documents',
    loadComponent: () =>
      import('./document/document-list/document-list')
      .then(m => m.DocumentList)
  }
];