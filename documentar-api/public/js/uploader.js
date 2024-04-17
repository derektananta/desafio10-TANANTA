document.addEventListener("DOMContentLoaded", () => {
    const uploaderForm = document.getElementById("uploader_form");
    const documentTypeSelect = document.getElementById("folder");
    const subdocumentTypeSelect = document.getElementById("subfolder");
    const subfolderContainer = document.getElementById("subfolderContainer");

    documentTypeSelect.addEventListener("change", () => {
        const selectedDocumentType = documentTypeSelect.value;

        if (selectedDocumentType === "document") {
            subfolderContainer.style.display = "block";
            subdocumentTypeSelect.setAttribute("required", "required");
        } else {
            subfolderContainer.style.display = "none";
            subdocumentTypeSelect.removeAttribute("required");
        }
    });

    uploaderForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(uploaderForm);
        const uid = uploaderForm.dataset.uid;
        const folder = documentTypeSelect.value;
        const subfolder = subdocumentTypeSelect.value;

        try {
            const response = await fetch(`/api/users/${uid}/documents?folder=${folder}&subfolder=${subfolder}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Image uploaded successfully");
                window.location.reload();
            } else {
                console.error('Error uploading image:', response.statusText);
            }
        } catch (error) {
            console.error('Server Error:', error);
        }
    });
});
