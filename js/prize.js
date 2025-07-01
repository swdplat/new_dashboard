// prize
$(document).ready(function () {
    // 通用的按鈕點擊事件處理
    $('.btn-select').on('click', function () {
        const targetClass = $(this).data('target'); // 取得 data-target 的值
        const targetContainer = $(this).closest('tr').nextAll(`.${targetClass}`).first(); // 找到對應的 child-container
        const icon = $(this).find('.material-symbols-outlined'); // 找到按鈕內的圖示

        // 如果點擊的按鈕已經開啟對應的 child-container
        if (targetContainer.is(':visible')) {
            targetContainer.hide(); // 隱藏對應的 child-container
            icon.text('keyboard_arrow_down'); // 將圖示改為向下箭頭
            $(this).removeClass('active'); // 移除 active class
        } else {
            $('.child-container').hide();// 隱藏所有的 child-container 並重置所有按鈕的圖示
            $('.btn-select .material-symbols-outlined').text('keyboard_arrow_down');// 重置所有按鈕的圖示
            $('.btn-select').removeClass('active'); // 移除所有按鈕的 active class

            targetContainer.show(); // 顯示對應的 child-container
            // icon.text('keyboard_arrow_up'); // 將圖示改為向上箭頭 
            // 不需以上這行，因為已有css會將icon旋轉180度
            // .btn-select.active i {transform: rotate(180deg);
            $(this).addClass('active'); // 加上 active class
        }
    });
});