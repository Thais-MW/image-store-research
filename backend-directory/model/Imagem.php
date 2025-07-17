<?php
include '../../conexao/Conexao.php';

class Imagem extends Conexao
{
    private $caminho;
    private $tipo;
    private $tamanho;

    // Getters
    function getCaminho()
    {
        return $this->caminho;
    }

    function getTipo()
    {
        return $this->tipo;
    }

    function getTamanho()
    {
        return $this->tamanho;
    }

    // Setters
    function setCaminho($caminho)
    {
        $this->caminho = $caminho;
    }

    function setTipo($tipo)
    {
        $this->tipo = $tipo;
    }

    function setTamanho($tamanho)
    {
        $this->tamanho = $tamanho;
    }

    public function insert($obj)
    {
        $sql = "INSERT INTO imagem(caminho,tipo,tamanho) VALUES (:caminho,:tipo,:tamanho)";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('caminho', $obj->caminho);
        $consulta->bindValue('tipo', $obj->tipo);
        $consulta->bindValue('tamanho', $obj->tamanho);
        return $consulta->execute();
    }

    public function update($obj, $id = null)
    {
        $sql = "UPDATE imagem SET caminho = :caminho, tipo = :tipo, tamanho = :tamanho WHERE id = :id ";
        $consulta = Conexao::prepare($sql);
        $consulta->bindValue('caminho', $obj->caminho);
        $consulta->bindValue('tipo', $obj->tipo);
        $consulta->bindValue('tamanho', $obj->tamanho);
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
        return $consulta->fetchAll();
    }
}
