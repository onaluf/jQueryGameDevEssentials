<?php

	session_start();
	include 'dbconnect.php';
	
	$name = $_GET['name'];
	if(isset($name)){
	    // JSON Object 
        $json = array('hit'=>false, 'success'=>false);
    
		// do the combat here!
		
		// get the enemy form DB
		$query = 'SELECT * FROM enemies WHERE life <> 0 AND name = "'.$name.'"';
		$result = mysqli_query($link, $query);
		$obj = mysqli_fetch_object($result);
		if ($obj) {
			
			$playerRoll = rand ( 5 , 11 );
			$enemyRoll  = rand ( $obj->defense, $obj->defense + 6);
			
			$json['hit'] = true;
            
			if ($playerRoll > $enemyRoll){
			    $json['success'] = true;
                
				if($playerRoll > $obj->life){
				    $json['killed'] = true;
                    
					// update DB
					mysqli_query($link, 'UPDATE enemies SET life = 0 WHERE name = "'.$name.'"');
				} else {
				    $json['killed'] = false;
                    $json['damage'] = intval($playerRoll);
                    
					// update DB
					mysqli_query($link, 'UPDATE enemies SET life = '.($obj->life - $playerRoll).' WHERE name = "'.$name.'"');
				}
			}
		}
	}

    echo json_encode($json);

    mysqli_close($link);
?>