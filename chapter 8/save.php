<?php
	session_start();
	
	include 'dbconnect.php';
	
	$name  = $_GET['name'];
	$time  = $_SESSION['time'];
	$level = $_SESSION['level'];
	
    if(isset($name) && isset($time) && isset($level)){
        $query = 'INSERT INTO scores (level, name, time) VALUES('.$level.', "'.$name.'",'.$time.')';
    
        if (!mysqli_query($link, $query)){
            print 'FAIL: '.mysqli_error($link);
        } else {
            print 'OK';
        }
    }
	
	mysqli_close($link);
?>