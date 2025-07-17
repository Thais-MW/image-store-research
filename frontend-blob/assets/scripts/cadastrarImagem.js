document
    .getElementById("imageUploadForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const messageDiv = document.getElementById("message");
        messageDiv.textContent = "";
        messageDiv.className = "mt-4 text-center text-sm font-medium";

        const imageFile = document.getElementById("imageFile").files[0];

        if (!imageFile) {
            messageDiv.textContent =
                "Por favor, selecione um arquivo de imagem.";
            messageDiv.classList.add("text-red-600");
            return;
        }

        const reader = new FileReader();

        reader.onload = async function (e) {
            const base64String = e.target.result;

            const base64Data = base64String.split(",")[1];
            const mimeType = imageFile.type;

            const imageData = {
                dados_imagem: base64Data,
                mime_type: mimeType,
            };

            try {
                const response = await fetch(
                    "http://localhost:8888/back_blob/view/Imagem/inserir.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(imageData),
                    }
                );

                const result = await response.json();

                if (response.ok) {
                    messageDiv.textContent =
                        result.message || "Imagem enviada com sucesso!";
                    messageDiv.classList.add("text-green-600");
                    document.getElementById("imageUploadForm").reset();
                } else {
                    messageDiv.textContent =
                        result.message || "Erro ao enviar imagem.";
                    messageDiv.classList.add("text-red-600");
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                messageDiv.textContent = "Erro de conexão com o servidor.";
                messageDiv.classList.add("text-red-600");
            }
        };

        reader.onerror = function (error) {
            console.error("Erro ao ler o arquivo:", error);
            messageDiv.textContent = "Erro ao ler o arquivo de imagem.";
            messageDiv.classList.add("text-red-600");
        };

        reader.readAsDataURL(imageFile);
    });
