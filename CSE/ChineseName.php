<label>Enter Your Name: <input id= "Name" name="Name" type="text"></label><input type="button" name="Translate" id="Translate" onClick="Translate();this.value='Painting ...';" value="Translate">
<?php 
 //Gets the IP address
 $ip = getenv("REMOTE_ADDR") ; 
 //Echo "Your IP is " . $ip; 
 ?> 
<?php 
//echo ' Client IP: '; 
if ( isset($_SERVER["REMOTE_ADDR"]) )    { 
//    echo '' . $_SERVER["REMOTE_ADDR"] . ' '; 
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    { 
//    echo '' . $_SERVER["HTTP_X_FORWARDED_FOR"] . ' '; 
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    { 
//    echo '' . $_SERVER["HTTP_CLIENT_IP"] . ' '; 
} 
// echo "joe ip is:";
$joe = apache_request_headers();
//echo $joe['PC-Remote-Addr'];
$Name = $_GET["Name"];
$page = file_get_contents('http://www.usdiner.com/cgi-bin/ShowCNamesUNR?Name=' . $Name);
echo $page;
//echo PHPinfo();
//echo file_get_html('http://www.usdiners.com/')->plaintext; 

?>
