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
var StretchLink = "https://stretch.vattitude.me/assets/img/Vattitude_Stretches.jpg"

$(document).ready(function() {

    //Extract the local storage timer
    const loclTimer = localStorage.getItem('loclTimer');
    console.log("Current locl time saved is - " + loclTimer);
    if (loclTimer) {
        defaultimer = loclTimer
    } else {
        localStorage.setItem('loclTimer', defaultimer);
    }

    //Extract the local storage notif-text
    const loclText = localStorage.getItem('loclText');
    console.log("Current locl text saved is - " + loclText);
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

    //Test Notification
    $('#testNotif').click(function() {
        defaulNotif = $('#Notiftext').val();
        localStorage.setItem('loclText', defaulNotif);
        notifyMe();
        $("#savetextNotif").show().delay(3000).fadeOut();
    });

    //Start the main notification
    startNotif()

    //Update the Feq 
    $('#savefreq').click(function() {
        defaultimer = $('#timerupdate').val();
        localStorage.setItem('loclTimer', defaultimer);
        $("#savefreqNotif").show().delay(3000).fadeOut();
        $("#nextrem").text(defaultimer);
        startNotif();
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
    $("#nextrem").text(defaultimer);
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
    console.log(defaultimer + " beginStrEvent - " + temptimer);
    notifyMe();
}


//Countdown Timer event
function cntdwntimerInt() {
    console.log(defaultimer + " interval - " + temptimer);
    temptimer = temptimer - 1;
    $("#nextrem").text(temptimer);
}

function startcountdown() {
    //Start the countdown timer
    temptimer = defaultimer;
    console.log(defaultimer + " startcountdown - " + temptimer);
    $("#nextrem").text(temptimer);
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
        }, 8000);
        notification.onclick = function(event) {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            window.open(StretchLink, '_blank');
        }
    } else {
        $("#myToast").toast({ delay: 7000 });
        $("#myToast").toast('show');
        alert(defaulNotif);
    }
    startcountdown();

}


function checkNotify() {


    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
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
        alert(`Permission to notify is ${Notification.permission}`);
    }

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