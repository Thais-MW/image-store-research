<?php
include '../../conexao/cors_headers.php';
include '../../control/ImagemControl.php';

$response = ['success' => false, 'message' => ''];

if (isset($_FILES['imageFile']) && $_FILES['imageFile']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imageFile']['tmp_name'];
    $fileName = $_FILES['imageFile']['name'];
    $fileSize = $_FILES['imageFile']['size'];
    $fileType = $_FILES['imageFile']['type'];

    $imageData = file_get_contents($fileTmpPath);

    if ($imageData !== false) {
        $obj = new stdClass();
        $obj->dados_imagem = $imageData;
        $obj->mime_type = $fileType;
        $obj->tamanho = $fileSize;

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
    } else {
        $response['message'] = 'Erro ao ler o conteúdo do arquivo enviado.';
        http_response_code(500);
    }
} else {
    $response['message'] = 'Nenhum arquivo enviado ou ocorreu um erro no upload.';
    if (isset($_FILES['imageFile']['error'])) {
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => 'O arquivo excede o limite de tamanho definido no php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'O arquivo excede o limite de tamanho do formulário HTML.',
            UPLOAD_ERR_PARTIAL    => 'O upload do arquivo foi feito apenas parcialmente.',
            UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo foi enviado.',
            UPLOAD_ERR_NO_TMP_DIR => 'Faltando uma pasta temporária.',
            UPLOAD_ERR_CANT_WRITE => 'Falha ao gravar o arquivo em disco.',
            UPLOAD_ERR_EXTENSION  => 'Uma extensão PHP interrompeu o upload do arquivo.',
        ];
        $response['upload_error_code'] = $_FILES['imageFile']['error'];
        $response['message'] .= ' Detalhe: ' . ($uploadErrors[$_FILES['imageFile']['error']] ?? 'Erro desconhecido.');
    }
    http_response_code(400);
}

header('Content-Type: application/json');
echo json_encode($response);
exit();
