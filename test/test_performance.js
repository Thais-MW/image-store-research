import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";
import encoding from "k6/encoding";
import { vu } from "k6/execution";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";

// --- CONFIGURAÇÕES DO TESTE ---
// Ex: k6 run -e BACKEND_TYPE=blob -e TEST_SCENARIO=multiple_uploads -e IMAGE_TYPE=jpg test_performance.js

const CONFIG = {
    backendType: __ENV.BACKEND_TYPE || "directory",

    testScenario: __ENV.TEST_SCENARIO || "single_upload_and_list",

    imageType: __ENV.IMAGE_TYPE || "png",

    imageFolderPath: "./images/",

    imageFiles: {
        "10x10_jpg": "10x10.jpg",
        "100x100_jpg": "100x100.jpg",
        "200x200_jpg": "200x200.jpg",
        "500x500_jpg": "500x500.jpg",
        "1000x1000_jpg": "1000x1000.jpg",
        "2000x2000_jpg": "2000x2000.jpg",
    },

    numImagesToUploadInBatch: 3,
};

const BACKEND_URLS = {
    blob: "http://localhost:8888/image-store-research/backend-blob/view/Imagem/",
    directory:
        "http://localhost:8888/image-store-research/backend-directory/view/Imagem/",
};

// --- Carregamento de Imagens do Disco ---
const images = new SharedArray("Test Images", function () {
    const loadedImages = [];
    for (const key in CONFIG.imageFiles) {
        const fileName = CONFIG.imageFiles[key];
        const filePath = `${CONFIG.imageFolderPath}${fileName}`;
        try {
            const fileBytes = open(filePath, "b");
            loadedImages.push({
                bytes: fileBytes,
                name: fileName,
                type: `image/${fileName.split(".").pop()}`,
                size: fileBytes.byteLength,
            });
            console.log(
                `Imagem '${fileName}' (${key}) carregada com sucesso. Tamanho: ${fileBytes.byteLength} bytes.`
            );
        } catch (e) {
            console.error(
                `ERRO: Não foi possível carregar a imagem '${filePath}'. Verifique o caminho e as permissões. Detalhes: ${e}`
            );
            throw new Error(`Falha ao carregar imagem: ${filePath}`);
        }
    }
    return loadedImages;
});

function getCurrentImageForUpload() {
    const filteredImages = images.filter((img) =>
        img.type.includes(CONFIG.imageType)
    );

    if (filteredImages.length === 0) {
        throw new Error(
            `Nenhuma imagem do tipo '${CONFIG.imageType}' encontrada na pasta 'images'. Verifique as configurações e os arquivos.`
        );
    }

    const randomIndex = randomIntBetween(0, filteredImages.length - 1);
    return filteredImages[randomIndex];
}

export let options = {
    vus: 10,
    duration: "1m",

    thresholds: {
        http_req_duration: ["p(95)<500"],
        http_req_failed: ["rate<0.01"],
    },
};

export default function () {
    const BASE_URL = BACKEND_URLS[CONFIG.backendType];
    const currentImage = getCurrentImageForUpload();

    // --- Cenário: Apenas Listagem ---
    if (CONFIG.testScenario === "only_list") {
        const listRes = http.get(`${BASE_URL}listar.php`);
        check(listRes, {
            "Listagem: Status é 200 OK": (r) => r.status === 200,
            "Listagem: Resposta JSON indica sucesso": (r) => {
                try {
                    return r.json().success === true;
                } catch (e) {
                    console.error(
                        `Erro ao analisar resposta da listagem: ${r.body}`
                    );
                    return false;
                }
            },
            "Listagem: Dados são um array": (r) => {
                try {
                    const json = r.json();
                    return Array.isArray(json.data);
                } catch (e) {
                    return false;
                }
            },
        });
        sleep(1);
        return;
    }

    // --- Cenário: Upload de Imagem Única e Listagem ---
    if (CONFIG.testScenario === "single_upload_and_list") {
        const uploadPayload = {
            imageFile: http.file(
                currentImage.bytes,
                currentImage.name,
                currentImage.type
            ),
        };

        const uploadRes = http.post(`${BASE_URL}inserir.php`, uploadPayload);

        check(uploadRes, {
            "Upload (Single): Status é 200 OK": (r) => r.status === 200,
            "Upload (Single): Resposta JSON indica sucesso": (r) => {
                try {
                    return r.json().success === true;
                } catch (e) {
                    console.error(
                        `Erro ao analisar resposta do upload (Single): ${r.body}`
                    );
                    return false;
                }
            },
        });
        sleep(1);
    }

    // --- Cenário: Múltiplos Uploads e Listagem ---
    if (CONFIG.testScenario === "multiple_uploads_and_list") {
        for (let i = 0; i < CONFIG.numImagesToUploadInBatch; i++) {
            const batchImage = getCurrentImageForUpload();
            const uploadPayload = {
                imageFile: http.file(
                    batchImage.bytes,
                    `Batch_${i}_VU:${vu.idInTest}_Iter:${__ITER}_${batchImage.name}`,
                    batchImage.type
                ),
            };

            const uploadRes = http.post(
                `${BASE_URL}inserir.php`,
                uploadPayload
            );

            check(uploadRes, {
                [`Upload (Batch ${i}): Status é 200 OK`]: (r) =>
                    r.status === 200,
                [`Upload (Batch ${i}): Resposta JSON indica sucesso`]: (r) => {
                    try {
                        return r.json().success === true;
                    } catch (e) {
                        console.error(
                            `Erro ao analisar resposta do upload (Batch ${i}): ${r.body}`
                        );
                        return false;
                    }
                },
            });
            sleep(0.5);
        }
    }

    const listRes = http.get(`${BASE_URL}listar.php`);

    check(listRes, {
        "Listagem: Status é 200 OK": (r) => r.status === 200,
        "Listagem: Resposta JSON indica sucesso": (r) => {
            try {
                return r.json().success === true;
            } catch (e) {
                console.error(
                    `Erro ao analisar resposta da listagem: ${r.body}`
                );
                return false;
            }
        },
        "Listagem: Dados são um array": (r) => {
            try {
                const json = r.json();
                return Array.isArray(json.data);
            } catch (e) {
                return false;
            }
        },
    });
    sleep(1);
}
