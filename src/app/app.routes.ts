import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:"full"},
      {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      )
  },
  {path:'dashboard',loadComponent :()=> import('./components/dashboard/dashboard.component').then((m)=>m.DashboardComponent ) ,children:[

    {path:'', redirectTo:'products',pathMatch:'full'},
    {path:'registeration',loadComponent:()=> import('./components/registeration/registeration.component').then((m)=>m.RegisterationComponent )},
    {path:'products',loadComponent:()=>import('./components/products/products.component').then((m)=>m.ProductsComponent )},
    
  ]

  },
];
