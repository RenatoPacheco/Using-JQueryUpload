<?php
header ('Content-type: application/javascript; charset=UTF-8');

$arquivos = [];
$url  = isset($_SERVER['HTTPS']) ? 'https://' : 'http://';
$url .= $_SERVER['SERVER_NAME'];
$url .= $_SERVER['REQUEST_URI'];

$dir = dirname($url);

foreach ($_FILES['arquivos']['name'] as $key => $value)
{
	$uploaddir = './files/';
	$uploadfile = $uploaddir . $_FILES['arquivos']['name'][$key];
	if (move_uploaded_file($_FILES['arquivos']['tmp_name'][$key], $uploadfile)) {
		$path_parts = pathinfo($uploadfile);
		$arquivos[$key] = [];
		$arquivos[$key]['server'] = $uploadfile;
		$arquivos[$key]['url'] = $uploadfile;
		$arquivos[$key]['name'] = $_FILES['arquivos']['name'][$key];
		$arquivos[$key]['contentType'] = $_FILES['arquivos']['type'][$key];
		$arquivos[$key]['extension'] = '.' . $path_parts['extension'];
		$arquivos[$key]['size'] = $_FILES['arquivos']['size'][$key];
		$arquivos[$key]['width'] = 0;
		$arquivos[$key]['height'] = 0;
		$arquivos[$key]['checksum'] = md5_file($uploadfile);
		$arquivos[$key]['delete_url'] = "$dir/remove.php?arquivo=$uploadfile";
		$arquivos[$key]['delete_type'] = 'DELETE';
	}
}
?>
<?=json_encode(array('files'=>$arquivos))?>