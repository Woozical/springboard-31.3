// 1.
/* Make a request to the Deck of Cards API to request a single card from a newly shuffled deck.
Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”). */

async function drawCard(){
    const res = await axios.get('http://deckofcardsapi.com/api/deck/new/draw/?count=1');
    const card = res.data.cards[0];
    console.log(`${card.value} of ${card.suit}`);
}

drawCard();

// 2.
/* Make a request to the deck of cards API to request a single card from a newly shuffled deck.
Once you have the card, make a request to the same API to get one more card from the same deck.
Once you have both cards, console.log the values and suits of both cards. */

async function draw2Cards(){
    const {data: newDeck} = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const {data : { cards : [card1, card2]}} = await axios.get(`http://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=2`);
    console.log(`1: ${card1.value} of ${card1.suit}`);
    console.log(`2: ${card2.value} of ${card2.suit}`);
}

draw2Cards();

// 3.
/* Build an HTML page that lets you draw cards from a deck.
When the page loads, go to the Deck of Cards API to create a new deck,
and show a button on the page that will let you draw a card. Every time you click the button,
display a new card, until there are no cards left in the deck.*/
const btn = document.getElementById('btn-draw');
const pile = document.getElementById('card-pile');
const counter = document.getElementById('card-count');

async function app(){
    const {data: deck} = await axios.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    deck.size = deck.remaining;
    counter.innerText = `Cards Remaining: ${deck.remaining}`;
    btn.addEventListener('click', () => {
        drawFromDeck(deck);
    })
}

async function drawFromDeck(deck){
    deck.remaining -= 1;
    if (deck.remaining >= 0){
        const {data} = await axios.get(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
        deck.remaining = data.remaining;
        const card = data.cards[0];
        renderCard(card, (deck.size - deck.remaining));
        counter.innerText = `Cards Remaining: ${deck.remaining}`;
    }
}

function renderCard(card, zIndex){
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = `${card.value} of ${card.suit}`;
    img.classList.add('card');
    img.style.zIndex = zIndex;
    img.style.transform = `rotate(${Math.random()}turn)`;
    img.style.top = String(Math.trunc(Math.random() * 10) - 5) + 'px';
    img.style.left = String(Math.trunc(Math.random() * 50) - 10) + 'px';
    pile.append(img);
}

app();