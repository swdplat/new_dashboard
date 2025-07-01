// tooltip.js

function showTooltip(element, message) {
    if ($('.tooltip').length > 0) {
        $('.tooltip').remove();
    }
    const html = `
        <div class="tooltip" style="display:none; position: absolute;">
            <p>${message}</p>
        </div>
    `;
    $('body').append(html);
    const offset = $(element).offset();
    const tooltip = $('.tooltip');
    tooltip.css({
        top: offset.top + $(element).outerHeight() + 5,
        left: offset.left + ($(element).outerWidth() / 2) - (tooltip.outerWidth() / 2),
    });
    tooltip.fadeIn();
}

function hideTooltip() {
    $('.tooltip').fadeOut(function () {
        $(this).remove();
    });
}