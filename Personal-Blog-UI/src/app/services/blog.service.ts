import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Blog, convertBlog } from '../models/blog.model';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8080/api/blog';
  private blogsSubject = new BehaviorSubject<Blog[]>([]);

  constructor(private http: HttpClient) {
    this.loadAllBlogs();
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  }

  private loadAllBlogs(): void {
    this.http.get<any[]>(this.apiUrl, this.getHttpOptions())
      .pipe(
        map(blogDataArray => {
          return blogDataArray.map(blogData => convertBlog(blogData));
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (blogs) => {
          this.blogsSubject.next(blogs as Blog[]);
        },
        error: () => {
          this.blogsSubject.next([]);
        }
      });
  }

  getBlogs(): Observable<Blog[]> {
    this.loadAllBlogs();
    return this.blogsSubject.asObservable();
  }

  getBlogById(id: number): Observable<Blog | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions())
      .pipe(
        map(blogData => {
          if (!blogData) return undefined;
          if (blogData.createdAt && !blogData.createdDate) {
            blogData.createdDate = blogData.createdAt;
          }
          return convertBlog(blogData);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  addBlog(blog: Omit<Blog, 'id'>): Observable<Blog> {
    const apiPayload = {
      name: blog.name,
      content: blog.content,
      createdAt: blog.createdDate
    };
    
    return this.http.post<Blog>(`${this.apiUrl}/new`, apiPayload, this.getHttpOptions())
      .pipe(
        tap(newBlog => {
          const currentBlogs = this.blogsSubject.value;
          this.blogsSubject.next([...currentBlogs, convertBlog(newBlog)]);
        }),
        catchError(this.handleError<Blog>('addBlog'))
      );
  }

  updateBlog(blog: Blog): Observable<Blog> {
    const apiPayload = {
      id: blog.id,
      name: blog.name,
      content: blog.content,
      createdAt: blog.createdDate
    };
    
    const updateUrl = `${this.apiUrl}/update/${blog.id}`;
    
    return this.http.put<Blog>(updateUrl, apiPayload)
      .pipe(
        map(response => {
          return convertBlog(response);
        }),
        tap(updatedBlog => {
          const currentBlogs = this.blogsSubject.value;
          const updatedBlogs = currentBlogs.map(b => b.id === updatedBlog.id ? updatedBlog : b);
          this.blogsSubject.next(updatedBlogs);
          
          this.loadAllBlogs();
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, this.getHttpOptions())
      .pipe(
        tap(() => {
          const currentBlogs = this.blogsSubject.value;
          const filteredBlogs = currentBlogs.filter(b => b.id !== id);
          this.blogsSubject.next(filteredBlogs);
        }),
        catchError(this.handleError<void>(`deleteBlog id=${id}`))
      );
  }

  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }

  refreshBlogs(): void {
    this.loadAllBlogs();
  }
} 