import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { List } from "lodash";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";
import moment from "moment";
import * as XLSX from 'xlsx';
import { PaginationParamsModel } from "models/commons/requestModel";
import { Location } from "@angular/common";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { VehicleService } from "../vehicle.service";
import { VehicleAdd } from "../vehicleadd/vehicleadd.component";


@Component({
    selector     : 'vehicle',
    templateUrl  : './vehicle.component.html',
    encapsulation: ViewEncapsulation.None
})
export class Vehicle
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    fileName= 'Report.xlsx';
    alert:any;
    searchParam:PaginationParamsModel;
    dataVehicle: MatTableDataSource<VehicleModel>;
    vehicleTypeList:VehicleTypeModel[];
    data:VehicleModel[];
    vehicle:VehicleModel;
    displayCols2: string[] = [
        'stt',
        // 'vehicletypecode',
        'vehicletypename',
        'numberPlate',
        'status',
        'createAt',
        'action'
    ];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private route:Router,
        private location:Location,
        private vehicleServices:VehicleService,
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
      this.getVehicles();
      this.getVehicleTypeList();
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            type:"",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
        }
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
    convertNumToDate(num:number){
        var date = new Date(num)
        return date.toLocaleDateString('en-GB');
    }
    getVehicles(){
        if(this.supportForm.controls["range"].value.start=='' && this.supportForm.controls["range"].value.end==''){
            var startDate= new Date("01/01/1000").getTime();
            var endDate= new Date("01/01/9999").getTime();
        }
        else{
            var startDate= moment(this.supportForm.controls["range"].value.start).toDate().getTime();
            var endDate= moment(this.supportForm.controls["range"].value.end).toDate().getTime();
        }
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status, VehicleTypeCode:this.supportForm.value.type, CreatedAt:startDate+':'+endDate};
        this.vehicleServices.getVehicles(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.data=data.data.items;
                this.data.forEach(d=>{
                    if (d.code!=null){
                        d.stt=temp;
                        temp++;
                    }
                });
                this.dataVehicle = new MatTableDataSource<VehicleModel>(this.data);
                this.dataVehicle.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    getVehicleTypeList(){
        this.searchParam={Keyword:"", Status:""};
        this.vehicleServices.getVehicleTypes(this.searchParam).subscribe({next : (data) => {
            if (data) {
                this.vehicleTypeList=data.data.items;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});

    }
    updateVehicleStatus(code:string, status:string){
        this.vehicleServices.getVehicleByCode(code).subscribe({next : (data) => {
            if (data) {
                this.vehicle=data.data;
                this.vehicle.status=status;
                this.vehicleServices.updateVehicle(this.vehicle).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update successfully for vehicle '+code,
                                icon       : {
                                    show : true,
                                    name : 'heroicons_outline:check-circle',
                                    color: 'success'
                                },
                                actions    : {
                                    confirm: {
                                        show : false,
                                        label: 'Confirm',
                                        color: 'warn'
                                    },
                                    cancel : {
                                        show : true,
                                        label: 'OK'
                                    }
                                },
                            });
                            confirmation.afterClosed().subscribe((result) => {
                               this.getVehicles();
                            });
                        } else {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Failed',
                                message: 'Update failed for vehicle '+code,
                                icon       : {
                                    show : true,
                                    name : 'heroicons_outline:exclamation',
                                    color: 'error'
                                },
                                actions    : {
                                    confirm: {
                                        show : false,
                                        label: 'Confirm',
                                        color: 'warn'
                                    },
                                    cancel : {
                                        show : true,
                                        label: 'OK'
                                    }
                                },
                            });
                            confirmation.afterClosed().subscribe((result) => {
                               this.getVehicles();
                            });        
                        }
                    },
                    error: (err) => {
                        this.alert = {
                            type: 'error',
                            message:
                                "Cannot connect to server.",
                        };
                    },
                });  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    refresh(){
        this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
            range: this._formBuilder.group({
                start: [""],
                end: [""],
              }),
          });
          this.getVehicles();
    }
    moveToVehicleNew() {
        this.route.navigateByUrl("/vehicleadd");
    }

    viewItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/vehicleadd', { state: { requestId: code, mode:'view' } });
    }
    
    editItem(code:string, event: Event) {
        event.stopPropagation();
        this.route.navigateByUrl('/vehicleadd', { state: { requestId: code, mode:'edit' } });
    }

}
