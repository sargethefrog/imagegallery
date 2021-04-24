<?php
    header("Access-Control-Allow-Origin: *");
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $result = [];
    $db_result = $mysqli -> query("SELECT * FROM imggallery_albums");
    while($row = $db_result -> fetch_assoc()){
        $album_id = $row['id'];
        $images_result = $mysqli -> query("SELECT COUNT(*) FROM `imggallery_images` WHERE `album_id` = $album_id");
        $count = $images_result -> fetch_assoc()['COUNT(*)'];
        $row['count'] = $count;
        $images_result = $mysqli -> query("SELECT `filename` FROM `imggallery_images` WHERE `album_id` = $album_id ORDER BY `id` DESC LIMIT 1");
        $row['filename'] = $images_result -> fetch_assoc()['filename'];
        $result[] = $row;
    }
    echo json_encode($result);
?>