import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">Admin Login</h4>
            </div>
            <div class="card-body">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    formControlName="username" 
                    [ngClass]="{'is-invalid': submitted && loginForm.get('username')?.errors}"
                  >
                  <div *ngIf="submitted && loginForm.get('username')?.errors" class="invalid-feedback">
                    <div *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && loginForm.get('password')?.errors}"
                  >
                  <div *ngIf="submitted && loginForm.get('password')?.errors" class="invalid-feedback">
                    <div *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</div>
                  </div>
                </div>
                
                <div *ngIf="error" class="alert alert-danger mb-3">
                  {{ error }}
                </div>
                
                <button type="submit" class="btn btn-primary" [disabled]="loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.authService.login(username, password)
      .subscribe({
        next: success => {
          if (success) {
            this.router.navigate(['/admin']);
          } else {
            this.error = 'Invalid username or password';
            this.loading = false;
          }
        },
        error: error => {
          this.error = 'An error occurred during login';
          this.loading = false;
        }
      });
  }
} 