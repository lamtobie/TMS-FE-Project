import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'example'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},

        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)},
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
            {path: 'station', loadChildren: () => import('app/modules/station/stationlist/stationlist.module').then(m => m.StationListModule)},
            {path: 'employee', loadChildren: () => import('app/modules/employee/employeelist/employeelist.module').then(m => m.EmployeeListModule)},
            {path: 'vehicle', loadChildren: () => import('app/modules/vehicle/vehiclelist/vehicle.module').then(m => m.VehicleModule)},
            {path: 'vehicletype', loadChildren: () => import('app/modules/vehicletype/vehicletypelist/vehicletype.module').then(m => m.VehicleTypeModule)},
            {path: 'deliveryoder', loadChildren: () => import('app/modules/deliveryorder/deliveryorderlist/deliveryoder.module').then(m => m.DeliveryOderModule)},
            {path: 'handoversession', loadChildren: () => import('app/modules/handoversession/hanhoversessionlist/handoversession.module').then(m => m.HandoverModule)},
            {path: 'stationnew', loadChildren: () => import('app/modules/station/stationnew/stationnew.module').then(m => m.StationNewModule)},
            {path: 'changepassword', loadChildren: () => import('app/modules/employee/changepassword/changepassword.module').then(m => m.ChangePasswordModule)},
            {path: 'drivernew', loadChildren: () => import('app/modules/employee/driveradd/driveradd.module').then(m => m.DriverAddModule)},
            {path: 'coordinatornew', loadChildren: () => import('app/modules/employee/coordinatornew/coordiatornew.module').then(m => m.CoordinatorNewModule)},
            {path: 'vehicletypeadd', loadChildren: () => import('app/modules/vehicletype/vehicletypeadd/vehicletypeadd.module').then(m => m.VehicletypeAddModule)},
            {path: 'vehicleadd', loadChildren: () => import('app/modules/vehicle/vehicleadd/vehicleadd.module').then(m => m.VehicleAddModule)},
            {path: 'changeorderstatus', loadChildren: () => import('app/modules/deliveryorder/changestatus/changestatus.module').then(m => m.ChangeOrderStatusModule)},
            {path: 'assigndriver', loadChildren: () => import('app/modules/deliveryorder/assignDriver/assignDriver.module').then(m => m.AssignDriverModule)},
            {path: 'deliveryorderadd', loadChildren: () => import('app/modules/deliveryorder/deliveryorderadd/deliveryorderadd.module').then(m => m.DeliveryOrderAddModule)},
            {path: 'handoversessionadd', loadChildren: () => import('app/modules/handoversession/handoversessionadd/handoversessionadd.module').then(m => m.HandoverSessionAddModule)},
            {path: 'getrefund', loadChildren: () => import('app/modules/handoversession/getrefund/getrefund.module').then(m => m.GetRefundModule)},
            {path: 'sessioninfo', loadChildren: () => import('app/modules/handoversession/handoversessioninfo/handoversessioninfo.module').then(m => m.HandoverSessionInfoModule)},
            {path: 'cancelorder', loadChildren: () => import('app/modules/deliveryorder/cancelorder/cancelorder.module').then(m => m.CancelOrderModule)},

        ]
    },{
        path: '**',
        redirectTo: 'example'
    }
];
