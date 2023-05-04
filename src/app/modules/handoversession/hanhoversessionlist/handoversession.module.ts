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
import { HandoverSession } from './handoversession.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';


const handoverRoutes: Route[] = [
    {
        path     : '',
        component: HandoverSession
    }
];

@NgModule({
    declarations: [
        HandoverSession
    ],
    imports     : [
        RouterModule.forChild(handoverRoutes),
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
        MatAutocompleteModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatCardModule,
        MatToolbarModule,
        MatProgressBarModule,
        MatListModule,
        MatDialogModule


    ]
})
export class HandoverModule
{
}
