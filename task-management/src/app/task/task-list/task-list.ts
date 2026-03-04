import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TaskService, Task } from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzPopconfirmModule,
    NzLayoutModule,
    NzCardModule,
    NzTooltipModule,
    NzDividerModule,
    NzSpinModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  // ✅ Only ONE loadTasks() with isLoading
  loadTasks() {
    this.isLoading = true;
    setTimeout(() => {
      this.taskService.getAll().subscribe({
        next: (data) => {
          this.tasks = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading tasks:', err);
          this.isLoading = false;
        }
      });
    }, 800);
  }

  get pendingCount() {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  get inProgressCount() {
    return this.tasks.filter(t => t.status === 'In Progress').length;
  }

  get completedCount() {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  getStatusColor(status: string): string {
    const map: any = {
      'Pending': 'orange',
      'In Progress': 'blue',
      'Completed': 'green'
    };
    return map[status] || 'default';
  }

  addTask() { this.router.navigate(['/tasks/add']); }
  view(id: string) { this.router.navigate(['/tasks/view', id]); }
  edit(id: string) { this.router.navigate(['/tasks/edit', id]); }

  delete(id: string) {
    this.taskService.delete(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error deleting task:', err)
    });
  }
}