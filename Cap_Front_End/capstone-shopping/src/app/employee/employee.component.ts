import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { customersModel } from  "capstone-shopping/src/app/customers.model";
import { EmpAdminsModel } from "capstone-shopping/src/app/EmpAdmins.model";
import { orderListModel } from "capstone-shopping/src/app/orderList.model";
import { productRequestModel } from "capstone-shopping/src/app/productRequest.model";

let mongoose = require("mongoose");

//change the db url so we can use the cloud database
let url = "mongodb://localhost:27017/ShoppingDB"

mongoose.connect(url).then(res => console.log("connected")).catch(error => console.log(error));

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

constructor() {
}

  ngOnInit(): void {
    
  }

  requestRef = new FormGroup({
    productname: new FormControl(""),
    quantityincreased: new FormControl("")
  })

  statusUpdateRef = new FormGroup({
    ordernum: new FormControl(""),
    orderstatus: new FormControl(""),
    statusDesc: new FormControl("")
  })

  unlockAccountRef = new FormGroup({
    accountnum: new FormControl("")
  })

  emppassRef = new FormGroup({
    empID: new FormControl(""),
    curpass: new FormControl(""),
    newpass: new FormControl(""),
    confirmnewpass: new FormControl("")
  })
  
  public empLogout(){
    console.log("HELLO");
  }

  sendRequest(): void{
    console.log("HELLO");
    let request = this.requestRef.value;
    productRequestModel.insertMany( {prodName: request.productname, quantityincrease: request.quantityincreased}, (err,result) =>{
      if (!err) {
        console.log("Request stored successfully.")
      } else {
        console.log(err);
      }
    })
  }

  showOrders(){
    var orderslist = orderListModel.find({}, (err, data) => {
      if (!err) {
        let oL = document.getElementById("orderslist");
        if( oL != null){
          oL.innerHTML = data;
        }
      } else {
        console.log(err);
      }
    })
  }

  updateStatus(){
    let statusupdate = this.statusUpdateRef.value;
    //add orderstatus model and update one with new orderstatus.
    orderListModel.updateOne({ ordernum: statusupdate.ordernum }, { $set: { orderstatus: statusupdate.orderstatus, statusDesc: statusupdate.statusDesc } }, (err, result) => {
      if (!err) {
        console.log("Order Status updated.");
      } else {
        console.log(err);
      }
    })
  }

  unlockAccount(){
    let acc = this.unlockAccountRef.value;
    customersModel.updateOne({ userID: acc.accountnum }, { $set: { unlocked: true} }, (err, result) => {
      if (!err) {
        console.log("Account Unlocked.");
      } else {
        console.log(err);
      }
    })
  }

  editEmpPass(){
    let passchange = this.emppassRef.value;
    let curEMP = EmpAdminsModel.find({ Emp_ID: passchange.empID} , (err, data) => {
      if (!err) {
        console.log(data);
        curEMP = data;
      } else {
        console.log(err);
      }
    })

    if( curEMP.password == passchange.curpass){
      if(passchange.newpass == passchange.confirmnewpass){
        
        EmpAdminsModel.updateOne({ empID: curEMP.empID }, { $set: { password: passchange.newpass, cPassword: passchange.confirmnewpass } }, (err, result) => {
          if (!err) {
            console.log("Password Updated.");
          } else {
            console.log(err);
          }
        })
      }
    }

  }

}