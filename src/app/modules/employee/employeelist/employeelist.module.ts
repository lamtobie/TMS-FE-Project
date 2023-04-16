import { NgModule } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Route, RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeList } from './employeelist.component';


const employeelistRoutes: Route[] = [
    {
        path     : '',
        component: EmployeeList
    }
];

@NgModule({
    declarations: [
        EmployeeList
    ],
    imports     : [
        RouterModule.forChild(employeelistRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        SharedModule,
        MatDatepickerModule,     
        MatSelectModule,
        MatTableModule,
        CommonModule,
        MatMomentDateModule,
        MatPaginatorModule,
        MatMenuModule,
        FuseAlertModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatListModule,
        MatSidenavModule,
        MatCardModule,
    ]
})
export class EmployeeListModule
{
}
