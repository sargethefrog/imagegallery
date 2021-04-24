<?php
    header("Access-Control-Allow-Origin: *");
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $id = (int)$_POST['id'];
    $result = $mysqli -> query("SELECT * FROM `imggallery_albums` WHERE `id` = $id");
    $row = $result -> fetch_assoc();
    echo json_encode($row);
?>