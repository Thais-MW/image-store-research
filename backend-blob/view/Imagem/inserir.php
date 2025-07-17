<?php
include '../../conexao/cors_headers.php';
include '../../control/ImagemControl.php';

$response = ['success' => false, 'message' => ''];

$rawData = file_get_contents('php://input');
$data = json_decode($rawData);

if ($data === null) {
    $response['message'] = 'Erro: Dados JSON inválidos ou ausentes.';
    http_response_code(400);
} elseif (!isset($data->dados_imagem) || !isset($data->mime_type)) {
    $response['message'] = 'Erro: Campos essenciais (dados_imagem, mime_type) ausentes.';
    http_response_code(400);
} else {
    $imageData = base64_decode($data->dados_imagem);

    if ($imageData === false) {
        $response['message'] = 'Erro: Não foi possível decodificar os dados da imagem Base64.';
        http_response_code(400);
    } else {
        $obj = new stdClass();
        $obj->dados_imagem = $imageData;
        $obj->mime_type = $data->mime_type;

        $imagemControl = new ImagemControl();
        $insertResult = $imagemControl->insert($obj);

        if ($insertResult) {
            $response['success'] = true;
            $response['message'] = 'Imagem e metadados inseridos com sucesso no banco de dados!';
            http_response_code(200);
        } else {
            $response['message'] = 'Erro ao inserir metadados da imagem no banco de dados.';
            http_response_code(500);
        }
    }
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
