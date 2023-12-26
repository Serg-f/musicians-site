document.addEventListener('DOMContentLoaded', function () {
    const videoInput = document.getElementById('id_video');
    const photoInput = document.getElementById('id_photo');
    const videoPreviewDiv = createPreviewDiv('id_video');
    const photoPreviewDiv = createPreviewDiv('id_photo');

    function createPreviewDiv(id) {
        const previewDiv = document.createElement('div');
        previewDiv.id = id + '-preview';
        const inputElement = document.getElementById(id);

        if (inputElement) {
            inputElement.insertAdjacentElement('afterend', previewDiv);
        }

        return previewDiv;
    }

    function getYoutubeEmbedUrl(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? 'https://www.youtube.com/embed/' + match[2] : null;
    }

    function updateVideoPreview() {
        const embedUrl = getYoutubeEmbedUrl(videoInput.value);
        videoPreviewDiv.innerHTML = embedUrl ? `<iframe src="${embedUrl}" style="width: 100%; height: 450px;" frameborder="0" allowfullscreen></iframe>` : '';
    }

    function updatePhotoPreview() {
        photoPreviewDiv.innerHTML = '';
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => photoPreviewDiv.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: auto;">`;
            reader.readAsDataURL(photoInput.files[0]);
        }
    }

    if (videoInput) videoInput.addEventListener('input', updateVideoPreview);
    if (photoInput) photoInput.addEventListener('input', updatePhotoPreview);

    if (videoInput) updateVideoPreview(); // Initialize video preview if a value is already set
    if (photoInput) updatePhotoPreview(); // Initialize photo preview if a file is already selected
});