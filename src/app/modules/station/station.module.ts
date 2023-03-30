import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Station } from './station.component';

const stationRoutes: Route[] = [
    {
        path     : '',
        component: Station
    }
];

@NgModule({
    declarations: [
        Station
    ],
    imports     : [
        RouterModule.forChild(stationRoutes)
    ]
})
export class StationModule
{
}
