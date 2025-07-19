import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
    selector: 'app-blog-post-detail',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule
    ],
    template: `
        <div class="post-detail-page">
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
                </div>
                
                <!-- Post Content Card -->
                <div class="post-card">
                    <div *ngIf="post; else loading" class="post-content">
                        <h1 class="post-title">{{ post.title }}</h1>
                        
                        <div class="post-meta">
                            <div class="meta-item">
                                <i class="pi pi-user"></i>
                                <span>{{ post.author.username }}</span>
                            </div>
                            <div class="meta-item">
                                <i class="pi pi-calendar"></i>
                                <span>{{ post.publishedDate | date:'mediumDate' }}</span>
                            </div>
                            <div class="meta-item">
                                <i class="pi pi-clock"></i>
                                <span>{{ post.publishedDate | date:'shortTime' }}</span>
                            </div>
                        </div>
                        
                        <div class="post-body">
                            <div [innerHTML]="formatContent(post.body)"></div>
                        </div>
                    </div>
                    
                    <ng-template #loading>
                        <div class="loading-content">
                            <i class="pi pi-spin pi-spinner"></i>
                            <p>Loading post...</p>
                        </div>
                    </ng-template>
                </div>
            </div>
        </div>
    `,
    styles: [`
        /* Page Layout */
        .post-detail-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 2rem 0;
        }

        .container {
            max-width: 900px;
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
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .back-button:hover {
            background: white;
            border-color: #007bff;
            color: #007bff;
            transform: translateX(-5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        /* Post Card */
        .post-card {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
        }

        .post-content {
            max-width: 100%;
        }

        .post-title {
            font-size: 3rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .post-meta {
            display: flex;
            gap: 2rem;
            margin-bottom: 2.5rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #6c757d;
            font-size: 0.95rem;
            font-weight: 500;
        }

        .meta-item i {
            color: #007bff;
            font-size: 0.9rem;
        }

        .post-body {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #495057;
        }

        .post-body h1, .post-body h2, .post-body h3 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        .post-body h1 {
            font-size: 2rem;
            font-weight: 600;
        }

        .post-body h2 {
            font-size: 1.5rem;
            font-weight: 600;
        }

        .post-body h3 {
            font-size: 1.25rem;
            font-weight: 600;
        }

        .post-body p {
            margin-bottom: 1.5rem;
        }

        .post-body code {
            background: #f8f9fa;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }

        .post-body pre {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid #e9ecef;
        }

        .post-body pre code {
            background: none;
            padding: 0;
        }

        /* Loading State */
        .loading-content {
            text-align: center;
            padding: 3rem;
            color: #007bff;
        }

        .loading-content i {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: block;
        }

        .loading-content p {
            margin: 0;
            font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 0 0.5rem;
            }

            .post-card {
                padding: 2rem 1.5rem;
            }

            .post-title {
                font-size: 2rem;
            }

            .post-meta {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }
        }
    `]
})
export class BlogPostDetail implements OnInit {
    post: BlogPost | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private blogService: BlogService
    ) {}

    ngOnInit() {
        const postId = this.route.snapshot.paramMap.get('id');
        if (postId) {
            this.loadPost(postId);
        }
    }

    loadPost(id: string) {
        this.blogService.getPost(id).subscribe({
            next: (post) => {
                this.post = post;
            },
            error: (error) => {
                console.error('Error loading post:', error);
                // For demo purposes, load mock data
            }
        });
    }

    formatContent(content: string): string {
        // Convert markdown-style content to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/## (.*?)$/gm, '<h2>$1</h2>') // H2
            .replace(/# (.*?)$/gm, '<h1>$1</h1>') // H1
            .replace(/### (.*?)$/gm, '<h3>$1</h3>') // H3
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
            .replace(/\n/g, '<br>'); // Line breaks
    }

    goBack() {
        this.router.navigate(['/blog']);
    }
} 