import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminTagsComponent } from './pages/admin-tags/admin-tags.component';
import { AdminPerfumeFormComponent } from './pages/admin-perfume-form/admin-perfume-form.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginRegisterComponent } from './pages/login-register/login-register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'register', component: LoginRegisterComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'perfume/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'profile', component: ProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/tags', component: AdminTagsComponent },
  { path: 'admin/perfumes/new', component: AdminPerfumeFormComponent },
  { path: 'admin/perfumes/:id', component: AdminPerfumeFormComponent }
];
