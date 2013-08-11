<?php
//echo $_SERVER['HTTP_USER_AGENT'] . "\n\n";
$browser = get_browser(null, true);

//print_r($browser);

if($browser["platform"] == "iOS"){
	echo "iOS";
} else {
	echo "not iOS";
}

?>