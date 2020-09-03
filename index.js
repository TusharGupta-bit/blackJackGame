// Challenge 5 BlackJack

let blackjackGame = {
    'you': { 'yourScore': '#your-blackjack-result', 'div': '#your-div', 'score': 0 },
    'dealer': { 'yourScore': '#dealer-blackjack-result', 'div': '#dealer-div', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [11, 1] },
    "wins": 0,
    "losses": 0,
    "Draws": 0,
    "isStand": false,
    "turnOver": false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];
const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lossSound = new Audio('sounds/aww.mp3');

let hitBtn = document.getElementById('blackjack-hit-button').addEventListener('click', blackjackHit);
let standBtn = document.getElementById('blackjack-stand-button').addEventListener('click', dealerLogic);
let dealBtn = document.getElementById('blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] == false) {

        let card = randomCard();
        showCardHit(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }

}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13)
    return blackjackGame['cards'][randomIndex];
}

function showCardHit(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImg = document.createElement('img');
        cardImg.src = `images/${card}.png`;
        cardImg.setAttribute('class', 'cardimg-element');
        document.querySelector(activePlayer['div']).appendChild(cardImg);
        hitSound.play();
    }
    else {

    }
}

function blackjackDeal() {
    // showResult(computeWinner());
    if (blackjackGame['turnOver'] == true) {

        blackjackGame['isStand'] = false;
        let yourImg = document.querySelector(YOU['div']).querySelectorAll('img');
        let dealerImg = document.querySelector(DEALER['div']).querySelectorAll('img');
        for (let i = 0; i < yourImg.length; i++) {
            yourImg[i].remove();
        }
        for (let i = 0; i < dealerImg.length; i++) {
            dealerImg[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector('#your-blackjack-result').textContent = 0
        document.querySelector('#dealer-blackjack-result').textContent = 0

        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = `Let's Play`;
        document.querySelector('#blackjack-result').style = 'black';

        blackjackGame['turnOver'] == true;
    }
}

function updateScore(card, activePlayer) {
    if (card == "A") {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['yourScore']).textContent = 'BUST';
        document.querySelector(activePlayer['yourScore']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['yourScore']).textContent = activePlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] == true) {
        
        let card = randomCard();
        showCardHit(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }

        blackjackGame['turnOver'] = true
        let winner = computeWinner();
        showResult(winner);
}

function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] == DEALER['score']) {
            blackjackGame['Draws']++;
        }
        //Condition when user burst but dealer don't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;
    }// When You and the daealer busts
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['Draws']++;
    }
    return winner;

}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnOver'] == true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = "You Won!"
            messageColor = "Green"
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#looses').textContent = blackjackGame['losses'];
            message = "You Lost!"
            messageColor = "red"
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['Draws'];
            message = "Game Drew"
            messageColor = "black"
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }

}
