/**
 * An autotouch script that will help you to crack apps automatically and use appdb API to publish them
 * Requires paid autotouch subscription
 * Designed for iPad 6 with 13<=iPadOS<=13.5
 *
 */
const { touchDown, touchMove, touchUp, usleep, appActivate, toast, keyDown, keyUp, appState, appRun, appKill, openURL, exec } = at

const LT = 'LINK TOKEN'; // device link token, you can get it from appdb profile in settings application, check URL (?lt=LINK_TOKEN)
const ST = 'STAFF TOKEN'; // you can get staff token from your staff account control panel. More info at https://forum.appdb.to/index.php?/topic/8708-requests-fulfilment-api/
const API_URL = 'https://api.dbservices.to/v1.3/';


// simulate swapping horizontally
function swipeHorizontally() {
    for (let i = 0; i < 5; i++) {
        touchDown(1, 900, 300)
        for (let x = 900; x >= 100; x -= 50) {
            usleep(1200)
            touchMove(1, x, 300)
        }
        touchMove(1, 100, 300)
        touchUp(1, 100, 300)
        usleep(200000)
    }
}

// simulate swapping vertically
function swipeVertically() {
    for (let i = 0; i < 8; i++) {
        touchDown(1, 200, 300);
        for (let y = 300; y <= 900; y += 50) {
            usleep(1200);
            touchMove(1, 200, y);
        }
        touchMove(1, 200, 900);
        touchUp(1, 200, 900);
        usleep(200000);
    }
}

function keyPress(keyType) {
    keyDown(keyType);
    usleep(10000);
    keyUp(keyType);
}

function fill_password() {

    /*
    PLEASE RECORD SCRIPT TO INPUT YOUR PASSWORD FROM KEYBOARD AND PLACE IT HERE
     */

}

function check_app_coordinators() {
    var path = "/private/var/containers/Shared/SystemGroup/systemgroup.com.apple.installcoordinationd/Library/InstallCoordination/Coordinators";

    var file_counter = 1;

    while (file_counter > 0) {
        file_counter = 0;
        log_and_toast("there are app coordinators, waiting");
        file_counter = (exec('ls ' + path).split("\n").length - 1);
        wake_touch()
        usleep(1000000);
    }

    usleep(2000000);
}

function wake_touch() {
    touchDown(9, 491.64, 12.66);
    usleep(100);
    touchUp(9, 491.64, 12.66);
}

function accept_popups() {

    log_and_toast("touching cancels/oks")

    touchDown(4, 1030, 920);
    usleep(16000);
    touchUp(4, 1030, 920);

    touchDown(5, 900, 1200);
    usleep(16000);
    touchUp(5, 900, 1200);
    usleep(2000000);


    touchDown(5, 770, 1200);
    usleep(16000);
    touchUp(5, 700, 1200);
    usleep(2000000);


    touchDown(4, 1020, 930);
    usleep(16000);
    touchUp(4, 1020, 930);

    usleep(2000000);

    touchDown(4, 881, 1150);
    usleep(16000);
    touchUp(4, 881, 1150);

    usleep(2000000);

    touchDown(4, 905, 1250);
    usleep(16000);
    touchUp(4, 905, 1250);

    usleep(2000000);

}

function getRidOfPopups(bundle_id) {
    log_and_toast("getting rid of popups in " + bundle_id)
    usleep(1000000);
    appRun(bundle_id);
    appRun(bundle_id);
    appActivate(bundle_id);
    appActivate(bundle_id); // for sure
    usleep(20000000);


    accept_popups();
    accept_popups();
    accept_popups();



    appKill(bundle_id);
    log_and_toast("done rid of popups");
    appKill(bundle_id);

    usleep(10000000);


}

function api_request(url) {
    var query_string = url + "&lt=" + LT + "&st=" + ST;
    var query_array = query_string.split('&');
    var command = "curl";
    for (var i in query_array) {
        command = command + " -F '" + query_array[i] + "'";
    }
    command = command + " '" + API_URL + "'";

    log_and_toast('Requesting API ' + command);
    var result = exec(command);
    log_and_toast('got response ' + result);
    return JSON.parse(result);
}


function buy_crack_upload_app(trackid, request_id, bundle_id) {


    log_and_toast("got new app trackid " + trackid + ", request id" + request_id + " to crack!");

    usleep(16000);

    var response = api_request("action=set_publish_request_status&type=ios&id=" + request_id + "&status=taken");

    usleep(16000);

    log_and_toast("cleanup, killing unused apps");

    appKill("com.apple.Preferences");
    appKill("com.apple.Preferences");
    usleep(16000);
    appKill("com.ipc.crackerxi");
    appKill("com.ipc.crackerxi");
    usleep(16000);

    log_and_toast("starting appstore...");
    openURL("itms-apps://itunes.apple.com/app/id" + trackid);

    usleep(10000000);




    log_and_toast("touching buy..");

    touchDown(0, 600, 360);
    usleep(16000);
    touchUp(0, 600, 360);

    touchDown(8, 600, 960);
    usleep(16000);
    touchUp(8, 600, 960);

    usleep(10000000);
    log_and_toast("touching install..");
    touchDown(2, 770, 1200);
    usleep(16000);
    touchUp(2, 770, 1200);
    usleep(1000000);
    log_and_toast("touching purchase..");
    touchDown(2, 770, 1260);
    usleep(16000);
    touchUp(2, 770, 1260);

    log_and_toast("filling password..");
    usleep(1000000);
    fill_password();

    usleep(10000000);

    check_app_coordinators()

    log_and_toast("apps installed, continue!");

    api_request("action=set_publish_request_status&type=ios&id=" + request_id + "&status=cracking");

    log_and_toast("checking for app coordinators again..");

    usleep(5000000);

    check_app_coordinators();

    getRidOfPopups(bundle_id);

    log_and_toast("opening cracking tool..");


    appRun("com.ipc.crackerxi");

    usleep(2000000);

    log_and_toast("updating app list..");
    touchDown(3, 1490, 100);
    usleep(16000);
    touchUp(3, 1490, 100);

    usleep(2000000);

    log_and_toast("tapping on app crack..");

    touchDown(7, 1490, 240);
    usleep(16000);
    touchUp(7, 1490, 240);



    usleep(1000000);

    log_and_toast("tapping yes..");

    touchDown(6, 844.31, 1028.78);
    usleep(2000000);
    touchUp(6, 844.31, 1028.78);


    log_and_toast("app is being opened..");

    usleep(10000000);

    log_and_toast("waiting for cracking app to become foreground..");

    var state = appState("com.ipc.crackerxi");

    var cracking_tool_appearance_attempts = 0;
    while (state != 'ACTIVATED') {
        cracking_tool_appearance_attempts++
        state = appState("com.ipc.crackerxi");
        usleep(2000000);
        wake_touch()
        log_and_toast("still waiting.." + cracking_tool_appearance_attempts.toString());

        if (cracking_tool_appearance_attempts > 500) {
            log_and_toast("looks like crach appeared; " + cracking_tool_appearance_attempts.toString() + " attempts to get cracking tool active. giving up");
            delete_app_from_springboard_and_filza();
            IS_CRACKING_FINISHED = true;
            return true;
        }

    }

    log_and_toast("cracking tool became active, packaging IPA. lets wait for packaging");

    path = "/var/mobile/Documents/CrackerXI";

    var ipa_path = '';
    var files;

    var ipa_find_attempts = 0;
    while (ipa_path == '') {

        ipa_find_attempts++;

        if (ipa_find_attempts > 500) {
            log_and_toast("looks like no IPA will be cracked after " + ipa_find_attempts.toString() + " attempts to find it in cracking dir. giving up");
            delete_app_from_springboard_and_filza();
            IS_CRACKING_FINISHED = true;
            return true;
        }
        log_and_toast("no IPA apps in cracked dir, waiting..." + ipa_find_attempts.toString());

        files = exec("ls " + path).split("\n");
        for (i in files) {
            if (files[i].match(/\.ipa$/)) {
                ipa_path = path + "/" + files[i];

            }
            if (files[i].match(/^ipa$/)) { // there is ipa folder inside, so it's still packaging
                ipa_path = '';

            }
        }
        wake_touch()
        usleep(1000000);
    }


    log_and_toast(ipa_path);
    log_and_toast("got cracked app inside dir, uploading...");

    var query_string = "action=set_publish_request_status&type=ios&id=" + request_id + "&status=ipa_provided&lt=" + LT + "&st=" + ST;
    var query_array = query_string.split('&');
    var command = "curl -F 'ipa=@" + ipa_path + "'";
    for (var i in query_array) {
        command = command + " -F '" + query_array[i] + "'";
    }
    command = command + " '" + API_URL + "'";

    console.log(command);
    var result = exec(command);

    log_and_toast(result);

    log_and_toast("tapping dismiss");

    touchDown(7, 770, 1170);
    usleep(16000);
    touchUp(7, 770, 1170);
    usleep(1000000);

    prepare_springboard_for_app_deletion();

    delete_app_from_springboard_and_filza();

    log_and_toast("done cracking");

    usleep(1000000);

    IS_CRACKING_FINISHED = true;

    return true;

}

function prepare_springboard_for_app_deletion() {
    keyDown(KEY_TYPE.HOME_BUTTON);
    usleep(202239.79);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(148046.17);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(509787.88);

    keyDown(KEY_TYPE.HOME_BUTTON);
    usleep(206273.75);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(144027.29);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(534314.21);

    keyDown(KEY_TYPE.HOME_BUTTON);
    usleep(179611.75);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(170622.38);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(464928.17);

    keyDown(KEY_TYPE.HOME_BUTTON);
    usleep(216170.62);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(134031.83);
    keyUp(KEY_TYPE.HOME_BUTTON);
    usleep(411343.62);

    touchDown(11, 1286.37, 1315.75);
    usleep(58197.67);
    touchMove(11, 1276.41, 1323.22);
    usleep(8119.17);
    touchMove(11, 1272.26, 1323.22);
    usleep(8150.83);
    touchMove(11, 1266.47, 1325.72);
    usleep(8966.04);
    touchMove(11, 1255.69, 1328.19);
    usleep(7874.12);
    touchMove(11, 1232.46, 1330.69);
    usleep(7907.62);
    touchMove(11, 1200.94, 1333.19);
    usleep(9349.17);
    touchMove(11, 1160.30, 1336.50);
    usleep(7906.67);
    touchMove(11, 1122.98, 1340.66);
    usleep(8620.88);
    touchMove(11, 1084.01, 1345.62);
    usleep(7591.12);
    touchMove(11, 1044.19, 1350.59);
    usleep(8705.38);
    touchMove(11, 1006.03, 1355.56);
    usleep(8460.38);
    touchMove(11, 972.87, 1360.56);
    usleep(8401.75);
    touchMove(11, 933.05, 1367.19);
    usleep(8763.88);
    touchMove(11, 894.89, 1373.00);
    usleep(7734.79);
    touchMove(11, 856.73, 1379.62);
    usleep(7966.00);
    touchMove(11, 819.42, 1386.25);
    usleep(8612.54);
    touchMove(11, 777.96, 1393.72);
    usleep(8010.42);
    touchMove(11, 719.91, 1403.69);
    usleep(9016.00);
    touchMove(11, 647.74, 1416.12);
    usleep(7885.42);
    touchMove(11, 559.83, 1431.88);
    usleep(8248.00);
    touchUp(11, 457.80, 1476.66);
    usleep(3142626.67);

    touchDown(7, 903.19, 1076.06);
    usleep(58044.21);
    touchUp(7, 903.19, 1076.06);

    usleep(16000);
}

function delete_app_from_springboard_and_filza() {
    log_and_toast("deleting app from springboard");

    usleep(16000);

    touchDown(5, 670.97, 345.38);
    usleep(1183228.08);
    touchMove(5, 668.48, 345.38);
    usleep(1449895.42);
    touchMove(5, 668.48, 346.22);
    usleep(566772.58);
    touchMove(5, 668.48, 347.03);
    usleep(390965.67);
    touchMove(5, 667.64, 347.03);
    usleep(75584.79);
    touchMove(5, 666.82, 347.03);
    usleep(83260.62);
    touchMove(5, 666.82, 347.88);
    usleep(66695.58);
    touchUp(5, 667.64, 349.53);
    usleep(1007813.33);

    touchDown(13, 602.95, 270.72);
    usleep(166623.71);
    touchUp(13, 602.95, 270.72);
    usleep(1458990.50);

    touchDown(16, 918.12, 1144.09);
    usleep(333399.29);
    touchMove(16, 913.97, 1144.09);
    usleep(7778.92);
    touchMove(16, 913.97, 1144.91);
    usleep(8795.25);
    touchMove(16, 913.97, 1145.75);
    usleep(7883.83);
    touchMove(16, 913.97, 1146.56);
    usleep(25539.08);
    touchMove(16, 913.97, 1147.41);
    usleep(66783.33);
    touchMove(16, 913.97, 1148.22);
    usleep(16516.25);
    touchMove(16, 913.97, 1149.06);
    usleep(57784.58);
    touchMove(16, 913.97, 1149.88);
    usleep(25549.42);
    touchMove(16, 913.97, 1150.72);
    usleep(16756.67);
    touchMove(16, 913.97, 1151.53);
    usleep(74376.29);
    touchMove(16, 913.97, 1152.38);
    usleep(42146.12);
    touchMove(16, 913.97, 1153.19);
    usleep(24523.46);
    touchMove(16, 913.97, 1154.03);
    usleep(16652.46);
    touchMove(16, 913.97, 1154.88);
    usleep(59077.46);
    touchMove(16, 913.15, 1154.88);
    usleep(107662.29);
    touchMove(16, 913.15, 1155.69);
    usleep(17025.29);
    touchMove(16, 913.15, 1156.53);
    usleep(16269.17);
    touchMove(16, 913.15, 1157.34);
    usleep(49990.71);
    touchMove(16, 912.30, 1157.34);
    usleep(25513.75);
    touchMove(16, 911.48, 1157.34);
    usleep(33537.46);
    touchMove(16, 910.66, 1157.34);
    usleep(74294.83);
    touchMove(16, 910.66, 1156.53);
    usleep(66664.96);
    touchMove(16, 910.66, 1155.69);
    usleep(33320.58);
    touchMove(16, 910.66, 1154.88);
    usleep(50008.38);
    touchMove(16, 910.66, 1154.03);
    usleep(33460.00);
    touchMove(16, 910.66, 1153.19);
    usleep(42054.67);
    touchMove(16, 910.66, 1152.38);
    usleep(41150.79);
    touchMove(16, 910.66, 1151.53);
    usleep(25587.04);
    touchMove(16, 910.66, 1150.72);
    usleep(24423.79);
    touchMove(16, 909.82, 1150.72);
    usleep(25746.42);
    touchMove(16, 909.00, 1150.72);
    usleep(24327.71);
    touchMove(16, 909.00, 1149.88);
    usleep(8937.79);
    touchMove(16, 909.00, 1149.06);
    usleep(8081.42);
    touchMove(16, 909.00, 1146.56);
    usleep(8293.17);
    touchUp(16, 909.82, 1143.25);
    usleep(1408346.25);

    touchDown(4, 1445.60, 68.38);
    usleep(225114.00);
    touchUp(4, 1445.60, 68.38);

    usleep(1000000);

    log_and_toast("deleting app from filza");

    touchDown(5, 160.90, 327.12);
    usleep(100410.71);
    touchUp(5, 160.90, 327.12);
    usleep(1133358.12);

    touchDown(5, 197.39, 306.41);
    usleep(99998.58);
    touchUp(5, 197.39, 306.41);
    usleep(966999.62);

    touchDown(6, 860.06, 545.25);
    usleep(33601.46);
    touchMove(6, 862.55, 570.16);
    usleep(8091.46);
    touchMove(6, 862.55, 580.09);
    usleep(7781.04);
    touchMove(6, 862.55, 592.53);
    usleep(8919.08);
    touchMove(6, 862.55, 605.81);
    usleep(8148.12);
    touchMove(6, 862.55, 619.06);
    usleep(8613.58);
    touchMove(6, 862.55, 636.50);
    usleep(8204.29);
    touchMove(6, 862.55, 658.88);
    usleep(8253.29);
    touchMove(6, 862.55, 683.78);
    usleep(7921.71);
    touchMove(6, 862.55, 704.50);
    usleep(9163.42);
    touchMove(6, 862.55, 731.88);
    usleep(8065.71);
    touchMove(6, 862.55, 756.75);
    usleep(8133.38);
    touchMove(6, 862.55, 782.47);
    usleep(7921.12);
    touchMove(6, 862.55, 809.84);
    usleep(8758.96);
    touchMove(6, 862.55, 837.22);
    usleep(7919.50);
    touchMove(6, 862.55, 865.41);
    usleep(9073.33);
    touchMove(6, 862.55, 894.44);
    usleep(7596.12);
    touchMove(6, 863.39, 921.81);
    usleep(8662.25);
    touchMove(6, 864.21, 950.84);
    usleep(8549.62);
    touchMove(6, 865.03, 979.88);
    usleep(8125.25);
    touchMove(6, 865.88, 1009.72);
    usleep(8372.92);
    touchMove(6, 866.70, 1038.75);
    usleep(8939.83);
    touchMove(6, 867.54, 1068.59);
    usleep(7769.25);
    touchMove(6, 867.54, 1097.62);
    usleep(8357.67);
    touchMove(6, 868.36, 1127.50);
    usleep(7863.25);
    touchMove(6, 868.36, 1159.00);
    usleep(9036.96);
    touchMove(6, 868.36, 1189.69);
    usleep(7636.54);
    touchMove(6, 868.36, 1220.38);
    usleep(8729.42);
    touchMove(6, 868.36, 1251.06);
    usleep(7950.38);
    touchMove(6, 868.36, 1282.59);
    usleep(8753.62);
    touchMove(6, 868.36, 1314.09);
    usleep(8822.83);
    touchMove(6, 868.36, 1351.44);
    usleep(7766.04);
    touchMove(6, 868.36, 1386.25);
    usleep(8424.42);
    touchMove(6, 868.36, 1416.94);
    usleep(8632.12);
    touchMove(6, 868.36, 1456.75);
    usleep(7545.08);
    touchMove(6, 868.36, 1494.09);
    usleep(9082.46);
    touchMove(6, 869.18, 1532.22);
    usleep(7657.67);
    touchMove(6, 870.02, 1569.56);
    usleep(8656.21);
    touchMove(6, 870.84, 1608.53);
    usleep(7972.79);
    touchMove(6, 872.51, 1648.34);
    usleep(8761.79);
    touchMove(6, 875.81, 1690.66);
    usleep(8216.12);
    touchUp(6, 884.95, 1737.09);
    usleep(1366991.88);

    touchDown(7, 1481.27, 90.75);
    usleep(75035.17);
    touchUp(7, 1481.27, 90.75);
    usleep(1058651.58);

    touchDown(8, 456.14, 201.06);
    usleep(57845.50);
    touchUp(8, 456.14, 201.06);
    usleep(2458970.92);

    touchDown(9, 140.98, 577.59);
    usleep(58224.00);
    touchUp(9, 140.98, 577.59);
    usleep(974979.17);

    touchDown(10, 923.09, 1116.72);
    usleep(133227.88);
    touchUp(10, 923.09, 1116.72);
    usleep(1166955.04);

    touchDown(7, 1444.78, 84.12);
    usleep(58587.42);
    touchUp(7, 1444.78, 84.12);

}

const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

function log_and_toast(text) {
    toast(text);
    console.log(text);
}


function cracking_loop() {

    log_and_toast("starting cracking loop");
    var trackid;
    var bundle_id;
    var request_id;
    var response = api_request("action=get_publish_requests&type=ios&compatibility[model]=ipad");

    log_and_toast('got response '+response);

    if (response["data"].length) {

        trackid = (response["data"][0]["trackid"]);
        request_id = response["data"][0]["id"];
        bundle_id = response["data"][0]["bundle_id"];

        log_and_toast('cracking ' + bundle_id);

        buy_crack_upload_app(trackid, request_id, bundle_id);
        IS_CRACKING_FINISHED = true;
        return true;
    } else {
        log_and_toast("no apps, sleeping 60 sec");
        usleep(10000000);
        wake_touch()
        usleep(10000000);
        IS_CRACKING_FINISHED = true;
        return true;
    }
}




function run() {

    log_and_toast("starting script");

    var IS_CRACKING_FINISHED = true;

    while (true) {
        log_and_toast('ticker!');
        if (IS_CRACKING_FINISHED) {
            IS_CRACKING_FINISHED = false;
            IS_CRACKING_FINISHED = cracking_loop();
        }
        usleep(100000);
    }


}

// export `run()` method from this module
module.exports = {
    run
}
