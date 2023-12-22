document.addEventListener('DOMContentLoaded', function () {
    function createPreviewDiv(id) {
        var previewDiv = document.createElement('div');
        previewDiv.id = id + '-preview';
        var inputElement = document.getElementById(id);

        if (inputElement) {
            inputElement.insertAdjacentElement('afterend', previewDiv);
        }
    }

    createPreviewDiv('id_video');
    createPreviewDiv('id_photo');

    function getYoutubeEmbedUrl(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length == 11) {
            return 'https://www.youtube.com/embed/' + match[2];
        } else {
            return null;
        }
    }

    document.getElementById('id_video').addEventListener('input', function () {
        var url = this.value;
        var embedUrl = getYoutubeEmbedUrl(url);
        var videoPreview = document.getElementById('id_video-preview');
        videoPreview.innerHTML = '';

        if (embedUrl) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('src', embedUrl);
            iframe.style.width = '100%';
            iframe.style.height = '450px';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', true);

            videoPreview.appendChild(iframe);
        }
    });

    document.getElementById('id_photo').addEventListener('input', function () {
        var photoInput = this;
        var photoPreview = document.getElementById('id_photo-preview');
        photoPreview.innerHTML = '';

        if (photoInput.files && photoInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement('img');
                img.setAttribute('src', e.target.result);
                img.style.width = '100%';
                img.style.height = 'auto';
                photoPreview.appendChild(img);
            };

            reader.readAsDataURL(photoInput.files[0]);
        }
    });
});
