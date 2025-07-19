import { Routes } from '@angular/router';
import { BlogHome } from './blog.home';
import { BlogPostDetail } from './blog.post.detail';
import { BlogCreatePost } from './blog.create.post';
import { AuthGuard } from '../../guards/auth.guard';

export const blogRoutes: Routes = [
    { path: '', component: BlogHome },
    { path: 'post/:id', component: BlogPostDetail },
    { path: 'create', component: BlogCreatePost, canActivate: [AuthGuard] }
]; 