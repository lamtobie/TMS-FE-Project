import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { EmployeeService } from "app/modules/employee/employee.service";
import { List } from "lodash";
import { Location } from "@angular/common";
import { DeliveryOrderModel } from "models/deliveryOrder/deliveryOrderModel";
import moment from "moment";
import { PaginationParamsModel } from "models/commons/requestModel";
import { DeliveryOrderService } from "../deliveryorder.service";
import { fuseAnimations } from "@fuse/animations";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeModel } from "models/employee/employeeModel";
import * as XLSX from 'xlsx';
import { StationModel } from "models/station/stationModel";
import { ChangeOrderStatus } from "../changestatus/changestatus.component";
import { AssignDriver } from "../assignDriver/assignDriver.component";
import { CancelOrder } from "../cancelorder/cancelorder.component";

@Component({
    selector     : 'deliveryoder',
    templateUrl  : './deliveryoder.component.html',
    styleUrls:['./deliveryoder.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [ fuseAnimations,
        trigger('detailStaff', [
            state('collapsed', style({ height: '0px', minHeight: '0'})),
            state('expanded', style({ height: '*'})),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})
export class DeliveryOder
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;

    supportForm: FormGroup;
    searchParam:PaginationParamsModel;
    alert:any;
    fileName= 'Report.xlsx';
    dataDeliveryOrder: MatTableDataSource<DeliveryOrderModel>;
    data:DeliveryOrderModel[];
    order:DeliveryOrderModel;
    driverList:EmployeeModel[];
    coordinatorList:EmployeeModel[];
    stationList:StationModel[];
    displayCols2: string[] = [
        'docode',
        'childrencode',
        'numberofpackage',
        'status',
        'pickuppoint',
        'deliveryservice',
        'cod',
        'driver',
        'coordinator',
        'session',
        'date',
        'action'
    ];
    staffElement: DeliveryOrderModel | null;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route:Router,
        private location:Location,
        private deliveryOrderService:DeliveryOrderService,
        private _fuseAlertnService: FuseConfirmationService,
        private _matDialog: MatDialog,
        )
    {
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      this.getDeliveryOrders()
      this.getDriversField();
      this.getCoordinatorsField();
      this.getStationsField();
      //this.initData();
      
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            driver:"",
            coordinator:"",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
            }),
            deliveryRange: this._formBuilder.group({
                deliveryStart: [""],
                deliveryEnd: [""],
            }),
            arrivalRange: this._formBuilder.group({
                arrivalStart: [""],
                arrivalEnd: [""],
            }),
            pickuppoint:"",
            deliveryservice: "",
          });
        }
    }

    refresh(){
        this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            driver:"",
            coordinator:"",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
            }),
            deliveryRange: this._formBuilder.group({
                deliveryStart: [""],
                deliveryEnd: [""],
            }),
            arrivalRange: this._formBuilder.group({
                arrivalStart: [""],
                arrivalEnd: [""],
            }),
            pickuppoint:"",
            deliveryservice: "",
          });
          this.getDeliveryOrders();
    }
    getDeliveryOrders(){
        if(this.supportForm.controls["range"].value.start=='' && this.supportForm.controls["range"].value.end==''){
            var startDate= null;
            var endDate= null;
        }
        else{
            startDate= moment(this.supportForm.controls["range"].value.start).toDate().getTime();
            endDate= moment(this.supportForm.controls["range"].value.end).toDate().getTime();
        }
        if(this.supportForm.controls["deliveryRange"].value.deliveryStart=='' && this.supportForm.controls["deliveryRange"].value.deliveryEnd==''){
            var deliveryStart= null;
            var deliveryEnd= null;
        }
        else{
            deliveryStart= moment(this.supportForm.controls["deliveryRange"].value.deliveryStart).toDate().getTime();
            deliveryEnd= moment(this.supportForm.controls["deliveryRange"].value.deliveryEnd).toDate().getTime();
        }
        if(this.supportForm.controls["arrivalRange"].value.arrivalStart=='' && this.supportForm.controls["arrivalRange"].value.arrivalEnd==''){
            var arrivalStart= null;
            var arrivalEnd= null;
        }
        else{
            arrivalStart= moment(this.supportForm.controls["arrivalRange"].value.arrivalStart).toDate().getTime();
            arrivalEnd= moment(this.supportForm.controls["arrivalRange"].value.arrivalEnd).toDate().getTime();
        }
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status,ThreePLTeam:this.supportForm.value.deliveryservice,
                          DriverCode:this.supportForm.value.driver,CoordinatorCode:this.supportForm.value.coordinator,StartStation:this.supportForm.value.pickuppoint,
                          CreatedAt:startDate+':'+endDate, ActualStartTime:deliveryStart+':'+deliveryEnd,ActualArrivalTime:arrivalStart+':'+arrivalEnd};
        this.deliveryOrderService.getDeliveryOrders(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.data=data.data.items;
                console.log(data.data.items);
                this.dataDeliveryOrder = new MatTableDataSource<DeliveryOrderModel>(this.data);
                this.dataDeliveryOrder.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    getDriversField(){
        this.searchParam={Keyword:"", Status:"",};
        this.deliveryOrderService.getDrivers(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.driverList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    getCoordinatorsField(){
        this.searchParam={Keyword:"", Status:"",};
        this.deliveryOrderService.getCoordinators(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.coordinatorList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    getStationsField(){
        this.searchParam={Keyword:"", Status:"",};
        this.deliveryOrderService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.stationList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    selectElement(element: any, event: Event) {
            this.staffElement = this.staffElement === element ? null : element
    }
    convertNumToDate(num:number){
        var date = new Date(num)
        return date.toLocaleDateString('en-GB');
    }
    exportExcel(){
        /* pass here the table id */
        let element = document.getElementById('table');
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
     
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     
        /* save to file */  
        XLSX.writeFile(wb, this.fileName);
     
    }
    openChangeStautus(code:string) {
        const newScreen = this._matDialog.open(ChangeOrderStatus, {
          height: "450px",
          width: "600px",
          autoFocus: false,
          data: {orderCode:code},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getDeliveryOrders();
          } else {
            this.getDeliveryOrders();
          }
        });
      }
      openCancelOrder(code:string) {
        const newScreen = this._matDialog.open(CancelOrder, {
          height: "450px",
          width: "600px",
          autoFocus: false,
          data: {orderCode:code},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getDeliveryOrders();
          } else {
            this.getDeliveryOrders();
          }
        });
      }

    openAssignDriver(code:string) {
        const newScreen = this._matDialog.open(AssignDriver, {
          height: "800px",
          width: "600px",
          autoFocus: false,
          data: {orderCode:code},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getDeliveryOrders();
          } else {
            this.getDeliveryOrders();
          }
        });
      }

      moveToOrderAdd() {
        this.route.navigateByUrl("/deliveryorderadd");
    }
    viewItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/deliveryorderadd', { state: { requestId: code, mode:'view' } });
    }
    editItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/deliveryorderadd', { state: { requestId: code, mode:'edit' } });
    }
}
