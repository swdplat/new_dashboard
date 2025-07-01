// toast-message.js

function toastMessage (message) {
    if ($('.toast-message').length > 0) {
        $('.toast-message').remove();
    }
    const html = `
        <div class="toast-message" style="display:none;">
            <p>${message}</p>
        </div>
    `;
    $('body').append(html);
    $('.toast-message').fadeIn();
    setTimeout(function () {
        $('.toast-message').fadeOut(function () {
            $(this).remove();
        });
    }, 2000);
}