var cardEle = document.querySelector("#card");
var playing = false;
var cardIdx = 0;
var isFront = true;
// card index 가 변경되면 html element inner text q변경.
// vue watch 사용.

cards = _.shuffle(cards);
renderCardContent(cardIdx);

function renderCardContent(cardIdx){
  const content = cards[cardIdx];
  const backCategoryTextEle = document.querySelector("#back-category-text");
  const backQuestionTextEle = document.querySelector("#back-question-text");
  const frontIndexTextEle = document.querySelector("#front-index-text");
  const backCardInfoText = document.querySelector("#back-card-info-text");
  backCategoryTextEle.innerText = content.category;
  backQuestionTextEle.innerText = content.question;
  frontIndexTextEle.innerText = cardIdx + 1;
  backCardInfoText.innerText = `질문카드${cardIdx + 1}`;
}

function nextCard(){
  if(cardIdx >= cards.length - 1){
    return;
  }
  cardIdx = cardIdx + 1;
  renderCardContent(cardIdx);
}

function previousCard(){
  if(cardIdx <= 0){
    return;
  }
  cardIdx = cardIdx -1;
  renderCardContent(cardIdx);
}

/**
 * 카드 뒤집기 앞면뒷면 현상태 상관 없이
 */
function swipeCardToggle(completedCallback){
  if(playing)
  return;
  
  playing = true;
  anime({
    targets: cardEle,
    scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
    rotateY: {value: '+=180', delay: 200},
    easing: 'easeInOutSine',
    duration: 400,
    complete: function(anim){
       playing = false;
       completedCallback?.();
    }
  });
  isFront = !isFront;
}

/**
 * 카드 뒤집기: 카드를 앞면으로만 뒤집는 액션 함수
 */
function swipeCardFront(completedCallback){
  if(isFront) return;
  swipeCardToggle(completedCallback);
}


cardEle.addEventListener('click',function() {
  // swipeCardToggle();
  // nextCard();
});


const cardHammerTime = new Hammer(cardEle);
cardHammerTime.get('swipe').set({direction: Hammer.DIRECTION_ALL});

// 위로 슬라이드 (Swipe up)
cardHammerTime.on('swipeup', function() {
  console.log('Swipe up detected!');
  swipeCardToggle();
});

cardHammerTime.on('swipedown', function() {
  console.log('Swipe down detected!');
  swipeCardToggle();
});

// 왼쪽으로 슬라이드 (Swipe left) : 다음카드
cardHammerTime.on('swipeleft', function() {
  console.log('Swipe left detected!');
  // next
  if(isFront) nextCard();
  // 뒤집힌 상태 초기화 
  swipeCardFront(()=>{
    // 다음 질문답변 세트
    nextCard();
  });
});

cardHammerTime.on('swiperight', function() {
  console.log('Swipe right detected!');
  // previous
  if(isFront) previousCard();
  // 뒤집힌 상태 초기화
  swipeCardFront(()=>{
    // 이전 질문답변 세트
    previousCard();
  });
});