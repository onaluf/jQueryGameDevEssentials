<?php
	session_start();
	
	include 'dbconnect.php';
	if(isset($_GET['WfBCLQ']) && isset($_GET['Nmyzsf'])){
	    $time  = intval($_GET['WfBCLQ']) >> 1;
        $level = intval($_GET['Nmyzsf']);
        
        // player walk may 7px in 30ms -> 233.1
        $minTime = array(
            1 => 15, // 3500 / 233.1 
            2 => 15, // 3500 / 233.1 
            3 => 42, // 9800 / 233.1
            4 => 23  // 5460 / 233.1
        );
        $timeValid = !($minTime[intval($level)] > $time);
        
        // JSON Object 
        $json = array('top'=>array(), 'intop'=>false);
        
        $query = 'SELECT * FROM scores WHERE level='.$level.' ORDER BY time ASC LIMIT 5';
        $result = mysqli_query($link, $query);
        $i=0;
        
        while ($obj = mysqli_fetch_object($result)) {
            if(!$json['intop'] && $time < $obj->time && $timeValid){
                $json['intop'] = true;
                $json['pos'] = $i;
                
                array_push($json['top'], array('time'=>$time));
                
                $_SESSION['level'] = $level;
                $_SESSION['time']  = $time;
            
                $i++;
            }
            if($i < 5){
                array_push($json['top'], array('time'=>$obj->time, 'name'=>$obj->name));
                $i++;
            }
        }
        
        if($i < 5 && !$json['intop'] && $timeValid){
            $json['intop'] = true;
            $json['pos'] = $i;
            
            array_push($json['top'], array('time'=>$time));
            
            $_SESSION['level'] = $level;
            $_SESSION['time']  = $time;
        }
        
        mysqli_free_result($result);
    
        echo json_encode($json);
	}

	mysqli_close($link);
?>