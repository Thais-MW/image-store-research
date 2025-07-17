const BASE_BACKEND_URL =
    "http://localhost:8888/image-store-research/backend-blob/";
const imageListDiv = document.getElementById("image-list");
const messageDiv = document.getElementById("message");
const loadingMessage = document.getElementById("loading-message");

function displayMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `mt-4 text-center text-sm font-medium ${
        type === "success" ? "text-green-600" : "text-red-600"
    }`;
}

async function fetchAndDisplayImages() {
    imageListDiv.innerHTML = "";
    loadingMessage.style.display = "block";
    messageDiv.textContent = "";

    try {
        const response = await fetch(
            `${BASE_BACKEND_URL}view/Imagem/listar.php`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {
            loadingMessage.style.display = "none";
            if (result.data && result.data.length > 0) {
                result.data.forEach((image) => {
                    console.log(image);

                    const imageUrl = `data:${image.mime_type};base64,${image.dados_imagem_base64}`;

                    const imageCard = document.createElement("div");
                    imageCard.innerHTML = `
                        <img src="${imageUrl}" alt="${
                        image.nome
                    }" class="imagem">
                        <p>Tipo: ${image.mime_type}</p>
                        <p>Tamanho: ${(image.tamanho / 1024).toFixed(2)} KB</p>
                        <p>ID: ${image.id}</p>
                    `;
                    imageListDiv.appendChild(imageCard);
                });
            } else {
                imageListDiv.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
            }
        } else {
            loadingMessage.classList.add("hidden");
            displayMessage(
                result.message || "Erro ao carregar imagens.",
                "error"
            );
            imageListDiv.innerHTML = "<p>Falha ao carregar imagens.</p>";
        }
    } catch (error) {
        loadingMessage.classList.add("hidden");
        console.error("Erro na requisição de listagem:", error);
        displayMessage(
            "Erro de conexão ao servidor ao listar imagens.",
            "error"
        );
        imageListDiv.innerHTML = "<p>Erro de rede. Verifique sua conexão.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayImages);

const buttonClearAll = document.getElementById("clearAll");

buttonClearAll.addEventListener("click", async () => {
    try {
        const response = await fetch(
            `${BASE_BACKEND_URL}view/Imagem/limpar.php`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Erro na limpeza das imagens", error);
        displayMessage(
            "Erro de conexão ao servidor ao listar imagens.",
            "error"
        );
    }
});
