<?php
$request_method = $_SERVER['REQUEST_METHOD'];
$required_fields = ['name', 'surname', 'country', 'email'];
$country = ['bih', 'hr', 'slo', 'bih', 'sr'];
$allowed = ['video/x-flv', 'video/mp4',
  //avi
  'video/avi',
  'video/x-msvideo',
  'application/x-troff-msvideo',
  //wmv
  'video/x-ms-wmv',
  //mov
  'video/quicktime'
  ];
$max_file_size = 157286400;
$DS = DIRECTORY_SEPARATOR;
$path = realpath('..');

$data = haveFields($_POST, $required_fields);

if ($request_method === 'POST' && $data !== false) {
  strlen($data['name']) > 2 && strlen($data['name']) <= 50 ? null : exit('Name error');
  strlen($data['surname']) > 2 && strlen($data['surname']) <= 50 ? null : exit('Surname error');
  in_array($data['country'], $country) ? null : exit('Country error');
  filter_var($data['email'], FILTER_VALIDATE_EMAIL) !== false ? null : exit('Email error');

  $file = $_FILES['files'];

  if (empty($file) || $file['error'] != 0) {
    error_log('[e] File upload error!');
    exit('File upload error');
  }

  // check extension
  in_array($file['type'], $allowed) ? null : exit('File extension isnt allowed!');

  // check file size
  $file['size'] <= $max_file_size ? null : exit('File size error! Upload smaller file!');

  // check does user exist with this email
  require_once 'db.php';
  $exist = user_exist($data['email'], $connection);
  $exist == false ? null : exit("User already uploaded file!");

  // create user && get user id
  $user_id = create_user($data['name'], $data['surname'], $data['email'], $data['country'], $connection);
  if (!$user_id) {
    exit('User isn\'t created');
  }
  $user_id = mysqli_insert_id($connection);


  // create folder and move uploaded file
  $filename = $file['name'];
  $uploads_path = $path . $DS . 'uploads';
  $user_path = $uploads_path . $DS . $user_id;

  $old = umask(0);
  mkdir($user_path, 0777, true);
  umask($old);

  move_uploaded_file($file['tmp_name'], $user_path . $DS. $filename);

  // save file in db
  $filesize = $file['size'] / 1024; // in kb
  $save_file_db = save_file($user_id, $filename, $filesize, $file['type'], $connection);
  echo 'success';
} else {
  die('No data');
}

/**
 * @param $resource
 * @param $requred
 * @return array|bool
 */
function haveFields($resource, $requred) {
  $data = [];

 foreach ($requred as $value) {

   if (!isset($resource[$value]) || empty($resource[$value])) {
     return false;
   }

   $data[$value] = $resource[$value];
 }

 return $data;
}