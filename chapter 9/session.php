<?php
	session_start();
	
	// MySQL connection
	include 'dbconnect.php';
    
    // JSON Object 
    $json = array('connected'=>'false');
	
	if(isset($_SESSION['name'])) {
		$query = 'SELECT * FROM players WHERE name = "'.$_SESSION['name'].'"';
		$result = mysqli_query($link, $query);
		$obj = mysqli_fetch_object($result);
		if($obj){
		    $json['name'] = $_SESSION['name'];
            $json['x'] = floatval($obj->x);
            $json['y'] = floatval($obj->y);
            $json['dir'] = intval($obj->dir);
		} else {
			session_destroy();	
		}
        
        mysqli_free_result($result);
	}
    
    echo json_encode($json);

    mysqli_close($link);
?>