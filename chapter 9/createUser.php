<?php
	session_start();
	
	include 'dbconnect.php';
	
    // JSON Object 
    $json = array('success'=>false);
    
	$name = $_GET['name'];
	$pw    = $_GET['pw'];
	
	if(isset($name) && isset($pw)) {
		$hash = hash('md5', $pw);
		$query = 'SELECT * FROM players WHERE name = "'.$name.'"';
		$result = mysqli_query($link, $query);
		$obj = mysqli_fetch_object($result);
		if(!$obj){
			$query = 'INSERT INTO players (name, x, y, dir, pw, state) VALUES("'.$name.'", 510, 360, 0, "'.$hash.'", 0)';
			$result = mysqli_query($link, $query);
			
			$_SESSION['name'] = $name;
			$_SESSION['pw'] = $pw;
            
            $json['success'] = true;
            $json['x'] = 510;
            $json['y'] = 360;
            $json['dir'] = 0;
		}
	}

    echo json_encode($json);

	// Close DB's connection
	mysqli_close($link);
?>