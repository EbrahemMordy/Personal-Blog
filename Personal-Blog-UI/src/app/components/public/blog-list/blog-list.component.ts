import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <h1 class="mb-4">Latest Blog Posts</h1>
      
      <div *ngIf="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading blogs...</p>
      </div>
      
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
        <button class="btn btn-sm btn-outline-danger ms-2" (click)="refreshBlogs()">Try Again</button>
      </div>
      
      <div *ngIf="!loading && !error" class="row">
        <div *ngIf="blogs.length === 0" class="col-12">
          <div class="alert alert-info">
            No blog posts found. Check back later for new content!
          </div>
        </div>
        
        <div *ngFor="let blog of blogs" class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ blog.name }}</h5>
              <p class="card-text text-muted">
                {{ blog.createdDate | date }}
              </p>
              <p class="card-text">
                {{ blog.content.substring(0, 150) }}...
              </p>
              <a [routerLink]="['/blog', blog.id]" class="btn btn-primary">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  loading = false;
  error = '';

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.error = '';
    
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        console.log('Blogs received in component:', blogs);
        this.blogs = blogs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching blogs in component:', err);
        this.error = 'Failed to load blogs. Please try again later.';
        this.loading = false;
      }
    });
  }

  refreshBlogs(): void {
    this.blogService.refreshBlogs();
    this.loadBlogs();
  }
} 