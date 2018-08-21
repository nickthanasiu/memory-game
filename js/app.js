// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Grab the Restart Button DOM Element
var restartButton = document.querySelector('.restart');

 var cardClassList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
             'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond',
             'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle',
             'fa-paper-plane-o', 'fa-cube'];

// Initialize array for open cards
var openCards = [];
// Initialize array for matched cards
var matchedCards = [];

// Initialize matches counter, so we can track # of matches
var matches = 0;

// Initialize stars counter
var stars = 3;
// Grab stars display DOM Element
var starsDisplay = document.querySelector('.stars');
// Star list item to insert into starsDisplay
var starTemplate = `<li><i class="fa fa-star"></i></li>`;
// Reset stars Display
var resetStars = function() {
  starsDisplay.innerHTML = '';
  stars = 3;
  console.log(stars);
  for (var i = 0; i < stars; i++) {
    starsDisplay.innerHTML += starTemplate;
  }
}
// Initialize Stars Display by invoking resetStars
resetStars();

// Remove stars handler
var removeStar = function() {
  // Grab stars to interact with
  var starIcons = document.querySelectorAll('.fa-star');
  starIcons[starIcons.length-1].parentElement.remove();
  stars--;
}


// Grab moves counter DOM element
var movesCounter = document.querySelector('.moves');
// Initialize moves counter
var moves = 0;
movesCounter.innerHTML = moves;

// Function to reset moves counter
var resetMoves = function() {
  moves = 0;
  movesCounter.innerHTML = moves;
};

// Increment the moves counter
var incrementMoves = function() {
  moves++;
  movesCounter.innerHTML = moves;

  // After a certain number of moves have been taken, start removing stars
  if (moves === 10 || moves === 16 || moves === 20) {
    removeStar();
  }
}

// Grab Timer DOM Element
var timerSeconds = document.querySelector('.timer-seconds');
var timerMinutes = document.querySelector('.timer-minutes');
// Initialize timer
var seconds = 0;
var minutes = 0;
timerMinutes.innerHTML = minutes;
timerSeconds.innerHTML = seconds;

// Reset timer
function resetTimer() {
  var minutes = 0;
  var seconds = 0;
  timerMinutes.innerHTML = minutes;
  timerSeconds.innerHTML = seconds;
}

// Increment Timer
var incrementTimer = function() {
  if (seconds === 59) {
    seconds = 0;
    minutes++;
    timerMinutes.innerHTML = minutes;
    timerSeconds.innerHTML = seconds;
  } else {
    seconds++;
    timerSeconds.innerHTML = seconds;
    console.log('wooo');
  }

};

// Call incrementTimer once every second
window.setInterval(incrementTimer, 1000);


// Shuffle the deck
cardClassList = shuffle(cardClassList);

// Grab deck DOM element
var deck = document.querySelector('.deck');

// Populate the DOM with cards
cardClassList.forEach(function(cardClass) {
  var cardListItem = document.createElement('li');
  cardListItem.className = 'card';
  cardListItem.innerHTML = `<i class="fa ${cardClass}"></i>`;

  // Append each card-list-item to deck
  deck.appendChild(cardListItem);
});

// Grab card DOM element
var cards = document.querySelectorAll('.card');

// Toggle open and show classes on card. Reveal/Hide icon
var showCard = function(card) {
  card.classList.add('show');
  card.classList.add('open');
};

// Used to lock cards in the open position when matched
var lockOpen = function() {
  openCards.forEach(function(matchedCard) {
    matchedCard.classList.add('match');
  });
};

// Hides cards by removing open/show classes
var hideCards = function() {
  openCards.forEach(function(openCard) {
    openCard.classList.remove('open');
    openCard.classList.remove('show');
  });
}

// Reset matched cards
var resetMatch = function() {
  matchedCards.forEach(function(matchedCard) {
    matchedCard.classList.remove('open');
    matchedCard.classList.remove('show');
    matchedCard.classList.remove('match');
  });

  // Empty matchedCards array
  matchedCards = [];

  // Reset matches counter
  matches = 0;
};

var handleMismatch = function() {
  // Hide the cards
  hideCards();
  // Remove cards from list
  openCards = [];
};



// Function checks for match
function checkForMatch() {
  if (openCards[0].firstChild.className === openCards[1].firstChild.className) {

    // Lock cards in open position
    lockOpen();

    // Concat openCards contents with matchedCards array
    matchedCards = openCards.concat(matchedCards);

    // Reset openCards array, so other cards can be shown
    openCards = [];

    // Increment matches counter
    matches++;

  } else {
    // Wait a second, then hide cards and remove them from openCards array
    setTimeout(handleMismatch, 500);
  }

  // Regardless of whether there's a match, increment moves counter
  incrementMoves();

  // If all cards are now matched, display a message with the score
  if (matches === 8) {
    // Grab Modal DOM Element (hidden for now)
    var modal = document.getElementById('modal');
    var modalContentWrapper = document.querySelector('.modal-content-wrapper');
    // Template for modal content
    var modalContent = `
    <h1>Congratulations, YOU WON!!!</h1>
    <p>You finished in ${minutes} Minute(s) and ${seconds} Seconds, with ${stars} star rating</p>
    <p>Would you like to play again?</p>
    `;
    modal.style.display = "block";
    modalContentWrapper.innerHTML += modalContent;
    // Close the modal
    var closeButton = document.getElementById('close-btn');
    closeButton.addEventListener('click', function() {
      modal.style.display = "none";
      restartHandler();
      console.log('calling resetHandler');
    });
  }
}

// Event handler for card clicks
var cardClickHandler = function() {

  if(openCards.length < 2) {

    // Push card to openCards array
    openCards.push(this);

    // Show cards when clicked
    showCard(this);
    // If two cards are open, check for a match
    if (openCards.length === 2) {
      checkForMatch();
    }

  }
}

// Add click event listener to each card
cards.forEach(function(card){
  card.addEventListener('click', cardClickHandler);
});


// Restart the game when Restart Button is clicked
var restartHandler = function() {
  console.log('restarting the game');
  // Reset moves counter
  resetMoves();

  // Hide any open Cards
  hideCards();

  // Remove any cards from openCards array
  openCards = [];

  // Reset Matches
  resetMatch();

  // Reset Stars display
  if(stars < 3) {
    resetStars();
  }

  // Reset timer
  resetTimer();
}

// Add click event listener to Restart Button
restartButton.addEventListener('click', restartHandler);
