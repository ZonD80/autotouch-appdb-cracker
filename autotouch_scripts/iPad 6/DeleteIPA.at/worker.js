const { touchDown, touchMove, touchUp, usleep, toast, keyDown, keyUp} = at


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

    touchDown(9, 663.49, 322.16);
    usleep(2690558.67);
    touchUp(9, 663.49, 322.16);
    usleep(925405.17);

    touchDown(16, 602.13, 261.62);
    usleep(66656.88);
    touchUp(16, 602.13, 261.62);
    usleep(841431.29);

    touchDown(16, 602.95, 272.41);
    usleep(92118.96);
    touchUp(16, 602.95, 272.41);
    usleep(1166792.83);

    touchDown(11, 931.38, 1123.34);
    usleep(174463.83);
    touchUp(11, 931.38, 1123.34);
    usleep(1550360.50);

    touchDown(15, 1456.38, 47.62);
    usleep(75175.67);
    touchUp(15, 1456.38, 47.62);

    usleep(1000000);

}

function log_and_toast(text) {
    toast(text);
    console.log(text);
}

function run() {

    prepare_springboard_for_app_deletion();

    delete_app_from_springboard_and_filza();
}

// export `run()` method from this module
module.exports = {
    run
}
