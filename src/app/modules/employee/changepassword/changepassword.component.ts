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
import { EmployeeService } from "../employee.service";

@Component({
    selector     : 'changepassword',
    templateUrl  : './changepassword.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ChangePassword
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
    employee:EmployeeModel;
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
        private employeeService:EmployeeService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        private dialogRef: MatDialogRef<ChangePassword>,
        @Inject(MAT_DIALOG_DATA) public employeeCode:any,
        )
    {
        this.params = this.location.getState();
        console.log(employeeCode.employeeCode);
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      this.getEmployeeByCode()
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            new: ["", Validators.required],
            confirm: ["", Validators.required],
          });
        }
    }


    onBack() {
        this.dialogRef.close();
    }
   

    getEmployeeByCode(){
        this.employeeService.getEmployeeByCode(this.employeeCode.employeeCode).subscribe({next : (data) => {
            if (data) {
                this.employee=data.data;
               
                  this.employeeName=data.data.fullName;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }


    updatePassword(){
        var newPassword=this.supportForm.get('new').value;
        var confirmPassword=this.supportForm.get('confirm').value;
        if (newPassword != confirmPassword){
            const confirmation = this._fuseAlertnService.open({
                                title  : 'Error',
                                message: 'Confirmation password does not match',
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
                                this.supportForm.reset();
                                this.supportForm = this._formBuilder.group({
                                    new: ["", Validators.required],
                                    confirm: ["", Validators.required],
                                  });
                            });
        }
        else{
            if (this.employee.password==confirmPassword){
                const confirmation = this._fuseAlertnService.open({
                    title  : 'Error',
                    message: 'Password has not changed!',
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
                    this.supportForm.reset();
                    this.supportForm = this._formBuilder.group({
                        new: ["", Validators.required],
                        confirm: ["", Validators.required],
                      });
                });
            }
            else{
                this.employee.password=confirmPassword;
                this.employeeService.updateEmployee(this.employee).subscribe({
                    next: (result) => {
                        if (result.success == true) {
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Success',
                                message: 'Update password successfully for employee '+this.employee.fullName,
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
                                message: 'Update password failed for employee '+this.employee.fullName,
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

    }

}
