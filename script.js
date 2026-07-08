// -----------------------------
// HTML取得
// -----------------------------

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const board = document.getElementById("board");

const singleBtn = document.getElementById("singleBtn");
const multiBtn = document.getElementById("multiBtn");

const retryBtn = document.getElementById("retryBtn");
const homeBtn = document.getElementById("homeBtn");

const turnText = document.getElementById("turnText");

const player1ScoreText = document.getElementById("player1Score");
const player2ScoreText = document.getElementById("player2Score");

const winnerText = document.getElementById("winnerText");


// -----------------------------
// ゲーム情報
// -----------------------------

let gameMode = "single";

let cards = [];

let openedCards = [];

let matchedCount = 0;

let player1Score = 0;

let player2Score = 0;

let currentPlayer = 1;

let lockBoard = false;


// -----------------------------
// CPU記憶用
// -----------------------------

let cpuMemory = [];


// -----------------------------
// カード画像
// -----------------------------

const cardImages = [

    "card1.png",
    "card2.png",
    "card3.png"

];


// -----------------------------
// スタートボタン
// -----------------------------

singleBtn.addEventListener("click", () => {

    gameMode = "single";

    startGame();

});

multiBtn.addEventListener("click", () => {

    gameMode = "multi";

    startGame();

});


// -----------------------------
// ゲーム開始
// -----------------------------

function startGame(){

    startScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    player1Score = 0;

    player2Score = 0;

    matchedCount = 0;

    currentPlayer = 1;

    openedCards = [];

    cpuMemory = [];

    updateScore();

    createCards();

}


// -----------------------------
// スコア表示
// -----------------------------

function updateScore(){

    if(gameMode === "single"){

        player1ScoreText.textContent =
            "あなた：" + player1Score + "組";

        player2ScoreText.textContent =
            "CPU：" + player2Score + "組";

    }else{

        player1ScoreText.textContent =
            "プレイヤー1：" + player1Score + "組";

        player2ScoreText.textContent =
            "プレイヤー2：" + player2Score + "組";

    }

    updateTurnText();

}


// -----------------------------
// 手番表示
// -----------------------------

function updateTurnText(){

    if(gameMode === "single"){

        turnText.textContent =
            currentPlayer === 1
            ? "あなたの番"
            : "CPUの番";

    }else{

        turnText.textContent =
            currentPlayer === 1
            ? "プレイヤー1の番"
            : "プレイヤー2の番";

    }

}


// -----------------------------
// カード生成
// -----------------------------

function createCards(){

    board.innerHTML = "";

    cards = [];

    const list = [

        {
            id:1,
            image:cardImages[0]
        },

        {
            id:1,
            image:cardImages[0]
        },

        {
            id:2,
            image:cardImages[1]
        },

        {
            id:2,
            image:cardImages[1]
        },

        {
            id:3,
            image:cardImages[2]
        },

        {
            id:3,
            image:cardImages[2]
        }

    ];

    shuffle(list);

    list.forEach((data,index)=>{

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.index = index;

        card.dataset.id = data.id;

        card.dataset.image = data.image;

        card.dataset.open = "false";

        card.dataset.match = "false";

        const back = document.createElement("div");
back.className = "card-back";

const backImg = document.createElement("img");
backImg.src = "back.png";
back.appendChild(backImg);

const front = document.createElement("div");
front.className = "card-front";

const frontImg = document.createElement("img");
frontImg.src = data.image;
front.appendChild(frontImg);

card.appendChild(back);
card.appendChild(front);

        card.addEventListener("click",()=>{

            cardClick(card);

        });

        board.appendChild(card);

        cards.push(card);

    });

}


// -----------------------------
// シャッフル
// -----------------------------

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}
// =============================
// カードをめくる・ペア判定・ターン切替
// =============================


// -----------------------------
// カードクリック
// -----------------------------
function cardClick(card){

    if(lockBoard) return;

    if(currentPlayer === 2 && gameMode === "single") return;

    if(card.dataset.open === "true") return;

    if(card.dataset.match === "true") return;

    openCard(card);

}


// -----------------------------
// カードをめくる
// -----------------------------
function openCard(card){

    card.dataset.open = "true";

    function openCard(card){

    card.dataset.open = "true";

    card.classList.add("flipped");

    openedCards.push(card);

    rememberCard(card);

    if(openedCards.length===2){

        lockBoard=true;

        setTimeout(checkPair,800);

    }

}
    openedCards.push(card);

    // CPUは見たカードを記憶
    rememberCard(card);

    if(openedCards.length === 2){

        lockBoard = true;

        setTimeout(checkPair,800);

    }

}


// -----------------------------
// ペア判定
// -----------------------------
function checkPair(){

    const card1 = openedCards[0];
    const card2 = openedCards[1];

    // ペア成立
    if(card1.dataset.id === card2.dataset.id){

        card1.dataset.match = "true";
        card2.dataset.match = "true";

        card1.classList.add("matched");
        card2.classList.add("matched");

        matchedCount++;

        if(currentPlayer === 1){

            player1Score++;

        }else{

            player2Score++;

        }

        updateScore();

        openedCards = [];

        lockBoard = false;

        // 全部揃った？
        if(matchedCount === 3){

            setTimeout(endGame,600);
            return;

        }

        // CPUなら続ける
        if(gameMode === "single" && currentPlayer === 2){

            setTimeout(cpuTurn,800);

        }

        return;

    }

    // 不一致
    setTimeout(()=>{

        closeCard(card1);

        closeCard(card2);

        openedCards = [];

        changeTurn();

        lockBoard = false;

    },500);

}


// -----------------------------
// カードを閉じる
// -----------------------------
function closeCard(card){

    card.dataset.open="false";

    card.classList.remove("flipped");

}

// -----------------------------
// ターン交代
// -----------------------------
function changeTurn(){

    if(currentPlayer === 1){

        currentPlayer = 2;

    }else{

        currentPlayer = 1;

    }

    updateTurnText();

    // CPU開始
    if(gameMode === "single" && currentPlayer === 2){

        setTimeout(cpuTurn,1000);

    }

}
// =============================
// 簡易CPU・ゲーム終了
// =============================

// -----------------------------
// CPU記憶（今回は何もしない）
// -----------------------------
function rememberCard(card){

    // 後でAIを実装予定

}


// -----------------------------
// CPUターン
// -----------------------------
function cpuTurn(){

    if(gameMode !== "single") return;

    if(currentPlayer !== 2) return;

    const selectable = cards.filter(card=>{

        return card.dataset.open==="false"
            && card.dataset.match==="false";

    });

    if(selectable.length===0) return;

    const first =
        selectable[Math.floor(Math.random()*selectable.length)];

    openCard(first);

    setTimeout(()=>{

        const secondList = cards.filter(card=>{

            return card.dataset.open==="false"
                && card.dataset.match==="false";

        });

        if(secondList.length===0) return;

        const second =
            secondList[Math.floor(Math.random()*secondList.length)];

        openCard(second);

    },800);

}


// -----------------------------
// ゲーム終了
// -----------------------------
function endGame(){

    gameScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

if(player1Score > player2Score){

    if(gameMode === "single"){

        winnerText.textContent = "あなたの勝ち！";

    }else{

        winnerText.textContent = "プレイヤー1の勝ち！";

    }

    }else if(player2Score>player1Score){

        if(gameMode==="single"){

            winnerText.textContent="CPUの勝ち！";

        }else{

            winnerText.textContent="プレイヤー2の勝ち！";

        }

    }else{

        winnerText.textContent="引き分け！";

    }

}


// -----------------------------
// もう一度遊ぶ
// -----------------------------
retryBtn.addEventListener("click",()=>{

    startGame();

});


// -----------------------------
// スタート画面へ戻る
// -----------------------------
homeBtn.addEventListener("click",()=>{

    resultScreen.classList.add("hidden");

    gameScreen.classList.add("hidden");

    startScreen.classList.remove("hidden");

});
