import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { BlogService, BlogPost } from '../../services/blog.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-blog-home',
    standalone: true,
    imports: [
        CommonModule,
        AgGridAngular,
        ButtonModule,
        CardModule,
        DropdownModule,
        FormsModule
    ],
    template: `
        <div class="blog-posts-page">
            <div class="container">
                <!-- Header Section -->
                <div class="header-section">
                    <div class="page-subtitle">Blog Posts</div>
                    <div class="header-content">
                        <h1 class="page-title">Latest Blog Posts</h1>
                        <p-button 
                            *ngIf="isAuthenticated" 
                            label="Create Post" 
                            icon="pi pi-plus" 
                            (onClick)="navigateToCreate()"
                            severity="success"
                            class="create-button">
                        </p-button>
                    </div>
                </div>
                
                <!-- Table Card -->
                <div class="table-card">
                    <!-- No Posts Message -->
                    <div *ngIf="rowData.length === 0" class="no-posts-message">
                        <div class="no-posts-icon">
                            <i class="pi pi-file-edit"></i>
                        </div>
                        <h3>No Blog Posts Found</h3>
                        <p>There are currently no blog posts available. Be the first to create one!</p>
                        <p-button 
                            *ngIf="isAuthenticated"
                            label="Create Your First Post" 
                            icon="pi pi-plus" 
                            (onClick)="navigateToCreate()"
                            severity="primary"
                            class="create-first-post-btn">
                        </p-button>
                        <p-button 
                            *ngIf="!isAuthenticated"
                            label="Login to Create Posts" 
                            icon="pi pi-sign-in" 
                            routerLink="/auth/login"
                            severity="secondary"
                            class="login-btn">
                        </p-button>
                    </div>
                    
                    <!-- AG Grid (only show when there are posts) -->
                    <div *ngIf="rowData.length > 0">
                        <ag-grid-angular
                            #agGrid
                            style="width: 100%; height: 600px;"
                            class="ag-theme-alpine"
                            [columnDefs]="columnDefs"
                            [rowData]="rowData"
                            [pagination]="false"
                            [defaultColDef]="defaultColDef"
                            (gridReady)="onGridReady($event)">
                        </ag-grid-angular>
                        
                        <!-- Custom Pagination Controls -->
                        <div class="custom-pagination">
                            <div class="pagination-info">
                                Showing {{ (currentPage - 1) * paginationPageSize + 1 }} to {{ Math.min(currentPage * paginationPageSize, totalPosts) }} of {{ totalPosts }} posts
                            </div>
                            <div class="pagination-controls">
                                <p-button 
                                    icon="pi pi-angle-double-left" 
                                    [disabled]="currentPage === 1"
                                    (onClick)="goToPage(1)"
                                    severity="secondary"
                                    size="small">
                                </p-button>
                                <p-button 
                                    icon="pi pi-angle-left" 
                                    [disabled]="currentPage === 1"
                                    (onClick)="goToPage(currentPage - 1)"
                                    severity="secondary"
                                    size="small">
                                </p-button>
                                <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
                                <p-button 
                                    icon="pi pi-angle-right" 
                                    [disabled]="currentPage === totalPages"
                                    (onClick)="goToPage(currentPage + 1)"
                                    severity="secondary"
                                    size="small">
                                </p-button>
                                <p-button 
                                    icon="pi pi-angle-double-right" 
                                    [disabled]="currentPage === totalPages"
                                    (onClick)="goToPage(totalPages)"
                                    severity="secondary"
                                    size="small">
                                </p-button>
                            </div>
                            <div class="page-size-selector">
                                <label>Page Size:</label>
                                <p-dropdown 
                                    [options]="pageSizeOptions" 
                                    [(ngModel)]="paginationPageSize"
                                    (onChange)="onPageSizeChange($event)"
                                    placeholder="Select page size">
                                </p-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        /* Page Layout */
        .blog-posts-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 2rem 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        /* Header Section */
        .header-section {
            margin-bottom: 2rem;
        }

        .page-subtitle {
            color: #007bff;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }

        .page-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin: 0;
        }

        .create-button {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 8px;
        }

        /* Table Card */
        .table-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
            position: relative;
        }

        /* View Button */
        :host ::ng-deep .view-btn {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        :host ::ng-deep .view-btn:hover {
            background: #0056b3;
            transform: translateY(-1px) scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
        }

        :host ::ng-deep .view-btn i {
            font-size: 0.8rem;
        }

        /* AG Grid Styling */
        :host ::ng-deep .ag-theme-alpine {
            --ag-header-height: 60px;
            --ag-row-height: 70px;
            --ag-header-background-color: #f8f9fa;
            --ag-odd-row-background-color: #fafbfc;
            --ag-row-hover-color: #e3f2fd;
            --ag-selected-row-background-color: #e3f2fd;
            --ag-border-color: #e9ecef;
            --ag-cell-horizontal-border: solid #e9ecef;
            --ag-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --ag-font-size: 14px;
        }
        
        :host ::ng-deep .ag-header-cell {
            font-weight: 700;
            color: #495057;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #dee2e6;
        }
        
        :host ::ng-deep .ag-header-cell-label {
            justify-content: center;
        }
        
        :host ::ng-deep .ag-row {
            border-bottom: 1px solid #f1f3f4;
            transition: all 0.2s ease;
        }
        
        :host ::ng-deep .ag-row:hover {
            background-color: #f8f9fa;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        :host ::ng-deep .ag-cell {
            padding: 1rem 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .post-title {
            color: #007bff;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s ease;
            text-align: center;
            display: block;
        }
        
        .post-title:hover {
            color: #0056b3;
            text-decoration: underline;
        }
        
        .post-excerpt {
            color: #6c757d;
            font-size: 0.9rem;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-align: center;
        }

        /* Pagination Styling */
        :host ::ng-deep .ag-paging-panel {
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            padding: 1rem;
            font-weight: 500;
            color: #495057;
        }

        :host ::ng-deep .ag-paging-button {
            background: white;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 0.5rem 0.75rem;
            margin: 0 0.25rem;
            color: #495057;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        :host ::ng-deep .ag-paging-button:hover {
            background: #007bff;
            border-color: #007bff;
            color: white;
        }

        :host ::ng-deep .ag-paging-button.ag-disabled {
            background: #f8f9fa;
            border-color: #e9ecef;
            color: #adb5bd;
            cursor: not-allowed;
        }

        /* Custom Pagination Styling */
        .custom-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-top: 1px solid #e9ecef;
            margin-top: 1rem;
        }

        .pagination-info {
            color: #6c757d;
            font-size: 0.9rem;
        }

        .pagination-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .page-info {
            margin: 0 1rem;
            font-weight: 500;
            color: #495057;
        }

        .page-size-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .page-size-selector label {
            color: #6c757d;
            font-size: 0.9rem;
        }



        /* No Posts Message */
        .no-posts-message {
            text-align: center;
            padding: 4rem 2rem;
            color: #6c757d;
        }

        .no-posts-icon {
            font-size: 4rem;
            color: #dee2e6;
            margin-bottom: 1.5rem;
        }

        .no-posts-message h3 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #495057;
            margin-bottom: 1rem;
        }

        .no-posts-message p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }

        .create-first-post-btn {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 8px;
        }

        .login-btn {
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            border-radius: 8px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: 0 0.5rem;
            }

            .header-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }

            .page-title {
                font-size: 2rem;
            }

            .table-card {
                padding: 1rem;
            }

            .custom-pagination {
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }

            .no-posts-message {
                padding: 2rem 1rem;
            }

            .no-posts-icon {
                font-size: 3rem;
            }

            .no-posts-message h3 {
                font-size: 1.5rem;
            }

            .no-posts-message p {
                font-size: 1rem;
            }

            :host ::ng-deep .ag-theme-alpine {
                --ag-header-height: 50px;
                --ag-row-height: 60px;
            }
        }
    `]
})
export class BlogHome implements OnInit {
    @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

    public columnDefs: ColDef[] = [
        {
            headerName: 'Title',
            field: 'title',
            flex: 2,
            cellStyle: { textAlign: 'center' },
            cellRenderer: (params: any) => {
                return `<span class="post-title">${params.value}</span>`;
            }
        },
        {
            headerName: 'Excerpt',
            field: 'excerpt',
            flex: 3,
            cellStyle: { textAlign: 'center' },
            cellRenderer: (params: any) => {
                return `<div class="post-excerpt">${params.value}</div>`;
            }
        },
        {
            headerName: 'Author',
            field: 'author.username',
            flex: 1,
            cellStyle: { textAlign: 'center' }
        },
        {
            headerName: 'Published Date',
            field: 'publishedDate',
            flex: 1,
            cellStyle: { textAlign: 'center' },
            valueFormatter: (params: any) => {
                return new Date(params.value).toLocaleDateString();
            }
        },
        {
            headerName: 'Actions',
            valueGetter: (params: any) => params.data?._id,
            flex: 1,
            cellStyle: { textAlign: 'center' },
            cellRenderer: (params: any) => {
                const postId = params.value;

                if (!postId) {
                    return '<span style="color: red;">Error</span>';
                }
                return `<button class="view-btn" onclick="window.viewPost('${postId}')" title="View Post">
                    <i class="pi pi-eye"></i>
                </button>`;
            }
        }
    ];

    public allPosts: BlogPost[] = [];
    public rowData: BlogPost[] = [];
    public isAuthenticated = false;
    public paginationPageSize = 10;
    public currentPage = 1;
    public totalPosts = 0;
    public totalPages = 0;
    public Math = Math; // Make Math available in template
    public pageSizeOptions = [5, 10, 20, 50];
    public defaultColDef = {
        sortable: true,
        filter: true,
        resizable: true
    };

    constructor(
        private blogService: BlogService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadPosts();
        this.isAuthenticated = !!localStorage.getItem('token');

        // Add global function for view button
        (window as any).viewPost = (id: string) => {
            if (id && id !== 'undefined' && id !== 'null') {
                this.navigateToPost(id);
            } else {
                alert('Error: Invalid post ID');
            }
        };
    }

    loadPosts(page: number = 1, pageSize: number = this.paginationPageSize) {
        this.currentPage = page;
        this.paginationPageSize = pageSize;

        // Fetch all posts first
        this.blogService.getPosts(1, 50).subscribe({
            next: (response) => {
                this.allPosts = response.data || [];
                this.totalPosts = this.allPosts.length;
                this.totalPages = Math.ceil(this.totalPosts / pageSize);

                // Calculate pagination
                this.updatePagination(page, pageSize);
            },
            error: (error) => {
                this.allPosts = [];
                this.rowData = [];
                this.totalPosts = 0;
                this.totalPages = 0;
            }
        });
    }

    updatePagination(page: number, pageSize: number) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        this.rowData = this.allPosts.slice(startIndex, endIndex);
    }



    onGridReady(params: GridReadyEvent) {
        params.api.sizeColumnsToFit();
    }





    navigateToPost(id: string) {
        this.router.navigate(['/blog/post', id]);
    }

    navigateToCreate() {
        this.router.navigate(['/blog/create']);
    }

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePagination(page, this.paginationPageSize);
        }
    }

    onPageSizeChange(event: any) {
        const newPageSize = event.value;
        this.paginationPageSize = newPageSize;
        this.currentPage = 1; // Reset to first page
        this.totalPages = Math.ceil(this.totalPosts / newPageSize);
        this.updatePagination(1, newPageSize);
    }
} 