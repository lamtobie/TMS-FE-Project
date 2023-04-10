import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from "@angular/material/table";
import { Route, Router } from "@angular/router";
import { List } from "lodash";
import { StationModel } from "models/station/stationModel";
import { StationService } from "../station.service";
import { AWARD_LIST, CITY_LIST, DISTRICT_LIST, REGION_LIST } from "app/shared/province";
import { AddressModel } from "models/address/addressModel";
import { CONSTANT } from "app/shared/constants";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { FuseAlertService } from "@fuse/components/alert";
import { PaginationParamsModel } from "models/commons/requestModel";

@Component({
    selector     : 'stationnew',
    templateUrl  : './stationnew.component.html',
    encapsulation: ViewEncapsulation.None
})
export class StationNew
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
    station:StationModel;
    stationEdited:StationModel={};
    address:AddressModel={};
    alert:any;
    temp:number=1;
    stationName:string;
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
        private stationService:StationService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.stationCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.stationCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getViewStationByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getEditStationByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      this.generateStationCode();
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            contact1:["", Validators.required],
            contact2:["", Validators.required],
            phone1:["", Validators.required],
            phone2:["", Validators.required],
            email1:["", Validators.required],
            email2:["", Validators.required],
            address:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            status:"active"
          });
        }
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:this.stationCode, disabled:true}],
            name: ["", Validators.required],
            contact1:["", Validators.required],
            contact2:["", Validators.required],
            phone1:["", Validators.required],
            phone2:["", Validators.required],
            email1:["", Validators.required],
            email2:["", Validators.required],
            address:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            status:"active"
          });
    }

    onBack() {
        this.location.back();
    }
   
    getViewStationByCode(){
        this.stationService.getStationByCode(this.stationCode).subscribe({next : (data) => {
            if (data) {
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [{value:data.data.name, disabled:true}],
                    contact1:[{value:data.data.contactPerson, disabled:true}],
                    contact2:[{value:data.data.contactPersonAnother, disabled:true}],
                    phone1:[{value:data.data.contactPhone, disabled:true}],
                    phone2:[{value:data.data.contactPhoneAnother, disabled:true}],
                    email1:[{value:data.data.contactEmail, disabled:true}],
                    email2:[{value:data.data.contactEmailAnother, disabled:true}],
                    address:[{value:data.data.address.text, disabled:true}],
                    lat:[{value:data.data.address.lat, disabled:true}],
                    long:[{value:data.data.address.long, disabled:true}],
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status
                  });
                  this.stationName=data.data.name;
                  
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

    getEditStationByCode(){
        this.stationService.getStationByCode(this.stationCode).subscribe({next : (data) => {
            if (data) {
                this.station=data.data;
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: data.data.name,
                    contact1:data.data.contactPerson,
                    contact2:data.data.contactPersonAnother,
                    phone1:data.data.contactPhone,
                    phone2:data.data.contactPhoneAnother,
                    email1:data.data.contactEmail,
                    email2:data.data.contactEmailAnother,
                    address:data.data.address.text,
                    lat:data.data.address.lat,
                    long:data.data.address.long,
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status
                  });
                  this.stationName=data.data.name;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToStation() {
        this.route.navigateByUrl("/station");
    }

    updateStation(){
        this.stationEdited=this.station;
        this.stationEdited.name=this.supportForm.get('name').value;
        this.stationEdited.contactEmail=this.supportForm.get('email1').value;
        this.stationEdited.contactEmailAnother=this.supportForm.get('email2').value;
        this.stationEdited.contactPerson=this.supportForm.get('contact1').value;
        this.stationEdited.contactPersonAnother=this.supportForm.get('contact2').value;
        this.stationEdited.contactPhone=this.supportForm.get('phone1').value;
        this.stationEdited.contactPhoneAnother=this.supportForm.get('phone2').value;
        this.stationEdited.address.text=this.supportForm.get('address').value;
        this.stationEdited.address.lat=this.supportForm.get('lat').value;
        this.stationEdited.address.long=this.supportForm.get('long').value;
        this.stationEdited.address.slicRegion=this.supportForm.get('region').value;
        this.stationEdited.address.slicProvince=this.supportForm.get('province').value;
        this.stationEdited.address.slicDistrict=this.supportForm.get('district').value;
        this.stationEdited.address.slicWard=this.supportForm.get('ward').value;
        this.stationEdited.status=this.supportForm.get('status').value;

        this.stationService.updateStation(this.station).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Update successfully for station '+this.stationEdited.name,
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
                       this.moveToStation();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Update failed for station '+this.stationEdited.name,
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
                       this.moveToStation();
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

    convertStr2Num(value: string): number {
        value = value.toString().split('.').join('');
        value = value.replace(',', '.');
        return parseFloat(value);
    }

    createStation(){
        this.stationEdited.code=this.stationCode;
        this.stationEdited.name=this.supportForm.get('name').value;
        this.stationEdited.contactEmail=this.supportForm.get('email1').value;
        this.stationEdited.contactEmailAnother=this.supportForm.get('email2').value;
        this.stationEdited.contactPerson=this.supportForm.get('contact1').value;
        this.stationEdited.contactPersonAnother=this.supportForm.get('contact2').value;
        this.stationEdited.contactPhone=this.supportForm.get('phone1').value;
        this.stationEdited.contactPhoneAnother=this.supportForm.get('phone2').value;
        this.stationEdited.status=this.supportForm.get('status').value;
        this.address.text=this.supportForm.get('address').value;
        this.address.lat= this.convertStr2Num(this.supportForm.get('lat').value);
        this.address.long=this.convertStr2Num(this.supportForm.get('long').value);
        this.address.slicRegion=this.supportForm.get('region').value;
        this.address.slicProvince=this.supportForm.get('province').value;
        this.address.slicDistrict=this.supportForm.get('district').value;
        this.address.slicWard=this.supportForm.get('ward').value;
        this.address.slicCode=this.stationCode;
        this.address.slicLabel=this.supportForm.get('ward').value;
        this.address.slicLevel="Phuong"
        this.stationEdited.address=this.address;

        this.stationService.createStation(this.stationEdited).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create successfully for station '+this.stationEdited.name,
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
                       this.moveToStation();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create failed for station '+this.stationEdited.name,
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
                       this.moveToStation();
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
    generateStationCode(){
        this.searchParam={Keyword:'', Status:''};
        this.stationService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
                //this.asset=data;
                data.data.items.forEach(d=>{
                    if (d.code!=null){
                        this.temp++;
                    }
                });
                this.stationCode='STA'+this.temp
                this.supportForm.patchValue({'code': this.stationCode});
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }
    validatePhoneNumber(){
        var phoneno = /^\d{10}$/;
        var phone=this.supportForm.get('phone1').value;
        if(phone.match(phoneno))
        {
            
        }
         else
        {
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'Incorrect phone number format',
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
               this.supportForm.patchValue({'phone1':""});
            });        
        }
    }
    validateAnotherPhoneNumber(){
        var phoneno = /^\d{10}$/;
        var phone=this.supportForm.get('phone2').value;
       if(phone.match(phoneno))
       {
           
       }
        else
       {
           const confirmation = this._fuseAlertnService.open({
               title  : 'Error',
               message: 'Incorrect phone number format',
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
              this.supportForm.patchValue({'phone2':""});
           });        
       }
   }
}
