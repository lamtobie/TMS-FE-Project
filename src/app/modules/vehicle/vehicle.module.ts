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
import { Vehicle } from './vehicle.component';


const vehicleRoutes: Route[] = [
    {
        path     : '',
        component: Vehicle
    }
];

@NgModule({
    declarations: [
        Vehicle
    ],
    imports     : [
        RouterModule.forChild(vehicleRoutes),
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
        MatMenuModule


    ]
})
export class VehicleModule
{
}
