<?php
include '../../conexao/Conexao.php';

class Imagem extends Conexao
{
    private $dados_imagem;
    private $mime_type;

    // Getters
    function getDadosImagem()
    {
        return $this->dados_imagem;
    }

    function getMimeType()
    {
        return $this->mime_type;
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

    public function insert($obj)
    {
        $sql = "INSERT INTO imagem(dados_imagem,mime_type) VALUES (:dados_imagem,:mime_type)";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('dados_imagem', $obj->dados_imagem, PDO::PARAM_LOB);
        $consulta->bindValue('mime_type', $obj->mime_type);
        return $consulta->execute();
    }

    public function update($obj, $id = null)
    {
        $sql = "UPDATE imagem SET dados_imagem = :dados_imagem, mime_type = :mime_type WHERE id = :id ";
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
