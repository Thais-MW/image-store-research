<?php
include '../../conexao/cors_headers.php';
include '../../control/ImagemControl.php';

$data = file_get_contents('php://input');
$obj =  json_decode($data);

$id = $obj->id;


if (!empty($data)) {
    $imagemControl = new ImagemControl();
    $imagemControl->update($obj, $id);
    header('Location:listar.php');
}
