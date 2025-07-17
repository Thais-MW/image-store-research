<?php
include '../../conexao/Conexao.php';

class Imagem extends Conexao
{
    private $dados_imagem;
    private $mime_type;
    private $tamanho;

    // Getters
    function getDadosImagem()
    {
        return $this->dados_imagem;
    }

    function getMimeType()
    {
        return $this->mime_type;
    }

    function getTamanho()
    {
        return $this->tamanho;
    }

    // Setters
    function setDadosImagem($dados_imagem)
    {
        $this->dados_imagem = $dados_imagem;
    }

    function setMimeType($mime_type)
    {
        $this->mime_type = $mime_type;
    }

    function setTamanho($tamanho)
    {
        $this->tamanho = $tamanho;
    }

    public function insert($obj)
    {
        $sql = "INSERT INTO imagem(dados_imagem,mime_type,tamanho) VALUES (:dados_imagem,:mime_type,:tamanho)";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('dados_imagem', $obj->dados_imagem, PDO::PARAM_LOB);
        $consulta->bindValue('mime_type', $obj->mime_type);
        $consulta->bindValue('tamanho', $obj->tamanho);
        return $consulta->execute();
    }

    public function update($obj, $id = null)
    {
        $sql = "UPDATE imagem SET dados_imagem = :dados_imagem, mime_type = :mime_type, tamanho = :tamanho  WHERE id = :id ";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('dados_imagem', $obj->dados_imagem, PDO::PARAM_LOB);
        $consulta->bindValue('mime_type', $obj->mime_type);
        $consulta->bindValue('id', $id);
        return $consulta->execute();
    }

    public function delete($id = null)
    {
        $sql =  "DELETE FROM imagem WHERE id = :id";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('id', $id);
        $consulta->execute();
        return $consulta->execute();
    }

    public function clearAll()
    {
        $sql = "TRUNCATE TABLE imagem";
        $consulta = Conexao::prepare($sql);
        return $consulta->execute();
    }

    public function find($id = null)
    {
        $sql = "SELECT * FROM imagem WHERE id = :id";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('id', $id);
        $consulta->execute();
        return $consulta->fetch(PDO::FETCH_OBJ);
    }

    public function findAll()
    {
        $sql = "SELECT * FROM imagem";
        $consulta = Conexao::prepare($sql);
        $consulta->execute();
        return $consulta->fetchAll(PDO::FETCH_OBJ);
    }
}
