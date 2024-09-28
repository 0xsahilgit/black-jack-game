//Track the current state of the game
const gameState = {  //Initialize game state object
    deck: [],
    player: {
      hand: [],
      total: 0,
      isBusted: false
    },
    dealer: {
      hand: [],
      total: 0,
      isBusted: false
    },
    roundOver: false,
    winner: null
  };
  
  //Deck Creation Method
  function createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck = [];
  
    suits.forEach(suit => {
      values.forEach(value => {
        deck.push({ value, suit });
      });
    });
  
    return deck;
  }
  
  //Fisher-Yates Shuffle Algorithm
  function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  
  //Deal a card to either the player or dealer
  function dealCard(playerOrDealer) {
    const card = gameState.deck.pop();
    
    if (playerOrDealer === 'player') {
      gameState.player.hand.push(card);
      updatePlayerHandDisplay();
    } else {
      gameState.dealer.hand.push(card);
      updateDealerHandDisplay();
    }
  
    return card;
  }
  
  //Calculate hand total (value)
  function calculateHand(hand) {
    let total = 0;
    let aceCount = 0;
  
    hand.forEach(card => {
      if (card.value === "J" || card.value === "Q" || card.value === "K") {
        total += 10;
      } else if (card.value === "A") {
        aceCount++;
      } else {
        total += parseInt(card.value);
      }
    });
  
    for (let i = 0; i < aceCount; i++) {
      if (total + 11 <= 21) {
        total += 11;
      } else {
        total += 1;
      }
    }
  
    return total;
  }
  
  //Function for hit action
  function playerHit() {
    dealCard('player');
    gameState.player.total = calculateHand(gameState.player.hand);
    if (gameState.player.total > 21) {
      gameState.player.isBusted = true;
      gameState.roundOver = true;
      document.getElementById('status').innerText = "Player busts! Dealer wins.";
      showDealerWins(); // Show crying cat and "You lose!" when player busts
      revealDealerHand();
      showNewRoundButton();
    }
  }
  
  //Function for stand action
  function playerStand() {
    dealerHit();
  }
  
  //Function to to do dealer's turn, hitting unless 17 or higher
  function dealerHit() {
    while (gameState.dealer.total < 17) {
      dealCard('dealer');
      gameState.dealer.total = calculateHand(gameState.dealer.hand);
    }
  
    if (gameState.dealer.total > 21) {
      gameState.dealer.isBusted = true;
      document.getElementById('status').innerText = "Dealer busts! Player wins.";
      showPlayerWins();  // Show dog and "Hooray! You win!" when dealer busts
    } else {
      determineWinner();
    }
  
    gameState.roundOver = true;
    revealDealerHand();  // Show both dealer's cards after round ends
    showNewRoundButton();
  }
  
  //Determining winner function
  function determineWinner() {
    const statusDiv = document.getElementById('status');
  
    if (gameState.player.isBusted) {
      gameState.winner = 'dealer';
    } else if (gameState.dealer.isBusted) {
      gameState.winner = 'player';
    } else {
      if (gameState.player.total > gameState.dealer.total) {
        gameState.winner = 'player';
      } else if (gameState.player.total < gameState.dealer.total) {
        gameState.winner = 'dealer';
      } else {
        gameState.winner = 'push';
      }
    }
  
    //Announce result to user
    if (gameState.winner === 'push') {
      statusDiv.innerText = "It's a tie!";
    } else if (gameState.winner === 'dealer') {
      statusDiv.innerText = "Dealer wins!";
      showDealerWins(); 
    } else if (gameState.winner === 'player') {
      statusDiv.innerText = "Player wins!";
      showPlayerWins(); 
    }
  }
  
  //Function to show "You lose!" and the crying cat meme when dealer wins
  function showDealerWins() {
    const statusDiv = document.getElementById('status');
    const imageURL = "https://uploads.dailydot.com/2023/12/crying-cat-meme.jpg?q=65&auto=format&w=1600&ar=2:1&fit=crop";
    
    //Display losing img + message
    const imageElement = document.createElement('img');
    imageElement.src = imageURL;
    imageElement.alt = "Crying Cat Meme";
    imageElement.style.width = '200px';
  
    //Display losing message below image
    const loseMessage = document.createElement('div');
    loseMessage.innerText = "You lose!";
    loseMessage.classList.add('lose-message'); 
    
    statusDiv.appendChild(imageElement);  
    statusDiv.appendChild(loseMessage); 
  }
  
  //Function to display winning message + img
  function showPlayerWins() {
    const statusDiv = document.getElementById('status');
    const imageURL = "https://image.petmd.com/files/styles/863x625/public/CANS_dogsmiling_379727605.jpg";
    const imageElement = document.createElement('img');
    imageElement.src = imageURL;
    imageElement.alt = "Smiling Dog";
    imageElement.style.width = '200px';
    const winMessage = document.createElement('div');
    winMessage.innerText = "Hooray! You win!";
    winMessage.classList.add('win-message'); 
    
    statusDiv.appendChild(imageElement);  
    statusDiv.appendChild(winMessage); 
  }
  
  //Show accurate hand for player
  function updatePlayerHandDisplay() {
    const handDisplay = gameState.player.hand.map(card => `${card.value} of ${card.suit}`).join(", ");
    document.getElementById('player-hand').innerText = handDisplay;
  }
  
  //Show dealer hand with hidden card
  function updateDealerHandDisplay() {
    const dealerHandDiv = document.getElementById('dealer-hand');
    dealerHandDiv.innerHTML = ''; //Clear previous hand
  
    if (!gameState.roundOver) {
      const faceUpCardDiv = document.createElement('div');
      faceUpCardDiv.classList.add('card');
      faceUpCardDiv.innerText = `${gameState.dealer.hand[0].value} ${gameState.dealer.hand[0].suit}`;
      dealerHandDiv.appendChild(faceUpCardDiv);
  
      const hiddenCardDiv = document.createElement('div');
      hiddenCardDiv.classList.add('card');
      hiddenCardDiv.innerText = '???';
      dealerHandDiv.appendChild(hiddenCardDiv);
    } else {
      //Show both dealer cards 
      gameState.dealer.hand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerText = `${card.value} ${card.suit}`;
        dealerHandDiv.appendChild(cardDiv);
      });
    }
  }
  
  //Functioon to show both dealer cards at round's end
  function revealDealerHand() {
    const dealerHandDiv = document.getElementById('dealer-hand');
    dealerHandDiv.innerHTML = ''; //Clear previous hand
  
    gameState.dealer.hand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      cardDiv.innerText = `${card.value} ${card.suit}`;
      dealerHandDiv.appendChild(cardDiv);
    });
  }
  
  //Reset game state-> Function to start new round
  function beginGame() {
    gameState.deck = createDeck();
    shuffle(gameState.deck);
  
    gameState.player.hand = [];
    gameState.dealer.hand = [];
    gameState.player.total = 0;
    gameState.dealer.total = 0;
    gameState.player.isBusted = false;
    gameState.dealer.isBusted = false;
    gameState.roundOver = false;
    gameState.winner = null;
  
    dealCard('player');
    dealCard('dealer');
    dealCard('player');
    dealCard('dealer');
  
    gameState.player.total = calculateHand(gameState.player.hand);
    gameState.dealer.total = calculateHand(gameState.dealer.hand);
  
    document.getElementById('status').innerText = '';
  
    //Display cards
    updatePlayerHandDisplay();
    updateDealerHandDisplay();
  
    //Set new yound button display to none (hides it until later)
    document.getElementById('new-round-btn').style.display = "none";
  }
  
  //Show new round button when round is over
  function showNewRoundButton() {
    document.getElementById('new-round-btn').style.display = "inline";
  }
  
  //Event listeners for the buttons
  document.getElementById('hit-btn').addEventListener('click', playerHit);
  document.getElementById('stand-btn').addEventListener('click', playerStand);
  document.getElementById('new-round-btn').addEventListener('click', beginGame);
  
  //Begin game on window load
  window.onload = function() {
    beginGame();
  };
  