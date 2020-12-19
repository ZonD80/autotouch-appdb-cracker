<?php
ini_set('display_errors', true);
ini_set('error_reporting', E_ALL & ~E_NOTICE);
function result($response)
{
    if (PHP_SAPI != 'cli') {
        header('Content-type: application/json; charset=utf-8');
    } else {
        print "\n";
    }
    print json_encode($response);
    die();
}

$request_id = (int)$_REQUEST['request_id'];
$magic = (string)$_REQUEST['magic'];
if ($magic!='dsfsf3FHh3hg') {
    die('invalid magic');
}

$ROOT_PATH = dirname(__FILE__);
$active_request_data = json_decode(@file_get_contents($ROOT_PATH.'/active_request.json'),true);

$active_request_data['ipa_downloaded'] = 1;
file_put_contents($ROOT_PATH.'/active_request.json',json_encode($active_request_data));

result([
    'success'=>true,
]);
