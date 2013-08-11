<?php
    include 'dbconnect.php';
    
    $time  = $_GET['time'];
    $level = $_GET['level'];
    
    $intop = 0;
    $pos   = 0;
    
    $query = 'SELECT * FROM scores WHERE level='.$level.' ORDER BY time ASC LIMIT 5';
    $result = mysql_query($query);
    $num = mysql_numrows($result);
    $i=0;
    $first = true;
    print '{ "top" : [';
    while ($i < $num && $i+ $intop < 5) {
        $topTime  = mysql_result($result,$i,"time");
        $topName  = mysql_result($result,$i,"name");
        
        if($first){
            $first = false;
        } else {
            print ",";
        }

        if($intop == 0 && $time < $topTime){
            $intop++;
            $pos = $i;
            print '{"time": '.$time.'}';
        } else {
            $i++;
            print '{"name": "'.$topName.'", "time": '.$topTime.'}';
        }
    }
    if($num < 5 && $intop == 0){
        if($first){
            $first = false;
        } else {
            print ",";
        }
        $intop = 1;
        print '{"time": '.$time.'}';
    }
    
    print '],';
    
    if ($intop > 0){
        print '"intop": true, "pos": '.$pos.'}';
    } else {
        print '"intop": false}';
    }

    mysql_close();
?>

<?php
    session_start();
    
    include 'dbconnect.php';
    
    $time  = $_GET['time'];
    $level = $_GET['level'];
        
    if(isset($time) && isset($level)){
        
        // JSON Object 
        $json = array('top'=>array(), 'intop'=>false);
        
        $query = 'SELECT * FROM scores WHERE level='.$level.' ORDER BY time ASC LIMIT 5';
        $result = mysqli_query($link, $query);
        $i=0;
        
        while ($obj = mysqli_fetch_object($result)) {
            if(!$json['intop'] && $time < $obj->time){
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
