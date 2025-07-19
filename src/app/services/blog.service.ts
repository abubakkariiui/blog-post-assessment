import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
    _id: string;
    title: string;
    body: string;
    excerpt: string;
    author: {
        _id: string;
        username: string;
    };
    publishedDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostRequest {
    title: string;
    body: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private readonly API_URL = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    getPosts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<BlogPost>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
        
        return this.http.get<PaginatedResponse<BlogPost>>(`${this.API_URL}/posts`, { params });
    }

    getPost(id: string): Observable<BlogPost> {
        return this.http.get<BlogPost>(`${this.API_URL}/posts/${id}`);
    }

    createPost(postData: CreatePostRequest): Observable<BlogPost> {
        return this.http.post<BlogPost>(`${this.API_URL}/posts`, postData);
    }
} 