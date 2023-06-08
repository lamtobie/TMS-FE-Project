import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { List } from "lodash";
import { DeliverySessionModel } from "models/deliverySession/deliverySessionModel";
import { StationModel } from "models/station/stationModel";
import * as XLSX from 'xlsx';
import { Location } from "@angular/common";
import { HandoverSessionService } from "../handoversession.service";
import { PaginationParamsModel } from "models/commons/requestModel";
import { EmployeeModel } from "models/employee/employeeModel";
import moment from "moment";
import { GetRefund } from "../getrefund/getrefund.component";


@Component({
    selector     : 'handoversession',
    templateUrl  : './handoversession.component.html',
    styleUrls:['./handoversession.component.css'],
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
export class HandoverSession
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    fileName= 'Report.xlsx';
    searchParam:PaginationParamsModel;
    alert:any;
    dataHandoverSession: MatTableDataSource<DeliverySessionModel>;
    data:DeliverySessionModel[];
    driverList:EmployeeModel[]=[];
    coordinatorList:EmployeeModel[]=[];
    startStationList:StationModel[]=[];
    endStationList:StationModel[]=[];
    displayCols2: string[] = [
        'stt',
        'code',
        'status',
        'start',
        'end',
        'coordinator',
        'driver',
        'vehicle',
        'dos',
        'pks',
        'action'
    ];
    staffElement: DeliverySessionModel | null;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route:Router,
        private location:Location,
        private handoverSessionService:HandoverSessionService,
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
      this.getHandoverSessions();
      this.getDriverField();
      this.getCoordinatorField();
      this.getStationField();
      //this.initData();

  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            coordinator:"",
            driver:"",
            pickuppoint:"",
            endpoint:"",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
            status: "",
          });
        }
    }
    refresh(){
        this.supportForm = this._formBuilder.group({
                keyword: "",
                coordinator:"",
                driver:"",
                pickuppoint:"",
                endpoint:"",
                range: this._formBuilder.group({
                    start: [""],
                    end: [""],
                  }),
                status: "",
              });
          this.getHandoverSessions();
    }
   
    selectElement(element: any, event: Event) {
        this.staffElement = this.staffElement === element ? null : element
    }
    convertNumToDate(num:number){
        var date = new Date(num);
        return date.toLocaleDateString("en-GB");
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
    getHandoverSessions(){
        if(this.supportForm.controls["range"].value.start=='' && this.supportForm.controls["range"].value.end==''){
            var startDate= new Date("01/01/1000").getTime();
            var endDate= new Date("01/01/9999").getTime();
        }
        else{
            var startDate= moment(this.supportForm.controls["range"].value.start).toDate().getTime();
            var endDate= moment(this.supportForm.controls["range"].value.end).toDate().getTime();
        }
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status,CreatedAt:startDate+':'+endDate, CoordinatorCode:this.supportForm.value.coordinator, 
                          DriverCode:this.supportForm.value.driver, StartStationCode:this.supportForm.value.pickuppoint, EndStationCode:this.supportForm.value.endpoint};
        this.handoverSessionService.getAll(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                this.data=data.data.items;
                this.data.forEach(d=>{
                    if (d.code!=null){
                        d.stt=temp;
                        temp++;
                    }
                });
                console.log(data.data.items);
                this.dataHandoverSession = new MatTableDataSource<DeliverySessionModel>(this.data);
                this.dataHandoverSession.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    getDriverField(){
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status,};
        this.handoverSessionService.getDrivers(this.searchParam).subscribe({next : (data) => {
            if (data) {
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
    getCoordinatorField(){
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status,};
        this.handoverSessionService.getCoordinators(this.searchParam).subscribe({next : (data) => {
            if (data) {
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
    getStationField(){
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status,};
        this.handoverSessionService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
                this.startStationList=data.data.items;
                this.endStationList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    moveToSessionAdd() {
        this.route.navigateByUrl("/handoversessionadd");
    }
    viewItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/sessioninfo', { state: { requestId: code, mode:'view' } });
    }
    editItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/sessioninfo', { state: { requestId: code, mode:'edit' } });
    }
    openGetRefund(code:string) {
        const newScreen = this._matDialog.open(GetRefund, {
          height: "450px",
          width: "600px",
          autoFocus: false,
          data: {orderCode:code},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getHandoverSessions();
          } else {
            this.getHandoverSessions();
          }
        });
      }


}
