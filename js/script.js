'use strict';
$();

const jsonAddress = "../js/hyakunin.json";

// JSONデータを格納する変数を初期化する
let poems = [];

// 変数selectedThemを作成
let selectedTheme = "";

// テーマが変更されたら、設定値をselectedThemeに格納する
$('#themeSelector').on('change', function () {
  selectedTheme = $(this).val();
  console.log(selectedTheme);
  // テーマによって、歌人をソートする
  updateJsonSelectorOptions();
});


// JSONデータを取得する
fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    poems = data;

  })
  .catch((error) => {
    console.error('データの取得に失敗!:', error);
  });

// 選択されたテーマの歌人を抽出する
function getThemePoems() {
  let themePoems = [];
  for (let key in poems) {
    if (poems[key].theme === selectedTheme) {
      themePoems.push(poems[key]);
    } else if (selectedTheme === "all") {
      themePoems.push(poems[key]);
    }
  }
  return themePoems;
}

// 選択されたテーマの歌人を抽出する
function updateJsonSelectorOptions() {
  let themePoems = getThemePoems();
  $('#jsonSelector').html(
    '<option value="all">歌人を選んでください</option>'
  );
  themePoems.forEach(function (poem) {
    let strippedName = poem.name.replace(/<rt>.*?<\/rt>/g, '');/* rt要素を削除する */
    $('#jsonSelector').append(
      `<option value="${poem.number}">第${poem.number}首:${strippedName}</option>`
    );
  });
}

$(function () {
  $('.card-item').on('click', function (event) {
    $(this).toggleClass('active');
    event.stopPropagation();
  })
})



jsonSelector.addEventListener("change", () => {
  const selectedDataSet = jsonSelector.value;

  //札を表に返す
  if ($('.card-item').hasClass('active')) {
    $('.card-item').removeClass('active');
  }

  //表に要素があれば削除する
  if ($('.card-front').children().length > 0) {/* '.card-front' 要素に子要素がある場合 */
    $('.card-front').empty(); /* '.card-front' 要素の子要素をすべて削除 */
  }
  //表の写真に要素があれば削除する
  if ($('.photo').children().length > 0) {
    $('.photo').empty(); // photoの子要素をすべて削除する
  }
  //  //裏に要素があれば削除する
  if ($('.card-back').children().length > 0) {
    // containerBackに子要素があれば
    $('.card-back').empty(); // containerBackの子要素をすべて削除する
  }
  if ($('.explanation').children().length > 0) {
    // containerBackに子要素があれば
    $('.explanation').empty(); // containerBackの子要素をすべて削除する
  }



  fetch(jsonAddress)
    .then((response) => response.json())
    .then((data) => {/* jsonデータを取り込んだときの動作ここから */
      const selectedData = data[selectedDataSet];
      const yomihuda = selectedData.yomihuda;
      const first = selectedData.first;
      const second = selectedData.second;
      const name = selectedData.name;
      const nameKana = selectedData.nameKana;
      const theme = selectedData.theme;
      const translation = selectedData.translation;
      const bg = selectedData.background;
      const number = selectedData.number;
      const personality = selectedData.personality;

      // HTMLを更新
      $('.card-front').append(`
      <dl>
        <dt id="poemName">${name}</dt>
        <dd id="poemContent">${first}<br>${second}</dd>
      </dl>
      <img src="../img/${number}.svg" alt="${name}">
      `);

// ---------------------------------------------------
// ひらがなトグルボタンについて
// ---------------------------------------------------

const checkbox = document.getElementById('toggle');
  let startX;

  checkbox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  checkbox.addEventListener('touchmove', (e) => {
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    if (deltaX > 10) {
      // Swiped to the right, toggle checkbox to checked
      checkbox.checked = true;
      updatePoemContent();
      updateNameContent();
    } else if (deltaX < -10) {
      // Swiped to the left, toggle checkbox to unchecked
      checkbox.checked = false;
      updatePoemContent();
      updateNameContent();
    }
  });



// スマホのチェックボックスのスワイプ対応ここまで


      // チェックボックスの変更時にコンテンツを即座に更新
      $('#toggle').on('change', function () {
        updatePoemContent();
        updateNameContent();
      });

      // 初回読み込み時にも更新
      updatePoemContent();
      updateNameContent();

      // 選択されたデータを表示する関数
      function updatePoemContent() {
        const poemContent = $('#toggle').is(':checked') ? yomihuda : `${first}<br>${second}`;
        /* ?はif elseの意味 */
        $('#poemContent').html(poemContent);
      }

      function updateNameContent() {
        const poemName = $('#toggle').is(':checked') ? nameKana : `${name}`;
        /* ?はif elseの意味 */
        $('#poemName').html(poemName);
      }

      $('.card-back').append(`
      <dl>
      <dt>歌の意味</dt>
      <dd>${translation}</dd>
      </dl>
       `);
      $('.explanation').append(`
      <dl>
        <dt>歌について</dt>
        <dd>${bg}</dd>
      </dl>
      <dl>
        <dt>歌人の人となり</dt>
        <dd>${personality}</dd>
      </dl>
      `)
      $('#sp_menu').append(`
        <table>
      `)
    })/* jsonデータを取り込んだときの動作ここまで */

    .catch((error) => console.error("Error fetching JSON:", error));
});

let currentPoemIndex = 0;
// Function to display the poem with a given index
function displayPoem(index) {
  // ... (display code remains the same)
  currentPoemIndex = index; // Update the current poem index
}

////////////////////////////////////////////////////////////
//次へボタンの実装
$(function () {
  $('#next').on('click', function (event) {
    const selectMenu = document.getElementById("jsonSelector");
    // 現在の選択肢を取得する
    let currentOptionIndex = selectMenu.selectedIndex;
    // 次の選択肢のインデックスを計算する
    let nextOptionIndex = currentOptionIndex + 1;
    // もし次の選択肢が存在しない場合、最初の選択肢を選択する
    if (nextOptionIndex >= selectMenu.options.length) {
      nextOptionIndex = 0;
    }
    // セレクトメニューを次の選択肢に設定する
    selectMenu.selectedIndex = nextOptionIndex;
    const changeEvent = new Event('change');
    selectMenu.dispatchEvent(changeEvent);
    //「歌人を選んでください」のoption要素を削除する
    removeOptionByValue(jsonSelector, "all");
    event.stopPropagation();
  });
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//前へボタンの実装

$(function () {
  $('#back').on('click', function (event) {
    //「歌人を選んでください」のoption要素を削除する
    removeOptionByValue(jsonSelector, "all");
    // セレクトメニュー要素を取得します
    const selectMenu = document.getElementById("jsonSelector");
    // 現在の選択肢を取得します
    let currentOptionIndex = selectMenu.selectedIndex;
    // 前の選択肢のインデックスを計算します
    let previousOptionIndex = currentOptionIndex - 1;
    // もし前の選択肢が存在しない場合、最後の選択肢を選択します
    if (previousOptionIndex < 0) {
      previousOptionIndex = selectMenu.options.length - 1;
    }
    // セレクトメニューを前の選択肢に設定します
    selectMenu.selectedIndex = previousOptionIndex;
    const changeEvent = new Event('change');
    selectMenu.dispatchEvent(changeEvent);
    event.stopPropagation();
  });
});

/* 前へボタン、戻るボタンの誤動作を防止するため、
ダブルクリックの親要素への伝播をstopさせる */
$(function () {
  $('#back').on('click', function (event) {
    event.stopPropagation();
  });
});
$(function () {
  $('#next').on('click', function (event) {
    event.stopPropagation();
  });
});
/* 親要素への伝播をstopさせる　ここまで */




fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    poems = data;
    // JSONデータが取得されたら、ここに実行したいコードを記述します
    // 例：JSONデータがdata変数に格納されているので、これを使用して処理を行う
    console.log(data);

    // ここで実行したい処理を記述します
    // 例：テーマセレクターを更新する関数を呼び出す
    updateJsonSelectorOptions();

    // themeSelectorの値を設定します
    const desiredTheme = "all";
    themeSelector.value = desiredTheme;

    // 'change'イベントを新しく作成します
    const changeEvent = new Event('change');

    // themeSelector上で'change'イベントを発生させます
    themeSelector.dispatchEvent(changeEvent);
  })
  .catch((error) => {
    console.error('データの取得に失敗!:', error);
  });


////////////////////////////////////////////////////////////
// option要素「歌人を選んでください」を削除する関数
////////////////////////////////////////////////////////////
function removeOptionByValue(selector, valueToRemove) {
  // selectorから指定した値のoption要素を取得します
  const optionToRemove = selector.querySelector(`option[value = "${valueToRemove}"]`);
  // option要素が存在する場合に削除します
  if (optionToRemove) {
    selector.removeChild(optionToRemove);
  }
}

////////////////////////////////////////////////////////////
// 見出しをクリックしてリロード
////////////////////////////////////////////////////////////
$('h1').on('click', function () {
  location.reload();
});

////////////////////////////////////////////////////////////
// ハンバーガーメニュー
////////////////////////////////////////////////////////////
$('#burger').on('click', function () {
  $(this).toggleClass('active');
  $('#sp-menu').toggleClass('drawer');
});

$('#close').on('click', function () {
  $('#burger').removeClass('active');
  $('#sp-menu').toggleClass('drawer');
  clearSearch();
})
////////////////////////////////////////////////////////////
// sp-menu
////////////////////////////////////////////////////////////

// JSONデータを取得し、テーブルを生成する関数
fetch(jsonAddress)
  .then((response) => response.json())
  .then((data) => {
    // テーブル要素を作成
    let table = document.createElement('table');
    // table.id = 'myTable'; // テーブルのIDを設定


    // テーブルの各行を生成
    for (let key in data) {
      let poem = data[key];
      // tr要素を生成
      let tr = document.createElement('tr');

      // number, first, nameの情報をセルに追加
      let numberTd = document.createElement('td');
      numberTd.textContent = poem.number;
      tr.appendChild(numberTd);

      let wakaTd = document.createElement('td');
      wakaTd.innerHTML = poem.first.replace(/<br\s*\/?>/g, " ") + '<br>' + poem.second.replace(/<br\s*\/?>/g, " ") + '<span class="small">' + poem.name + '（' + poem.date + '）' + '</span>';
      tr.appendChild(wakaTd);

      let kanaTd = document.createElement('td');
      kanaTd.innerHTML = poem.yomihuda.replace(/<rt>.*?<\/rt>/g, '');/* rt要素を削除する */;
      tr.appendChild(kanaTd);

      // tr要素をテーブルに追加
      table.appendChild(tr);
    }

    // 生成したtable要素をHTMLの要素（idが'dbTable'の要素）に追加する
    document.getElementById('table').appendChild(table);
  })
  .catch((error) => console.error("Error fetching JSON:", error));


////////////////////////////////////////////////////////////
// 検索機能
////////////////////////////////////////////////////////////
let searchInput = document.getElementById('searchInput');
let tableRows;

searchInput.addEventListener('keyup', () => {
  if (table && !tableRows) {
    tableRows = table.getElementsByTagName('tr');
  }

  let searchValue = searchInput.value.toLowerCase();
  for (let i = 0; i < tableRows.length; i++) {
    let rowText = tableRows[i].textContent.toLowerCase();
    if (rowText.includes(searchValue)) {
      tableRows[i].style.display = '';
    } else {
      tableRows[i].style.display = 'none';
    }
  }
});

// 検索を初期化する(番号をクリックして、sp-menuを閉じるときに使う）
function clearSearch() {
  // tableRowsが未定義の場合は何もせず関数を終了する
  if (!tableRows) {
    return;
  }

  // 検索欄の値を空にする
  searchInput.value = '';

  // テーブルの全ての行を表示する
  for (let i = 0; i < tableRows.length; i++) {
    tableRows[i].style.display = '';
  }
}



////////////////////////////////////////////////////////////
// 番号をクリックしたときのリンク処理
////////////////////////////////////////////////////////////
document.addEventListener('click', function (event) {
  if (event.target.tagName === 'TD' && event.target.parentNode.firstChild === event.target) {
    let linkNumber = parseInt(event.target.textContent.trim());
    console.log('クリックされた数字:', linkNumber);
    themeSelector.value = 'all';
    themeSelector.dispatchEvent(new Event('change'));
    jsonSelector.value = linkNumber;
    jsonSelector.dispatchEvent(new Event('change'));
    $('#sp-menu').removeClass('drawer');
    $('#burger').removeClass('active');
    $('body, html').animate({ scrollTop: 0 }, 500);
    clearSearch();
  }
});



////////////////////////////////////////////////////////////
// トップに戻る
////////////////////////////////////////////////////////////
$(function () {
  var pagetop = $('#page-top');
  pagetop.hide();
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      pagetop.fadeIn();
    } else {
      pagetop.fadeOut();
    }
  });
  pagetop.click(function () {
    $('body, html').animate({ scrollTop: 0 }, 500);
    return false;
  });
});