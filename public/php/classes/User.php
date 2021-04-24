<?php
    class User{
        static function handlerAuth($email,$pass){
            global $mysqli;
            header("Access-Control-Allow-Origin: http://localhost:3000");
            header("Access-Control-Allow-Credentials: true");
            session_start();
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
        }
        static function handlerLogout(){
            header("Access-Control-Allow-Origin: http://localhost:3000");
            header("Access-Control-Allow-Credentials: true");
            session_start();
            session_destroy();
            if(empty($_SESSION)){
                echo json_encode(['result' => 'success']);
            } else {
                echo json_encode(['result' => 'error']);
            }
        }
        static function handlerReg($name,$email,$pass){
            global $mysqli;
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
        }
        static function getUser(){
            global $mysqli;
            header("Access-Control-Allow-Origin: http://localhost:3000");
            header("Access-Control-Allow-Credentials: true");
            session_start();
            if(!empty($_SESSION['user_id'])){
                $id = $_SESSION['user_id'];
                $result = $mysqli -> query("SELECT * FROM `imggallery_users` WHERE `id` = $id");
                if($result -> num_rows){
                    echo json_encode($result -> fetch_assoc());
                } else {
                    echo json_encode(['result' => 'error']);
                }
            } else {
                echo json_encode(['result' => 'error']);
            }
        }
    }
?>