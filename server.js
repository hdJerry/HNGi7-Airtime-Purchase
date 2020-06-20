let express = require('express');

let app = express();

let body_parser = require('body-parser');

let unirest = require('unirest');

let getDigits = require('./telco-checker.js');


// let provider = getDigits('+23490200056744');
// console.log(provider);

let test_secretkey ="hfucj5jatq8h";
let test_publickey = "uvjqzm5xl6bw";



let secretkey ="5dd38ui1f50c";
let publickey = "15g06h2lmvt5";
// secretkey = "SecretKey":"hfucj5jatq8h"


global.root_path = __dirname;


app
.use(body_parser.json())
.use(body_parser.urlencoded({
  extended:true
}))

.use(express.static(root_path+'/dist'))


.post('/getnetwork',async (req,res)=>{
  let data = req.body;

  // console.log(data);

  let url ="https://sandbox.wallets.africa/bills/airtime/providers";
 //
  let headers = {
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization':'Bearer uvjqzm5xl6bw'
  }

 let { body, status } = await unirest.post(url).headers(headers).send(data).then((response) => response);

 // console.log(body);
 // console.log(status);

})



.post('/buyairtime',async (req,res)=>{
  let data = req.body;

  let datas = data;
  // console.log(data);

  datas['SecretKey'] = test_secretkey;

  let result = [];
  let pass = 0;
  let fail = 0;
  let message = "";
  let statusX = 0;


 //
 //  console.log(datas);
 // //
  // let url ="https://api.wallets.africa/bills/airtime/purchase";
   let url ="https://sandbox.wallets.africa/bills/airtime/purchase";
 // //
 //  let headers = {
 //    'Accept': 'application/json',
 //    'Content-Type':'application/json',
 //    'Authorization':'Bearer uvjqzm5xl6bw'
 //  }
 //
 //

  let headers = {
    'Accept': 'application/json',
    'Content-Type':'application/json',
    'Authorization':'Bearer '+test_publickey
  }
 if(datas['single'] === true){

   delete datas['single'];
   let code = await getDigits(datas.PhoneNumber);
   // console.log(code);
   datas['Code'] = code;

   // console.log(code);

   if(code.toLowerCase() == 'Not Found!!'.toLowerCase()){
     result.push({ number:  datas.PhoneNumber, 'message': "Invalid Network Provide", status: "fail", network: code, amount: datas.Amount, ref: "XXXX"})
     fail++;

     res.send({
       status: 0,
       resp: result,
       pass: pass,
       fail: fail,
       totalpurchase: result.length,
       message: "Invalid Network Provide"
     })
   }else{
     let { body, status } = await unirest.post(url).headers(headers).send(datas).then((response) => response);
     // console.log(status);
     if(status == 200){
       result.push({number: datas.PhoneNumber, 'message': body.Message, status: 'success',network: code, amount: datas.Amount, ref: body.TransactionReference})
       pass++;
       statusX = 1;
       message = body.Message;

     }else{

       result.push({number: datas.PhoneNumber, 'message': body.Message, status: 'fail',network: code, amount: datas.Amount, ref: "XXXX"})
       fail++;
       statusX = 0;
       message = body.Message;
     }
     //
     res.send({
       status: statusX,
       resp: result,
       pass: pass,
       fail: fail,
       totalpurchase: result.length,
       message: message
     })

   }
   // console.log(datas);
 }else if(datas['single'] === false){

   delete datas['single'];

   let bulkNumber = datas.PhoneNumber.split(',');
   // console.log(bulkNumber);

   let num = 0;

   while(num < bulkNumber.length){

     // setTimeout(async ()=>{

       datas['PhoneNumber'] = bulkNumber[num];

       let code = await getDigits(bulkNumber[num]);
       // console.log(code);
       datas['Code'] = code;

       // console.log(code);
       // console.log("=====================================================");
          if(code.toLowerCase() == 'Not Found!!'.toLowerCase()){
         result.push({ number:  bulkNumber[num], 'message': "Invalid Network", status: "fail", network: code, amount: datas.Amount, ref: "XXXX"})
         fail++;
         // num++;
       }else{
         let { body, status } = await unirest.post(url).headers(headers).send(datas).then((response) => response);
         if(status == 200){
           result.push({number:  bulkNumber[num], 'message': body.Message, status: 'success',network: code, amount: datas.Amount, ref: body.TransactionReference})
           pass++;

         }else{

           result.push({ number:  bulkNumber[num], 'message': body.Message, status: "fail", network: code, amount: datas.Amount, ref: "XXXX"})
           fail++;
         }
         // console.log(result);

         // },3000);


       }

       num++;
   }
   if(num === bulkNumber.length){

     res.send({
       status: 1,
       resp: result,
       pass: pass,
       fail: fail,
       totalpurchase: result.length,
       message: `Total of ${result.length} completed, ${pass} success, ${fail} fail`
     })
   }



 }


})





app.listen(process.env.PORT || 2440, ()=>{
  console.log("App working");
})
