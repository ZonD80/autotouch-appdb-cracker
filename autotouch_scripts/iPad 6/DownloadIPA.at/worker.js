const { touchDown, touchMove, touchUp, usleep, toast, keyDown, keyUp, appKill, openURL, exec } = at


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

 // RECORD YOUR PASSWORD KEY INPUT AND FILL IT HERE
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

function api_request(url,override_url) {

    var query_string = url + "&lt=" + LT + "&st=" + ST;
    var query_array = query_string.split('&');
    var command = "curl";
    for (var i in query_array) {
        command = command + " -F '" + query_array[i] + "'";
    }
    if (override_url) {
        command = command + " '" + override_url + "'";
    } else {
        command = command + " '" + API_URL + "'";
    }

    log_and_toast('Requesting API ' + command);
    var result = exec(command);
    log_and_toast('got response '+override_url+' :' + result);
    try {
        var to_return = JSON.parse(result);
        return JSON.parse(result);
    } catch (e) {
        return {success:false,data:[]};
    }
}


function buy_crack_upload_app(trackid, request_id, bundle_id, server_url) {


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

    var craching_response = api_request("magic=dsfsf3FHh3hg&bundle_id="+bundle_id+"&request_id="+request_id,server_url);

    log_and_toast(craching_response);

    log_and_toast("done cracking");

    return true;

}

function log_and_toast(text) {
    toast(text);
    console.log(text);
}




function run() {

    log_and_toast("starting appdb");

    LT = '';
    ST = '';
    API_URL = '';

    var active_request = api_request('lol=lol','http://192.168.1.10/active_request.json');

    log_and_toast("got active request\n"+JSON.stringify(active_request));

    LT = active_request['LT'];
    ST = active_request['ST'];
    API_URL = active_request['API_URL'];
    server_url = 'http://192.168.1.10/';

    buy_crack_upload_app(active_request.trackid,active_request.request_id, active_request.bundle_id, server_url);


}

// export `run()` method from this module
module.exports = {
    run
}
