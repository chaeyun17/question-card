var cards = [
  {
    "category": "회상",
    "question": "인생의 터닝 포인트가 있다면?"
  },
  {
    "category": "회상",
    "question": "인생에서 가장 뿌듯했던 적은?"
  },
  {
    "category": "회상",
    "question": "인생에서 가장 좌절했던 적은?"
  },
]

var cardEle = document.querySelector("#card");
var playing = false;
var cardIdx = 0;
var isFront = true;
// card index 가 변경되면 html element inner text q변경.
// vue watch 사용.

renderCardContent(cardIdx);

function renderCardContent(cardIdx){
  const content = cards[cardIdx];
  const backCategoryTextEle = document.querySelector("#back-category-text");
  const backQuestionTextEle = document.querySelector("#back-question-text");
  const frontIndexTextEle = document.querySelector("#front-index-text");
  backCategoryTextEle.innerText = content.category;
  backQuestionTextEle.innerText = content.question;
  frontIndexTextEle.innerText = cardIdx + 1;
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


function swipeCardToggle(){
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
    }
  });
  isFront = !isFront;
}

function swipeCardFront(){
  if(isFront) return;
  swipeCardToggle();
}


cardEle.addEventListener('click',function() {
  // swipeCardToggle();
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
  // 뒤집힌 상태 초기화 
  swipeCardFront();
  // 다음 질문답변 세트
  nextCard();
});

cardHammerTime.on('swiperight', function() {
  console.log('Swipe right detected!');
  // previous
  // 뒤집하 상태 초기화
  swipeCardFront();
  // 이전 질문답변 세트
  previousCard();
});