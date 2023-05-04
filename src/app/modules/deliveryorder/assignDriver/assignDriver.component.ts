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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EmployeeModel } from "models/employee/employeeModel";
import { EmployeeService } from "app/modules/employee/employee.service";
import { DeliveryOrderService } from "../deliveryorder.service";
import { DeliveryOrderModel } from "models/deliveryOrder/deliveryOrderModel";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { AssignDriverRequestModel } from "models/deliverySession/assignDriverModel";

@Component({
    selector     : 'assignDriver',
    templateUrl  : './assignDriver.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AssignDriver
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
    stationCode:string;
    params: any;
    order:DeliveryOrderModel;
    assignModel:AssignDriverRequestModel={};
    stationEdited:StationModel={};
    address:AddressModel={};
    driverList:EmployeeModel[];
    alert:any;
    temp:number=1;
    employeeName:string;
    vehicleList:VehicleModel[];
    stationList:StationModel[];
    regionSelected:string="";
    searchParam:PaginationParamsModel;
    regionList=REGION_LIST;
    cityList=CITY_LIST;
    districtList=DISTRICT_LIST;
    wardList=AWARD_LIST;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private location:Location,
        private orderService:DeliveryOrderService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        private dialogRef: MatDialogRef<AssignDriver>,
        @Inject(MAT_DIALOG_DATA) public orderCode:any,
        )
    {
        this.params = this.location.getState();
        console.log(orderCode.orderCode);
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      this.getDriversField();
      this.getVehiclesField();
      this.getStationsField();
      this.getOrderByCode()
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code:[{value:"",disabled:true}],
            referencecode:[{value:"", disabled:true}],
            totalitems:[{value:"",disabled:true}],
            status: [{value:"",disabled:true}],
            deliveryservice:[{value:"", disabled:true}],
            address:[{value:"", disabled:true}],
            driver:["",Validators.required],
            vehicle:["",Validators.required],
            station:["",Validators.required]
          });
        }
    }


    onBack() {
        this.dialogRef.close();
    }
    getDriversField(){
        this.searchParam={Keyword:"", Status:"",};
        this.orderService.getDrivers(this.searchParam).subscribe({next : (data) => {
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
    getVehiclesField(){
        this.searchParam={Keyword:"", Status:"",};
        this.orderService.getVehicles(this.searchParam).subscribe({next : (data) => {
            if (data) {
                var temp=1;
                //this.asset=data;
                this.vehicleList=data.data.items;
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
        this.orderService.getStations(this.searchParam).subscribe({next : (data) => {
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

    getOrderByCode(){
        this.orderService.getDeliveryOrderByCode(this.orderCode.orderCode).subscribe({next : (data) => {
            if (data) {
                this.order=data.data;
                this.employeeName=data.data.code;
                this.supportForm.patchValue({
                    "code":data.data.code,
                    "referencecode":data.data.referenceCode,
                    "totalitems":data.data.childrens.length>0? data.data.childrens[0].totalItems:data.data.totalItems,
                    "status":this.order.status,
                    "deliveryservice":data.data.childrens.length>0? data.data.childrens[0].threePLTeam:data.data.threePLTeam,
                    "address":data.data.childrens[0].endAddress.text+" "+data.data.childrens[0].endAddress.slicWard+" "+data.data.childrens[0].endAddress.slicDistrict+" "+data.data.childrens[0].endAddress.slicProvince+" "
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


    assign(){
        const confirmation = this._fuseAlertnService.open({
            title  : 'Confirmation',
            message: 'Are you sure you want to assign this order "'+this.orderCode.orderCode+'" to driver ?',
            actions: {
                confirm: {
                    label: 'Confirmation'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
            if ( result === 'confirmed' )
            {
                var driver=this.supportForm.get('driver').value;
                var vehicle=this.supportForm.get('vehicle').value;
                var station=this.supportForm.get('station').value;
        
               this.assignModel.driverCode=driver;
               this.assignModel.deliveryOrderCodes=[this.orderCode.orderCode];
               this.assignModel.stationCode=station;
               this.assignModel.vehicleCode=vehicle;
               console.log(this.assignModel);
                this.orderService.assignDriver(this.assignModel).subscribe({
                            next: (result) => {
                                if (result.success == true) {
                                    const confirmation = this._fuseAlertnService.open({
                                        title  : 'Success',
                                        message: 'Assign driver successfully for order '+this.order.code,
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
                                    this.onBack();
                                    });
                                
                                } else {
                                    const confirmation = this._fuseAlertnService.open({
                                        title  : 'Failed',
                                        message: 'Assign driver failed for order '+this.order.code,
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
        });
    }

    


}
