const jsonSelector = document.getElementById("jsonSelector");
const containerFront = document.getElementById("containerFront");
const containerBack = document.getElementById("containerBack");
const kaisetsu  = document.getElementById("kaisetsu");
const photo = document.getElementById("photo");
const commentary = document.getElementById("commentary");
const flipBtn = document.getElementById("flipCard");
const next = document.getElementById('next');
const back = document.getElementById('back');

////////////////////////////////////////////////////////
// テーマを選んで歌を抽出する
const themeSelector = document.getElementById("themeSelector");
// JSONデータを格納する変数
let poems = [];

// 選択されたテーマをselectedThemに格納する
let selectedTheme = "";

// 季節が変更された際のイベントリスナーを追加
themeSelector.addEventListener('change', () => {
  selectedTheme = themeSelector.value;
  console.log(selectedTheme);

  // 選択された季節に基づいてJSONセレクターのオプションを更新
  updateJsonSelectorOptions();
});

// JSONデータを取得するfetch部分
fetch("https://daisuke-ishigure.github.io/100/js/hyakunin.json")
  .then((response) => response.json())
  .then((data) => {
    poems = data;
    // JSONデータが取得されたら、最初のオプションをセットアップ
    // jsonSelector.innerHTML = '<option value="">（2）歌人を選んでください</option>';
  })
  .catch((error) => {
    console.error('データの取得に失敗!:', error);
  });


// 選択されたテーマの歌を抽出する
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

// 選択されたテーマに基づいてJSONセレクターを更新する
function updateJsonSelectorOptions() {
  let themePoems = getThemePoems();
  jsonSelector.innerHTML = '<option value="all">歌人を選んでください</option>';
  themePoems.forEach(function(poem) {
    jsonSelector.innerHTML += `<option value="${poem.number}">第${poem.number}首：${poem.name}</option>`;
  });
}

////////////////////////////////////////////////////////

//クリックしたらフリップする

flipBtn.addEventListener("click", () => {
  if (flipBtn.classList.contains("flip")) {
    flipBtn.classList.remove("flip");
  } else {
    flipBtn.classList.add("flip");
  }
  
});

jsonSelector.addEventListener("change", () => {
  const selectedDataSet = jsonSelector.value;

  //札を表に返す
  if (flipBtn.classList.contains("flip")) {
    flipBtn.classList.remove("flip");
  }

  //表に要素があれば削除する
  if (containerFront.hasChildNodes()) {
    //containerに子要素があれば
    while (containerFront.firstChild) {
      //子要素が存在するかぎり
      containerFront.removeChild(containerFront.firstChild); //最初の子要素を削除する
    }
  }
  //前の写真を削除する
  if (photo.hasChildNodes()) {
    //photoに子要素があれば
    while (photo.firstChild) {
      //子要素が存在するかぎり
      photo.removeChild(photo.firstChild); //最初の子要素を削除する
    }
  }

  //  //裏に要素があれば削除する
   if (containerBack.hasChildNodes()) {
    //containerBackに子要素があれば
    while (containerBack.firstChild) {
      //子要素が存在するかぎり
      containerBack.removeChild(containerBack.firstChild); //最初の子要素を削除する
    }
  }



  //前の現代語訳を削除する
  if (kaisetsu.hasChildNodes()) {
    while (kaisetsu.firstChild) {
      kaisetsu.removeChild(kaisetsu.firstChild);
    }
  }

  fetch("https://daisuke-ishigure.github.io/100/js/hyakunin.json")
    .then((response) => response.json())
    .then((data) => {
      const selectedData = data[selectedDataSet];
      const torihuda = selectedData.torihuda;
      const first = selectedData.first;
      const second = selectedData.second;
      const name = selectedData.name;
      const theme = selectedData.theme;
      const ct = selectedData.comment;
      const number = selectedData.number;
      console.log(first);

      // HTMLを更新
      containerFront.innerHTML = `
      <p id="kaminoku">${first}<br>${second}</p>
       `;

      containerBack.innerHTML = `
      <p>${ct}</p>
       `;

      const portrait = selectedData.portrait;
      const img = document.createElement("img");
      img.src = `https://daisuke-ishigure.github.io/100/img/${number}.svg`;
      photo.appendChild(img);
    })

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
next.addEventListener('click', () => {
  // セレクトメニュー要素を取得します
const selectMenu = document.getElementById("jsonSelector");
// 現在の選択肢を取得します
let currentOptionIndex = selectMenu.selectedIndex;
// 次の選択肢のインデックスを計算します
let nextOptionIndex = currentOptionIndex + 1;
// もし次の選択肢が存在しない場合、最初の選択肢を選択します
if (nextOptionIndex >= selectMenu.options.length) {
    nextOptionIndex = 0;
}
// セレクトメニューを次の選択肢に設定します
selectMenu.selectedIndex = nextOptionIndex;
const changeEvent = new Event('change');
selectMenu.dispatchEvent(changeEvent);
    //「歌人を選んでください」のoption要素を削除する
    removeOptionByValue(jsonSelector, "all");

});
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//前へボタンの実装
back.addEventListener('click', () => {
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
});


//////////////////////////////////////////////////////////////////
//スマホでスワイプしたときの動作
////////////////////////////////////////////////////////////////// 

let touchStartX = null; // スワイプ開始位置を格納する変数
let touchEndX = null;   // スワイプ終了位置を格納する変数

// タッチ開始時の処理
containerFront.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

// タッチ終了時の処理
containerFront.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;

  // スワイプの方向を判断
  if (touchStartX - touchEndX > 50) {
    // 左にスワイプした場合、次の歌を表示する
    next.click(); // 次へボタンをクリックしたことと同じ処理
  } else if (touchEndX - touchStartX > 50) {
    // 右にスワイプした場合、前の歌を表示する
    back.click(); // 前へボタンをクリックしたことと同じ処理
  }
});

//スワイプ動作
//----------------------------ここまで----------------------------

// JSONデータを取得するfetch部分
fetch("https://daisuke-ishigure.github.io/100/js/hyakunin.json")
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