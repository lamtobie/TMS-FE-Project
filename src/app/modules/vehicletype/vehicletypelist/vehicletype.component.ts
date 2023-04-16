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
import { VehicleTypeService } from "../vehicletype.service";
import { PaginationParamsModel } from "models/commons/requestModel";
import { Location } from "@angular/common";
import { VehicletypeAdd } from "../vehicletypeadd/vehicletypeadd.component";



@Component({
    selector     : 'vehicletype',
    templateUrl  : './vehicletype.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehicleType
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    fileName= 'Report.xlsx';
    alert:any;
    searchParam:PaginationParamsModel;
    dataVehicleType: MatTableDataSource<VehicleTypeModel>;
    data:VehicleTypeModel[];
    vehicleType:VehicleTypeModel;
    displayCols2: string[] = [
        'stt',
        'code',
        'name',
        'height',
        'maximumCapacity',
        'maximumPayload',
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
        private vehicleTypeServices:VehicleTypeService,
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
      this.getVehicleTypes()
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            keyword: "",
            status: "",
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
      getVehicleTypes(){
        if(this.supportForm.controls["range"].value.start=='' && this.supportForm.controls["range"].value.end==''){
            var startDate= new Date("01/01/1000").getTime();
            var endDate= new Date("01/01/9999").getTime();
        }
        else{
            var startDate= moment(this.supportForm.controls["range"].value.start).toDate().getTime();
            var endDate= moment(this.supportForm.controls["range"].value.end).toDate().getTime();
        }
        this.searchParam={Keyword:this.supportForm.value.keyword, Status:this.supportForm.value.status, CreatedAt:startDate+':'+endDate};
        this.vehicleTypeServices.getVehicleTypes(this.searchParam).subscribe({next : (data) => {
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
                this.dataVehicleType = new MatTableDataSource<VehicleTypeModel>(this.data);
                this.dataVehicleType.paginator=this.paginator;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    updateVehicleTypeStatus(code:string, status:string){
        this.vehicleTypeServices.getVehicleTypenByCode(code).subscribe({next : (data) => {
            if (data) {
                this.vehicleType=data.data;
                this.vehicleType.status=status;
                this.vehicleTypeServices.updateVehicleType(this.vehicleType).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update successfully for vehicle type '+code,
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
                               this.getVehicleTypes();
                            });
                        } else {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Failed',
                                message: 'Update failed for vehicle type '+code,
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
                               this.getVehicleTypes();
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


    convertNumToDate(num:number){
        var date = new Date(num)
        return date.toLocaleDateString('en-GB');
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
          this.getVehicleTypes();
    }
    
    moveToVehicleTypeNew() {
        this.route.navigateByUrl("/vehicletypeadd");
    }

    exportexcel(){
        /* pass here the table id */
        let element = document.getElementById('table');
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
     
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     
        /* save to file */  
        XLSX.writeFile(wb, this.fileName);
     
      }
    openVehicleTypeAdd() {
        const newScreen = this._matDialog.open(VehicletypeAdd, {
          height: "550px",
          width: "1100px",
          autoFocus: false,
          data: {},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getVehicleTypes();
          } else {
            this.getVehicleTypes();
          }
        });
    }
    openVehicleTypeView(code:string) {
        const newScreen = this._matDialog.open(VehicletypeAdd, {
          height: "550px",
          width: "1100px",
          autoFocus: false,
          data: {code:code, mode:"view"},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getVehicleTypes();
          } else {
            this.getVehicleTypes();
          }
        });
    }
    openVehicleTypeEdit(code:string) {
        const newScreen = this._matDialog.open(VehicletypeAdd, {
          height: "550px",
          width: "1100px",
          autoFocus: false,
          data: {code:code, mode:"edit"},
        });
        newScreen.afterClosed().subscribe((result: any) => {
          if (result) {
            this.getVehicleTypes();
          } else {
            this.getVehicleTypes();
          }
        });
    }
    

}
