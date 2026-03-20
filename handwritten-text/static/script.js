function uploadImage() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("⚠️ Please select an image first!");
        return;
    }

    let formData = new FormData();
    formData.append("image", file);

    // Show loading
    document.getElementById("output").value = "⏳ Processing...";

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response:", data);
        document.getElementById("output").value = data.text;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("output").value = "❌ Error occurred!";
    });
}