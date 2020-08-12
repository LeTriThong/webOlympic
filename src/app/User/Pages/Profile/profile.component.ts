import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  email:'';
  Name:'';
  Sex:'';
  BirthDate:'';
  university_id:'';
  inforUser: any = {};
  URL_up_account='https://strapi-atlas.herokuapp.com/accounts/update';
  constructor(private http: HttpClient) {
    this.getUser();
  }

  ngOnInit(): void {


    $(document).ready(function(){
      $("#clickEditProfile").click(function(){
          $("#EditProfile").modal('show');
      });
  });
  }
  postUpdateProfile(){
    if(this.Name =="" || this.Name==undefined || this.Name==null){
      this.Name=this.inforUser.Name;
    }
    if(this.email=="" || this.email==undefined || this.email==null){
      this.email=this.inforUser.email;
    }
    if(this.BirthDate=="" || this.BirthDate==undefined || this.BirthDate==null){
      this.BirthDate=this.inforUser.BirthDate;
    }
    const options = {
      headers:new HttpHeaders({
        'Content-Type':'text/plain'
      })
    };
    return this.http.post(this.URL_up_account, {
      "token":localStorage.token,
      "id":localStorage.id,
      "User":
      {
        "email":this.email,
        "Name":this.Name,
        "Sex":$("#selectSex").val(),
        "BirthDate":this.BirthDate,
        "university":$("#selectSchool").val()
      }
    },options);
  }
  updateProfile(){
    this.postUpdateProfile()
    .subscribe(
      response => {
        Swal.fire('Thành công', response, 'success');
      },
      err => {
        if( err[`error`].text=="Cap nhat khong thanh cong !")
        {
          Swal.fire('Lỗi người dùng', err[`error`].text, 'warning');
          return;
        }
        else Swal.fire('Thành công', err[`error`].text, 'success');
    })
    location.reload();
  }
  getData(token, id){
    return this.http.get('https://strapi-atlas.herokuapp.com/accounts/'+ '?token='+token +'&id=' +id);
  }
  getUser(){
    this.getData(localStorage.token, localStorage.id).subscribe((data) => {
      this.inforUser = data['temp'][0];
    });
  }
}
