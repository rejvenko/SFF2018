<?php
require_once '../app/db.php';
$url = 'http://svismomiizistogfilma.com';

if ($_SERVER['SERVER_NAME'] === 'localhost') {
  $url = 'http://localhost/sff2018';
}

$sql = "
SELECT 
u.id as user_id,
u.name,
u.lastname,
u.email,
u.country,
u.ip,
f.name as filename,
f.filesize as 'filesize (kb)',
f.extension
FROM users as u
LEFT JOIN files as f ON u.id = f.user_id
WHERE u.id > 41 order by u.id desc;";

$res = mysqli_query($connection, $sql);
?>
<table>
  <thead>
    <tr>
        <td>user id</td>
        <td>Name</td>
        <td>Email</td>
        <td>Country</td>
        <td>File Name</td>
        <td>File size</td>
        <td>File type</td>
        <td>IP</td>
    </tr>
  </thead>
  <tbody>
<?php
  $res->fetch_assoc();
  foreach ($res as $item):
  $link = $url . '/uploads/' . $item['user_id'] . '/' . $item['filename'];
  ?>
  <tr>
    <td><?php echo $item['user_id']; ?></td>
    <td><?php echo $item['name']; ?> <?php echo $item['lastname']; ?></td>
    <td><?php echo $item['email']; ?></td>
    <td><?php echo $item['country']; ?></td>
    <td>
      <a href="<?php echo $link; ?>" target="_blank">
        <?php echo $item['filename']; ?>
      </a>
    </td>
    <td><?php echo $item['filesize (kb)']; ?></td>
    <td><?php echo $item['extension']; ?></td>
    <td><?php echo $item['ip']; ?></td>
  </tr>
<?php endforeach; ?>
  </tbody>
</table>