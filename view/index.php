<?php
require_once '../app/db.php';

$sql = "
SELECT 
u.id as user_id,
u.name,
u.lastname,
u.email,
f.name as filename,
f.filesize as 'filesize (kb)'
FROM users as u
LEFT JOIN files as f ON u.id = f.user_id
WHERE u.id > 41 order by u.id desc;";

$res = mysqli_query($connection, $sql);

echo '<table><thead>
<tr>
    <td>user id</td>
    <td>name</td>
    <td>email</td>
    <td>filename</td>
    <td>size</td>
</tr>
</thead> <tbody>';

//$res = $res->fetch_array();
//var_dump();
$res->fetch_assoc();
foreach ($res as $item) {

  echo "<tr>
    <td>{$item['user_id']}</td>
    <td>{$item['name']} {$item['lastname']}</td>
    <td>{$item['email']}</td>
    <td>{$item['filename']}</td>
    <td>{$item['filesize (kb)']}</td>
</tr>";
}
echo '</tbody></table>';


//var_dump($res->fetch_assoc());