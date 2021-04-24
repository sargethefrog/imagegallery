<?php
    /*header("Access-Control-Allow-Origin: *");*/
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    session_start();
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    if(!empty($_SESSION['user_id'])){
        $id = $_SESSION['user_id'];
        $result = $mysqli -> query("SELECT * FROM `imggallery_users` WHERE `id` = $id");
        if($result -> num_rows){
            echo json_encode($result -> fetch_assoc());
        } else {
            echo json_encode(['result' => 'error']);
            //echo json_encode(['result' => 'db_error']);
        }
    } else {
        echo json_encode(['result' => 'error']);
        //echo json_encode(['result' => 'session_error']);
    }
?>