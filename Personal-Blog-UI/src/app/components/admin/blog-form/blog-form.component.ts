import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/admin" class="btn btn-outline-secondary me-3">
          &larr; Back to Dashboard
        </a>
        <h1 class="mb-0">{{ isEditMode ? 'Edit' : 'Create' }} Blog Post</h1>
      </div>

      <div class="card">
        <div class="card-body">
          <form [formGroup]="blogForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="name" class="form-label">Blog Title</label>
              <input 
                type="text" 
                class="form-control" 
                id="name" 
                formControlName="name"
                [ngClass]="{'is-invalid': submitted && blogForm.get('name')?.errors}"
              >
              <div *ngIf="submitted && blogForm.get('name')?.errors" class="invalid-feedback">
                <div *ngIf="blogForm.get('name')?.errors?.['required']">Title is required</div>
              </div>
            </div>
            
            <div class="mb-3">
              <label for="content" class="form-label">Content</label>
              <textarea 
                class="form-control" 
                id="content" 
                rows="10" 
                formControlName="content"
                [ngClass]="{'is-invalid': submitted && blogForm.get('content')?.errors}"
              ></textarea>
              <div *ngIf="submitted && blogForm.get('content')?.errors" class="invalid-feedback">
                <div *ngIf="blogForm.get('content')?.errors?.['required']">Content is required</div>
              </div>
            </div>
            
            <div *ngIf="error" class="alert alert-danger mb-3">
              {{ error }}
            </div>
            
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-secondary me-2" routerLink="/admin">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEditMode ? 'Update' : 'Create' }} Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode = false;
  blogId: number | null = null;
  submitted = false;
  loading = false;
  error = '';
  originalBlog: Blog | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {
    this.blogForm = this.formBuilder.group({
      name: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.blogId = Number(id);
      this.loadBlog(this.blogId);
    } else {
      this.isEditMode = false;
    }
  }
  
  loadBlog(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.blogService.getBlogById(id).subscribe({
      next: blog => {
        if (blog) {
          this.originalBlog = blog;
          this.blogForm.patchValue({
            name: blog.name,
            content: blog.content
          });
        } else {
          this.error = 'Blog not found';
        }
        this.loading = false;
      },
      error: error => {
        this.error = 'Error loading blog: ' + (error.message || 'Unknown error');
        this.loading = false;
      }
    });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.blogForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const formData = {
      name: this.blogForm.get('name')?.value,
      content: this.blogForm.get('content')?.value
    };
    
    if (this.isEditMode && this.blogId) {
      if (!this.originalBlog) {
        this.error = 'Error: Cannot update blog because original data is missing';
        this.loading = false;
        return;
      }
      
      const updatedBlog: Blog = {
        id: this.blogId,
        name: formData.name,
        content: formData.content,
        createdDate: this.originalBlog.createdDate
      };
      
      this.blogService.updateBlog(updatedBlog).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.error = 'Error updating blog: Endpoint not found (404). Please check API paths.';
          } else if (error.status === 400) {
            this.error = 'Error updating blog: Bad request (400). Server rejected the data format.';
          } else if (error.status === 0) {
            this.error = 'Error updating blog: Network error. Server might be down or unreachable.';
          } else {
            this.error = 'Error updating blog: ' + (error.message || 'Unknown error');
          }
          
          this.loading = false;
        }
      });
    } else {
      const newBlogData = {
        ...formData,
        createdDate: new Date()
      };
      
      this.blogService.addBlog(newBlogData).subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: error => {
          this.error = 'Error creating blog: ' + (error.message || 'Unknown error');
          this.loading = false;
        }
      });
    }
  }
} 