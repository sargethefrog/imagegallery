<?php
    /*header("Access-Control-Allow-Origin: *");*/
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    session_start();
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $email = trim(mb_strtolower($_POST['email']));
    $pass = trim($_POST['pass']);
    $result = $mysqli -> query("SELECT * FROM `imggallery_users` WHERE `email` = '$email'");
    $row = $result -> fetch_assoc();
    if(password_verify($pass,$row["pass"])){
        $_SESSION['name'] = $row['name'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['user_id'] = $row['id'];
        echo json_encode(['result' => 'success']);
    } else {
        echo json_encode(['result' => 'error']);
    }
?>