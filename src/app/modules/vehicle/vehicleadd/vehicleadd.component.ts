import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,Inject,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Route, Router } from "@angular/router";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";
import { AWARD_LIST, CITY_LIST, DISTRICT_LIST, REGION_LIST } from "app/shared/province";
import { AddressModel } from "models/address/addressModel";
import { CONSTANT } from "app/shared/constants";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { FuseAlertService } from "@fuse/components/alert";
import { PaginationParamsModel } from "models/commons/requestModel";
import { StationService } from "app/modules/station/station.service";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { VehicleTypeService } from "app/modules/vehicletype/vehicletype.service";
import { VehicletypeAdd } from "app/modules/vehicletype/vehicletypeadd/vehicletypeadd.component";
import { VehicleService } from "../vehicle.service";
import { VehicleModel } from "models/vehicle/vehicleModel";

@Component({
    selector     : 'vehicleadd',
    templateUrl  : './vehicleadd.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehicleAdd
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    vehicleTypeList:VehicleTypeModel[];
    isAddShow:boolean=true;
    PAGEMODE: string='new';
    vehicleCode:string;
    params: any;
    vehicle:VehicleModel;
    vehicleEdited:VehicleModel={};
    address:AddressModel={};
    alert:any;
    temp:number=1;
    vehiclePlate:string;
    regionSelected:string="";
    searchParam:PaginationParamsModel;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private location:Location,
        private vehicleServices:VehicleService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.vehicleCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.vehicleCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getVehicleTypeList();
            this.getViewVẹicleTypeByCode();
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getVehicleTypeList();
            this.getEditVehicleTypeByCode();
        }
        if (this.PAGEMODE == "new") {
            this.createForm();
            this.generateVehicleCode();
            this.getVehicleTypeList();
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
   
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            type: ["", Validators.required],
            numberplate:["", Validators.required],
            status:"active"
          });
        }
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            type: ["", Validators.required],
            numberplate:["", Validators.required],
            status:"active"
          });
    }


    createVehicle(){
        this.vehicleEdited.code=this.vehicleCode;
        this.vehicleEdited.numberPlate=this.supportForm.get('numberplate').value;
        this.vehicleEdited.vehicleTypeCode =this.supportForm.get('type').value;
        this.vehicleEdited.status='active';

        this.vehicleServices.createVehicle(this.vehicleEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create successfully for vehicle '+this.vehicleEdited.numberPlate,
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
                        this.moveToVehicle();
                        this.onBack();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create failed for vehicle '+this.vehicleEdited.numberPlate,
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
                       this.moveToVehicle();
                       this.onBack();
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
    updateVehicle(){
    
        this.vehicleServices.getVehicleByCode(this.vehicleCode).subscribe({next : (data) => {
            if (data) {
                this.vehicle=data.data;
                this.vehicle.numberPlate=this.supportForm.get('numberplate').value;
                this.vehicle.vehicleTypeCode =this.supportForm.get('type').value;
                this.vehicle.status=this.supportForm.get('status').value;
                this.vehicleServices.updateVehicle(this.vehicle).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update successfully for vehicle '+this.vehicle.numberPlate,
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
                               this.moveToVehicle();
                            });
                        } else {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Failed',
                                message: 'Update failed for vehicle '+this.vehicle.numberPlate,
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
                               this.moveToVehicle();
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

    getViewVẹicleTypeByCode(){
        this.vehicleServices.getVehicleByCode(this.vehicleCode).subscribe({next : (data) => {
            if (data) {
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    type: [{value:data.data.vehicleTypeCode, disabled:true}],
                    numberplate:[{value:data.data.numberPlate, disabled:true}],
                    status:[{value:data.data.status, disabled:true}],
                  });
                  this.vehiclePlate=data.data.numberPlate;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
        this.supportForm.disable();
    }

    getEditVehicleTypeByCode(){
        this.vehicleServices.getVehicleByCode(this.vehicleCode).subscribe({next : (data) => {
            if (data) {
                this.vehicle=data.data;
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    type:data.data.vehicleTypeCode,
                    numberplate:[data.data.numberPlate],
                    status:data.data.status,
                  });
                  this.vehiclePlate=data.data.numberPlate;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToVehicle() {
        this.route.navigateByUrl("/vehicle");
    }

  
    convertStr2Num(value: string): number {
        value = value.replace(',', '.');
        return parseFloat(value);
    }

  
    generateVehicleCode(){
        this.searchParam={Keyword:'', Status:''};
        this.vehicleServices.getVehicles(this.searchParam).subscribe({next : (data) => {
            if (data) {
                //this.asset=data;
                data.data.items.forEach(d=>{
                    if (d.code!=null){
                        this.temp++;
                    }
                });
                this.vehicleCode='VEH'+this.temp
                this.supportForm.patchValue({'code': this.vehicleCode});
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

    onBack() {
       this.location.back();
    }
   
}
