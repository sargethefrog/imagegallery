<?php
    header('Access-Control-Allow-Origin: *');
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $name = $_POST['name'];
    $email = trim(mb_strtolower($_POST['email']));
    $pass = $_POST['pass'];
    $pass = trim(password_hash($pass,PASSWORD_DEFAULT));
    $result = $mysqli -> query("SELECT id FROM `imggallery_users` WHERE `email` = '$email'");
    if($result -> num_rows){
        echo json_encode(['result' => 'exist']);
    } else {
        $mysqli -> query("INSERT INTO `imggallery_users`(`name`,`email`,`pass`) VALUES ('$name','$email','$pass');");
        if($mysqli -> insert_id){
            echo json_encode(['result' => 'success']);
        } else {
            echo json_encode(['result' => 'error']);
        }
    }
?>