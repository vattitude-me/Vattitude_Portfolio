 /*!
  * Stretch App - V1.0 (Developed by https://www.vattitude.me)
  * Copyright 2021 Stretch App - Vattitude
  * Licensed under MIT (https://github.com/vatsakrish/Stretch-app/blob/main/LICENSE)
  */
 //
 // Scripts
 // 


 // Global variables
 var defaultimer = 45;
 var defaulNotif = "Stand-up & Stretch A Bit";
 var nIntervId;
 var nCountInterv;
 var temptimer = defaultimer;
 var glblstrtTime = 08;
 var glblendTime = 18;
 //var StretchLink = "https://stretch.vattitude.me/assets/img/Vattitude_Stretches.jpg"

 $(document).ready(function() {

     //Extract the local storage timer
     const loclTimer = localStorage.getItem('loclTimer');
     //console.log("Current locl time saved is - " + loclTimer);
     if (loclTimer) {
         defaultimer = loclTimer
     } else {
         localStorage.setItem('loclTimer', defaultimer);
     }

     //Extract the local storage notif-text
     const loclText = localStorage.getItem('loclText');
     //console.log("Current locl text saved is - " + loclText);
     if (loclText) {
         defaulNotif = loclText
     } else {
         localStorage.setItem('loclText', defaulNotif);
     }

     //Start the clock and keep incrementing
     clockUpdate();
     setInterval(clockUpdate, 999);

     //Default values
     $("#timerupdate").val(defaultimer);
     $("#Notiftext").val(defaulNotif);

     //Check notification feature
     checkNotify();

     $('#notifEnable').click(function() {
         checkNotify();
     });

     //Test Notification
     $('#testNotif').click(function() {
         defaulNotif = $('#Notiftext').val();
         localStorage.setItem('loclText', defaulNotif);
         notifyMe();
         $("#savetextNotif").show().delay(3000).fadeOut();

     });

     //Start the main notification
     startNotif()

     //Start the countdown for next start and stop
     const strtTime = localStorage.getItem('strtTime');
     if (strtTime) {
         glblstrtTime = strtTime;
     }
     $("#strtTime").val(glblstrtTime);
     triggerStartTime();

     const endTime = localStorage.getItem('endTime');
     if (endTime) {
         glblendTime = endTime;
     }
     $("#endTime").val(glblendTime);
     triggerStopTime();

     //Update Time Range Click
     $('#btnTimeRange').click(function() {
         var strtTemp = $('#strtTime').val();
         var endTemp = $('#endTime').val();

         if (isNaN(strtTemp) || isNaN(endTemp) || strtTemp < 1 || strtTemp >= endTemp ||
             strtTemp > 23 || endTemp > 23 || endTemp < 1) {
             $('#strtTime').val(glblstrtTime);
             $('#endTime').val(glblendTime)
         } else {
             glblstrtTime = Math.floor(Number($('#strtTime').val()));
             localStorage.setItem('strtTime', glblstrtTime);
             glblendTime = Math.floor(Number($('#endTime').val()));
             localStorage.setItem('endTime', glblendTime);
             triggerStartTime();
             triggerStopTime();
             $("#saveSchedNotif").show().delay(3000).fadeOut();
         }
     });

     //Update the Feq 
     $('#savefreq').click(function() {
         const newTimer = $('#timerupdate').val();
         if (!isNaN(newTimer)) {
             defaultimer = Math.floor(Number($('#timerupdate').val()));
             localStorage.setItem('loclTimer', defaultimer);
             $("#savefreqNotif").show().delay(3000).fadeOut();
             $("#succProgress").text(defaultimer);
             $('#succProgress').css('width', '100%').attr('aria-valuenow', '100');

             startNotif();
         } else {
             $('#timerupdate').val(defaultimer);
         }

     });

     $('#togglereminder').click(function() {
         tglRem = $("#togglereminder").text();
         if (tglRem == "Stop Reminder") {
             stopNotif();
         } else {
             startNotif();
         }

     });
 });

 //Main notification
 function startNotif() {
     $(".txtRunning").show();
     $(".txtPaused").hide();
     $("#togglereminder").text("Stop Reminder");

     intervalLoop = defaultimer * 60 * 1000
     $("#succProgress").text(defaultimer);
     $('#succProgress').css('width', '100%').attr('aria-valuenow', '100');

     clearInterval(nIntervId);
     nIntervId = setInterval(beginStrEvent, intervalLoop);

     startcountdown();
 }


 function stopNotif() {
     clearInterval(nIntervId);
     clearInterval(nCountInterv);
     $(".txtRunning").hide();
     $(".txtPaused").show();
     $("#togglereminder").text("Start Reminder");
 }

 function beginStrEvent() {
     //console.log(defaultimer + " beginStrEvent - " + temptimer);
     notifyMe();
 }


 //Countdown Timer event
 function cntdwntimerInt() {
     //console.log(defaultimer + " interval - " + temptimer);
     temptimer = temptimer - 1;
     $("#succProgress").text(temptimer + " min(s)");
     percTimer = calculatePerc(temptimer, defaultimer);
     if (percTimer < 16) {
         percTimer = 16;
     }
     //console.log("Interval Perctimer - " + percTimer);
     $('#succProgress').css('width', percTimer + '%').attr('aria-valuenow', percTimer);
 }

 function startcountdown() {
     //Start the countdown timer
     temptimer = defaultimer;
     //console.log(defaultimer + " startcountdown - " + temptimer);
     $("#succProgress").text(temptimer + " mins");
     percTimer = calculatePerc(temptimer, defaultimer);
     //console.log("Start Perctimer - " + percTimer);
     $('#succProgress').css('width', percTimer + '%').attr('aria-valuenow', percTimer);

     clearInterval(nCountInterv);
     nCountInterv = setInterval(cntdwntimerInt, 60000);
 }



 function notifyMe() {
     console.log(defaultimer + " notifyMe - " + temptimer);

     if (Notification.permission === "granted") {
         var notification = new Notification(defaulNotif, {
             icon: 'https://www.vattitude.me/assets/img/Logo.png',
             body: 'Click to Stretch',

         });
         $.playSound('../assets/audio/positive-1.wav');
         setTimeout(function() {
             notification.close()
         }, 7000);
         notification.onclick = function(event) {
             window.open("https://www.youtube.com/watch?v=tAUf7aajBWE&ab_channel=YogaWithAdriene", "", "width=640,height=400");
         }
     } else {
         $("#myToast").toast({ delay: 7000 });
         $("#myToast").toast('show');
         alert(defaulNotif);
     }
     startcountdown();
 }


 var strtVTime = glblstrtTime;

 function triggerStartTime() {
     if (!strtVTime) {
         strtVTime = 09;
     }
     const startTime = new Date();
     startTime.setHours(strtVTime, 00);
     const now = new Date();

     if (startTime.getTime() < now.getTime()) {
         startTime.setHours(startTime.getHours() + 24);
     }
     console.log("Start time is " + startTime.getHours());

     var cntdwntimerInt = startTime.getTime() - now.getTime();
     console.log("First start is " + cntdwntimerInt);
     setInterval(startNotif, cntdwntimerInt);
 }

 function triggerStopTime() {
     var endVTime = glblendTime
     if (!endVTime) {
         endVTime = 17;
     }
     const endTime = new Date();
     endTime.setHours(endVTime, 00);
     const now = new Date();

     if (endTime.getTime() < now.getTime()) {
         endTime.setHours(endTime.getHours() + 24);
     }
     //console.log("End time is " + endTime.getHours());

     var cntdwntimerInt = endTime.getTime() - now.getTime();
     //console.log("Last end is " + cntdwntimerInt);
     setInterval(stopNotif, cntdwntimerInt);
 }

 function checkNotify() {
     console.log(`checkNotify - Permission to notify is ${Notification.permission}`);
     // Let's check if the browser supports notifications
     if (!("Notification" in window)) {
         alert("This browser does not support desktop notification");
     }

     // Let's check if the user is okay to get some notification
     else if (Notification.permission === "granted") {
         $(".notifbanner").hide();
         // If it's okay let's create a notification
         var notification = new Notification("Welcome to Stretch Reminder", {
             icon: 'https://www.vattitude.me/assets/img/Logo.png',
             body: 'Get Active',
         });
         setTimeout(function() {
             notification.close()
         }, 8000);

     }

     // Otherwise, we need to ask the user for permission
     else if (Notification.permission !== 'denied') {
         Notification.requestPermission(function(permission) {

             // Whatever the user answers, we make sure we store the information
             if (!('permission' in Notification)) {
                 Notification.permission = permission;
             }

             // If the user is okay, let's create a notification
             if (permission === "granted") {
                 var notification = new Notification("Welcome to Stretch Reminder", {
                     icon: 'https://www.vattitude.me/assets/img/Logo.png',
                     body: 'Get Active',
                 });
                 $.playSound('../assets/audio/positive-1.wav');
             }
         });
     } else {
         console.log(`Permission to notify is ${Notification.permission}`);
     }

 }

 const calculatePerc = (actual, initial) => {
     actual = parseFloat(actual);
     initial = parseFloat(initial);
     return (actual * 100 / initial).toFixed(2); //percentage
 }


 //Function to play audio notification
 (function($) {
     $.extend({
         playSound: function() {
             return $(
                 '<audio class="sound-player" autoplay="autoplay" style="display:none;">' +
                 '<source src="' + arguments[0] + '" />' +
                 '<embed src="' + arguments[0] + '" hidden="true" autostart="true" loop="false"/>' +
                 '</audio>'
             ).appendTo('body');
         },
         stopSound: function() {
             $(".sound-player").remove();
         }
     });
 })(jQuery);


 //Keep the current time running
 function clockUpdate() {
     var date = new Date();


     function addZero(x) {
         if (x < 10) {
             return x = '0' + x;
         } else {
             return x;
         }
     }

     function twelveHour(x) {
         if (x > 12) {
             return x = x - 12;
         } else if (x == 0) {
             return x = 12;
         } else {
             return x;
         }
     }

     var h = addZero(twelveHour(date.getHours()));
     var m = addZero(date.getMinutes());
     var s = addZero(date.getSeconds());

     $('.digital-clock').text(h + ':' + m + ':' + s)
 }