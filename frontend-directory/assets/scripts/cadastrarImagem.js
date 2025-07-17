document
    .getElementById("imageUploadForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const messageDiv = document.getElementById("message");
        messageDiv.textContent = "";

        const imageFile = document.getElementById("imageFile").files[0];

        if (!imageFile) {
            messageDiv.textContent =
                "Por favor, selecione um arquivo de imagem.";
            return;
        }

        const formData = new FormData();
        formData.append("imageFile", imageFile);

        try {
            const response = await fetch(
                "http://localhost:8888/back_dir/view/Imagem/inserir.php",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent =
                    result.message || "Imagem enviada com sucesso!";
                document.getElementById("imageUploadForm").reset();
            } else {
                messageDiv.textContent =
                    result.message || "Erro ao enviar imagem.";
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            messageDiv.textContent = "Erro de conexão com o servidor.";
        }
    });
