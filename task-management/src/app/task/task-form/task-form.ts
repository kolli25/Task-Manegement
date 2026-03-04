import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCardModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
    NzLayoutModule,
    NzBreadCrumbModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm implements OnInit {
  taskForm!: FormGroup;
  isViewMode = false;
  isEditMode = false;
  taskId: string | null = null;

  statusOptions = [
    { label: '🕐 Pending', value: 'Pending' },
    { label: '🔄 In Progress', value: 'In Progress' },
    { label: '✅ Completed', value: 'Completed' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    // Build Form
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: ['Pending', Validators.required]
    });

    // Check route mode - view / edit / add
    this.taskId = this.route.snapshot.paramMap.get('id');
    const urlSegment = this.route.snapshot.url[0]?.path;

    if (urlSegment === 'view') {
      this.isViewMode = true;
      this.taskForm.disable();
    }

    if (urlSegment === 'edit') {
      this.isEditMode = true;
    }

    // ✅ Fix: Subscribe to Observable to load task data
    if (this.taskId) {
      this.taskService.getById(this.taskId).subscribe({
        next: (task) => {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
            status: task.status
          });
          // If view mode, disable after data loads
          if (this.isViewMode) {
            this.taskForm.disable();
          }
        },
        error: (err) => console.error('Error loading task:', err)
      });
    }
  }

  get pageTitle(): string {
    if (this.isViewMode) return 'View Task';
    if (this.isEditMode) return 'Edit Task';
    return 'Add New Task';
  }

  get pageIcon(): string {
    if (this.isViewMode) return 'eye';
    if (this.isEditMode) return 'edit';
    return 'plus-circle';
  }

  submit() {
    if (this.taskForm.invalid) {
      Object.values(this.taskForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formData = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      // ✅ Update existing task - Subscribe to Observable
      this.taskService.update(this.taskId, formData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error updating task:', err)
      });
    } else {
      // ✅ Add new task - Subscribe to Observable
      this.taskService.add(formData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => console.error('Error adding task:', err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/tasks']);
  }
}
