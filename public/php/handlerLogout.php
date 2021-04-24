<?php
    /*header("Access-Control-Allow-Origin: *");*/
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Credentials: true");
    session_start();
    session_destroy();
    if(empty($_SESSION)){
        echo json_encode(['result' => 'success']);
    } else {
        echo json_encode(['result' => 'error']);
    }
    
?>