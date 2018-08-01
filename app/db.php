<?php
require_once 'browser.php';
require_once 'config.php';

$connection = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if (!$connection) {
  die('No sql connection!');
}

//$query = mysqli_query($connection, 'SELECT * FROM users');
//var_dump($query->num_rows, $query->fetch_assoc());
function create_user($name, $lastname, $email, $country, $newsletter, $db_link) {
  $ip = getIP();
  $browser = new Browser();
  $browser = $browser->getAll();

  $sql = "INSERT INTO users (name, lastname, email, country, druge_aktivnosti, ip, browser) VALUES " .
  "('{$name}', '{$lastname}', '{$email}', '{$country}', {$newsletter}, '{$ip}', '{$browser}')";
  $query = mysqli_query($db_link, $sql);

  if ($query) {
    return $query;
  }

  return false;
}

function save_file($user_id, $filename, $filesize, $extension, $db_link) {
  $sql = "INSERT INTO files (user_id, name, filesize, extension) VALUES " .
    "({$user_id}, '{$filename}', {$filesize}, '{$extension}')";
  $query = mysqli_query($db_link, $sql);

  if ($query) {
    return $query;
  }

  error_log('[*] MySQL error!');
  error_log(json_encode(mysqli_error($db_link)));
  return false;
}

function user_exist($email, $db_link) {
  $sql = "SELECT * FROM users where email = '{$email}'";
  $query = mysqli_query($db_link, $sql);

  return $query->num_rows > 0;
}

function getIP() {
  $ipaddress = '';
  if (isset($_SERVER['HTTP_CLIENT_IP']))
    $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
  else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
    $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
  else if(isset($_SERVER['HTTP_X_FORWARDED']))
    $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
  else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
    $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
  else if(isset($_SERVER['HTTP_FORWARDED']))
    $ipaddress = $_SERVER['HTTP_FORWARDED'];
  else if(isset($_SERVER['REMOTE_ADDR']))
    $ipaddress = $_SERVER['REMOTE_ADDR'];
  else
    $ipaddress = 'UNKNOWN';
  return $ipaddress;
}
