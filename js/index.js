// DOM 요소 캐시
const cardEle = document.querySelector("#card");
const backCategoryTextEle = document.querySelector("#back-category-text");
const backQuestionTextEle = document.querySelector("#back-question-text");
const frontIndexTextEle = document.querySelector("#front-index-text");
const backCardInfoText = document.querySelector("#back-card-info-text");

let playing = false;
let cardIdx = 0;
let isFront = true;

cards = _.shuffle(cards); // 카드 섞기
renderCardContent(cardIdx); // 초기 카드 내용 렌더링

function renderCardContent(cardIdx) {
    const content = cards[cardIdx];
    backCategoryTextEle.innerText = content.category;
    backQuestionTextEle.innerText = content.question;
    frontIndexTextEle.innerText = cardIdx + 1;
    backCardInfoText.innerText = `질문카드 ${cardIdx + 1}`;
}

function nextCard() {
    if (cardIdx < cards.length - 1) {
        cardIdx++;
        renderCardContent(cardIdx);
    }
}

function previousCard() {
    if (cardIdx > 0) {
        cardIdx--;
        renderCardContent(cardIdx);
    }
}

function swipeCardToggle(completedCallback) {
    if (playing) return;

    playing = true;
    anime({
        targets: cardEle,
        scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
        rotateY: { value: '+=180', delay: 200 },
        easing: 'easeInOutSine',
        duration: 400,
        complete: function (anim) {
            playing = false;
            completedCallback?.();
        }
    });
    isFront = !isFront;
}

function swipeCardFront(completedCallback) {
    if (isFront) return;
    swipeCardToggle(completedCallback);
}

// cardEle.addEventListener('click', function () {
//     swipeCardToggle();
//     nextCard();
// });

// Hammer.js 설정
const cardHammerTime = new Hammer(cardEle);
cardHammerTime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

cardHammerTime.on('swipeup', function () {
    swipeCardToggle();
});

cardHammerTime.on('swipedown', function () {
    swipeCardToggle();
});

cardHammerTime.on('swipeleft', function () {
    if (isFront) nextCard();
    swipeCardFront(() => nextCard());
});

cardHammerTime.on('swiperight', function () {
    if (isFront) previousCard();
    swipeCardFront(() => previousCard());
});