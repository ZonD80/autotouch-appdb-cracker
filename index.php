<?php
/*
 * const LT = '5a6c9c3cc267c88b78f5408193f84788c8db38bf';
const ST = 'c23885117e91c0e9bfafbce8f83ca84aa1ac38d0';
const API_URL = 'https://api.dbservices.to/v1.2/';
 */
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
