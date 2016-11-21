$( document ).ready(function() {
  $('.datepicker').datepicker({
    format: 'dd-mm-yyyy',
    language: "th"
  });
  $('#savedataintime').click(function(){
    swal({
      title: "ต้องการบันทึกเวลาหรือไม่?",   
      text: "",   
      type: "warning", //info-warning  
      showCancelButton: true,   
      confirmButtonColor: "primary",  
      confirmButtonText: "บันทึก", 
      cancelButtonText:'ยกเลิก',  
      closeOnConfirm: false 
     }, function(){
      var name =  $('#dataselectName').val();
      var dataTime = $('#dataTime').html();
      var dataDate = $('#dataDete').html();
      // 05-10-2016 datebase 2016-10-05
      $.post( "/insertTime", { "name": name, 'time': dataTime, 'date': dataDate }).done(function( data ) {
        if (data == "OK") {
          swal({
            title: "บันทึกเรียบร้อยแล้ว",   
            text: "",   
            type: "success",   
          },function(){
            window.location.reload(); 
          });
        }else if(data == "UPDATE"){
          swal({
            title: "แก้ไขเรียบร้อยแล้ว",   
            text: "",   
            type: "success",   
          },function(){
            window.location.reload(); 
          });
        } else{
          swal("ผิดพลาด");
        }
      });
    });
  });

var pro = null;
var table = "";
$.get("/selectdata", function(data){
  $.each(data,function(i,v){
    pro += '<option value="'+ v.id +'">'+v.name+' '+v.surname+'</option>';
  });
  $("#dataselectName").html(pro);
});


$.get("/getdata", function(data){
  $("#dataprofile").html(data);
});

$(".searchdatadatesubmit").click(function(){
  $.get("/search",{"date":$(".searchdatadate").val(),"dateEnd":$(".searchdatadateEnd").val()}).done(function(data){
    $("#dataprofile").html(data);
  });
});



function timedUpdate () {
      updateClock();
      setTimeout(timedUpdate, 1000);
}
function updateClock(){
  var date = moment().format('DD/MM/YYYY');
  var time = moment().format('HH:mm:ss');
  $('#dataTime').html(time);
  $('#dataDete').html(date);
}
timedUpdate();


// $(window).scroll(function(){
//   if($(window).scrollTop()+$(window).height()==$(document).height()){
//     alert("เย้");
//   }
// });
});









