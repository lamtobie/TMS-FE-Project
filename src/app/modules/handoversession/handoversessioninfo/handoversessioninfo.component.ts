import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
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
import { EmployeeModel } from "models/employee/employeeModel";
import { VehicleModel } from "models/vehicle/vehicleModel";
import { HandoverSessionService } from "../handoversession.service";
import { DeliverySessionLineModel, DeliverySessionModel, DeliverySessionToCreateDto } from "models/deliverySession/deliverySessionModel";
import { DeliveryOrderModel } from "models/deliveryOrder/deliveryOrderModel";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
    selector     : 'handoversessioninfo',
    templateUrl  : './handoversessioninfo.component.html',
    encapsulation: ViewEncapsulation.None
})
export class HandoverSessionInfo
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild("addorderNgForm") addorderNgForm: NgForm;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    supportForm: FormGroup;
    addorder: FormGroup;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    isAddShow:boolean=true;
    PAGEMODE: string='new';
    stationCode:string;
    sessionCode:string;
    doCode:string="";
    codes:Array<string>=[];
    deliverySessionToCreate:DeliverySessionToCreateDto={};
    sessionList:Array<DeliveryOrderModel>=[];
    coordinatorList:EmployeeModel[]=[];
    doList:Array<DeliveryOrderModel>=[];
    sessionLineList:DeliverySessionLineModel[]=[];
    deliverySession:DeliverySessionModel={};
    sessionLine:DeliverySessionLineModel={};
    params: any;
    station:StationModel;
    isStationManager:boolean=false;
    isDisabled:boolean=false;
    invalid:boolean=false;
    invalidDisabled:boolean=false;
    donot:boolean=false;
    donotDisabled:boolean=false;
    stationEdited:StationModel={};
    address:AddressModel={};
    alert:any;
    temp:number=0;
    stationName:string;
    regionSelected:string="";
    searchParam:PaginationParamsModel;
    dataSessionLine: MatTableDataSource<DeliverySessionLineModel>;
    driverList:EmployeeModel[]=[];
    vehicleList:VehicleModel[]=[];
    stationList:StationModel[]=[];
    spackages:number=0;
    sdos:number=0;
    displayCols2: string[] = [
        'stt',
        'docode',
        'packagecode',
        'referencecode',
        'dogroupcode',
        'action'
    ];
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private location:Location,
        private stationService:StationService,
        private sessionService:HandoverSessionService,
        private _fuseAlertnService: FuseConfirmationService,
        private route:Router,
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.sessionCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.sessionCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getDriverField();
            this.getCoordinatorField();
            this.getVehicleField();
            this.getStationField();
            this.getSessionByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getDriverField();
            this.getCoordinatorField();
            this.getVehicleField();
            this.getStationField();
            this.getSessionByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
      this.createForm();
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            status: [{value:"", disabled:true}],
            pickup:[{value:"", disabled:true}],
            dropdown:[{value:"", disabled:true}],
            coordinator:[{value:"", disabled:true}],
            driver:[{value:"", disabled:true}],
            vehicle:[{value:"", disabled:true}],
            dos:[{value:"", disabled:true}],
            dps:[{value:"", disabled:true}],
            createdate:[{value:"", disabled:true}],
            confirmdate:[{value:"", disabled:true}],
            reiceved:[{value:"", disabled:true}],
            except:[{value:"", disabled:true}],
            cancelreason:[{value:"", disabled:true}],
            note:[{value:"", disabled:true}],
          });
        }
        if (!this.addorder) {
            // Create the support form
            this.addorder = this._formBuilder.group({
              code: "",
            });
        }
    }

    clearButton(){
        this.supportForm.reset();
        this.addorder.reset();
        this.supportForm = this._formBuilder.group({
            status: [{value:"", disabled:true}],
            pickup:[{value:"", disabled:true}],
            dropdown:[{value:"", disabled:true}],
            coordinator:[{value:"", disabled:true}],
            driver:[{value:"", disabled:true}],
            vehicle:[{value:"", disabled:true}],
            dos:[{value:"", disabled:true}],
            dps:[{value:"", disabled:true}],
            createdate:[{value:"", disabled:true}],
            confirmdate:[{value:"", disabled:true}],
            reiceved:[{value:"", disabled:true}],
            except:[{value:"", disabled:true}],
            cancelreason:[{value:"", disabled:true}],
            note:[{value:"", disabled:true}],
          });
          this.addorder = this._formBuilder.group({
            code: "",
          });
    }

    onBack() {
        this.location.back();
    }

    moveToSessionList() {
        this.route.navigateByUrl("/handoversession");
    }

    convertStr2Num(value: string): number {
        value = value.toString().split('.').join('');
        value = value.replace(',', '.');
        return parseFloat(value);
    }
    removeRow(element:DeliverySessionLineModel){
        const i:number= this.sessionLineList.indexOf(element);
        
        if (i !== -1){
            this.sessionLineList.splice(i,1);
            this.temp--;
        }
        this.dataSessionLine=new MatTableDataSource<DeliverySessionLineModel>(this.sessionLineList);
        this.dataSessionLine.paginator=this.paginator;
    }
    createSession(){
        this.deliverySession.driverCode=this.supportForm.get('driver').value;
        this.deliverySession.coordinatorCode="EPL2"
        this.deliverySession.vehicleCode=this.supportForm.get('vehicle').value;
        this.deliverySession.startStationCode="STA1";
        this.deliverySession.endStationCode=this.supportForm.get('droppoint').value;
        this.deliverySession.totalDOs=this.sdos;
        this.deliverySession.totalDPs=this.spackages;
        this.deliverySession.deliverySessionLines=this.sessionLineList;
        this.sessionList.push(this.deliverySession);
        this.deliverySessionToCreate.data=this.sessionList;

        this.sessionService.create(this.deliverySessionToCreate).subscribe({
            next: (result) => {
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create session successfully ',
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
                       this.moveToSessionList();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create session failed',
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
                       this.moveToSessionList();
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
    convertNumToDate(num:number){
        var date = new Date(num);
        return date.toLocaleDateString("en-GB");
    }
    getSessionByCode(){
        this.sessionService.getOneByCode(this.sessionCode).subscribe({next : (data) => {
            if (data) {
               this.deliverySession=data.data;
               console.log(this.deliverySession);
               this.supportForm = this._formBuilder.group({
                status: [{value:this.deliverySession.status, disabled:true}],
                pickup:[{value:this.deliverySession.startStationCode, disabled:true}],
                dropdown:[{value:this.deliverySession.endStationCode, disabled:true}],
                coordinator:[{value:this.deliverySession.coordinator.code, disabled:true}],
                driver:[{value:this.deliverySession.driverCode, disabled:true}],
                vehicle:[{value:this.deliverySession.vehicleCode, disabled:true}],
                dos:[{value:this.deliverySession.totalDOs, disabled:true}],
                dps:[{value:this.deliverySession.totalDPs, disabled:true}],
                createdate:[{value:this.convertNumToDate(this.deliverySession.createdAt), disabled:true}],
                confirmdate:[{value:this.deliverySession.bVerifyAt?this.convertNumToDate(this.deliverySession.bVerifyAt):"", disabled:true}],
                reiceved:[{value:this.deliverySession.totalReceivedItems, disabled:true}],
                except:[{value:this.deliverySession.excepted, disabled:true}],
                cancelreason:[{value:this.deliverySession.reasonCancel, disabled:true}],
                note:[{value:this.deliverySession.note, disabled:true}],
              });
              this.deliverySession.deliverySessionLines.forEach(e=>{
                this.temp++;
                this.sessionLine={};
                this.sessionLine.stt=this.temp;
                this.sessionLine.deliveryOrderCode=e.code;
                this.sessionLine.referenceCode=e.referenceCode;
                this.sessionLine.deliveryOrderGroupCode=e.deliveryOrderGroupCode;
                this.sessionLine.deliveryPackageCode=e.deliveryPackageCode;
                this.sessionLineList.push(this.sessionLine);
              });
              this.dataSessionLine=new MatTableDataSource<DeliverySessionLineModel>(this.sessionLineList);
              this.dataSessionLine.paginator=this.paginator;
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
        this.searchParam={Keyword:'', Status:''};
        this.sessionService.getDrivers(this.searchParam).subscribe({next : (data) => {
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
        this.searchParam={Keyword:"", Status:""};
        this.sessionService.getCoordinators(this.searchParam).subscribe({next : (data) => {
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
    getVehicleField(){
        this.searchParam={Keyword:'', Status:''};
        this.sessionService.getVehicles(this.searchParam).subscribe({next : (data) => {
            if (data) {
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
    getStationField(){
        this.searchParam={Keyword:'', Status:''};
        this.sessionService.getStations(this.searchParam).subscribe({next : (data) => {
            if (data) {
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
    scanCode(){
        var check=0;
        this.doCode= this.addorder.value.code;
        this.sessionLineList.forEach(e=>{
            if (this.doCode==e.deliveryOrderCode){
                check++;
            }
        });
        if (check==0){
            var packages;
            this.codes=this.doCode.split(",");
            this.sessionService.scanCode(this.codes).subscribe({next : (data) => {
                if (data && data.data.length>0) {
                   this.doList=data.data;
                   console.log(this.doList);
                   this.doList.forEach(e =>{
                        if(e.sessionCode != null && e.sessionStatus!="Cancelled"){
                            const confirmation = this._fuseAlertnService.open({
                                title  : 'Error',
                                message: 'The order was created during the handover session '+e.sessionCode,
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
                               this.addorder.patchValue({'code':""});
                            });    
                        }
                        else{
                            if (e.status=="New" || e.status=="DeliveredFailureAndReturned" || e.status=="DeliveryDelayAndReturned" || e.status=="DeliveredToStationSuccess"){
                                packages=e.childrens[0].totalItems;
                                e.childrens[0].deliveryOrderLines.forEach(d=>{
                                    this.sessionLine={};
                                    this.sessionLine.stt=this.temp;
                                    this.sessionLine.deliveryOrderCode=e.code;
                                    this.sessionLine.referenceCode=e.referenceCode;
                                    this.sessionLine.deliveryOrderGroupCode=e.groupCode;
                                    this.sessionLine.deliveryPackageCode=d.code;
                                    this.sessionLine.lineStatus="Valid"
                                    this.sessionLine.message="";
                                    this.sessionLineList.push(this.sessionLine);
                                });
                             
                                this.spackages+=packages;
                                this.sdos+=this.doList.length;
                                document.getElementById('pks').innerText=packages;
                                document.getElementById('dos').innerText=this.doList.length.toString();
                                document.getElementById('spks').innerText=this.spackages.toString();
                                document.getElementById('sdos').innerText=this.sdos.toString();
                            }
                           else{
                            this.sessionLine={};
                            this.sessionLine.stt=this.temp;
                            this.sessionLine.deliveryOrderCode=this.doCode;
                            this.sessionLine.referenceCode="";
                            this.sessionLine.deliveryOrderGroupCode="";
                            this.sessionLine.lineStatus="Invalid"
                            this.sessionLine.message="Order has invalid status";
                            this.sessionLineList.push(this.sessionLine);
                           }
                        }     
                   });
                   
                }
                else{
                        this.sessionLine={};
                        this.sessionLine.stt=this.temp;
                        this.sessionLine.deliveryOrderCode=this.doCode;
                        this.sessionLine.referenceCode="";
                        this.sessionLine.deliveryOrderGroupCode="";
                        this.sessionLine.lineStatus="Invalid"
                        this.sessionLine.message="Order does not exist";
                        this.sessionLineList.push(this.sessionLine);
                }
                this.dataSessionLine=new MatTableDataSource<DeliverySessionLineModel>(this.sessionLineList);
                this.dataSessionLine.paginator=this.paginator;
            }, error: err => {
                this.alert = {
                    type: 'error',
                    message:
                        'Cannot get any data from center. Please refresh this page.',
                };
            }});
            this.temp++;
        }
        else{
            const confirmation = this._fuseAlertnService.open({
                title  : 'Error',
                message: 'The order already exists in the list',
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
            });        
        }
        this.supportForm.patchValue({'code':""});

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
