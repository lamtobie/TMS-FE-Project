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
import { VehicleTypeService } from "../vehicletype.service";
import { VehicleTypeModel } from "models/vehicle/vehicleTypeModel";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector     : 'vehicletypeadd',
    templateUrl  : './vehicletypeadd.component.html',
    encapsulation: ViewEncapsulation.None
})
export class VehicletypeAdd
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    isAddShow:boolean=true;
    PAGEMODE: string='new';
    vehicleTypeCode:string;
    params: any;
    vehicleType:VehicleTypeModel;
    vehicleTypeEdited:VehicleTypeModel={};
    address:AddressModel={};
    alert:any;
    temp:number=1;
    vehicleTypeName:string;
    regionSelected:string="";
    searchParam:PaginationParamsModel;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private location:Location,
        private vehicleTypeServices:VehicleTypeService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        private dialogRef: MatDialogRef<VehicletypeAdd>,
        private _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public vehicletype:any,
        )
    {
        this.params = this.location.getState();
        if (vehicletype.code && vehicletype.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.vehicleTypeCode = vehicletype.code;
        }
        if (vehicletype.code && vehicletype.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.vehicleTypeCode = vehicletype.code;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getViewVẹicleTypeByCode();
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getEditVehicleTypeByCode();
        }
        if (this.PAGEMODE == "new") {
            this.createForm();
            this.generateVehicleCode();
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
            name: ["", Validators.required],
            length:["", Validators.required],
            width:["", Validators.required],
            height:["", Validators.required],
            capacity:["", Validators.required],
            payload:["", Validators.required],
            status:"active"
          });
        }
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            length:["", Validators.required],
            width:["", Validators.required],
            height:["", Validators.required],
            capacity:["", Validators.required],
            payload:["", Validators.required],
            status:"active"
          });
    }


    createVehicleType(){
        this.vehicleTypeEdited.code=this.vehicleTypeCode;
        this.vehicleTypeEdited.name=this.supportForm.get('name').value;
        this.vehicleTypeEdited.length=parseFloat(this.supportForm.get('length').value);
        this.vehicleTypeEdited.width=parseFloat(this.supportForm.get('width').value);
        this.vehicleTypeEdited.height=parseFloat(this.supportForm.get('height').value);
        this.vehicleTypeEdited.maximumCapacity=parseFloat(this.supportForm.get('capacity').value);
        this.vehicleTypeEdited.maximumPayload=parseInt(this.supportForm.get('payload').value);
        this.vehicleTypeEdited.status=this.supportForm.get('status').value;

        this.vehicleTypeServices.createVehicleType(this.vehicleTypeEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create successfully for station '+this.vehicleTypeEdited.name,
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
                        this.moveToVehicleType();
                        this.onBack();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create failed for station '+this.vehicleTypeEdited.name,
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
                       this.moveToVehicleType();
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
    updateVehicleType(){
        this.vehicleTypeEdited=this.vehicleType;
        this.vehicleTypeEdited.name=this.supportForm.get('name').value;
        this.vehicleTypeEdited.length=parseFloat(this.supportForm.get('length').value);
        this.vehicleTypeEdited.width=parseFloat(this.supportForm.get('width').value);
        this.vehicleTypeEdited.height=parseFloat(this.supportForm.get('height').value);
        this.vehicleTypeEdited.maximumCapacity=parseFloat(this.supportForm.get('capacity').value);
        this.vehicleTypeEdited.maximumPayload=parseInt(this.supportForm.get('payload').value);
        this.vehicleTypeEdited.status=this.supportForm.get('status').value;

        this.vehicleTypeServices.updateVehicleType(this.vehicleTypeEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Update successfully for station '+this.vehicleTypeEdited.name,
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
                       this.moveToVehicleType();
                       this.onBack();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Update failed for station '+this.vehicleTypeEdited.name,
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
                        this.moveToVehicleType();
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

    getViewVẹicleTypeByCode(){
        this.vehicleTypeServices.getVehicleTypenByCode(this.vehicleTypeCode).subscribe({next : (data) => {
            if (data) {
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [{value:data.data.name, disabled:true}],
                    length:[{value:data.data.length, disabled:true}],
                    width:[{value:data.data.width, disabled:true}],
                    height:[{value:data.data.height, disabled:true}],
                    capacity:[{value:data.data.maximumCapacity, disabled:true}],
                    payload:[{value:data.data.maximumPayload, disabled:true}],
                    status:[{value:data.data.status, disabled:true}],
                  });
                  this.vehicleTypeName=data.data.name;
                  
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
        this.vehicleTypeServices.getVehicleTypenByCode(this.vehicleTypeCode).subscribe({next : (data) => {
            if (data) {
                this.vehicleType=data.data;
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: data.data.name,
                    length:data.data.length,
                    width:data.data.width,
                    height:data.data.height,
                    capacity:data.data.maximumCapacity,
                    payload:data.data.maximumPayload,
                    status:data.data.status,
                  });
                  this.vehicleTypeName=data.data.name;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToVehicleType() {
        this.route.navigateByUrl("/vehicletype");
    }

  
    convertStr2Num(value: string): number {
        value = value.replace(',', '.');
        return parseFloat(value);
    }

  
    generateVehicleCode(){
        this.searchParam={Keyword:'', Status:''};
        this.vehicleTypeServices.getVehicleTypes(this.searchParam).subscribe({next : (data) => {
            if (data) {
                //this.asset=data;
                data.data.items.forEach(d=>{
                    if (d.code!=null){
                        this.temp++;
                    }
                });
                this.vehicleTypeCode='VEHT'+this.temp
                this.supportForm.patchValue({'code': this.vehicleTypeCode});
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    validateNumber(){
        var number = /([a-z])/;
        var payloadRegex = /^[0-9]+$/;
        var length=this.supportForm.get('length').value;
        var width=this.supportForm.get('width').value;
        var height=this.supportForm.get('height').value;
        var capacity=this.supportForm.get('capacity').value;
        var payload=this.supportForm.get('payload').value;


        if(length !="" && length.match(number))
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect number format',
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
               this.supportForm.patchValue({'length':""});
            });        
        }
         else
        {
            var formatted=length.replace(",",".");
            this.supportForm.patchValue({'length': formatted});

        }
        if(width !="" && width.match(number))
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect number format',
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
               this.supportForm.patchValue({'width':""});
            });        
        }
         else
        {
            var formatted=width.replace(",",".");
            this.supportForm.patchValue({'width': formatted});

        }
        if(height !="" && height.match(number))
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect number format',
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
               this.supportForm.patchValue({'height':""});
            });        
        }
         else
        {
            var formatted=height.replace(",",".");
            this.supportForm.patchValue({'height': formatted});

        }
        if(capacity !="" && capacity.match(number))
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect number format',
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
               this.supportForm.patchValue({'capacity':""});
            });        
        }
         else
        {
            var formatted=capacity.replace(",",".");
            this.supportForm.patchValue({'capacity': formatted});

        }
        if(payload!="" && payload.match(payloadRegex)==null)
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect number format',
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
               this.supportForm.patchValue({'payload':""});
            });        
        }
         else
        {
           

        }
    }

    onBack() {
        this.dialogRef.close();
    }
   
}
