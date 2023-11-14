import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';

export const routes : Routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', loadChildren: './home/home.module#HomeModule' }
        ]
    },

    // Not found
    { path: '**', redirectTo: 'home' }

];