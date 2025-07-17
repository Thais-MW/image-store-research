document
    .getElementById("imageUploadForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const messageDiv = document.getElementById("message");
        messageDiv.textContent = "";

        imageFiles = document.getElementById("imageFile").files;

        if (imageFiles.length === 0) {
            messageDiv.textContent =
                "Por favor, selecione pelo menos um arquivo de imagem.";
            return;
        }

        let successfulUploads = 0;
        let failedUploads = 0;
        let totalFiles = imageFiles.length;

        for (let i = 0; i < totalFiles; i++) {
            const file = imageFiles[i];
            const formData = new FormData();
            formData.append("imageFile", file);

            try {
                const response = await fetch(
                    "http://localhost:8888/image-store-research/backend-directory/view/Imagem/inserir.php",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const result = await response.json();

                if (response.ok && result.success) {
                    successfulUploads++;
                    console.log(
                        `Upload de '${file.name}' bem-sucedido:`,
                        result.message
                    );
                } else {
                    failedUploads++;
                    console.error(
                        `Falha no upload de '${file.name}':`,
                        result.message || "Erro desconhecido."
                    );
                }
            } catch (error) {
                failedUploads++;
                console.error(`Erro na requisição para '${file.name}':`, error);
            }
        }

        if (successfulUploads === totalFiles) {
            messageDiv.textContent = `${successfulUploads} imagem(ns) enviada(s) com sucesso!`;
            document.getElementById("imageUploadForm").reset();
        } else if (failedUploads === totalFiles) {
            messageDiv.textContent = `Erro: Nenhuma imagem foi enviada.`;
        } else {
            messageDiv.textContent = `Upload concluído: ${successfulUploads} sucesso(s), ${failedUploads} falha(s).`;
        }
    });
