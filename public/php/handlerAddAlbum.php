<?php
    header("Access-Control-Allow-Origin: *");
    session_start();
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $title = strip_tags(trim($_POST['title']));
    $description = strip_tags(trim($_POST['description']));
    /*if(isset($_SESSION['user_id'])){ 
        $user_id = (int)$_SESSION['user_id'];
    } else if(isset($_POST['user_id'])){
        $user_id = (int)$_POST['user_id'];
    } else {
        $user_id = 1;
    }*/
    $user_id = (int)$_POST['user_id'];
    if($title && $description && $user_id){
        $mysqli -> query("INSERT INTO `imggallery_albums`(`title`, `description`, `user_id`) VALUES ('$title', '$description',$user_id)");
        if($mysqli -> insert_id){
            $result = ['result' => 'success'];
        } else {
            $result = ['result' => 'error'];
        }
    } else {
        $result = ['result' => 'error'];
    }
    echo json_encode($result);
?>