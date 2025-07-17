<?php
include '../../conexao/cors_headers.php';

include '../../control/ImagemControl.php';

$imagemControl = new ImagemControl();

$success = $imagemControl->clearAll();

if ($success) {
    header('Content-Type: application/json');
    exit();
} else {
    echo "Erro ao limpar a tabela 'imagem'.";
}
