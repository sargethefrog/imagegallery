<?php
    header("Access-Control-Allow-Origin: *");
    define('UPLOADS_DIR','../uploads');
    if(!is_dir(UPLOADS_DIR)){
        mkdir(UPLOADS_DIR);
    }
    $title = htmlspecialchars(trim($_POST['title']));
    $description = htmlspecialchars(trim($_POST['description']));
    $data = $_POST['data'];
    $album_id = (int)$_POST['album_id'];
    $filename = 'image'.time().'.jpg';
    if($data && $album_id && $title && $description){
        $file = fopen(UPLOADS_DIR . '/' . $filename,'w');
        $data = base64_decode($data);
        fwrite($file,$data);
        fclose($file);
        $mysqli = new mysqli('localhost','y91756wn_0201','zG6X6&pb','y91756wn_0201');
        $mysqli -> query("INSERT INTO `imggallery_images`(`title`, `description`, `album_id`, `filename`) VALUES ('$title', '$description', $album_id,'$filename')");
        if($mysqli -> insert_id){
            $result = ['result' => 'success'];
        } else {
            //$result = ['result' => 'error'];
            $result = ['result' => 'db_error'];
        }
    } else {
        //$result = ['result' => 'error'];
        $result = ['result' => 'data_error'];
    }
    echo json_encode($result);
?>