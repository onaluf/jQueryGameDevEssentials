<?php

require 'facebook/facebook.php';

$app_id = 'XXXXXXXXXXXXXXX';
$app_secret = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
$app_namespace = 'yap_bookdemo';
$app_url = 'http://jquerygamedevelopment.com/';
$scope = 'publish_actions';

$facebook = new Facebook(array(
	'appId'  => $app_id,
	'secret' => $app_secret,
));

$app_access_token = get_app_access_token($app_id, $app_secret);
$facebook->setAccessToken($app_access_token);

$response = $facebook->api('/'.$app_id.'/achievements', 'post', array(
   'achievement' => 'http://jquerygamedevelopment.com/demo2/ach1.html',
));

print($response);

// Helper function to get an APP ACCESS TOKEN
function get_app_access_token($app_id, $app_secret) {
   $token_url = 'https://graph.facebook.com/oauth/access_token?'
     . 'client_id=' . $app_id
     . '&client_secret=' . $app_secret
     . '&grant_type=client_credentials';

   $token_response =file_get_contents($token_url);
   $params = null;
   parse_str($token_response, $params);
   return  $params['access_token'];
}

?>