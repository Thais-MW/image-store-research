<?php
include '../../model/Imagem.php';

class ImagemControl
{
    function insert($obj)
    {
        $imagem = new Imagem();
        return $imagem->insert($obj);
    }

    function update($obj, $id)
    {
        $imagem = new Imagem();
        return $imagem->update($obj, $id);
    }

    function delete($id)
    {
        $imagem = new Imagem();
        return $imagem->delete($id);
    }

    function clearAll()
    {
        $imagem = new Imagem();
        return $imagem->clearAll();
    }

    function find($id = null)
    {
        $imagem = new Imagem();
        return $imagem->find($id);
    }

    function findAll()
    {
        $imagem = new Imagem();
        return $imagem->findAll();
    }
}
