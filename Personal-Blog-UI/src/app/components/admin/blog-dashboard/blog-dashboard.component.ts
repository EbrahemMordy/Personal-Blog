import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';
import { Blog, formatBlogDate } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Blog Dashboard</h1>
        <div>
          <button class="btn btn-outline-secondary me-2" (click)="logout()">Logout</button>
          <a routerLink="/admin/blogs/new" class="btn btn-primary">Add New Blog</a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let blog of blogs">
              <td>{{ blog.id }}</td>
              <td>{{ blog.name }}</td>
              <td>{{ formatDate(blog.createdDate) }}</td>
              <td>
                <a [routerLink]="['/admin/blogs', blog.id]" class="btn btn-sm btn-primary me-2">Edit</a>
                <button (click)="deleteBlog(blog.id)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
            <tr *ngIf="blogs.length === 0">
              <td colspan="4" class="text-center">No blogs found. Create your first blog post!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class BlogDashboardComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
      },
      error: () => {}
    });
  }

  deleteBlog(id: number): void {
    if (confirm('Are you sure you want to delete this blog?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.loadBlogs();
        },
        error: () => {
          alert('Failed to delete blog. Please try again.');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
  
  formatDate(date: any): string {
    return formatBlogDate(date);
  }
} 