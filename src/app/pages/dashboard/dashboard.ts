import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, RouterModule],
    template: `
        <div class="grid">
            <div class="col-12">
                <div class="card">
                    <h1>Welcome to the Blog Application</h1>
                    <p class="text-lg mb-4">A modern blog built with Angular 17, PrimeNG, and AG Grid.</p>
                    
                    <div class="grid">
                        <div class="col-12 md:col-6">
                            <div class="card">
                                <h3>📝 Blog Posts</h3>
                                <p>View and manage blog posts with our powerful AG Grid interface.</p>
                                <p-button 
                                    label="View Blog" 
                                    icon="pi pi-book" 
                                    routerLink="/blog"
                                    severity="primary">
                                </p-button>
                            </div>
                        </div>
                        
                        <div class="col-12 md:col-6">
                            <div class="card">
                                <h3>✍️ Create Post</h3>
                                <p>Create new blog posts with our intuitive form interface.</p>
                                <p-button 
                                    label="Create Post" 
                                    icon="pi pi-plus" 
                                    routerLink="/blog/create"
                                    severity="success">
                                </p-button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <h3>🚀 Features</h3>
                        <ul class="list-disc list-inside space-y-2">
                            <li>AG Grid with pagination and sorting</li>
                            <li>JWT authentication</li>
                            <li>Responsive design with PrimeNG</li>
                            <li>Express.js backend with MongoDB</li>
                            <li>Real-time form validation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Dashboard {}
