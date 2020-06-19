let express = require('express');

let app = express();

let body_parser = require('body-parser');

let unirest = require('unirest');

let getDigits = require('./telco-checker.js');


let provider = getDigits('+23490200056744');
// console.log(provider);

let test_secretkey ="hfucj5jatq8h";
let text_publickey = "uvjqzm5xl6bw";



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

 console.log(body);
 console.log(status);

})



.post('/buyairtime',async (req,res)=>{
  let data = req.body;

  let datas = Object.create(data);
  datas = JSON.parse(datas);
  let code = await getDigits(datas.number);
  console.log(code);
  // datas['Code'] =


 //
 //  // console.log(data);
 //
 //  let url ="https://sandbox.wallets.africa/bills/airtime/purchase";
 //  // let url ="https://api.wallets.africa/bills/airtime/purchase";
 // //
 //  let headers = {
 //    'Accept': 'application/json',
 //    'Content-Type':'application/json',
 //    'Authorization':'Bearer uvjqzm5xl6bw'
 //  }
 //
 //
 //  // let headers = {
 //  //   'Accept': 'application/json',
 //  //   'Content-Type':'application/json',
 //  //   'Authorization':'Bearer 15g06h2lmvt5'
 //  // }
 //
 // let { body, status } = await unirest.post(url).headers(headers).send(data).then((response) => response);
 //
 // console.log(body);
 // console.log(status);

})





app.listen(2440, ()=>{
  console.log("App working");
})
