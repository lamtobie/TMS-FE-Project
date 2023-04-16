import { Location } from "@angular/common";
import { ChangeDetectorRef,Component,ElementRef,ViewChild,ViewEncapsulation,} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
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
import { FilePickerComponent } from "ngx-awesome-uploader";
import { FilePickAdapter } from "app/shared/file-picker.adapter";
import { HttpClient } from "@angular/common/http";
import { EmployeeModel } from "models/employee/employeeModel";
import { EmployeeService } from "../employee.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";

@Component({
    selector     : 'coordinatornew',
    templateUrl  : './coordinatornew.component.html',
    styleUrls:['./coordinatornew.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CoordinatorNew
{
    @ViewChild("supportNgForm") supportNgForm: NgForm;
    @ViewChild('uploader', { static: true }) uploader: FilePickerComponent;
    @ViewChild('identity', { static: true }) identity: FilePickerComponent;
    @ViewChild("attachqueue") attachQueue: ElementRef;
    @ViewChild("paginator", { static: true }) paginator: MatPaginator;
    @ViewChild("content") content: ElementRef;

    public adapter = new FilePickAdapter(this.http);
    public identityAdapter = new FilePickAdapter(this.http);

    supportForm: FormGroup;
    isEditShow:boolean=false;
    isViewShow:boolean=false;
    isAddShow:boolean=true;
    PAGEMODE: string='new';
    employeeCode:string;
    params: any;
    photos: string[] = [];
    isStationManager:boolean=false;
    isDisabled:boolean=false;
    identityPhotos: string[] = [];
    licensePhotos: string[] = [];
    services:string[];
    employee:EmployeeModel;
    employeeEdited:EmployeeModel={};
    addresses:AddressModel[];
    stationList:StationModel[];
    address:AddressModel={};
    alert:any;
    temp:number=1;
    employeeName:string;
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
        private employeeServices:EmployeeService,
        private _fuseAlertnService: FuseConfirmationService,
        private http: HttpClient,
        private route:Router,
        )
    {
        this.params = this.location.getState();
        if (this.params.requestId && this.params.mode=='view') {
            this.PAGEMODE = "view";
            this.isViewShow = true;
            this.isAddShow=false;
            this.employeeCode = this.params.requestId;
        }
        if (this.params.requestId && this.params.mode=='edit') {
            this.PAGEMODE = "edit";
            this.isViewShow = false;
            this.isAddShow=false;
            this.isEditShow=true;
            this.employeeCode = this.params.requestId;
        }
        if (this.PAGEMODE == "view") {
            this.createForm();
            this.getStaitonField();
            this.getViewEmployeeByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE == "edit") {
            this.createForm();
            this.getStaitonField();
            this.getEditEmployeenByCode();
            //document.getElementById('clear').style.visibility='hidden';
        }
        if (this.PAGEMODE== "new"){
            this.createForm();
            this.getStaitonField();
            this.generateEmployeeCode();
            
        }
    }


    /**
   * On init
   */
  ngOnInit(): void {
    this.identity.enableAutoUpload=false;
    this.uploader.enableAutoUpload=false;
      //this.initData();
  }
    createForm() {
        if (!this.supportForm) {
          // Create the support form
          this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            email:["", Validators.required],
            password:["", Validators.required],
            idnumber:["", Validators.required],
            address:["", Validators.required],
            phone:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            station:["", Validators.required],
            status:"active"
          });
        }
        
    }

    clearButton(){
        this.supportForm.reset();
        this.supportForm = this._formBuilder.group({
            code: [{value:"", disabled:true}],
            name: ["", Validators.required],
            email:["", Validators.required],
            password:["", Validators.required],
            idnumber:["", Validators.required],
            address:["", Validators.required],
            phone:["", Validators.required],
            lat:["", Validators.required],
            long:["", Validators.required],
            region:"Mien Nam",
            province:"Ho Chi Minh",
            district:"Quan 1",
            ward:"Phuong 1",
            station:["", Validators.required],
            status:"active"
          });
    }

    createEmployee(){
        this.employeeEdited.code=this.supportForm.get('code').value;
        this.employeeEdited.employeeType='coordinator'
        this.employeeEdited.fullName=this.supportForm.get('name').value;
        this.employeeEdited.email=this.supportForm.get('email').value;
        this.employeeEdited.password=this.supportForm.get('password').value;
        this.employeeEdited.identityNumber=this.supportForm.get('idnumber').value;
        this.employeeEdited.mobilePhone=this.supportForm.get('phone').value;
        this.employeeEdited.status='active';
        this.employeeEdited.stationCode=this.supportForm.get('station').value;
        this.address.text=this.supportForm.get('address').value;
        this.address.lat= this.convertStr2Num(this.supportForm.get('lat').value);
        this.address.long=this.convertStr2Num(this.supportForm.get('long').value);
        this.address.slicRegion=this.supportForm.get('region').value;
        this.address.slicProvince=this.supportForm.get('province').value;
        this.address.slicDistrict=this.supportForm.get('district').value;
        this.address.slicWard=this.supportForm.get('ward').value;
        this.address.slicCode=this.employeeCode;
        this.address.slicLabel=this.supportForm.get('ward').value;
        this.address.slicLevel="Phuong"
        this.employeeEdited.address=this.address;
        this.employeeEdited.isStationAdmin=this.isStationManager;
       
        this.employeeServices.createEmployee(this.employeeEdited).subscribe({
            next: (result) => {
                if (this.identity.files.length>0)
                this.identityAdapter.uploadIdentityPicture(this.identity.files[0],this.employeeCode).subscribe();    
                if (this.uploader.files.length>0)
                this.adapter.uploadFile(this.uploader.files[0],this.employeeCode).subscribe();      
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Create successfully for employee '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Create failed for employee '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
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

    onBack() {
        this.location.back();
    }
    getIdentityPhotos(name:string){
        if (name){
            var form=document.getElementById('identity');
            form.style.display='none';
            this.employeeServices.getIdentityPhotos(name).subscribe(data => this.identityPhotos = data['photos']);
        }   
    }
    getPhotos(name:string){
        if (name){
            var form=document.getElementById('uploader');
            form.style.display='none';
            this.employeeServices.getPhotos(name).subscribe(data => this.photos = data['photos']);
        }
      
    }
    getViewEmployeeByCode(){
        this.employeeServices.getEmployeeByCode(this.employeeCode).subscribe({next : (data) => {
            if (data) {
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [{value:data.data.fullName, disabled:true}],
                    email:[{value:data.data.email, disabled:true}],
                    password:[{value:data.data.password, disabled:true}],
                    idnumber:[{value:data.data.identityNumber, disabled:true}],
                    address:[{value:data.data.address.text, disabled:true}],
                    phone:[{value:data.data.mobilePhone, disabled:true}],
                    station:[data.data.stationCode, Validators.required],
                    lat:[{value:data.data.address.lat, disabled:true}],
                    long:[{value:data.data.address.long, disabled:true}],
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status
                  });
                  this.employeeName=data.data.fullName;
                  this.isStationManager=data.data.isStationAdmin;
                  this.isDisabled=true;
                  this.getIdentityPhotos(data.data.identityNumberPicture);
                  this.getPhotos(data.data.avatarPicture);
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

    getEditEmployeenByCode(){
        this.employeeServices.getEmployeeByCode(this.employeeCode).subscribe({next : (data) => {
            if (data) {
                this.employee=data.data;
                this.supportForm = this._formBuilder.group({
                    code: [{value:data.data.code, disabled:true}],
                    name: [data.data.fullName],
                    email:[data.data.email],
                    password:[data.data.password],
                    idnumber:[data.data.identityNumber],
                    address:[data.data.address.text],
                    phone:[data.data.mobilePhone],
                    station:[data.data.stationCode, Validators.required],
                    lat:[data.data.address.lat],
                    long:[data.data.address.long],
                    region:data.data.address.slicRegion,
                    province:data.data.address.slicProvince,
                    district:data.data.address.slicDistrict,
                    ward:data.data.address.slicWard,
                    status:data.data.status
                  });
                  this.employeeName=data.data.fullName;
                  this.isStationManager=data.data.isStationAdmin;
                  this.getIdentityPhotos(data.data.identityNumberPicture);
                  this.getPhotos(data.data.avatarPicture);
            }
        }, error: err => {
            this.alert = {
                type: 'error',
                message:
                    'Cannot get any data from center. Please refresh this page.',
            };
        }});
    }

    moveToEmployee() {
        this.route.navigateByUrl("/employee");
    }

    updateEmployee(){
        this.employeeEdited=this.employee;
        this.employeeEdited.fullName=this.supportForm.get('name').value;
        this.employeeEdited.email=this.supportForm.get('email').value;
        this.employeeEdited.password=this.supportForm.get('password').value;
        this.employeeEdited.identityNumber=this.supportForm.get('idnumber').value;
        this.employeeEdited.mobilePhone=this.supportForm.get('phone').value;
        this.employeeEdited.status=this.supportForm.get('status').value;
        this.employeeEdited.stationCode=this.supportForm.get('station').value;
        this.address.text=this.supportForm.get('address').value;
        this.address.lat= this.convertStr2Num(this.supportForm.get('lat').value);
        this.address.long=this.convertStr2Num(this.supportForm.get('long').value);
        this.address.slicRegion=this.supportForm.get('region').value;
        this.address.slicProvince=this.supportForm.get('province').value;
        this.address.slicDistrict=this.supportForm.get('district').value;
        this.address.slicWard=this.supportForm.get('ward').value;
        this.address.slicCode=this.employeeCode;
        this.address.slicLevel="Phuong"
        this.address.slicLabel=this.supportForm.get('ward').value;
        this.employeeEdited.address=this.address;
        this.employeeEdited.isStationAdmin=this.isStationManager;
       
        this.employeeServices.updateEmployee(this.employeeEdited).subscribe({
            next: (result) => {
                if (this.identity.files.length>0)
                this.identityAdapter.uploadIdentityPicture(this.identity.files[0],this.employeeCode).subscribe();    
                if (this.uploader.files.length>0)
                this.adapter.uploadFile(this.uploader.files[0],this.employeeCode).subscribe();      
                if (result.success == true) {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Success',
                        message: 'Update successfully for employee '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
                    });
                   
                } else {
                    const confirmation = this._fuseAlertnService.open({
                        title  : 'Failed',
                        message: 'Update failed for employee '+this.employeeEdited.fullName,
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
                       this.moveToEmployee();
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

   
    generateEmployeeCode(){
        this.searchParam={Keyword:'', Status:''};
        this.employeeServices.getEmployees(this.searchParam).subscribe({next : (data) => {
            if (data) {
                //this.asset=data;
                data.data.items.forEach(d=>{
                    if (d.code!=null){
                        this.temp++;
                    }
                });
                this.employeeCode='EPL'+this.temp
                this.supportForm.patchValue({'code': this.employeeCode});
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
        var phone=this.supportForm.get('phone').value;
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
               this.supportForm.patchValue({'phone':""});
            });        
        }
    }

    getStaitonField(){
        this.searchParam={Keyword:'', Status:''};
        this.employeeServices.getStations(this.searchParam).subscribe({next : (data) => {
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

    getCheckboxEvent(event:MatCheckboxChange){
        this.isStationManager=event.checked;
    }
    public createImgPath = (serverPath: string) => { 
        return `https://localhost:7229/${serverPath}`; 
    }
    onIdentityImageClick(){
        if (this.PAGEMODE=='edit'){
            var form=document.getElementById('identity');
            var photo=document.getElementById('identityPhoto');
            photo.style.display='none';
            form.style.display='block';
        }
    }
    onImageClick(){
        if (this.PAGEMODE=='edit'){
            var form=document.getElementById('uploader');
            var photo=document.getElementById('photo');
            photo.style.display='none';
            form.style.display='block';
        }
    }
   onUploadSuccess(): void {
    const confirmation = this._fuseAlertnService.open({
        title  : 'Success',
        message: 'Upload image successfully',
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
}
}
