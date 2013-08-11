<?php
session_start();
require_once('twitter/twitteroauth/twitteroauth.php');
require_once('twitter/config.php');

$time  = $_SESSION['time'];
$level = $_SESSION['level'];
if(isset($time) && isset($level)){
    /* Get user access tokens out of the session. */
    $access_token = $_SESSION['access_token'];
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
        
    $parameters = array('status' => 'I\'ve just finished level '.$level.' for Yet Another Platformer in '.$time.' seconds!');
    $status = $connection->post('statuses/update', $parameters);    
}
?>