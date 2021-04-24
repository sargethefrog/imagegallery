<?php
    header("Access-Control-Allow-Origin: *");
    $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
    $album_id = (int)$_POST['album_id'];
    //$db_result = $mysqli -> query("SELECT `id` AS `album_id`, `title` AS `album_title`, `description` AS `album_description` FROM `imggallery_albums` WHERE id = $album_id");
    $db_result = $mysqli -> query("SELECT imggallery_albums.id,imggallery_albums.title,imggallery_albums.description,imggallery_albums.datetime,imggallery_albums.user_id AS `userId`,imggallery_users.name AS `author` FROM `imggallery_albums` JOIN `imggallery_users` ON imggallery_albums.user_id = imggallery_users.id WHERE imggallery_albums.id = $album_id");
    $row = $db_result -> fetch_assoc();
    $result = $row;
    $images = [];
    $db_result = $mysqli -> query("SELECT `id`,`title`,`description`,`filename`,`datetime` FROM `imggallery_images` WHERE `album_id` = $album_id ORDER BY `datetime` DESC");
    while($row = $db_result -> fetch_assoc()){
        $images[] = $row;
    }
    $result['images'] = $images;
    echo json_encode($result);
?>