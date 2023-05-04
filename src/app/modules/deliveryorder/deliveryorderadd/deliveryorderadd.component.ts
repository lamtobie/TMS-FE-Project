import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
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
import { MatCheckboxChange } from "@angular/material/checkbox";
import { DeliveryOrderManyDropoffCreationModel, DropoffInfoModel, PickupInfoModel } from "models/deliveryOrder/deliveryOrderCreationModel";
import { DeliveryOrderModel, DeliveryPackageModel } from "models/deliveryOrder/deliveryOrderModel";
import { DeliveryOrderService } from "../deliveryorder.service";
import moment from "moment";

@Component({
    selector     : 'deliveryorderadd',
    templateUrl  : './deliveryorderadd.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DeliveryOrderAdd
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("pickupNgForm") pickupNgForm: NgForm;
    @ViewChild("dropdownNgForm") dropdownNgForm: NgForm;
    @ViewChild("orderNgForm") orderNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    pickupForm: FormGroup;
    dropdownForm: FormGroup;
    orderForm: FormGroup;
    orderCode:string;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    isAddShow:boolean=true;
    isStationManager:boolean=false;
    isLoadGoods:boolean=false;
    isUpstair:boolean=false;
    isCheckFirst:boolean=false;
    isDisabled:boolean=false;
    PAGEMODE: string='new';
    stationCode:string;
    slicCode:string;
    params: any;
    station:StationModel;
    orderCreation:DeliveryOrderManyDropoffCreationModel={};
    pickupInfo: PickupInfoModel={};
    dropoffInfoList: Array<DropoffInfoModel>=[];
    dropoffInfo:DropoffInfoModel={};
    stationEdited:StationModel={};
    deliveryOrder:DeliveryOrderModel={};
    address:AddressModel={};
    pickupAddress:AddressModel={};
    dropoffAddress:AddressModel={};
    deliveryOrderLines:DeliveryPackageModel[]=[];
    package:DeliveryPackageModel={};
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
        private orderService:DeliveryOrderService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        private _changeDetectorRef: ChangeDetectorRef
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.orderCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.orderCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getViewOrderByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getEditOrderByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      this.getSlicCode();
      //this.initData();
  }
  getSlicCode(){
    this.searchParam={Keyword:'', Status:''};
    this.orderService.getDeliveryOrders(this.searchParam).subscribe({next : (data) => {
        if (data) {
            data.data.items.forEach(d=>{
                if (d.code!=null){
                    this.temp++;
                }
            });
            this.slicCode='DO'+this.temp
        }
    }, error: err => {
        this.alert = {
            type: 'error',
            message:
                'Cannot get any data from center. Please refresh this page.',
        };
    }});
}
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
          });
        }
        if (!this.pickupForm) {
            // Create the support form
            this.pickupForm = this._formBuilder.group({
              contact:["", Validators.required],
              phone:["", Validators.required],
              address:["", Validators.required],
              lat:["", Validators.required],
              long:["", Validators.required],
              region:"Mien Nam",
              province:"Ho Chi Minh",
              district:"Quan 1",
              ward:"Phuong 1",
              expecteddate:"",
              expectedtime:"",
              note:"",
            });
          }
          if (!this.dropdownForm) {
            // Create the support form
            this.dropdownForm = this._formBuilder.group({
              contact:["", Validators.required],
              phone:["", Validators.required],
              address:["", Validators.required],
              lat:["", Validators.required],
              long:["", Validators.required],
              region:"Mien Nam",
              province:"Ho Chi Minh",
              district:"Quan 1",
              ward:"Phuong 1",
              expecteddate:"",
              expectedtime:"",
              note:"",
            });
          }
          if (!this.orderForm) {
            // Create the support form
            this.orderForm = this._formBuilder.group({
              referencecode:["", Validators.required],
              deliveryservice:["", Validators.required],
              producttype:["", Validators.required],
              totalitems:["", Validators.required],
              weight:["", Validators.required],
              amount:[{value:"",disabled:true},Validators.required],
              codmethod:[{value:"",disabled:true},Validators.required],
              sows: this._formBuilder.array([]),
              status:""
            });
        }
        const sowFormGroups: any = [];
        sowFormGroups.push(
            this._formBuilder.group({
                name: [''],
                code: [''],
                unit: [],
                quantity: [0],
                weight: [0],
                long: [0],
                wide: [0],
                height: [0],
            })
        );

        sowFormGroups.forEach((sowFormGroup) => {
            (this.orderForm.get('sows') as FormArray).push(sowFormGroup);
        });
        
    }
    addSowField(): void
    {
        // Create an empty email form group
        const sowFormGroup = this._formBuilder.group({
            name: [''],
            code: [''],
            unit: [],
            quantity: [0],
            weight: [0],
            long: [0],
            wide: [0],
            height: [0],
        });

        // Add the email form group to the emails form array
        (this.orderForm.get('sows') as FormArray).push(sowFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    removeSowField(index: number): void
    {
        // Get form array for emails
        const sowsFormArray = this.orderForm.get('sows') as FormArray;

        // Remove the email field
        sowsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
          });
          this.pickupForm.reset();
          this.pickupForm = this._formBuilder.group({
            contact:["", Validators.required],
            phone:["", Validators.required],
            address:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            expecteddate:"",
            expectedtime:"",
            note:"",
          });
        this.dropdownForm.reset();
        this.dropdownForm = this._formBuilder.group({
            contact:["", Validators.required],
            phone:["", Validators.required],
            address:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            expecteddate:"",
            expectedtime:"",
            note:"",
          });
        this.orderForm.reset();
        this.orderForm = this._formBuilder.group({
            referencecode:["", Validators.required],
            deliveryservice:["", Validators.required],
            producttype:["", Validators.required],
            totalitems:["", Validators.required],
            weight:["", Validators.required],
            amount:[{value:"",disabled:true},Validators.required],
            codmethod:[{value:"",disabled:true},Validators.required],
            sows: this._formBuilder.array([]),
            status:"active"
          });
          const sowFormGroups: any = [];
          sowFormGroups.push(
              this._formBuilder.group({
                  name: [''],
                  code: [''],
                  unit: [],
                  quantity: [0],
                  weight: [0],
                  long: [0],
                  wide: [0],
                  height: [0],
              })
          );
  
          sowFormGroups.forEach((sowFormGroup) => {
              (this.orderForm.get('sows') as FormArray).push(sowFormGroup);
          });
    }

    onBack() {
        this.location.back();
    }
   
    getViewOrderByCode(){
        this.orderService.getDeliveryOrderByCode(this.orderCode).subscribe({next : (data) => {
            if (data) {
                var pickup= new Date(data.data.expectedStartTime);
                var dropoff=new Date(data.data.childrens[0].expectedArrivalTime);
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                  });
                this.pickupForm = this._formBuilder.group({
                    contact:[{value:data.data.startContactPerson, disabled:true}, Validators.required],
                    phone:[{value:data.data.startContactPhone, disabled:true}, Validators.required],
                    address:[{value:data.data.startAddress.text,disabled:true}, Validators.required],
                    lat:[{value:data.data.startAddress.lat,disabled:true}, Validators.required],
                    long:[{value:data.data.startAddress.long, disabled:true}, Validators.required],
                    region:data.data.startAddress.slicRegion,
                    province:data.data.startAddress.slicProvince,
                    district:data.data.startAddress.slicDistrict,
                    ward:data.data.startAddress.slicWard,
                    expecteddate:[{value:pickup,disabled:true},Validators.required],
                    expectedtime: [{value:(pickup.getHours() < 10 ? '0' : '') +pickup.getHours().toLocaleString()+":"+pickup.getMinutes().toString(),disabled:true},Validators.required],
                    note:[{value:data.data.startNote,disabled:true}, Validators.required],
                });
                this.dropdownForm = this._formBuilder.group({
                    contact:[{value:data.data.childrens[0].endContactPerson,disabled:true}, Validators.required],
                    phone:[{value:data.data.childrens[0].endContactPhone,disabled:true}, Validators.required],
                    address:[{value:data.data.childrens[0].endAddress.text,disabled:true}, Validators.required],
                    lat:[{value:data.data.childrens[0].endAddress.lat, disabled:true},Validators.required],
                    long:[{value:data.data.childrens[0].endAddress.long,disabled:true}, Validators.required],
                    region:data.data.childrens[0].endAddress.slicRegion,
                    province:data.data.childrens[0].endAddress.slicProvince,
                    district:data.data.childrens[0].endAddress.slicDistrict,
                    ward:data.data.childrens[0].endAddress.slicWard,
                    expecteddate:[{value:dropoff,disabled:true},Validators.required],
                    expectedtime: [{value:(dropoff.getHours() < 10 ? '0' : '') +dropoff.getHours().toLocaleString()+":"+dropoff.getMinutes().toString(),disabled:true},Validators.required],
                    note:{value:data.data.childrens[0].endNote,disabled:true},
                  });
                  this.orderForm = this._formBuilder.group({
                    referencecode:[{value:data.data.childrens[0].referenceCode,disabled:true}, Validators.required],
                    deliveryservice:[data.data.childrens[0].threePLTeam, Validators.required],
                    producttype:[data.data.childrens[0].productType, Validators.required],
                    totalitems:[{value:data.data.childrens[0].totalItems,disabled:true}, Validators.required],
                    weight:[{value:data.data.childrens[0].weight, disabled:true},Validators.required],
                    amount:[{value:data.data.childrens[0].codAmount,disabled:true},Validators.required],
                    codmethod:[{value:data.data.childrens[0].codMethod,disabled:true},Validators.required],
                    sows: this._formBuilder.array([]),
                    status:data.data.status,
                  });
                  this.isStationManager=data.data.childrens[0].codAllowed;
                  this.isDisabled=true;
                  const sowFormGroups: any = [];
                  this.deliveryOrderLines=data.data.childrens[0].deliveryOrderLines;
                  console.log(this.deliveryOrderLines);
                  this.deliveryOrderLines.forEach(e=>{
                    sowFormGroups.push(
                        this._formBuilder.group({
                            name: [{value:e.name,disabled:true},Validators.required],
                            code: [{value:e.externalCode,disabled:true},Validators.required],
                            unit: [{value:e.uom,disabled:true},Validators.required],
                            quantity: [{value:e.quantity,disabled:true},Validators.required],
                            weight: [{value:e.weight,disabled:true},Validators.required],
                            long: [{value:e.length,disabled:true},Validators.required],
                            wide: [{value:e.width,disabled:true},Validators.required],
                            height: [{value:e.height,disabled:true},Validators.required],
                        })
                    );
                  });
               
          
                  sowFormGroups.forEach((sowFormGroup) => {
                      (this.orderForm.get('sows') as FormArray).push(sowFormGroup);
                  });
                  this.stationName=data.data.code;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
        this.pickupForm.disable();
        this.dropdownForm.disable();
        this.orderForm.disable();
    }

    getEditOrderByCode(){
        this.orderService.getDeliveryOrderByCode(this.orderCode).subscribe({next : (data) => {
            if (data) {
                this.deliveryOrder=data.data;
                var pickup= new Date(data.data.expectedStartTime);
                var dropoff=new Date(data.data.childrens[0].expectedArrivalTime);
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                  });
                this.pickupForm = this._formBuilder.group({
                    contact:[data.data.startContactPerson, Validators.required],
                    phone:[data.data.startContactPhone, Validators.required],
                    address:[data.data.startAddress.text, Validators.required],
                    lat:[data.data.startAddress.lat, Validators.required],
                    long:[data.data.startAddress.long, Validators.required],
                    region:data.data.startAddress.slicRegion,
                    province:data.data.startAddress.slicProvince,
                    district:data.data.startAddress.slicDistrict,
                    ward:data.data.startAddress.slicWard,
                    expecteddate:[pickup,Validators.required],
                    expectedtime: [(pickup.getHours() < 10 ? '0' : '') +pickup.getHours().toLocaleString()+":"+pickup.getMinutes().toString(),Validators.required],
                    note:[data.data.startNote, Validators.required],
                });
                this.dropdownForm = this._formBuilder.group({
                    contact:[data.data.childrens[0].endContactPerson, Validators.required],
                    phone:[data.data.childrens[0].endContactPhone, Validators.required],
                    address:[data.data.childrens[0].endAddress.text, Validators.required],
                    lat:[data.data.childrens[0].endAddress.lat,Validators.required],
                    long:[data.data.childrens[0].endAddress.long, Validators.required],
                    region:data.data.childrens[0].endAddress.slicRegion,
                    province:data.data.childrens[0].endAddress.slicProvince,
                    district:data.data.childrens[0].endAddress.slicDistrict,
                    ward:data.data.childrens[0].endAddress.slicWard,
                    expecteddate:[dropoff,Validators.required],
                    expectedtime: [(dropoff.getHours() < 10 ? '0' : '') +dropoff.getHours().toLocaleString()+":"+dropoff.getMinutes().toString(),Validators.required],
                    note:data.data.childrens[0].endNote,
                  });
                  this.orderForm = this._formBuilder.group({
                    referencecode:[data.data.childrens[0].referenceCode, Validators.required],
                    deliveryservice:[data.data.childrens[0].threePLTeam, Validators.required],
                    producttype:[data.data.childrens[0].productType, Validators.required],
                    totalitems:[data.data.childrens[0].totalItems, Validators.required],
                    weight:[data.data.childrens[0].weight,Validators.required],
                    amount:[data.data.childrens[0].codAmount,Validators.required],
                    codmethod:[data.data.childrens[0].codMethod,Validators.required],
                    sows: this._formBuilder.array([]),
                    status:data.data.status,
                  });
                  this.isStationManager=data.data.childrens[0].codAllowed;
                  const sowFormGroups: any = [];
                  this.deliveryOrderLines=data.data.childrens[0].deliveryOrderLines;
                  console.log(this.deliveryOrderLines);
                  this.deliveryOrderLines.forEach(e=>{
                    sowFormGroups.push(
                        this._formBuilder.group({
                            name: [e.name,Validators.required],
                            code: [e.externalCode,Validators.required],
                            unit: [e.uom,Validators.required],
                            quantity: [e.quantity,Validators.required],
                            weight: [e.weight,Validators.required],
                            long: [e.length,Validators.required],
                            wide: [e.width,Validators.required],
                            height: [e.height,Validators.required],
                        })
                    );
                  });
               
          
                  sowFormGroups.forEach((sowFormGroup) => {
                      (this.orderForm.get('sows') as FormArray).push(sowFormGroup);
                  });
                  this.stationName=data.data.code;
                  
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToOrderList() {
        this.route.navigateByUrl("/deliveryoder");
    }

    updateOrder(){
         //pickup Address
         this.pickupAddress.text=this.pickupForm.get('address').value;
         this.pickupAddress.lat= this.convertStr2Num(this.pickupForm.get('lat').value);
         this.pickupAddress.long=this.convertStr2Num(this.pickupForm.get('long').value);
         this.pickupAddress.slicRegion=this.pickupForm.get('region').value;
         this.pickupAddress.slicProvince=this.pickupForm.get('province').value;
         this.pickupAddress.slicDistrict=this.pickupForm.get('district').value;
         this.pickupAddress.slicWard=this.pickupForm.get('ward').value;
         this.pickupAddress.slicCode=this.slicCode;
         this.pickupAddress.slicLabel=this.pickupForm.get('ward').value;
         this.pickupAddress.slicLevel="Phuong"
         //dropoff Address
         this.dropoffAddress.text=this.dropdownForm.get('address').value;
         this.dropoffAddress.lat= this.convertStr2Num(this.dropdownForm.get('lat').value);
         this.dropoffAddress.long=this.convertStr2Num(this.dropdownForm.get('long').value);
         this.dropoffAddress.slicRegion=this.dropdownForm.get('region').value;
         this.dropoffAddress.slicProvince=this.dropdownForm.get('province').value;
         this.dropoffAddress.slicDistrict=this.dropdownForm.get('district').value;
         this.dropoffAddress.slicWard=this.dropdownForm.get('ward').value;
         this.dropoffAddress.slicCode=this.slicCode;
         this.dropoffAddress.slicLabel=this.dropdownForm.get('ward').value;
         this.dropoffAddress.slicLevel="Phuong"
        //package info
         let formObj: any = this.orderForm.getRawValue();
         var sows = formObj.sows;
         for (let i = 0; i < sows.length; i++) {
             this.package={};
              this.package.externalCode= formObj.sows[i].code;
              this.package.height=formObj.sows[i].height;
              this.package.length=formObj.sows[i].long;
              this.package.name=formObj.sows[i].name;
              this.package.quantity=formObj.sows[i].quantity;
              this.package.uom=formObj.sows[i].unit;
              this.package.weight=formObj.sows[i].weight;
              this.package.width=formObj.sows[i].wide;
              this.deliveryOrderLines.push(this.package);
         }
         
        var deliveryDate= moment(this.pickupForm.get("expecteddate").value).toDate();
        var deliveryTime= new Date('01/01/1970 '+this.pickupForm.get("expectedtime").value);
        var expected=this.combineDateAndTime(deliveryDate,deliveryTime);
        this.deliveryOrder.startContactPerson=this.pickupForm.get('contact').value;
        this.deliveryOrder.startContactPhone=this.pickupForm.get('phone').value;
        this.deliveryOrder.startNote=this.pickupForm.get('note').value;
        this.deliveryOrder.expectedStartTime=expected.getTime();
        this.deliveryOrder.startAddress=this.pickupAddress;
        var arrivalDate= moment(this.dropdownForm.get("expecteddate").value).toDate();
        var arrivalTime= new Date('01/01/1970 '+this.dropdownForm.get("expectedtime").value);
        var arrival=this.combineDateAndTime(arrivalDate,arrivalTime);
        this.deliveryOrder.childrens[0].endContactPerson=this.dropdownForm.get('contact').value;
        this.deliveryOrder.childrens[0].endContactPhone=this.dropdownForm.get('phone').value;
        this.deliveryOrder.childrens[0].expectedArrivalTime=arrival.getTime();
        this.deliveryOrder.childrens[0].codAllowed=this.isStationManager;
        this.deliveryOrder.childrens[0].codAmount=this.orderForm.get('amount').value;
        this.deliveryOrder.childrens[0].codMethod=this.orderForm.get('codmethod').value;
        this.deliveryOrder.childrens[0].deliveryOrderLines=this.deliveryOrderLines;
        this.deliveryOrder.childrens[0].endAddress=this.dropoffAddress;
        this.deliveryOrder.childrens[0].endNote=this.dropdownForm.get('note').value;
        this.deliveryOrder.childrens[0].expectedTimeConsumed=(arrival.getTime()-expected.getTime());
        this.deliveryOrder.childrens[0].productType=this.orderForm.get('producttype').value;
        this.deliveryOrder.childrens[0].referenceCode=this.orderForm.get('referencecode').value;
        this.deliveryOrder.childrens[0].threePLTeam=this.orderForm.get('deliveryservice').value;
        this.deliveryOrder.childrens[0].totalItems=this.orderForm.get('totalitems').value;
        this.deliveryOrder.childrens[0].weight=this.orderForm.get('weight').value;


        this.orderService.updateDeliveryOrder(this.deliveryOrder).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Update successfully for order '+this.deliveryOrder.code,
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
                       this.moveToOrderList();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Update failed for order '+this.deliveryOrder.code,
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
                       this.moveToOrderList();
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

    combineDateAndTime(date:Date, time:Date) {
        var timeString = time.getHours() + ':' + time.getMinutes() + ':00';
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Jan is 0, dec is 11
        var day = date.getDate();
        var dateString = '' + year + '-' + month + '-' + day;
        var combined = new Date(dateString + ' ' + timeString);
    
        return combined;
    };
    createDeliveryOder(){
        //pickup Address
        this.pickupAddress.text=this.pickupForm.get('address').value;
        this.pickupAddress.lat= this.convertStr2Num(this.pickupForm.get('lat').value);
        this.pickupAddress.long=this.convertStr2Num(this.pickupForm.get('long').value);
        this.pickupAddress.slicRegion=this.pickupForm.get('region').value;
        this.pickupAddress.slicProvince=this.pickupForm.get('province').value;
        this.pickupAddress.slicDistrict=this.pickupForm.get('district').value;
        this.pickupAddress.slicWard=this.pickupForm.get('ward').value;
        this.pickupAddress.slicCode=this.slicCode;
        this.pickupAddress.slicLabel=this.pickupForm.get('ward').value;
        this.pickupAddress.slicLevel="Phuong"
        //dropoff Address
        this.dropoffAddress.text=this.dropdownForm.get('address').value;
        this.dropoffAddress.lat= this.convertStr2Num(this.dropdownForm.get('lat').value);
        this.dropoffAddress.long=this.convertStr2Num(this.dropdownForm.get('long').value);
        this.dropoffAddress.slicRegion=this.dropdownForm.get('region').value;
        this.dropoffAddress.slicProvince=this.dropdownForm.get('province').value;
        this.dropoffAddress.slicDistrict=this.dropdownForm.get('district').value;
        this.dropoffAddress.slicWard=this.dropdownForm.get('ward').value;
        this.dropoffAddress.slicCode=this.slicCode;
        this.dropoffAddress.slicLabel=this.dropdownForm.get('ward').value;
        this.dropoffAddress.slicLevel="Phuong"

        //PickupInfo
        var deliveryDate= moment(this.pickupForm.get("expecteddate").value).toDate();
        var deliveryTime= new Date('01/01/1970 '+this.pickupForm.get("expectedtime").value);
        var expected=this.combineDateAndTime(deliveryDate,deliveryTime);
        this.pickupInfo.startAddress=this.pickupAddress;
        this.pickupInfo.expectedStartTime=expected.getTime();
        this.pickupInfo.startContactPerson=this.pickupForm.get('contact').value;
        this.pickupInfo.startContactPhone=this.pickupForm.get('phone').value;
        this.pickupInfo.startNote=this.pickupForm.get('note').value

        //Package info
        let formObj: any = this.orderForm.getRawValue();
        var sows = formObj.sows;
        for (let i = 0; i < sows.length; i++) {
            this.package={};
             this.package.externalCode= formObj.sows[i].code;
             this.package.height=formObj.sows[i].height;
             this.package.length=formObj.sows[i].long;
             this.package.name=formObj.sows[i].name;
             this.package.quantity=formObj.sows[i].quantity;
             this.package.uom=formObj.sows[i].unit;
             this.package.weight=formObj.sows[i].weight;
             this.package.width=formObj.sows[i].wide;
             this.deliveryOrderLines.push(this.package);
        }
        console.log(this.deliveryOrderLines)

        //Dropdown info
        var arrivalDate= moment(this.dropdownForm.get("expecteddate").value).toDate();
        var arrivalTime= new Date('01/01/1970 '+this.dropdownForm.get("expectedtime").value);
        var arrival=this.combineDateAndTime(arrivalDate,arrivalTime);
        this.dropoffInfo.codAllowed=this.isStationManager;
        this.dropoffInfo.codAmount=this.orderForm.get('amount').value;
        this.dropoffInfo.codMethod=this.orderForm.get('codmethod').value;
        this.dropoffInfo.deliveryOrderLines=this.deliveryOrderLines;
        this.dropoffInfo.endAddress=this.dropoffAddress;
        this.dropoffInfo.endContactPerson=this.dropdownForm.get('contact').value;
        this.dropoffInfo.endContactPhone=this.dropdownForm.get('phone').value;
        this.dropoffInfo.endNote=this.dropdownForm.get('note').value;
        this.dropoffInfo.expectedArrivalTime=arrival.getTime();
        this.dropoffInfo.expectedTimeConsumed=(arrival.getTime()-expected.getTime());
        this.dropoffInfo.productType=this.orderForm.get('producttype').value;
        this.dropoffInfo.referenceCode=this.orderForm.get('referencecode').value;
        this.dropoffInfo.threePLTeam=this.orderForm.get('deliveryservice').value;
        this.dropoffInfo.totalItems=this.orderForm.get('totalitems').value;
        this.dropoffInfo.weight=this.orderForm.get('weight').value;

        this.dropoffInfoList.push(this.dropoffInfo);
        this.orderCreation.pickupInfo=this.pickupInfo;
        this.orderCreation.dropoffInfo=this.dropoffInfoList;

        this.orderService.createDeliveryOrderWithManyDropOff(this.orderCreation).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Order create successfully',
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
                       this.moveToOrderList();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Order create failed',
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
                       this.moveToOrderList();
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
    getCheckboxEvent(event:MatCheckboxChange){
        this.isStationManager=event.checked;
        if (this.isStationManager==false){
            this.orderForm.get('amount').disable();
            this.orderForm.get('codmethod').disable();
            this.orderForm.patchValue({codmethod:''});
        }
        else{
            this.orderForm.get('amount').enable();
            this.orderForm.get('codmethod').enable();
            this.orderForm.patchValue({codmethod:'Thu tiền mặt'});
        }
    }
    getIsLoadGooosEvent(event:MatCheckboxChange){
        this.isLoadGoods=event.checked;
    }
    getIsUpstairEvent(event:MatCheckboxChange){
        this.isUpstair=event.checked;
    }
    getIsCheckFirstEvent(event:MatCheckboxChange){
        this.isCheckFirst=event.checked;
    }
    validatePickupPhoneNumber(){
        var phoneno = /^\d{10}$/;
        var phone=this.pickupForm.get('phone').value;
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
               this.pickupForm.patchValue({'phone':""});
            });        
        }
    }
    validateDropOffPhoneNumber(){
        var phoneno = /^\d{10}$/;
        var phone=this.dropdownForm.get('phone').value;
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
               this.dropdownForm.patchValue({'phone':""});
            });        
        }
    }
  
}
