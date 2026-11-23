
// 最終課題：肩幅調整ゲーム

let playerX;
let playerY;
let shoulderWidth = 0;

let itemSize = 30;
let items = [];


let startTime;
let gameOver = false;
let gameStarted = false;
let officialLink;


// 最初に一度だけ実行する
function setup() {
  officialLink = createA(
    "https://jr-official.starto.jp/s/jr/persons/33?ima=1534",
    "公式サイトはこちら",
    "_blank"
  );
  officialLink.hide();

  console.log("setup開始！");
  createCanvas(windowWidth, windowHeight);

  playerX = windowWidth / 2;
  playerY = height - 120;

  startTime = millis();
}


// 毎フレーム実行する
function draw() {
  background(80, 130, 220);

  if (!gameStarted) {
    drawStartScreen();
  }
  else if (!gameOver) {

    // プレイヤーを動かす
    movePlayer();

    // 60フレームごとにアイテムを追加
    if (frameCount % 60 === 0) {
      createItems();
    }

    // アイテムを動かす・取得判定
    moveItems();

    // プレイヤーを描く
    drawPlayer();

    // アイテムを描く
    drawItems();

    // 肩幅と残り時間を表示
    drawInformation();

    // 制限時間を確認
    let remainingTime = 30 - (millis() - startTime) / 1000;

    if (remainingTime <= 0) {
      gameOver = true;
    }

  } else {

    // ゲーム終了後は結果画面
    drawResult();


  }
}

function drawStartScreen() {
  fill(255);
  textAlign(CENTER);

  textSize(45);
  text("肩幅育成ゲーム", width / 2, height / 3);

  drawOnigiri(width / 2 + 300, height / 3);
  drawOnigiri(width / 2 - 300, height / 3);

  textSize(22);
  text("\n目指せ！理想の肩幅！\n障害物を避けながらおにぎりを食べて肩幅を広くしよう！", width / 2, height / 2 - 50);

  textSize(18);
  text("矢印キー：移動", width / 2, height / 2 + 60);
  text("SHIFT：ダッシュ", width / 2, height / 2 + 90);

  // スタートボタン
  fill(255, 200, 50);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 170, 220, 60, 15);

  fill(0);
  textSize(22);
  text("START", width / 2, height / 2 + 178);

  rectMode(CORNER);
}

// プレイヤーの移動
function movePlayer() {

  let speed = 5;

  if (keyIsDown(SHIFT)) {
    speed = 8;
  }

  if (keyIsDown(LEFT_ARROW)) {
    playerX -= speed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    playerX += speed;
  }


  if (keyIsDown(UP_ARROW)) {
    playerY -= speed;
  }


  if (keyIsDown(DOWN_ARROW)) {
    playerY += speed;
  }

  // 画面の外に出ないようにする
  playerX = constrain(playerX, 30, width - 30);
  playerY = constrain(playerY, 80, height - 60);
}


// アイテムを複数追加する
function createItems() {

  // 2〜6個のアイテムを作る
  let itemCount = floor(random(2, 7));

  for (let i = 0; i < itemCount; i++) {

    let item = {
      x: random(30, width - 30),
      y: random(-150, -30),
      type: random(["up", "down"]),
      speed: random(2, 5)
    };

    items.push(item);
  }
}


// アイテムを動かす・取得判定
function moveItems() {

  for (let i = items.length - 1; i >= 0; i--) {

    let item = items[i];

    // アイテムを下に動かす
    item.y += item.speed;

    // プレイヤーとアイテムが接触したか判定
    if (dist(playerX, playerY, item.x, item.y) < 50) {

      // upを取ると肩幅が5増える
      if (item.type === "up") {
        shoulderWidth += 5;

        // downを取ると肩幅が10減る
      } else if (item.type === "down") {
        shoulderWidth -= 10;
      }

      // 肩幅を0〜150に制限
      shoulderWidth = constrain(shoulderWidth, 0, 150);

      // 取ったアイテムを削除
      items.splice(i, 1);

    } else if (item.y > height + itemSize) {

      // 画面の下に出たアイテムを削除
      items.splice(i, 1);

    }
  }
}


// プレイヤーを描く
function drawPlayer() {

  // 頭
  fill(255, 220, 180);
  noStroke();
  ellipse(playerX, playerY - 58, 35, 35);

  // 体
  fill(230, 240, 255);
  rectMode(CENTER);
  rect(playerX, playerY, 20 + shoulderWidth, 75, 10);


  rectMode(CORNER);
  noStroke();
}


// アイテムを描く
function drawItems() {

  for (let item of items) {

    // up：おにぎり
    if (item.type === "up") {

      drawOnigiri(item.x, item.y);

      // down：ピンクの円
    } else if (item.type === "down") {

      fill(255, 100, 180);
      noStroke();
      ellipse(item.x, item.y, itemSize);

    }
  }
}

// おにぎりを描く
function drawOnigiri(x, y) {

  // ごはん：白い三角形
  fill(255);
  noStroke();

  ellipse(x, y - 9, 30, 30);       // 上
  ellipse(x - 10, y + 5, 30, 30);  // 左下
  ellipse(x + 10, y + 5, 30, 30);  // 右下
  ellipse(x, y, 40, 40);

  // 海苔：黒い四角形
  fill(20);
  noStroke();

  rectMode(CENTER);
  rect(x, y + 10, 17, 23);

  rectMode(CORNER);
}


// 肩幅と残り時間を表示
function drawInformation() {

  fill(30);
  noStroke();
  textSize(24);
  textAlign(LEFT);

  // 肩幅
  text("肩幅：" + shoulderWidth, 20, 35);

  // 残り時間
  let remainingTime = max(
    0,
    30 - floor((millis() - startTime) / 1000)
  );

  text("残り時間：" + remainingTime + "秒", 20, 70);
}


// ランク判定
function getRank() {

  if (shoulderWidth >= 100) {
    return "S";

  } else if (shoulderWidth >= 57) {
    return "A";

  } else if (shoulderWidth >= 50) {
    return "B";

  } else if (shoulderWidth >= 45) {
    return "C";

  } else if (shoulderWidth >= 40) {
    return "D";

  } else {
    return "E";
  }
}

// 肩幅判定
function getshoulder() {

  if (shoulderWidth >= 100) {
    return "大谷翔平";

  } else if (shoulderWidth >= 57) {
    return "岩﨑大昇";

  } else if (shoulderWidth >= 50) {
    return "佐々木大光";

  } else if (shoulderWidth >= 45) {
    return "猪狩蒼弥";

  } else if (shoulderWidth >= 40) {
    return "中村嶺亜";

  } else {
    return "井上瑞稀";
  }
}


// 結果画面
function drawResult() {

  background(230, 240, 255);

  fill(30);
  noStroke();
  textAlign(CENTER);



  textSize(28);
  text(
    "最終的な肩幅：" + shoulderWidth,
    width / 2,
    height / 3
  );

  textSize(60);
  text(
    "ランク：" + getRank(),
    width / 2,
    height / 2 - 40
  );

  textSize(40)
  text(
    "あなたの肩幅、" + getshoulder() + "級！",
    width / 2,
    height / 2 + 30
  )

  textSize(20);
  text(
    "おつかれさまでした！",
    width / 2,
    height / 2 + 100
  );

  if (shoulderWidth < 100) {
    fill(30);
    textSize(20);
    textAlign(CENTER);

    text(
      getshoulder() +
      "は2026年12月9日にCDデビューするアイドルグループ、KEY TO LITの" +
      "\nメンバーである。ちなみにKEY TO LITの岩﨑大昇は肩幅が57cmあることで知られている。",
      width / 2,
      height / 2 + 250
    );
  }

  if (shoulderWidth >= 100) {
    fill(30);
    textSize(20);
    textAlign(CENTER);

    text("\nメジャーリーガー級の肩幅！おめでとうございます！" +
      "\nちなみに2026年12月9日にCDデビューするアイドルグループ、KEY TO LITの" +
      "\nメンバーである岩﨑大昇は肩幅が57cmあることで知られている。",
      width / 2,
      height / 2 + 240)
  }

  officialLink.show();
  officialLink.position(width / 2 - 80, height / 2 + 320);
  officialLink.style("font-size", "20px");
  officialLink.style("color", "blue");

  // もう一度プレイボタン
  fill(100, 180, 255);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 180, 200, 60, 10);

  fill(255);
  textSize(20);
  text("もう一度プレイ", width / 2, height / 2 + 185);

  rectMode(CORNER);
  return;
}


function mousePressed() {

  // スタート画面
  if (!gameStarted) {

    if (
      mouseX > width / 2 - 110 &&
      mouseX < width / 2 + 110 &&
      mouseY > height / 2 + 140 &&
      mouseY < height / 2 + 200
    ) {

      gameStarted = true;
      startTime = millis();

    }
  }

  // 結果画面
  else if (gameOver) {

    if (
      mouseX > width / 2 - 100 &&
      mouseX < width / 2 + 100 &&
      mouseY > height / 2 + 150 &&
      mouseY < height / 2 + 210
    ) {

      restartGame();

    }
  }
}

function restartGame() {
  playerX = width / 2;
  playerY = height - 120;

  shoulderWidth = 0;
  items = [];

  startTime = millis();
  gameOver = false;
  gameStarted = true;

  officialLink.hide();

}

// ウィンドウサイズが変わったとき
function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  playerX = constrain(playerX, 30, width - 30);
}

