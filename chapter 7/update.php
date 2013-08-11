<?php
	session_start();
	
	// MySQL connection
	include 'dbconnect.php';
    
    // JSON Object 
    $json = array('players'=>array(), 'enemies'=>array());
	
	// Retriving all the other player positions
	$query = 'SELECT * FROM players WHERE lastupdate > TIMESTAMPADD(MINUTE, -10, NOW()) AND name <> "'.$_GET['name'].'"';
	$result = mysqli_query($link, $query);
    
    while ($obj = mysqli_fetch_object($result)) {
        array_push($json['players'], array('name'=>$obj->name, 'x'=>floatval($obj->x), 'y'=>floatval($obj->y), 'dir'=>intval($obj->dir), 'state'=>floatval($obj->state)));
	}
    
	mysqli_free_result($result);
	
	// Retriving all the enemies
	$query = "SELECT * FROM enemies WHERE life <> 0";
	$result = mysqli_query($link, $query);
    
    /* fetch associative array */
    while ($obj = mysqli_fetch_object($result)) {
        array_push($json['enemies'], array('name'=>$obj->name, 'type'=>$obj->type, 'x'=>floatval($obj->x), 'y'=>floatval($obj->y)));
    }

    mysqli_free_result($result);
	
    echo json_encode($json);
	
	// Revtrive the value from parameters
	$name = $_GET['name'];
	$x    = $_GET['x'];
	$y    = $_GET['y'];
	$dir  = $_GET['dir'];
	$state  = $_GET['state'];
	
	if(isset($name) && isset($x) && isset($y) && isset($dir) && isset($state)){
	    // Update DB
        mysqli_query($link, 'UPDATE players SET x='.$x.', y ='.$y.', dir = '.$dir.', state = '.$state.', lastupdate = NOW() WHERE name="'.$name.'"');
	}
	
	// Close DB's connection
	mysqli_close($link);
?>