<?php
    header('Access-Control-Allow-Origin: *');
    $title = htmlspecialchars(trim($_POST['title']));
    $description = htmlspecialchars(trim($_POST['description']));
    $id = (int)$_POST['album_id'];
    if($title && $description && $id){
        $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
        $mysqli -> query("UPDATE `imggallery_albums` SET `title`='$title',`description`='$description' WHERE `id` = $id");
        if($mysqli -> affected_rows){
            $result = ['result' => 'success'];
        } else {
            $result = ['result' => 'error'];
        }
    } else {
        $result = ['result' => 'error'];
    }
    echo json_encode($result);
?>