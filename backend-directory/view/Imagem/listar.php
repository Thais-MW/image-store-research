<?php
include '../../conexao/cors_headers.php';
include '../../control/ImagemControl.php';

$imagemControl = new ImagemControl();
$response = ['success' => false, 'message' => '', 'data' => []];

try {
	$imagens = $imagemControl->findAll();
	$response['success'] = true;
	$response['data'] = $imagens;
	http_response_code(200); // OK
} catch (Exception $e) {
	$response['message'] = 'Erro ao buscar imagens: ' . $e->getMessage();
	http_response_code(500); // Erro Interno do Servidor
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
