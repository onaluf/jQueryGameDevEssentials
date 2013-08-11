<?php 
session_start();


// Twitter 
require_once('twitter/twitteroauth/twitteroauth.php');
require_once('twitter/config.php');

/* Get user access tokens out of the session. */
$access_token = $_SESSION['access_token'];
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
$twitterUser = $connection->get('account/verify_credentials');

// Facebook
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

// Get the current user
$facebookUser = $facebook->getUser();

?>

<html>
	<head>
		<title>Jump'n'run</title>
		<link href='http://fonts.googleapis.com/css?family=Sniglet:800' rel='stylesheet' type='text/css'>
		<style>
			.screen {
				display: none;
				font-family: 'Sniglet', cursive;
				font-size: 36px;
				color: #FFF;
				background-color: #4C6D90;
				text-align: center;
				
				position: absolute;
				top: 0;
				left: 0;

				width: 100%;
				height: 100%;
				
				text-shadow: #000 4px 0px, #000 -4px 0px, #000 0px -4px, #000 0px 4px;
				z-index: 100;
			}
			
			.screen h1 {
				margin-top: 100px;
				font-size: 3em;
			}
			
			.screen input {
				font-family: 'Sniglet', cursive;
				font-size: 36px;
				background: none;
				border: none;
				
				color: #FFF;
				text-shadow: #000 4px 0px, #000 -4px 0px, #000 0px -4px, #000 0px 4px;
			}
			.screen a {
				font-size: 24px;
				color: #FFF;
				text-decoration: none;
			}
			#startScreen {
				background: url(start.png);
				display: block;
				padding-top: 380px;
			}
			.screen .tweetLink {
				color: #BBF;
			}
		</style>
		<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.min.js"></script>
		<script type="text/javascript" src="gameFramework.js"></script>
		<script type="text/javascript" src="yap.js"></script>
		<script type="text/javascript">
<?php if($_SESSION['status'] == 'verified'){ ?>
			var twitter = true;
			var twitterName = "<?php print $twitterUser->screen_name; ?>";
<?php } else { ?>
			var twitter = false;	
<?php } ?>
<?php if($facebookUser){ ?>
			var facebook = true;
			var facebookId = "<?php print $facebookUser; ?>";
<?php } else { ?>
			var facebook = false;	
<?php } ?>
		</script>
	</head>
	<body>
		<div id="mygame" style="position: relative; width: 640px; height: 480px; overflow: hidden; background: #5e81a1; -webkit-transform:translateZ(0); -moz-transform:translateZ(0); transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)">
			<div id="startScreen" class="screen">
				<?php if($_SESSION['status'] != 'verified'){ ?>
					<a class="button tweetLink" href="./twitter/redirect.php">Login with Twitter</a> 
				<?php } else { ?>
					<a class="button tweetLink" href="./twitter/clearsessions.php">Logout from Twitter</a>
				<?php }?>
				<?php if(!$facebookUser){ 
					$loginUrl = $facebook->getLoginUrl(array(
						'scope' => $scope,
						'redirect_uri' => $app_url
					));
				?>
					<a class="button tweetLink" href="<?php print $loginUrl; ?>">Login with Facebook</a>
				<?php } else { 
					$logoutUrl = $facebook->getLogoutUrl(array(
						'next' => $app_url
					));	
				?>
					<a class="button tweetLink" href="<?php print $logoutUrl; ?>">Logout from Facebook</a>
				<?php } ?>
				<a id="startButton"class="button" href="#">Start game</a>
			</div>
			<div id="levelStart" class="screen">
				<h1>Level <span id="level_nb_1">1</span></h1>
				<p>Get ready!</p>
			</div>
			<div id="levelEnd" class="screen">
				<p>You finished Level <span id="level_nb_2">1</span> in <span id="time">10:20</span>!</p>
				<p>Top 5</p>
				<div id="top_list"></div>
				<p>press space to play next level</p>
			</div>
		</div>
	</body>
</html>