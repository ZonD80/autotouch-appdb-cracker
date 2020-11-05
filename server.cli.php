<?php
error_reporting(E_ALL & ~E_NOTICE);
define('MICROTIME', microtime(true));

if (PHP_SAPI != 'cli') {
    die("must to be run from cli");
}
$ROOT_PATH = dirname(__FILE__);

require_once $ROOT_PATH.'/secrets.php'; // see secrets.sample.php

$API_URL = 'https://api.dbservices.to/v1.3/';
$DEVICE_IP = '192.168.1.8';
$SCRIPT_PLAY_URL = 'http://'.$DEVICE_IP.':8080/control/start_playing?path=/DownloadIPA.at';
$DELETE_IPA_PLAY_URL = 'http://'.$DEVICE_IP.':8080/control/start_playing?path=/DeleteIPA.at';
$SCRIPT_STOP_URL = 'http://'.$DEVICE_IP.':8080/control/stop_playing?path=/DownloadIPA.at';
$SERVER_URL = 'http://192.168.1.13/';


loggy("Server is starting...");

while (true) {


    $wait_timer=0;
    $active_request_data = json_decode(@file_get_contents($ROOT_PATH.'/active_request.json'),true);

    while ($active_request_data!==NULL) {

        loggy("There is active request in process, waiting for ipa download...");

        if ($active_request_data['ipa_downloaded']) {

            loggy("ipa has been downloaded to device, clearing caches, cracking");

            rm_rf($ROOT_PATH."/dump");
            $command = '/usr/bin/node --unhandled-rejections=strict '.$ROOT_PATH.'/bagbak/go.js -z --override '.escapeshellarg($active_request_data['bundle_id']);

            var_dump($command);
            $result = liveExecuteCommand($command);

            if (preg_match("/archive: (.*?\.ipa)/i",$result['output'],$matches)) {


                $ipa_path = $matches[1];

                loggy("Got IPA, uploading ($ipa_path)");

                $query_string = "action=set_publish_request_status&type=ios&id=" . $active_request_data['request_id'] . "&status=ipa_provided&lt=" . $active_request_data['LT'] . "&st=" . $active_request_data['ST'];
                $query_array = explode('&',$query_string);
                $command = "curl -F 'ipa=@" . $ROOT_PATH."/".$ipa_path . "'";
                foreach ($query_array as $value) {
                    $command = $command." -F '" .$value. "'";
                }
                $command = $command . " '" . $API_URL . "'";

                //var_dump($command);
                $upload_result = liveExecuteCommand($command);
                //var_dump($upload_result);
                @unlink($ROOT_PATH.'/active_request.json');

                loggy("IPA uploaded, requesting deletion");

                $delete_ipa_result = curl_request($DELETE_IPA_PLAY_URL);

                var_dump($delete_ipa_result);

                loggy("triggered ipa deletion, waiting 60 sec till next run");

                sleep(60);

            } else {
                @unlink($ROOT_PATH.'/active_request.json');
                loggy("ERROR unable to crack ipa");
                loggy("IPA uploaded, requesting deletion");

                $delete_ipa_result = curl_request($DELETE_IPA_PLAY_URL);

                var_dump($delete_ipa_result);

                loggy("triggered ipa deletion, waiting 60 sec till next run");

                sleep(60);
            }

        } else {
            loggy("still waiting for ipa download");
        }

        if ($wait_timer>60*15) {
            loggy("Waiting for too long, stopping script");
            $device_response = json_decode(curl_request($SCRIPT_STOP_URL),true);
            if ($device_response['status']=='success') {
                loggy("stopped");
            } else {
                loggy("Error while stopping script; EXITING");
                die();
            }
            @unlink($ROOT_PATH.'/active_request.json');
        } else {
            sleep(10);
            $wait_timer = $wait_timer+10;
        }

        $active_request_data = json_decode(@file_get_contents($ROOT_PATH.'/active_request.json'),true);
    }

    $existing_requests = api_request('get_publish_requests',[
        'type'=>'ios',
        'compatibility[model]'=>'ipad',
    ]);

    if ($existing_requests['success']) {
        $app_request = $existing_requests['data'][0];
        if (!$app_request) {
            loggy("looks like no pending app requests, sleeping 60 sec");
            sleep(60);
            continue;
        }
        loggy("got request {$app_request['id']} {$app_request['bundle_id']}, requesting device");
        file_put_contents($ROOT_PATH.'/active_request.json',json_encode([
            'request_id'=>$app_request['id'],
            'trackid'=>$app_request['trackid'],
            'bundle_id'=>$app_request['bundle_id'],
            'LT'=>$CONFIG['LT'],
            'ST'=>$CONFIG['ST'],
            'API_URL'=>$API_URL,
        ]));

        $device_response = json_decode(curl_request($SCRIPT_PLAY_URL),true);
        if ($device_response['status']=='success') {
            loggy("started successfully, waiting for cracking to complete...");
        } else {
            loggy("Error while starting script; EXITING");
            die();
        }
    }
}

function api_request($method,$data=[]) {
    global $API_URL;
    return json_decode(curl_request($API_URL.'?action='.$method,$data),true);
}

function curl_request($url, $post_data = array(), $user_agent = '', $cookie_str = '', $custom_headers = array())
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    //curl_setopt($ch,CURLOPT_VERBOSE,true);
    if ($user_agent) {
        curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
    }
    if ($cookie_str) {
        curl_setopt($ch, CURLOPT_COOKIE, $cookie_str);
    }
    if ($custom_headers) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $custom_headers);
    }
    if ($post_data) {
        $post_data = http_build_query($post_data, '', '&');

        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
    }
    curl_setopt($ch, CURLOPT_TIMEOUT, 180);
    return curl_exec($ch);
}

function loggy($text)
{
    $now = microtime(true);
    print number_format($now - MICROTIME, 10) . "s, " . mksize(memory_get_usage(true)) . ": $text\n";
    ob_flush();
}

function mksize($bytes)
{
    if ($bytes < 1000 * 1024)
        return number_format($bytes / 1024, 2) . " kB";
    elseif ($bytes < 1000 * 1048576)
        return number_format($bytes / 1048576, 2) . " MB";
    elseif ($bytes < 1000 * 1073741824)
        return number_format($bytes / 1073741824, 2) . " GB";
    else
        return number_format($bytes / 1099511627776, 2) . " TB";
}

/**
 * Execute the given command by displaying console output live to the user.
 *  @param  string  cmd          :  command to be executed
 *  @return array   exit_status  :  exit status of the executed command
 *                  output       :  console output of the executed command
 */
function liveExecuteCommand($cmd)
{

    while (@ ob_end_flush()); // end all output buffers if any

    $proc = popen("$cmd 2>&1 ; echo Exit status : $?", 'r');

    $live_output     = "";
    $complete_output = "";

    while (!feof($proc))
    {
        $live_output     = fread($proc, 4096);
        $complete_output = $complete_output . $live_output;
        echo "$live_output";
        @ flush();
    }

    pclose($proc);

    // get exit status
    preg_match('/[0-9]+$/', $complete_output, $matches);

    // return exit status and intended output
    return array (
        'exit_status'  => intval($matches[0]),
        'output'       => str_replace("Exit status : " . $matches[0], '', $complete_output)
    );
}

function rm_rf($dirname)
{
    if (!$dirname) {
        return;
    }
    exec("rm -Rf $dirname");
}
