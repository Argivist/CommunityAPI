<?php
$host = "http://awt.eastus.cloudapp.azure.com";
$user = "*******";
$pass = "*******";
$db = "Fruits";
$conn = mysqli_connect($host, $user, $pass, $db);   

if(!$conn){
    die("Connection failed: ".mysqli_connect_error());
}

$sql = "SELECT * FROM fruits";

$result = mysqli_query($conn, $sql);

// stringify
while($row = mysqli_fetch_assoc($result)){
    $data[] = $row;
}

echo json_encode($data);
?>