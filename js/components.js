$(document).ready(function(){

    // 日曆
    $('.calendar').each(function () {
        $(this).daterangepicker({
            timePicker: true,
            timePicker24Hour: true,
            autoUpdateInput: false,
            locale: {
                format: 'YYYY/MM/DD HH:mm',
                applyLabel: '確認',
                cancelLabel: '清除'
            }
        }, function(start, end) {
            // 更新當前元素的值
            $(this.element).val(start.format('YYYY/MM/DD HH:mm') + ' - ' + end.format('YYYY/MM/DD HH:mm'));
        });
    });

    // 開啟設定區間
    $(document).on('change', '.switch-calendar', function(){
        const field = $(this).closest('label').next('.switch-field').find('.calendar');
        let isChecked = $(this).is(':checked');
        if(isChecked){
            field.prop('disabled', false);
        }else{
            field.prop('disabled', true);
        }
    });

    // 開啟設定限制
    $(document).on('change', '.switch-limit', function () {
        const field = $(this).closest('label').next('.switch-field').find('input');
        let isChecked = $(this).is(':checked');
        if (isChecked) {
            field.prop('disabled', false);
        } else {
            field.prop('disabled', true);
        }
    });

    // 一個Checkbox可開啟多種input(dual-listbox、searchbar、select...等)功能
    // e.g. prize-event-卡號密碼-新增> 店家群組 Shop Type
    $(document).on('change', '.switch-limit', function () {
        const $wrap = $(this).closest('.listbox-wrap');
        const isChecked = $(this).is(':checked');
        // 控制 dual-listbox-container
        $wrap.find('.dual-listbox-container').toggleClass('disabled', !isChecked);
        $wrap.find('.dual-listbox-container input, .dual-listbox-container button').prop('disabled', !isChecked);
        // 控制 select
        $wrap.find('select').prop('disabled', !isChecked);
    });

    // 開啟區塊內容
    function updateToggleContainerInputs() {
        const isEnabled = $('.main-controlled .toggle-group:checked').val() === $('.main-controlled').attr('data-enabled-value');
    
        $('.toggle-container').each(function () {
            const $container = $(this);
            const customValue = $container.attr('data-custom-value');

            // 控制一般 controlled inputs（排除 dependent-inputs）
            $container.find('.controlled-inputs input')
                .not($container.find('.dependent-inputs input'))
                .prop('disabled', !isEnabled);
    
            // 控制 dependent-inputs，交由 toggle-option 的 radio 判斷
            const isCustomSelected = $container.find(".toggle-option-radio:checked").val() === customValue;
            $container.find('.dependent-inputs input').prop('disabled', !(isEnabled && isCustomSelected));
        });
    }
    
    // 初始化 + 綁定 toggle-container 本身的邏輯
    $(".toggle-container").each(function () {
        const $container = $(this);
        const customValue = $container.attr('data-custom-value');

        updateDependentInputs($container, customValue);
    });

    // 全域綁定 change 事件到所有 .toggle-option-radio
    $(document).on("change", ".toggle-option-radio", function () {
        const $radio = $(this);
        const $container = $radio.closest(".toggle-container");
        const customValue = $container.attr('data-custom-value');

        updateDependentInputs($container, customValue);
    });

    // 抽離出來的共用函式，根據條件控制 dependent input 的啟用狀態
    function updateDependentInputs($container, customValue) {
        const isCustomSelected = $container.find(".toggle-option-radio:checked").val() === customValue;
        const isMainEnabled = $('.main-controlled .toggle-group:checked').val() === $('.main-controlled').attr('data-enabled-value');

        $container.find(".dependent-inputs input").prop("disabled", !(isMainEnabled && isCustomSelected));
    }
    
    // 綁定 main-controlled 的控制邏輯
    $(document).on('change', '.main-controlled .toggle-group', function () {
        updateToggleContainerInputs();
    });
    
    // 初始化時執行一次
    updateToggleContainerInputs();

    // 切換radio內容開始 //
    // radio互斥與切換顯示
    function updateSections(selectedId) {
        const sections = {
            option1: $(".change1"),
            option2: $(".change2"),
            option3: $(".change3")
        };
        $.each(sections, function (id, $section) {
            if (id === selectedId) {
                $section.show();
            } else {
                $section.hide();
            }
        });
    }

    // 初始化：顯示預設選中的區塊
    const $defaultChecked = $(".radio-group .changeContext:checked");
    if ($defaultChecked.length) {
        updateSections($defaultChecked.attr("id"));
    }

    // 強制 radio-group 互斥與切換
    $(document).on('change', '.radio-group .changeContext', function() {
        var $group = $(this).closest('.radio-group');
        $group.find('.changeContext').not(this).prop('checked', false);
        updateSections($(this).attr("id"));
    });
    // 切換radio內容結束 //
    
    // Tab切換事件
    $(document).on('click', '.tabs-container .tabs li', function(){
        const index = $(this).index();
        const tabs = $(this).closest('.tabs');
        const tabsContainer = $(this).closest('.tabs-container');
        const contentDivs = tabsContainer.find('.content > div');
        tabs.find('li').removeClass('active');
        $(this).addClass('active');
        contentDivs.removeClass('active');
        contentDivs.eq(index).addClass('active');
    });

    // 新增Tab按鈕開始 //
    // 點擊新增Tab按鈕
    $(document).on('click', '.add-new-tab', function(e){
        e.preventDefault();
    });

    // 新增Tab事件
    $(document).on('click', '.add-new-tab', function () {
        const tabs = $(this).closest('.tabs-bar').find('.tabs');
        const tabsContent = $(this).closest('.tabs-container').find('.content');
        const newTabIndex = tabs.find('li').length + 1;

        tabs.append(`<li class="active">頁籤${newTabIndex}<span class="material-symbols-outlined fz-m">Cancel</span></li>`);
        tabsContent.append(`<div class="tab${newTabIndex}-content active"></div>`);

        // 移除其他的 active 狀態
        tabs.find('li').not(':last').removeClass('active');
        tabsContent.find('div').not(`.tab${newTabIndex}-content`).removeClass('active');

        $(document).trigger('tab-added', [newTabIndex]);

         //判斷是否有事件物件
         const hasToggleGroup = tabsContent.find('.toggle-container').length > 0;
        
         if (hasToggleGroup) {//刷新物件disabled狀態
             updateToggleContainerInputs();
         }
    });
    // 新增Tab按鈕結束 //


    // 刪除Tab事件
    $(document).on('click', '.tabs li span', function (event) {
        event.stopPropagation();

        const tab = $(this).closest('li');
        const tabs = tab.closest('.tabs');
        const tabsContainer = tabs.closest('.tabs-container');
        const tabsContent = tabsContainer.find('.content');
        const romovetabIndex = tab.index();
        const isActiveTab = tab.hasClass('active'); //判斷是否為當前選中的 tab

        const $activeTab = tabsContent.find('div.active');
        var zeroBasedTabIndex = $activeTab.index();


        const confirmDelete = confirm('您確定要刪除此標籤嗎？');
        if (!confirmDelete) return;

        if (tabs.find('li').length > 1) {
            // 移除 tab 和對應的內容 div
            tab.remove();
            tabsContent.children('div').eq(romovetabIndex).remove();

            tabsContent.children('div').each(function (i) {
                const isActive = $(this).hasClass('active');
                const newClass = `tab${i + 1}-content`;
                $(this).attr('class', newClass);
            });

            //如果刪除的是當前 active tab，才把第一個設為 active
            if (isActiveTab) {
                tabs.find('li').removeClass('active').eq(0).addClass('active');
                tabsContent.children('div').removeClass('active').eq(0).addClass('active');
            } else {
                if (zeroBasedTabIndex > romovetabIndex) {
                    zeroBasedTabIndex--;
                }
                tabsContent.children('div').removeClass('active').eq(zeroBasedTabIndex).addClass('active');
            }
            //刪除頁籤後自定義事件，ex:頁籤內容物件排序處理
            $(document).trigger('tab-removed');
        } else {
            alert('至少需要保留一個頁籤');
        }
    });
    
    // 點擊其他地方移除菜單項
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.add-new-tab').length) {
            $('.add-new-tab .options').removeClass('active');
        }
    });

    // 修改Tab名稱
    $(document).on('click', '.tabs-container .changeAction', function () {
        const $tabsContainer = $(this).closest('.tabs-container');
        const $activeContent = $tabsContainer.find('.content > div.active');
        const $input = $activeContent.find('input[type="text"]');
        const newTitle = $input.val().trim();

        if (newTitle === '') {
            alert('請輸入有效的頁籤名稱');
            return;
        }

        // 找到目前 active tab 的 index
        const activeIndex = $activeContent.index();
        const $activeTab = $tabsContainer.find('.tabs li').eq(activeIndex);

        // 保留關閉 icon
        const $closeIcon = $activeTab.find('span');
        $activeTab.html(`${newTitle}`).append($closeIcon);

        // 顯示 tooltip 提示
        // toastMessage('修改成功');
    });

    // 在上傳按鈕右側顯示上傳檔案名稱
    $(".a-upload input[type='file']").on("change", function () {
        var fileInput = $(this)[0];
        var filePath = fileInput.value;
        var fileName = filePath.split("\\").pop(); // 提取檔案名稱
        var allowedExtensions = /(\.txt)$/i; // 允許的檔案格式
    
        if (fileInput.files && fileInput.files.length > 0) {
            if (allowedExtensions.test(fileName)) {
                $(".fileerrorTip").hide();
                $(".showFileName").text(fileName);
            } else {
                $(".showFileName").text("");
                $(".fileerrorTip").text("檔案類型錯誤！僅支援 txt 格式").show();
            }
        } else {
            $(".showFileName").text("");
            $(".fileerrorTip").text("請選擇檔案！").show();
        }
    });

    // 新增輸入欄(會員資格代碼)
    $('.add-form-modal .add-new-input').on('click', function () {
        const $ul = $(this).siblings('ul');
        const newLi = $(`
            <li class="mar-txs">
                <input type="text" placeholder="請輸入" />
                <span class="material-symbols-outlined delete-btn">Delete</span>
            </li>
        `);
        $ul.append(newLi);
    });

    // 刪除單筆欄位（事件委派寫法）
    $('.add-form-modal ul').on('click', '.delete-btn', function () {
        $(this).closest('li').remove();
    });

    // tbody資料列表新增及刪除
    function initDynamicRowHandler(sectionSelector) {
        const $sections = $(sectionSelector); // ex: [data-section^="dynamic-"]

        $sections.each(function () {
            const $section = $(this);
            const $table = $section.closest('table');
            const $templateRow = $section.find('.data-row').first().clone(); // 每個 section 自己抓範本 row

            // 綁定「新增一筆資料」按鈕
            $section.on('click', '[data-add-button]', function () {
                const $newRow = $templateRow.clone();
                $newRow.find('input').val(''); // 清空 input 值
                $section.find('.add-button-row').before($newRow);
            });

            // // 綁定刪除一筆的按鈕
            // $section.on('click', '.btn-delete', function () {
            //     const $row = $(this).closest('tr');
            //     const $allRows = $section.find('.data-row');
            //     const hasDeleteAllButton = $table.find('.btn-delete-all').length > 0;

            //     if ($allRows.length === 1 && hasDeleteAllButton) {
            //         if (confirm('確定要刪除這筆資料嗎？')) {
            //             $table.remove();
            //         }
            //         return;
            //     }

            //     // if (!hasDeleteAllButton && $allRows.length <= 1) {
            //     //     toastMessage('至少需要保留一筆資料，無法刪除。');
            //     //     return;
            //     // }

            //     if (confirm('確定要刪除這筆資料嗎？')) {
            //         $row.remove();
            //     }
            // });
        });
    }

    // 初始化所有符合規則的區塊
    initDynamicRowHandler('[data-section^="dynamic-"]');

    // // 全域綁定「整批刪除」按鈕事件
    // $('table').on('click', '.btn-delete-all', function () {
    //     // 更精準地找出對應的 tbody（避免影響其他 table）
    //     const $table = $(this).closest('table');
    //     const $tbody = $table.find('tbody[data-section^="dynamic-"]').first();
    //     const $rows = $tbody.find('.data-row');

    //     if ($rows.length === 0) {
    //         toastMessage('已經沒有資料可刪除。');
    //         return;
    //     }

    //     if ($rows.length === 1) {
    //         if (confirm('確定要刪除這筆資料嗎？')) {
    //             $table.remove();
    //         }
    //         return;
    //     }
    
    //     if (confirm('確定要刪除整批資料嗎？')) {
    //         $table.remove();
    //     }
    // });

});



