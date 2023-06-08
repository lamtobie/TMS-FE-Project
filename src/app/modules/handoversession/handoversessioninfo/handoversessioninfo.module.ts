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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HandoverSessionInfo } from './handoversessioninfo.component';
import { MatDividerModule } from '@angular/material/divider';


const handoverSessionInfoRoutes: Route[] = [
    {
        path     : '',
        component: HandoverSessionInfo
    }
];

@NgModule({
    declarations: [
        HandoverSessionInfo
    ],
    imports     : [
        RouterModule.forChild(handoverSessionInfoRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        SharedModule,
        MatDatepickerModule,     
        MatSelectModule,
        MatTableModule,
        CommonModule,
        FuseAlertModule,
        MatMomentDateModule,
        MatPaginatorModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTableModule,
        MatDividerModule,

    ]
})
export class HandoverSessionInfoModule
{
}
