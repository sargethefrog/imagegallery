<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: text/html; charset=utf-8");
    require_once('php/db.php');
    require_once('php/classes/Album.php');
    require_once('php/classes/User.php');
    $uri = explode('/',$_SERVER['REQUEST_URI']);
    if($uri[1] == 'getAlbums'){
        Album::getAlbums();
    } else if($uri[1] == 'getImages'){
        $album_id = (int)$_POST['album_id'];
        Album::getImages($album_id);
    } else if($uri[1] == 'getAlbum'){
        $id = (int)$_POST['id'];
        Album::getAlbum($id);
    } else if($uri[1] == 'handlerEditAlbum'){
        $title = htmlspecialchars(trim($_POST['title']));
        $description = htmlspecialchars(trim($_POST['description']));
        $id = (int)$_POST['album_id'];
        Album::handlerEditAlbum($title,$description,$id);
    } else if($uri[1] == 'handlerDeleteAlbum'){
        $id = (int)$_POST['id'];
        Album::handlerDeleteAlbum($id);
    } else if($uri[1] == 'handlerDeleteImage'){
        $id = (int)$_POST['id'];
        Album::handlerDeleteImage($id);
    } else if($uri[1] == 'handlerEditImage'){
        $title = htmlspecialchars(trim($_POST['title']));
        $description = htmlspecialchars(trim($_POST['description']));
        $id = (int)$_POST['id'];
        Album::handlerEditImage($title,$description,$id);
    } else if($uri[1] == 'handlerAddAlbum'){
        $title = strip_tags(trim($_POST['title']));
        $description = strip_tags(trim($_POST['description']));
        $user_id = (int)$_POST['user_id'];
        Album::handlerAddAlbum($title,$description,$user_id);
    } else if($uri[1] == 'uploadImage'){
        $title = htmlspecialchars(trim($_POST['title']));
        $description = htmlspecialchars(trim($_POST['description']));
        $data = $_POST['data'];
        $album_id = (int)$_POST['album_id'];
        Album::uploadImage($title,$description,$data,$album_id);
    } else if($uri[1] == 'handlerSearch'){
        $search = $_POST['search'];
        Album::handlerSearch($search);
    } else if($uri[1] == 'handlerAuth'){
        $email = trim(mb_strtolower($_POST['email']));
        $pass = trim($_POST['pass']);
        User::handlerAuth($email,$pass);
    } else if($uri[1] == 'handlerLogout'){
        User::handlerLogout();
    } else if($uri[1] == 'handlerReg'){
        $name = $_POST['name'];
        $email = trim(mb_strtolower($_POST['email']));
        $pass = $_POST['pass'];
        User::handlerReg($name,$email,$pass);
    } else if($uri[1] == 'getUser'){
        User::getUser();
    } else if($uri[1] == 'getImage'){
         $id = (int)$_POST['id'];
         Album::getImage($id);
    } else {
        require_once('index.html');
    }
?>