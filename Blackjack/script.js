// I need a list of all cards with the value of each card and the amount of time it appears in the deck (starting with 4 then when its shown in the deck it goes down by 1)
const cardListFresh = [
    { name: '2', value: 2, amount: 4 },
    { name: '3', value: 3, amount: 4 },
    { name: '4', value: 4, amount: 4 },
    { name: '5', value: 5, amount: 4 },
    { name: '6', value: 6, amount: 4 },
    { name: '7', value: 7, amount: 4 },
    { name: '8', value: 8, amount: 4 },
    { name: '9', value: 9, amount: 4 },
    { name: '10', value: 10, amount: 4 },
    { name: 'J', value: 10, amount: 4 },
    { name: 'Q', value: 10, amount: 4 },
    { name: 'K', value: 10, amount: 4 },
    { name: 'A', value: 11, amount: 4 }
];
let cardList = cardListFresh;

class Player {
    constructor(name, hand) {
        this.name = name;
        this.hand = hand;
        this.wins = 0;
        this.losses = 0;
        this.winRound = false;
    }

    addCard() {
        // Get all cards that are still in the deck
        var allCardsProb = cardList.reduce((total, card) => total + card.amount, 0);
        // Get the random card
        var randomCard = Math.floor(Math.random() * allCardsProb);

        // Get the card that was randomly selected
        var cardIndex = 0;
        for (var i = 0; i < cardList.length; i++) {
            randomCard -= cardList[i].amount;
            if (randomCard < 0) {
                cardIndex = i;
                break;
            }
        }

        // Add the card to the player's hand
        this.hand.push(cardList[cardIndex]);
        cardList[cardIndex].amount--;
        console.log(cardList);
    }

    getHandValue() {
        return this.hand.reduce((total, card) => total + card.value, 0);
    }
}

function XOR(a, b) {
    return (!a && b) || (a && !b);
}

let player = new Player('Player', []);
let dealer = new Player('Dealer', []);
let wonRound = false;
let tieRound = false;
function getWinner() {
    if (player.getHandValue() == dealer.getHandValue()) {
        tieRound = true;
    }
    else if (player.getHandValue() > 21 || (dealer.getHandValue() > player.getHandValue() && dealer.getHandValue() <= 21)) {
        dealer.wins++;
        player.losses++;
        wonRound = false;
    }
    else if (dealer.getHandValue() > 21 || player.getHandValue() > dealer.getHandValue()) {
        player.wins++;
        dealer.losses++;
        wonRound = true;
    }
}

function renderWinner() {
    const wbox = document.getElementById('winner-box');
    wbox.innerHTML = '';
    // Create a box with the text "winner + {player || dealer}" on top of it
    const winnerTitle = document.createElement('h2');
    if (player.getHandValue() == dealer.getHandValue()) {
        winnerTitle.innerText = 'Tie!';
    }
    
    else if (player.getHandValue() > 21 || (dealer.getHandValue() > player.getHandValue() && dealer.getHandValue() <= 21)) {
        winnerTitle.innerText = 'Dealer wins!';
        dealer.wins++;
        player.losses++;

    }
    else if (dealer.getHandValue() > 21 || player.getHandValue() > dealer.getHandValue()) {
        winnerTitle.innerText = 'Player wins!';
    }
    wbox.appendChild(winnerTitle);
    // Reset the game button
    const newGameButton = document.createElement('button');
    newGameButton.id = 'new-game-button';
    newGameButton.className = 'button';
    newGameButton.innerText = 'New Game';
    newGameButton.onclick = () => {
        newGame();
    };
    wbox.appendChild(newGameButton);
}

function renderAllCards() {
    const abox = document.getElementById('all-cards-box');
    abox.innerHTML = '';
    // Create a box with the text "all cards" on top of it
    const allCardsTitle = document.createElement('h2');
    allCardsTitle.innerText = 'All Cards';
    abox.appendChild(allCardsTitle);
    // Get all cards amounts
    let allCardsAmount = cardList.reduce((total, card) => total + card.amount, 0);
    let percentOfBust = 0;
    for (var i = 0; i < cardList.length; i++) {
        const cardBox = document.createElement('div');
        cardBox.innerText = cardList[i].name + ' ' + cardList[i].amount + '  |  ' + (cardList[i].amount / allCardsAmount * 100).toFixed(2) + '%';
        if (player.getHandValue() + cardList[i].value > 21) {
            cardBox.style.color = 'red';
        }
        else {
            cardBox.style.color = 'black';
        }
        abox.appendChild(cardBox);

        if (player.getHandValue() + cardList[i].value > 21) {
            percentOfBust += cardList[i].amount / allCardsAmount;
        }
    }
    const bustBox = document.createElement('div');
    bustBox.innerText = 'Bust ' + (percentOfBust * 100).toFixed(2) + '%';
    abox.appendChild(bustBox);


}

function cardProbabilities() {
    var allCardsProb = cardList.reduce((total, card) => total + card.amount, 0);
    var cardProb = [];
    for (var i = 0; i < cardList.length; i++) {
        cardProb.push(cardList[i].amount / allCardsProb);
    }
    // probability of busting on the next card
    // take player hand value and subtract 21, then take the probability of getting a card that will make the player bust
    var remainingValue = 21 - player.getHandValue();
    var bustProb = 0;
    for (var i = 0; i < cardList.length; i++) {
        if (cardList[i].value > remainingValue) {
            bustProb += cardProb[i];
        }
    }
    


}

function renderDealer() {
    const dbox = document.getElementById('dealer-box');
    dbox.innerHTML = '';
    // Create a box with the text "dealer" on top of it
    const dealerTitle = document.createElement('h2');
    dealerTitle.innerText = 'Dealer';
    dbox.appendChild(dealerTitle);
    // Create a box with the text "score" on top of it
    const dealerScore = document.createElement('h2');
    dealerScore.innerText = dealer.getHandValue();
    dbox.appendChild(dealerScore);
    // Create a box with the text "cards" on top of it
    const dealerCards = document.createElement('h2');
    dealerCards.innerText = 'Cards';
    dbox.appendChild(dealerCards);
    // Show all the cards in the dealer's hand
    dealer.hand.forEach(card => {
        const cardBox = document.createElement('div');
        cardBox.innerText = card.name;
        dbox.appendChild(cardBox);
    });

    // If the dealer wins show the text "Dealer wins!"
    if (dealer.getHandValue() <= 21 && dealer.getHandValue() > player.getHandValue()) {
        const winText = document.createElement('h2');
        winText.innerText = 'Dealer wins!';
        dbox.appendChild(winText);
    }

}

function renderPlayer() {
    const pbox = document.getElementById('player-box');
    pbox.innerHTML = '';
    // Create a box with the text "player" on top of it
    const playerTitle = document.createElement('h2');
    playerTitle.innerText = 'Player';
    pbox.appendChild(playerTitle);
    // Create a box with the text "Wins" on top of it
    const playerWins = document.createElement('h2');
    playerWins.innerText = 'Wins: ' + player.wins;
    pbox.appendChild(playerWins);
    // Create a box with the text "score" on top of it
    const playerScore = document.createElement('h2');
    playerScore.innerText = player.getHandValue();
    pbox.appendChild(playerScore);
    // Create a box with the text "cards" on top of it
    const playerCards = document.createElement('h2');
    playerCards.innerText = 'Cards';
    pbox.appendChild(playerCards);
    // Show all the cards in the player's hand
    player.hand.forEach(card => {
        const cardBox = document.createElement('div');
        cardBox.innerText = card.name;
        pbox.appendChild(cardBox);
    });

    // Create a button that says "Hit" if the player's hand is less than 21
    
    if (player.getHandValue() == 21) {
        const wbox = document.getElementById('winner-box');
        wbox.innerHTML = '';
        const winText = document.createElement('h2');
        winText.innerText = 'Player wins!';
        wbox.appendChild(winText);
    }
    

    if (player.getHandValue() < 21) {
        const hitButton = document.createElement('button');
        hitButton.id = 'hit-button';
        hitButton.className = 'button';
        hitButton.innerText = 'Hit';
        hitButton.onclick = () => {
            player.addCard();
            renderPlayer();
            renderAllCards();
        };
        pbox.appendChild(hitButton);

        const standButton = document.createElement('button');
        standButton.id = 'stand-button';
        standButton.className = 'button';
        standButton.innerText = 'Stand';
        standButton.onclick = () => {
            // Dealer's turn
            while (dealer.getHandValue() < 17){
                dealer.addCard();
            }
            renderWinner();
            renderDealer();
            renderPlayer();
            renderAllCards();
        };
        pbox.appendChild(standButton);
        

    }
    else if (player.getHandValue() > 21){
        const bustText = document.createElement('h2');
        bustText.innerText = 'Bust!';
        pbox.appendChild(bustText);
    }
}


function newGame() {
    player.hand = [];
    dealer.hand = [];
    /*
    player.addCard();
    dealer.addCard();
    player.addCard();
    dealer.addCard();
    */
    cardList = cardListFresh;
    renderPlayer();
    renderDealer();
    renderAllCards();
}

renderDealer();
renderPlayer();
console.log(cardList);


renderAllCards();