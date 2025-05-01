import { Routes } from '@angular/router';
import { BlogListComponent } from './components/public/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/public/blog-detail/blog-detail.component';
import { LoginComponent } from './components/admin/login/login.component';
import { BlogDashboardComponent } from './components/admin/blog-dashboard/blog-dashboard.component';
import { BlogFormComponent } from './components/admin/blog-form/blog-form.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: BlogListComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  
  // Admin routes
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin', 
    component: BlogDashboardComponent,
    canActivate: [authGuard]
  },
  // Route for creating a new blog
  { 
    path: 'admin/blogs/new', 
    component: BlogFormComponent,
    canActivate: [authGuard]
  },
  // Route for editing an existing blog
  { 
    path: 'admin/blogs/:id', 
    component: BlogFormComponent,
    canActivate: [authGuard]
  },
  
  // Redirect any unknown paths to home
  { path: '**', redirectTo: '' }
];
