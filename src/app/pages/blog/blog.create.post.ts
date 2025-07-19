import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { BlogService, CreatePostRequest } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-blog-create-post',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        MessageModule,
        MessagesModule
    ],
    template: `
        <div class="create-post-page">
            <div class="p-4">
                <!-- Header Section -->
                <div class="header-section">
                    <button 
                        class="back-button"
                        (click)="goBack()"
                        type="button">
                        <i class="pi pi-arrow-left"></i>
                        <span>Back to Posts</span>
                    </button>
                    
                    <div class="title-section">
                        <h1 class="page-title">
                            <i class="pi pi-pencil"></i>
                            Create New Blog Post
                        </h1>
                        <p class="page-subtitle">Share your thoughts and ideas with the world</p>
                    </div>
                </div>

                <!-- Form Card -->
                <div class="form-card">
                    <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="blog-form">
                        
                        <!-- Title Field -->
                        <div class="form-field">
                            <label for="title" class="field-label">
                                <i class="pi pi-tag"></i>
                                Post Title
                            </label>
                            <div class="input-wrapper">
                                <input 
                                    id="title" 
                                    type="text" 
                                    formControlName="title"
                                    placeholder="Enter a compelling title for your post..."
                                    [class.ng-invalid]="isFieldInvalid('title')"
                                    [class.ng-dirty]="isFieldInvalid('title')"
                                    class="form-input">
                                <div class="input-icon">
                                    <i class="pi pi-pencil"></i>
                                </div>
                            </div>
                            <small 
                                *ngIf="isFieldInvalid('title')" 
                                class="error-message">
                                <i class="pi pi-exclamation-triangle"></i>
                                Title is required and must be at least 3 characters long.
                            </small>
                        </div>
                        
                        <!-- Content Field -->
                        <div class="form-field">
                            <label for="body" class="field-label">
                                <i class="pi pi-file-edit"></i>
                                Content
                            </label>
                            <div class="textarea-wrapper">
                                <textarea 
                                    id="body" 
                                    formControlName="body"
                                    placeholder="Write your amazing blog post content here. Share your insights, experiences, and knowledge..."
                                    [rows]="12"
                                    [class.ng-invalid]="isFieldInvalid('body')"
                                    [class.ng-dirty]="isFieldInvalid('body')"
                                    class="form-textarea">
                                </textarea>
                                <div class="textarea-icon">
                                    <i class="pi pi-align-left"></i>
                                </div>
                            </div>
                            <small 
                                *ngIf="isFieldInvalid('body')" 
                                class="error-message">
                                <i class="pi pi-exclamation-triangle"></i>
                                Content is required and must be at least 10 characters long.
                            </small>
                        </div>
                        
                        <!-- Submit Section -->
                        <div class="submit-section">
                            <button 
                                type="submit" 
                                class="submit-button"
                                [disabled]="postForm.invalid || isSubmitting"
                                [class.loading]="isSubmitting">
                                <span class="button-content" *ngIf="!isSubmitting">
                                    <i class="pi pi-check"></i>
                                    Create Post
                                </span>
                                <span class="loading-content" *ngIf="isSubmitting">
                                    <i class="pi pi-spin pi-spinner"></i>
                                    Creating...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Messages -->
                <div class="messages-wrapper">
                    <p-messages 
                        *ngIf="messages.length > 0"
                        [value]="messages">
                    </p-messages>
                </div>
            </div>
        </div>
    `,
    styles: [`
        /* Page Layout */
        .create-post-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 2rem 0;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        /* Header Section */
        .header-section {
            margin-bottom: 2rem;
        }

        .back-button {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            padding: 0.75rem 1.25rem;
            color: #495057;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .back-button:hover {
            background: white;
            border-color: #007bff;
            color: #007bff;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .title-section {
            text-align: center;
        }

        .page-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
        }

        .page-title i {
            color: #007bff;
            font-size: 2rem;
        }

        .page-subtitle {
            color: #6c757d;
            font-size: 1.1rem;
            font-weight: 400;
            margin: 0;
        }

        /* Form Card */
        .form-card {
            background: white;
            border-radius: 16px;
            padding: 2.5rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
        }

        .blog-form {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        /* Form Fields */
        .form-field {
            position: relative;
        }

        .field-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #495057;
            margin-bottom: 0.75rem;
            font-size: 1rem;
        }

        .field-label i {
            color: #007bff;
            font-size: 0.9rem;
        }

        /* Input Wrapper */
        .input-wrapper, .textarea-wrapper {
            position: relative;
        }

        .form-input, .form-textarea {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.2s ease;
            background: #f8f9fa;
            color: #495057;
        }

        .form-input:focus, .form-textarea:focus {
            outline: none;
            border-color: #007bff;
            background: white;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input::placeholder, .form-textarea::placeholder {
            color: #adb5bd;
        }

        .form-textarea {
            resize: vertical;
            min-height: 200px;
            line-height: 1.6;
        }

        /* Input Icons */
        .input-icon, .textarea-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
            font-size: 0.9rem;
        }

        .textarea-icon {
            top: 1.5rem;
            transform: none;
        }

        /* Error States */
        .form-input.ng-invalid.ng-dirty,
        .form-textarea.ng-invalid.ng-dirty {
            border-color: #dc3545;
            background: #fff5f5;
        }

        .form-input.ng-invalid.ng-dirty:focus,
        .form-textarea.ng-invalid.ng-dirty:focus {
            border-color: #dc3545;
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

        .error-message {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-weight: 500;
        }

        .error-message i {
            font-size: 0.8rem;
        }

        /* Submit Section */
        .submit-section {
            display: flex;
            justify-content: center;
            margin-top: 1rem;
        }

        .submit-button {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            border: none;
            border-radius: 12px;
            padding: 1rem 2.5rem;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 180px;
            justify-content: center;
        }

        .submit-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
        }

        .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .submit-button.loading {
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        }

        .button-content, .loading-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        /* Messages */
        .messages-wrapper {
            margin-top: 1.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 0 0.5rem;
            }

            .form-card {
                padding: 1.5rem;
            }

            .page-title {
                font-size: 2rem;
            }

            .submit-button {
                width: 100%;
                padding: 1rem 1.5rem;
            }
        }

        /* Loading Animation */
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .pi-spin {
            animation: spin 1s linear infinite;
        }
    `]
})
export class BlogCreatePost implements OnInit {
    postForm: FormGroup;
    isSubmitting = false;
    messages: any[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private blogService: BlogService,
        private authService: AuthService
    ) {
        this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            body: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    ngOnInit() {
        // Check if user is authenticated
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
        }
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.postForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit() {
        if (this.postForm.valid) {
            this.isSubmitting = true;
            this.messages = [];

            const postData: CreatePostRequest = {
                title: this.postForm.value.title,
                body: this.postForm.value.body
            };

            this.blogService.createPost(postData).subscribe({
                next: (response) => {
                    this.messages = [{
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Blog post created successfully!'
                    }];
                    
                    // Navigate to the blog list after a short delay
                    setTimeout(() => {
                        this.router.navigate(['/blog']);
                    }, 1500);
                },
                error: (error) => {
                    console.error('Error creating post:', error);
                    this.messages = [{
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create blog post. Please try again.'
                    }];
                    this.isSubmitting = false;
                }
            });
        } else {
            // Mark all fields as touched to trigger validation display
            Object.keys(this.postForm.controls).forEach(key => {
                const control = this.postForm.get(key);
                control?.markAsTouched();
            });
        }
    }

    goBack() {
        this.router.navigate(['/blog']);
    }
} 