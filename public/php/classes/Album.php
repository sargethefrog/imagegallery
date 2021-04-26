<?php
    class Album{
        static function getImages($album_id){
            global $mysqli;
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
        }
        static function getImage($id){
            global $mysqli;
            if($id){
                /*$result = $mysqli -> query("SELECT * FROM `imggallery_images` WHERE `id` = $id;");*/
                $result = $mysqli -> query("SELECT imggallery_images.*,imggallery_albums.user_id FROM `imggallery_images` JOIN `imggallery_albums` ON imggallery_images.album_id = imggallery_albums.id WHERE imggallery_images.id = $id;");
                if($result -> num_rows){
                    echo json_encode($result -> fetch_assoc());
                } else {
                    echo json_encode(['result' => 'error']);
                }
            } else {
                echo json_encode(['result' => 'error']);
            }
        }
        static function getAlbums(){
            global $mysqli;
            $result = [];
            $db_result = $mysqli -> query("SELECT * FROM imggallery_albums ORDER BY `id` DESC");
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
        }
        static function getAlbum($id){
            global $mysqli;
            $result = $mysqli -> query("SELECT * FROM `imggallery_albums` WHERE `id` = $id");
            if($result -> num_rows){
                $row = $result -> fetch_assoc();
                echo json_encode($row);
            } else {
                echo json_encode(['result' => 'error']);
            }
            
        }
        static function handlerEditAlbum($title,$description,$id){
            global $mysqli;
            if($title && $description && $id){
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
        }
        static function handlerEditImage($title,$description,$id){
            global $mysqli;
            $title = trim(htmlspecialchars($_POST['title']));
            $description = trim(htmlspecialchars($_POST['description']));
            $mysqli -> query("UPDATE `imggallery_images` SET `title`='$title',`description`='$description' WHERE `id` = $id;");
            if($mysqli -> affected_rows){
                echo json_encode(['result' => 'success']);
            } else {
                echo json_encode(['result' => 'error']);
            }
        }
        static function handlerDeleteAlbum(){
            global $mysqli;
            if($id){
            $result = $mysqli -> query("SELECT * FROM `imggallery_albums` WHERE `id` = $id;");
            if($result -> num_rows){
                $result = $mysqli -> query("SELECT `filename` FROM `imggallery_images` WHERE `album_id` = $id;");
                $files = [];
                if($result -> num_rows){
                    while($row = $result -> fetch_assoc()){
                        $files[] = $row['filename'];
                    }
                    if($files){
                        foreach($files as $file){
                            unlink("../uploads/$file");
                        }
                    }
                    $mysqli -> query("DELETE FROM `imggallery_images` WHERE `album_id` = $id;");
                    if(!$mysqli -> affected_rows){
                        echo json_encode(['result' => 'error']);
                        exit();
                    }
                }
                $mysqli -> query("DELETE FROM `imggallery_albums` WHERE `id` = $id;");
                if($mysqli -> affected_rows){
                    echo json_encode(['result' => 'success']);
                } else {
                     echo json_encode(['result' => 'error']);
                }
            } else {
                echo json_encode(['result' => 'error']);
            }
            
        } else {
            echo json_encode(['result' => 'error']);
        }
        }
        static function handlerDeleteImage($id){
            global $mysqli;
            if($id){
            $dataset = $mysqli -> query("SELECT `filename` FROM `imggallery_images` WHERE `id` = $id;");
            $row = $dataset -> fetch_assoc();
            $filename = $row['filename'];
            if($filename){
                $mysqli -> query("DELETE FROM `imggallery_images` WHERE `id` = $id;");
                if($mysqli -> affected_rows){
                    if(unlink("uploads/$filename")){
                        echo json_encode(['result' => 'success']);
                    } else {
                        echo json_encode(['result' => 'error']);
                    }
                } else {
                    echo json_encode(['result' => 'error']);
                }
                
            } else {
                echo json_encode(['result' => 'error']);
            }
        } else {
            echo json_encode(['result' => 'error']);
        }
        }
        static function handlerAddAlbum($title,$description,$user_id){
            global $mysqli;
            session_start();
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
        }
        static function uploadImage($title,$description,$data,$album_id){
            global $mysqli;
            if(!is_dir('uploads')){
                mkdir('uploads');
            }
            $filename = 'image'.time().'.jpg';
            if($data && $album_id && $title && $description){
                $file = fopen('uploads/' . $filename,'w');
                $data = base64_decode($data);
                fwrite($file,$data);
                fclose($file);
                $mysqli -> query("INSERT INTO `imggallery_images`(`title`, `description`, `album_id`, `filename`) VALUES ('$title', '$description', $album_id,'$filename')");
                if($mysqli -> insert_id){
                    $result = ['result' => 'success'];
                } else {
                    $result = ['result' => 'db_error'];
                }
            } else {
                $result = ['result' => 'data_error'];
            }
            echo json_encode($result);
        }
        static function handlerSearch($search){
            global $mysqli;
            if($search){
                $result = $mysqli -> query("SELECT imggallery_images.*,imggallery_albums.title AS `album_title`,imggallery_users.name AS `author`,imggallery_users.id AS `author_id` FROM `imggallery_images` JOIN `imggallery_albums` ON imggallery_albums.id = imggallery_images.album_id JOIN `imggallery_users` ON imggallery_users.id = imggallery_albums.user_id WHERE imggallery_images.title LIKE '%$search%' OR imggallery_images.description LIKE '%$search%' ORDER BY imggallery_images.datetime DESC;");
                if($result -> num_rows){
                    $response = [];
                    while($row = $result -> fetch_assoc()){
                        $response[] = $row;
                    }
                    echo json_encode($response);
                } else {
                    echo json_encode(['result' => 'not_found']);
                }
            } else {
                echo json_encode(['result' => 'empty_string']);
            }
        }
    }
?>