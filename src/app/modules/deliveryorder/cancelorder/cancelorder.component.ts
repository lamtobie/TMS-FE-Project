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
import { DeliverySessionConfirmModel } from "models/deliverySession/assignDriverModel";

@Component({
    selector     : 'cancelorder',
    templateUrl  : './cancelorder.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CancelOrder
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
    orderConfirm:DeliverySessionConfirmModel={};
    stationEdited:StationModel={};
    address:AddressModel={};
    alert:any;
    temp:number=1;
    employeeName:string;
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
        private dialogRef: MatDialogRef<CancelOrder>,
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
      this.getOrderByCode()
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            reason: ["", Validators.required],
          });
        }
    }


    onBack() {
        this.dialogRef.close();
    }
   

    getOrderByCode(){
        this.orderService.getDeliveryOrderByCode(this.orderCode.orderCode).subscribe({next : (data) => {
            if (data) {
                this.order=data.data;
                this.employeeName=data.data.code;
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }


    cancelOrder(){
        var reason=this.supportForm.get('reason').value;
                this.orderConfirm.reasonCancel=reason;
                console.log(this.order);
                this.orderService.cancelOrder(this.order.sessionCode,this.orderConfirm).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Cancel successfully for order '+this.order.code,
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
                                message: 'Cancel failed for order '+this.order.code,
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

    


}
