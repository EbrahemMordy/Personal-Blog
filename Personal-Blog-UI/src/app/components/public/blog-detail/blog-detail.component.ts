import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Blog, formatBlogDate } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4" *ngIf="blog">
      <div class="mb-4">
        <a routerLink="/" class="btn btn-outline-secondary">
          &larr; Back to Blogs
        </a>
      </div>
      
      <h1 class="mb-3">{{ blog.name }}</h1>
      <p class="text-muted mb-4">Posted on {{ formatDate(blog.createdDate) }}</p>
      
      <div class="blog-content">
        <p>{{ blog.content }}</p>
      </div>
    </div>
    
    <div class="container py-4" *ngIf="!blog">
      <div class="alert alert-danger">
        Blog post not found.
        <a routerLink="/" class="alert-link">Return to blog list</a>
      </div>
    </div>
  `,
  styles: []
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.blogService.getBlogById(id).subscribe({
          next: (blog) => {
            this.blog = blog;
          },
          error: () => {}
        });
      }
    });
  }
  
  formatDate(date: any): string {
    return formatBlogDate(date);
  }
} 