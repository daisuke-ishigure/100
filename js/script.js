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
    $('#jsonSelector').append(
      `<option value="${poem.number}">第${poem.number}首:${poem.name}</option>`
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
      const torihuda = selectedData.torihuda;
      const first = selectedData.first;
      const second = selectedData.second;
      const name = selectedData.name;
      const theme = selectedData.theme;
      const translation = selectedData.translation;
      const bg = selectedData.background;
      const number = selectedData.number;
      const personality = selectedData.personality;

      // HTMLを更新
      $('.card-front').append(`
          <dl>
            <dt>${name}</dt>
            <dd>${first}<br>${second}</dd>
          </dl>
          <img src="../img/${number}.svg" alt="${name}">
        `);
      $('.card-back').append(`
      <dl>
      <dt>歌の意味</dt>
      <dd>${translation}</dd>
      </dl>
       `);
      $('.explanation').append(`
      <dl>
        <dt>補足説明</dt>
        <dd>${bg}</dd>
      </dl>
      <dl>
        <dt>歌人の人となり</dt>
        <dd>${personality}</dd>
      </dl>
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

$(function(){
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
$(function(){
  $('#back').on('click',function(event){
    event.stopPropagation();
  });
});
$(function(){
  $('#next').on('click',function(event){
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
  const optionToRemove = selector.querySelector(`option[value="${valueToRemove}"]`);
  // option要素が存在する場合に削除します
  if (optionToRemove) {
    selector.removeChild(optionToRemove);
  }
}


