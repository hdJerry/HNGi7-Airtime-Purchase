


 //
 //
 //
 //Serialize Form to Object
 $.fn.serializeObject = function(){
     let o = {};
     let a = this.serializeArray();
     // console.log(a);
     // console.log(this.serializeArray());
     // console.log(this.serializeObject());
     $.each(a, function() {
         if (o[this.name] !== undefined) {
             if (!o[this.name].push) {
                 o[this.name] = [o[this.name]];
             }
             o[this.name].push(this.value || '');
         } else {
             o[this.name] = this.value || '';
         }
     });
     return o;
 };

      function getProvider({amount, number}){

        var raw = JSON.stringify({"Code":"1000","Amount":amount,"PhoneNumber":number});

        var requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
          },
          body: raw,
          redirect: 'follow',
        };

        fetch("/getnetwork", requestOptions)
        .then(response => console.log(response))
        // .then(result => console.log(result))
        .catch(error => console.log('error', error));
      }


      async function getAirtime({amount, number, isSingle}){

        // var raw = JSON.stringify({"Code":"1000","Amount":100,"PhoneNumber":"07068260000","SecretKey":"5dd38ui1f50c"});
        var raw = JSON.stringify({"Amount":amount,"PhoneNumber":number,'single': isSingle});

        var requestOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type':'application/json',
          },
          body: raw,
          redirect: 'follow',
        };

        try{

          let resp = await fetch("/buyairtime", requestOptions);
          return resp.json();

        }catch(error){
           console.log('error', error)
        }

        // fetch("/buyairtime", requestOptions)
        // .then(response => response.json())
        // .then(result => result)
        // .catch(error => console.log('error', error));
      }

      async function Purchase(){
        $('#form-airtime').removeClass('show_result');
        $('#airtime-result').addClass('show_result');
        $('input#phone').prop('disabled',false);
        $('textarea#phones').prop('disabled',false);
        $('input#amount').prop('disabled',false);
        $('#purchase-btn').attr('disabled',false);
        $('#customers').html('');
      }
      // getAirtime();

      let btn = document.getElementById('purchase-btn');
let amounts = document.getElementById('amount');

$('#purchase-btn').attr('disabled',true);
$('input#amount').prop('disabled',true);


btn.addEventListener('click',async (elm)=>{

  elm.preventDefault();
  // elm.stopImmediatePropagtion();

  let {formname} = elm.target.dataset;

    let data = {};

    let form = $('.content form[name='+formname+']');

    let formdata  = form.serializeObject();
    //
    if(formdata['single-pay'].length == 0){
      delete formdata['single-pay']
      formdata['number'] = formdata['multiple-pay'];
      delete formdata['multiple-pay']
      formdata['isSingle'] = false;
    }else if(formdata['multiple-pay'].length == 0){
      delete formdata['multiple-pay']
      formdata['number'] = formdata['single-pay'];
        delete formdata['single-pay']
        formdata['isSingle'] = true;
    }else{
      alert("Something has gone wrong")
    }

    $('input#phone').prop('disabled',true);
    $('textarea#phones').prop('disabled',true);
    $('input#amount').prop('disabled',true);
    $('#purchase-btn').attr('disabled',true);
    $('#loader-anime').removeClass('hide-loader');

    let res = await getAirtime(formdata);

    if(res !== undefined){
      console.log(res);

      let {fail, pass, resp, totalpurchase, status} = res;

      $('#customers').html('');
      $('#customers').append(`
        <tr>
        <th>Phone</th>
        <th>Network</th>
        <th>Amount</th>
        <th>Message</th>
        <th>Status</th>
        </tr>
        `);

        resp.forEach(value =>{
          $('#customers').append(`
            <tr>
            <td>${value.number}</td>
            <td>${value.network}</td>
            <td>${value.amount}</td>
            <td>${value.message}</td>
            <td>${value.status}</td>
            </tr>
            `);
          })

          $('#form-airtime').addClass('show_result');
          $('#airtime-result').removeClass('show_result');
          $('#loader-anime').addClass('hide-loader');

    }else{
      Purchase();
    }




    // console.log(res);
})



let options = document.getElementById('options');

let singleBuy = document.getElementById('single');
let phone = document.getElementById('phone');
let phones = document.getElementById('phones');

let multipleBuy = document.getElementById('multiple');




options.addEventListener('change', (elm)=>{

  let selected = Number(elm.target.value);

    $('#purchase-btn').attr('disabled',true);
    $('input#amount').prop('disabled',true);

  if(selected == 1){
    singleBuy.classList.remove('hide-opt');
    multipleBuy.classList.add('hide-opt');
    phones.value="";
  }else if(selected == 2){

    multipleBuy.classList.remove('hide-opt');
    singleBuy.classList.add('hide-opt');
    phone.value="";
  }else{
    multipleBuy.classList.add('hide-opt');
    singleBuy.classList.add('hide-opt');
    phones.value="";
    phone.value="";
  }

})


$('body')

.on('keyup', '.form-sec .number',(elm)=>{

  let { id, value } = elm.target;


  if(value.length >= 11){
    $('#purchase-btn').attr('disabled',false);
    $('input#amount').prop('disabled',false);
  }else{
    $('#purchase-btn').attr('disabled',true);
    $('input#amount').prop('disabled',true);

  }

  if($('input#amount').prop('disabled') == false && Number($('input#amount').val()) > 50){
    $('#purchase-btn').attr('disabled',false);
  }else{
      $('#purchase-btn').attr('disabled',true);
  }
  console.log();

})


.on('keyup', '.form-sec #amount',(elm)=>{

  if($('input#amount').prop('disabled') == false && Number($('input#amount').val()) > 50){
    $('#purchase-btn').attr('disabled',false);
  }else{
      $('#purchase-btn').attr('disabled',true);
  }
})

.on('click','#back-btn',()=>{
  Purchase();
})
