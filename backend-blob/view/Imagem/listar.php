<?php
include '../../conexao/cors_headers.php';
include '../../control/ImagemControl.php';

$imagemControl = new ImagemControl();
$response = ['success' => false, 'message' => '', 'data' => []];

try {
	$imagens = $imagemControl->findAll();
	$processedImages = [];
	foreach ($imagens as $imagem) {
		if (isset($imagem->dados_imagem)) {
			$imagem->dados_imagem_base64 = base64_encode($imagem->dados_imagem);
			unset($imagem->dados_imagem);
		}
		$processedImages[] = $imagem;
	}

	$response['success'] = true;
	$response['data'] = $processedImages;
	http_response_code(200);
} catch (Exception $e) {
	$response['message'] = 'Erro ao buscar imagens: ' . $e->getMessage();
	http_response_code(500);
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
