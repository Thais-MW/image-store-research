const BASE_BACKEND_URL = "http://localhost:8888/back_dir/";
const UPLOADS_PATH = "uploads/";
const imageListDiv = document.getElementById("image-list");
const messageDiv = document.getElementById("message");
const loadingMessage = document.getElementById("loading-message");

/**
 * Função para exibir mensagens na UI
 * @param {string} message
 * @param {string} type
 */
function displayMessage(message, type) {
    messageDiv.textContent = message;
}

/**
 * Função para buscar e exibir as imagens do backend.
 */
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
                    const imageCard = document.createElement("div");
                    const imageUrl = `${BASE_BACKEND_URL}${UPLOADS_PATH}${image.caminho.replace(
                        "../../uploads/",
                        ""
                    )}`;

                    imageCard.innerHTML = `
                        <img 
                            src="${imageUrl}" 
                            class="imagem"
                        >
                        <p>Tipo: ${image.tipo}</p>
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
