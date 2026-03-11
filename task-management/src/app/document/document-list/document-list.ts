import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzNotificationService } from 'ng-zorro-antd/notification'; 
import { DocumentService, Document } from '../document.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTagModule,
    NzSpinModule,
    NzTooltipModule,
    NzLayoutModule,
    NzCardModule
    
  ],
  providers: [NzNotificationService], 
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.scss']
})
export class DocumentList implements OnInit {
  documents: Document[] = [];
  isLoading = false;
  isModalVisible = false;
  isEditMode = false;
  editingId: string | null = null;
  form!: FormGroup;

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    private notification: NzNotificationService 
  ) {}

  ngOnInit() {
    this.buildForm();
    this.loadDocuments();
  }

  buildForm() {
    this.form = this.fb.group({
      title:          ['', [Validators.required, Validators.minLength(3)]],
      required:       [false],
      uploadRequired: [false],
      isRelated:      [false],
      hasDocuments:   [false],
      perSite:        [false]
    });
  }

  loadDocuments() {
    this.isLoading = true;
    setTimeout(() => {
      this.documentService.getAll().subscribe({
        next: (data) => {
          this.documents = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
    }, 600);
  }

  // Open Add Modal
  openAddModal() {
    this.isEditMode = false;
    this.editingId = null;
    this.form.reset({
      title: '',
      required: false,
      uploadRequired: false,
      isRelated: false,
      hasDocuments: false,
      perSite: false
    });
    this.isModalVisible = true;
  }

  // Open Edit Modal
  openEditModal(doc: Document) {
    this.isEditMode = true;
    this.editingId = doc._id!;
    this.form.patchValue({
      title:          doc.title,
      required:       doc.required,
      uploadRequired: doc.uploadRequired,
      isRelated:      doc.isRelated,
      hasDocuments:   doc.hasDocuments,
      perSite:        doc.perSite
    });
    this.isModalVisible = true;
  }

  // Close Modal
  closeModal() {
    this.isModalVisible = false;
    this.form.reset();
  }

  // Submit Form (Add or Edit)
  submitForm() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(c => {
        c.markAsDirty();
        c.updateValueAndValidity();
      });
      return;
    }

    if (this.isEditMode) {
      // UPDATE
      this.documentService.update(this.editingId!, this.form.value)
        .subscribe({
          next: () => {
            //  Bottom Right Notification!
            this.notification.success(
              ' Success!',
              'Document updated successfully!',
              {
                nzPlacement: 'bottomRight',
                nzDuration: 3000
              }
            );
            this.closeModal();
            this.loadDocuments();
          },
          error: (err) => console.error(err)
        });
    } else {
      // CREATE
      this.documentService.add(this.form.value)
        .subscribe({
          next: () => {
            //  Bottom Right Notification!
            this.notification.success(
              ' Success!',
              'Document added successfully!',
              {
                nzPlacement: 'bottomRight',
                nzDuration: 3000
              }
            );
            this.closeModal();
            this.loadDocuments();
          },
          error: (err) => console.error(err)
        });
    }
  }

  // Soft Delete
  deleteDocument(id: string) {
    this.documentService.delete(id).subscribe({
      next: () => {
        
        this.notification.warning(
          ' Deleted!',
          'Document deleted successfully!',
          {
            nzPlacement: 'bottomRight',
            nzDuration: 3000
          }
        );
        this.loadDocuments();
      },
      error: (err) => console.error(err)
    });
  }

  getBooleanColor(value: boolean): string {
    return value ? 'green' : 'red';
  }
}
