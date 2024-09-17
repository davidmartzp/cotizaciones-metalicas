import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { LoginComponent } from './cms/pages/auth/login/login.component';
import { NotFoundComponent } from './cms/pages/not-found/not-found.component';  // Asegúrate de tener este componente creado

import { CreateBudgetComponent } from './cms/pages/budgets/create/create-budget/create-budget.component';
import { ListBudgetsComponent } from './cms/pages/budgets/list/list-budgets/list-budgets.component';
import { UpdateBudgetComponent } from './cms/pages/budgets/update/update-article/update-budget.component';
import { CreateProductComponent } from './cms/pages/products/create/create-product/create-product.component';
import { ListProductsComponent } from './cms/pages/products/list/list-products/list-products.component';
import { UpdateProductComponent } from './cms/pages/products/update/update-product/update-product.component';
import { ListUsersComponent } from './cms/pages/users/list/list-users/list-users.component';

import { UpdateUserComponent } from './cms/pages/users/update/update-user/update-user.component';

export const routes: Routes = [
    {
        path: '', component: ListBudgetsComponent
    },
    {
        path: 'cotizaciones-listar', component: ListBudgetsComponent
    },
    {
        path: 'cotizaciones-generar', component: CreateBudgetComponent
    },
    {
        path: 'cotizaciones-actualizar/:id', component: UpdateBudgetComponent
    },
    {
        path: 'productos-listar', component: ListProductsComponent
    },
    {
        path: 'productos-crear', component: CreateProductComponent
    },
    {
        path: 'productos-actualizar/:id', component: UpdateProductComponent
    },
    {
        path: 'usuarios-listar', component: ListUsersComponent
    },
    {
        path: 'usuarios-crear', component: ListUsersComponent
    },
    {
        path: 'usuarios-actualizar/:id', component: UpdateUserComponent
    },
    {
        path: 'login',
        children: [
            { path: '', component: LoginComponent },
        ]
    }
   
];
