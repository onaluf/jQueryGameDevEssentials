<?php
	session_start();
	
	include 'dbconnect.php';
	
	$name = $_GET['name'];
	$pw   = $_GET['pw'];
    
    // JSON Object 
    $json = array('success'=>false);
	
	if(isset($name) && isset($pw)) {
		$hash = hash('md5', $pw);
		$query = 'SELECT * FROM players WHERE name = "'.$name.'" AND pw = "'.$hash.'"';
		$result = mysqli_query($link, $query);
		$obj = mysqli_fetch_object($result);
		if($obj){
		    $json['success'] = true;
            $json['x'] = floatval($obj->x);
            $json['y'] = floatval($obj->y);
            $json['dir'] = intval($obj->dir);
            
			$_SESSION['name'] = $name;
		}
	}
    
    echo json_encode($json);

	// Close DB's connection
	mysqli_close($link);
?>