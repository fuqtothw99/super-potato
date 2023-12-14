var canvas = document.querySelector("canvas");
var ctx = canvas.getContext('2d');

// 시작 버튼
var startBtn = document.getElementById('startBtn');

// 로그인 버튼
var loginBtn = document.getElementById('loginBtn');

// 로그인-홈 버튼
var loginHomeBtn = document.getElementById('loginHome');

// 설명서 버튼
var manualBtn = document.getElementById('manualBtn');

// 설명서-홈 버튼
var manualHomeBtn = document.getElementById('manualHome');

// 게임 내 홈 버튼
var homeBtn = document.getElementById('home');

// 게임 초기화 버튼
var resetBtn = document.getElementById('reset');

// 랭킹 버튼
var rankBtn = document.getElementById('rankBtn');

// 랭킹 유저 이름
var userRank = document.getElementsByClassName('userRank');
// 랭킹 점수
var userRankNum= document.getElementsByClassName('userRankNum');

// 게임 오버 화면 창
var gameOverScore = document.getElementById('gameOverScore');

//다시 시작 버튼
var reStartBtn_Yes = document.getElementById('reStartBtn_Yes');
var reStartBtn_No = document.getElementById('reStartBtn_No');

// 설명서 버튼에 대한 이벤트 처리
manualBtn.addEventListener('click', function(){
  rankBtn.style.display = 'none';
  // 설명서 버튼, 캔버스, 시작 버튼을 없애고 설명서 내용과 설명서-홈 버튼을 활성화 함
  manualBtn.style.display = 'none';
  canvas.style.display = 'none';
  startBtn.style.display = 'none';
  document.getElementById('manualText').style.display = 'block';
  manualHome.style.display = 'block';
  loginBtn.style.display = 'block';
})

// 설명서-홈 버튼에 대한 이벤트 처리
manualHomeBtn.addEventListener('click', function(){
  document.getElementById('rankText').style.display = 'none';
  rankBtn.style.display = 'block';
  document.getElementById('loginText').style.display = 'none';
  loginHome.style.display = 'none';
  // 설명서 버튼, 캔버스, 시작 버튼을 활성화하고 설명서 내용과 설명서-홈 버튼을 없앰
  manualBtn.style.display = 'block';
  canvas.style.display = 'block';
  startBtn.style.display = 'block';
  loginBtn.style.display = 'block';
  document.getElementById('manualText').style.display = 'none';
  manualHome.style.display = 'none';
})

// 랭킹 버튼에 대한 이벤트 처리
rankBtn.addEventListener('click', function(){
  rankBtn.style.display = 'none';
  document.getElementById('manualText').style.display = 'none';
  manualBtn.style.display = 'none';
  loginBtn.style.display = 'none';
  canvas.style.display = 'none';
  startBtn.style.display = 'none';
  manualHomeBtn.style.display = 'none';
  document.getElementById('rankText').style.display = 'block';
  manualHomeBtn.style.display = 'block';
  // fetchRankingData();
})

// 로그아웃 버튼에 대한 이벤트 처리
document.getElementById('logout').addEventListener('click', function() {

  // 최고 점수를 0으로 초기화
  bestScore =0;
  bestScoreNum.textContent = bestScore;           // HTML에서 최고 점수를 표시하는 요소를 초기화
  
  // 게임 점수 초기화
  score = 0;
  scoreNum.textContent = score;                   // HTML에서 게임 점수를 표시하는 요소를 초기화

  // 점수도 초기화해야 함 (reset)
  document.getElementsByClassName('scoreBox')[0].style.display = 'reset';
  document.getElementsByClassName('scoreBox')[1].style.display = 'reset ';

  // 아이디, 비밀번호 입력 필드 초기화
  document.getElementById('username').value = ''; // 아이디 입력 필드 초기화
  document.getElementById('password').value = ''; // 비밀번호 입력 필드 초기화

  // 최고 점수를 표시하는 요소의 내용을 '0'으로 초기화
  document.getElementById('bestScoreNum').innerText = '0';
});

// 로그인 버튼에 대한 이벤트 처리
loginBtn.addEventListener('click', function(){
  rankBtn.style.display = 'none';
  document.getElementById('manualText').style.display = 'none';
  manualBtn.style.display = 'none';
  // 로그인 버튼, 캔버스, 시작 버튼을 없애고 설명서 내용과 설명서-홈 버튼을 활성화 함
  loginBtn.style.display = 'none';
  canvas.style.display = 'none';
  startBtn.style.display = 'none';
  document.getElementById('loginText').style.display = 'block';
  loginHome.style.display = 'block';
  manualHomeBtn.style.display = 'none';
})

// 진짜 로그인 버튼에 대한 이벤트 처리
rloginBtn.addEventListener('click', async function() {
  // 사용자 이름과 비밀번호(숫자 네 자리) 가져오기
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // 숫자 네 자리가 아닌 경우 알림창 띄우기
  if (password.length !== 4 || isNaN(password)) {
    alert('비밀번호는 숫자 네 자리로 입력해야 합니다.');
    return;                                                   // 함수 종료
  }

  // 최고 점수 가져오기
  const bestScore = parseInt(bestScoreNum.textContent);

  // HTTP POST 요청을 보내는 부분
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, bestScore }) // 사용자 이름, 비밀번호, 최고 점수를 JSON 형태로 전송
    });

    if (response.ok) {
      // 요청이 성공적으로 처리된 경우

      // 로그인 성공 시 토큰 저장
      const data = await response.json();
      token = data.token;                                    // 받은 토큰을 변수에 저장
      console.log('받은 토큰:', token);

      // 토큰을 안전한 곳에 저장 (로컬 스토리지 사용)
      localStorage.setItem('token', token);

      fetchRankingData(token);                               // 토큰을 사용하여 랭킹 데이터를 가져옴

      alert(`${username}님! 환영합니다`);                     // 환영 메시지 표시
      console.log('서버로부터 받은 데이터:', data);            // 받은 데이터 콘솔에 출력

      // 로그인 후 UI 변경 - 로그아웃 버튼 추가
      document.getElementById('loginText').innerHTML = `
      <h2>${username}님, 안녕하세요!</h2> <br><br>
      <form action="2048-1.html"><button id="logout">로그아웃</button></form>
      `;
    } else {
      // 요청이 실패한 경우
      alert('로그인을 실패하셨습니다');                         // 실패 메시지 표시
      console.error('서버로부터 응답을 받지 못했습니다.');
    }
  } catch (error) {
    // 네트워크 오류 등으로 인한 실패
    alert('네트워크 오류가 발생했습니다.');                     // 오류 메시지 표시
    console.error('Error:', error);                           // 오류 콘솔에 출력
  }
});

// 로그인-홈 버튼에 대한 이벤트 처리
loginHomeBtn.addEventListener('click', function(){
  document.getElementById('rankText').style.display = 'none';
  rankBtn.style.display = 'block';
  manualBtn.style.display = 'block';
  // 로그인 버튼, 캔버스, 시작 버튼을 활성화하고 설명서 내용과 설명서-홈 버튼을 없앰
  loginBtn.style.display = 'block';
  canvas.style.display = 'block';
  startBtn.style.display = 'block';
  document.getElementById('loginText').style.display = 'none';
  loginHome.style.display = 'none';
})

// 랭킹을 화면에 표시하는 함수
function Ranking(rankingData) {
  // 기존에 만들어둔 ol 엘리먼트를 선택
  const rankingList = document.querySelector('ol');

  // 랭킹 데이터를 이용하여 li 엘리먼트를 동적으로 생성하거나 수정
  rankingData.forEach((user, index) => {
    // 기존에 있는 li 엘리먼트 선택
    const listItem = rankingList.children[index];

    // li 엘리먼트에 클래스 추가
    listItem.classList.add('rankingItem');

    // li 엘리먼트 내부의 span 엘리먼트들 선택
    const userRankSpan = listItem.querySelector('.userRank');
    const userRankNumSpan = listItem.querySelector('.userRankNum');

    // span 엘리먼트의 내용 설정
    userRankSpan.textContent = user.username;
    userRankNumSpan.textContent = user.bestScore + '점';
  });
}

let token = null; // 초기에 토큰을 null로 설정

// 랭킹 데이터를 가져오는 비동기 함수
async function fetchRankingData() {
  try {
    // 서버로부터 랭킹 데이터 가져오기 (GET 요청)
    const response = await fetch('http://localhost:3000/getRanking',{ // 서버의 엔드포인트에 맞게 경로를 설정
    // 서버로 요청 시 헤더에 토큰 추가
      headers: {
        Authorization: `Bearer ${token}`,                             // 헤더에 토큰 정보 추가
      },
    });
    const data = await response.json();                               // JSON 형태로 받은 데이터를 파싱

    // 받아온 랭킹 데이터를 이용하여 화면에 표시
    console.log('랭킹 데이터 받아오기 성공:', data);
    Ranking(data);                                                    // 랭킹을 화면에 표시하거나 다른 작업 수행
  } catch (error) {
    console.error('랭킹 데이터 받아오기 실패:', error);
  }
}

// 초기 페이지 로딩 시 랭킹 데이터를 가져와 화면에 표시
fetchRankingData();

// 게임이 끝났을 때 호출되는 함수
async function onGameEnd(score) {
  try {
    // HTTP POST 요청을 보내서 서버에 점수를 업데이트
    const response = await fetch('http://localhost:3000/updateScore', {
      method: 'POST',                       // POST 메소드로 요청
      headers: {
        'Content-Type': 'application/json', // JSON 형태로 데이터 전달
        Authorization: `Bearer ${token}`,   // 요청 시에도 헤더에 토큰 추가
      },
      body: JSON.stringify({ score }),      // 서버에 보낼 데이터 설정
    });

    if (response.ok) {
      // 랭킹 데이터 업데이트 성공 시, 다시 랭킹 데이터를 가져와서 화면에 표시
      fetchRankingData();
    } else {
      console.error('랭킹 데이터 업데이트 실패');
    }
  } catch (error) {
    console.error('네트워크 오류가 발생했습니다.', error);
  }
}

//게임 코드
side = 4;                                           //게임 보드 한 변의 크기
padding = 12;                                       //블록 간 간격
blockSize = 90;                                     //블록의 크기
boardSize = padding * (side + 1) + blockSize * side; // 게임 보드의 전체 크기

//초기 설정
var interval;
score = 0;
bestScore = 0;
board = new Array(side).fill(0).map(() => new Array(side).fill(0));
colors = ['#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE', '#E5D8BE'];

//숫자 2 이미지
var img1 = new Image();
img1.src = "https://i.ibb.co/C1zHbRM/1.png";

//숫자 4 이미지
var img2 = new Image();
img2.src = "https://i.ibb.co/YN0czF7/2.png";

//숫자 8 이미지
var img3 = new Image();
img3.src = "https://i.ibb.co/mSnDhJg/3.png";

//숫자 16 이미지
var img4 = new Image();
img4.src = "https://i.ibb.co/3ckjvLf/4.png";

//숫자 32 이미지
var img5 = new Image();
img5.src = "https://i.ibb.co/w6wsyRg/5.png";

//숫자 64 이미지
var img6 = new Image();
img6.src = "https://i.ibb.co/60WmvCb/6.png";

//숫자 128 이미지
var img7 = new Image();
img7.src = "https://i.ibb.co/tc6s09r/7.png"; 

//숫자 256 이미지
var img8 = new Image();
img8.src = "https://i.ibb.co/2S39c0D/8.png";

//숫자 512 이미지
var img9 = new Image();
img9.src = "https://i.ibb.co/r6yDtzt/9.png";

//숫자 1024 이미지
var img10 = new Image();
img10.src = "https://i.ibb.co/ZLzvz5n/10.png";

//숫자 2048 이미지
var img11 = new Image();
img11.src = "https://i.ibb.co/Fh3WZDD/11.png";

// 캔버스를 초기화하고 게임 보드를 그리는 함수
function draw() {
  // 캔버스를 투명으로 지우고 게임 보드의 크기로 사각형을 그림
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#C8B795";  //게임 셀 테두리 색
  ctx.fillRect(0, 0, boardSize, boardSize);

  ctx.textAlign = "center";
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      y = padding * (i + 1) + blockSize * i;
      x = padding * (j + 1) + blockSize * j;
    
      // 각 셀의 숫자를 바탕으로 이미지를 삽입하는 부분
      cell_level = Math.log2(board[i][j]);
      switch (cell_level) {
        case -Infinity:
          ctx.fillStyle = colors[0];  // 셀의 색상
          ctx.fillRect(x, y, blockSize, blockSize);
          break;
        // 셀 레벨에 따라 이미지를 그리는 부분
        case 1:
          // 색 채우기
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          // 이미지 그리기
          ctx.drawImage(img1, x, y, blockSize, blockSize);
          break;
        case 2:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img2, x, y, blockSize, blockSize);
          break;
        case 3:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img3, x, y, blockSize, blockSize);
          break;
        case 4:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img4, x, y, blockSize, blockSize);
          break;
        case 5:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img5, x, y, blockSize, blockSize);
          break;
        case 6:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img6, x, y, blockSize, blockSize);
          break;
        case 7:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img7, x, y, blockSize, blockSize);
          break;
        case 8:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img8, x, y, blockSize, blockSize);
          break;
        case 9:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img9, x, y, blockSize, blockSize);
          break;
        case 10:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img10, x, y, blockSize, blockSize);
          break;
        default:
          ctx.fillStyle = colors[cell_level];
          ctx.fillRect(x, y, blockSize, blockSize);
          ctx.drawImage(img11, x, y, blockSize, blockSize);
      }  
    }
  }
}

var imgX = 0;
var imgY = 0;

// 이미지를 이동시키는 함수
function moveImage(direction) {
  switch (direction) {
    case 'up':
      imgY -= 10; // 위로 이동
      break;
    case 'down':
      imgY += 10; // 아래로 이동
      break;
    case 'left':
      imgX -= 10; // 왼쪽으로 이동
      break;
    case 'right':
      imgX += 10; // 오른쪽으로 이동
      break;
  }

  draw(); // 새로운 위치에 이미지 그리기
}

// 서버로부터 사용자 이름을 가져와 화면에 업데이트하는 함수
async function updateUsername() {
  // 사용자가 토큰을 가지고 있으면 사용자 이름을 설정
  try {
    // 서버에 사용자 이름을 요청하기 위한 HTTP GET 요청
    const response = await fetch('http://localhost:3000/getUsername', {
      headers: {
        Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
      },
    });
    
    // 서버로부터 받은 응답 데이터를 JSON 형태로 파싱
    const data = await response.json();

    // 받은 데이터를 이용하여 사용자 이름을 업데이트
    document.getElementById('user').textContent = data.username;
  } catch (error) {
    // 오류 발생 시 오류 메시지를 콘솔에 출력
    console.error('사용자 이름 업데이트 실패:', error);
  }
}

// 게임 상태를 업데이트하는 함수
function updateGame() {
  // 빈 셀을 저장할 배열을 초기화
  emptyCells = [];

  // 보드 내 모든 셀을 반복하여 빈 셀을 emptyCells 배열에 추가
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      // 현재 셀이 비어있는 경우 emptyCells 배열에 해당 셀의 좌표 추가
      if (board[i][j] == 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  // 빈 셀이 있을 경우
  if (emptyCells.length > 0) {
    // emptyCells 배열에서 랜덤한 셀을 선택하여 newNumber(새로운 숫자)를 추가
    chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 새로운 숫자는 2 또는 4 (2는 75%확률, 4는 25% 확률)
    newNumber = (1 + Math.round(Math.random() - 0.25)) * 2;
    // 선택된 셀에 새로운 숫자(newNumber)를 보드에 추가
    board[chosen[0]][chosen[1]] = newNumber;
  }

  // 최고 점수가 현재 점수를 넘어설 경우 최고 점수 업데이트
  if (bestScore < score) {
    bestScore = score;
  }
  bestScoreNum.textContent = bestScore;

  // 캔버스를 초기화하고 게임 보드를 다시 그리는 함수 호출
  draw();

  // 게임 종료 여부 확인
  if (!checkGame()) {
    // 사용자가 토큰을 가지고 있으면 사용자 이름을 업데이트
    if (token) {
      updateUsername();
    }

    // 게임 종료 시 점수 및 최고 점수 업데이트
    gameOverScore.textContent = score;
    userRankNum[5].textContent = bestScore + "점";

    // 게임 종료 시 랭킹 업데이트를 위한 함수 호출
    onGameEnd(score);

    // 게임 종료 메시지 표시
    document.getElementById('gameOverCheck').style.display = 'block';
  }
}

// 왼쪽으로 이동하는 함수
function left() {
  change = false;                             // 변경 여부를 나타내는 변수 초기화

  // 보드의 각 행에 대해 수행
  for (let i = 0; i < side; i++) {
    idx_last = -1;                            // 마지막으로 합쳐진 위치 초기화
    last_number = -1;                         // 마지막으로 합쳐진 숫자 초기화
  
    // 행의 각 열에 대해 수행
    for (let j = 0; j < side; j++) {
      // 현재 숫자와 이전 숫자가 같을 경우
      if (board[i][j] == last_number) {
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        last_number *= 2;                     // 마지막 숫자를 2배로 증가
        board[i][idx_last] = last_number;     // 이전 합쳐진 위치에 새로운 숫자 할당
        score += last_number;                 // 점수 업데이트                                   
        console.log(last_number);             // 확인용 로그 출력
        scoreNum.textContent = score;         // 점수 표시 업데이트
        last_number = -1;                     // 마지막 숫자 초기화
        change = true;                        // 변경 발생
      } else if (board[i][j] != 0 && board[i][idx_last + 1] == 0) {
        // 현재 숫자가 0이 아니고 이동할 위치가 비어 있는 경우
        board[i][idx_last + 1] = board[i][j]; // 현재 숫자를 이동할 위치로 선정
        last_number = board[i][j];            // 마지막 숫자 업데이트
        idx_last = idx_last + 1;              // 이동된 위치 업데이트
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        change = true;                        // 변경 발생
      }
      if (board[i][j] != 0) {
        idx_last = j;                         // 현재 위치 업데이트
        last_number = board[i][j];            // 마지막 숫자 업데이트
      }
    }
  }
  // 변경이 발생했을 경우 게임 상태 업데이트
  if (change) {
    updateGame();
  }
}

// 오른쪽으로 이동하는 함수
function right() {
  change = false;                             // 변경 여부를 나타내는 변수 초기화

  // 보드의 각 행에 대해 수행
  for (let i = 0; i < side; i++) {
    idx_last = side;                          // 마지막으로 합쳐진 위치 초기화
    last_number = -1;                         // 마지막으로 합쳐진 숫자 초기화

    // 행의 역순 열에 대해 수행
    for (let j = side - 1; j >= 0; j--) {
      // 현재 숫자와 이전 숫자가 같은 경우
      if (board[i][j] == last_number) {
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        last_number *= 2;                     // 마지막 숫자를 2배로 증가
        board[i][idx_last] = last_number;     // 이전 합쳐진 위치에 새로운 숫자 할당
        score += last_number;                 // 점수 업데이트
        console.log(last_number);             // 확인용 로그 출력
        scoreNum.textContent = score;         // 점수 표시 업데이트
        last_number = -1;                     // 마지막 숫자 초기화
        change = true;                        // 변경 발생
      } else if (board[i][j] != 0 && board[i][idx_last - 1] == 0) {
        // 현재 숫자가 0이 아니고 이동할 위치가 비어 있는 경우
        board[i][idx_last - 1] = board[i][j]; // 현재 숫자를 이동할 위치로 설정
        last_number = board[i][j];            // 마지막 숫자 업데이트
        idx_last = idx_last - 1;              // 이동된 위치 업데이트
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        change = true;                        // 변경 발생
      }
      if (board[i][j] != 0) {
        idx_last = j;                         // 현재 위치 업데이트
        last_number = board[i][j];            // 마지막 숫자 업데이트
      }
    }
  }

  // 변경이 발생했을 경우 게임 상태 업데이트
  if (change) {
    updateGame();
  }
}

// 아래쪽으로 이동하는 함수
function down() {
  change = false;                             // 변경 여부를 나타내는 변수 초기화

  // 보드의 각 열에 대해 수행
  for (let j = 0; j < side; j++) {
    idx_last = side;                          // 마지막으로 합쳐진 위치 초기화  
    last_number = -1;                         // 마지막으로 합쳐진 숫자 초기화
  
    // 열의 역순 행에 대해 수행
    for (let i = side - 1; i >= 0; i--) {
      // 현재 숫자와 이전 숫자가 같은 경우
      if (board[i][j] == last_number) {
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        last_number *= 2;                     // 마지막 숫자를 2배로 증가
        board[idx_last][j] = last_number;     // 이전 합쳐진 위치에 새로운 숫자 할당
        score += last_number;                 // 점수 업데이트
        console.log(last_number);             // 확인용 로그 출력
        scoreNum.textContent = score;         // 점수 표시 업데이트
        last_number = -1;                     // 마지막 숫자 초기화
        change = true;                        // 변경 발생
      } else if (board[i][j] != 0 && board[idx_last - 1][j] == 0) {
        // 현재 숫자가 0이 아니고 이동할 위치가 비어 있는 경우
        board[idx_last - 1][j] = board[i][j]; // 현재 숫자를 이동할 위치로 설정
        last_number = board[i][j];            // 마지막 숫자 업데이트
        idx_last = idx_last - 1;              // 이동된 위치 업데이트
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        change = true;                        // 변경 발생
      }
      if (board[i][j] != 0) {
        idx_last = i;                         // 현재 위치 업데이트
        last_number = board[i][j];            // 마지막 숫자 업데이트
      }
    }
  }

  // 변경이 발생했을 경우 게임 상태 업데이트
  if (change) {
    updateGame();
  }
}

// 위쪽으로 이동하는 함수
function up() {
  change = false;                             // 변경 여부를 나타내는 변수 초기화

  // 보드의 각 열에 대해 수행
  for (let j = 0; j < side; j++) {
    idx_last = -1;                            // 마지막으로 합쳐진 위치 초기화
    last_number = -1;                         // 마지막으로 합쳐진 숫자 초기화

    // 열의 각 행에 대해 수행
    for (let i = 0; i < side; i++) {
      // 현재 숫자와 이전 숫자가 같은 경우
      if (board[i][j] == last_number) {
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        last_number *= 2;                     // 마지막 숫자를 2배로 증가
        board[idx_last][j] = last_number;     // 이전 합쳐진 위치에 새로운 숫자 할당
        score += last_number;                 // 점수 업데이트
        console.log(last_number);             // 확인용 로그 출력
        scoreNum.textContent = score;         // 점수 표시 업데이트
        last_number = -1;                     // 마지막 숫자 초기화
        change = true;                        // 변경 발생
      } else if (board[i][j] != 0 && board[idx_last + 1][j] == 0) {
        // 현재 숫자가 0이 아니고 이동할 위치가 비어 있는 경우
        board[idx_last + 1][j] = board[i][j]; // 현재 숫자를 이동할 위치로 설정
        last_number = board[i][j];            // 마지막 숫자 업데이트
        idx_last = idx_last + 1;              // 이동된 위치 업데이트
        board[i][j] = 0;                      // 현재 위치를 0으로 설정
        change = true;                        // 변경 발생
      }
      if (board[i][j] != 0) {
        idx_last = i;                         // 현재 위치 업데이트
        last_number = board[i][j];            // 마지막 숫자 업데이트
      }
    }
  }

  // 변경이 발생했을 경우 게임 상태 업데이트
  if (change) {
    updateGame();
  }
}

// 게임 종료 여부를 확인하는 함수
// 빈 셀이 있거나, 인접한 블록에 같은 이미지가 있는지 확인
function checkGame() {
  // 보드를 순회하며 게임 종료 여부 확인
  for (let i = 0; i < side; i++) {
    for (let j = 0; j < side; j++) {
      // 현재 위치가 비어있는지 확인
      if (board[i][j] == 0) {
        return true;                                      // 비어있는 셀이 있으면 게임은 계속될 수 있음을 나타냄
      }
      // 현재 위치에서 오른쪽 또는 아래쪽에 같은 숫자가 있는지 확인
      if (
        i + 1 < side && board[i][j] == board[i + 1][j] || // 아래쪽으로 같은 숫자가 있는지 확인
        j + 1 < side && board[i][j] == board[i][j + 1]    // 오른쪽으로 같은 숫자가 있는지 확인
      ) {
        return true;                                      // 같은 숫자가 인접해 있으면 게임은 계속될 수 있음을 나타냄
      }
    }
  }
  return false;                                           // 모든 셀을 검사했지만 게임 종료 여부 확인되지 않음을 나타냄
}


// 페이지 로딩이 완료되면 게임을 시작
document.addEventListener("DOMContentLoaded", () => {
  startGame();

});

// 키보드 이벤트를 감지하여 해당하는 방향키에 따라 게임 동작을 처리
window.addEventListener('keydown', (e) => {
  // 브라우저에서 화살표 키를 눌렀을 때 스크롤되는 것을 방지합니다.
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
  // 키 코드에 따라 해당하는 방향으로 게임 동작을 수행합니다.
  switch (e.keyCode) {
    case 37:  // 왼쪽 화살표 키
      left(); // 왼쪽 이동 함수 호출
      break;
    case 38:  // 위쪽 화살표 키
      up();   // 위쪽 이동 함수 호출
      break;
    case 39:  // 오른쪽 화살표 키
      right();// 오른쪽 이동 함수 호출
      break;
    case 40:  // 아래쪽 화살표 키
      down(); // 아래쪽 이동 함수 호출
      break;
  }
});

// 키보드 이벤트를 통해 이미지 이동
window.addEventListener('keydown', (e) => {
  // 키 코드에 따라 해당하는 방향으로 이미지를 이동시키는 함수 호출
  switch (e.keyCode) {
    case 37:              // 왼쪽 화살표 키
      moveImage('left');  // 왼쪽으로 이미지 이동 함수 호출
      break;
    case 38:              // 위쪽 화살표 키
      moveImage('up');    // 위쪽으로 이미지 이동 함수 호출
      break;
    case 39:              // 오른쪽 화살표 키
      moveImage('right'); // 오른쪽으로 이미지 이동 함수 호출
      break;
    case 40:              // 아래쪽 화살표 키
      moveImage('down');  // 아래쪽으로 이미지 이동 함수 호출
      break;
  }
});


// 게임 시작 버튼 클릭 시 게임 시작
function startGame() {
  startBtn.addEventListener('click', function(){
  // 게임 시작 버튼을 클릭하면 해당 버튼과 게임 시작 버튼을 숨깁니다.
  document.getElementById('home').style.display = 'block';
  document.getElementsByClassName('scoreBox')[0].style.display = 'block';
  document.getElementsByClassName('scoreBox')[1].style.display = 'block';
  document.getElementById('startBtn').style.display = 'none';
  // 게임을 그릴 캔버스를 보여줍니다.
  reset.style.display = 'block';
  canvas.style.marginTop = '280px';
  startBtn.style.display = 'none';
  manualBtn.style.display = 'none';
  loginBtn.style.display = 'none';
  rankBtn.style.display = 'none';
  // 게임을 초기화하고 시작합니다.
  score = 0;
  board = new Array(side).fill(0).map(() => new Array(side).fill(0));
  updateGame();
})
}

// 게임 도중 홈 화면으로 돌아가는 버튼
homeBtn.addEventListener('click', function(){

// 2048 게임을 초기화 및 중단 시킬 함수 필요
// 홈 버튼, 점수 상자(현재 점수, 최고 점수), 
//초기화 버튼을 없애고 캔버스의 높이 조정 및 시작 버튼과 설명서 버튼을 활성화 함
document.getElementById('home').style.display = 'none';
// 점수도 초기화해야 함
score = 0;
scoreNum.textContent = 0;
ctx.clearRect(0, 0, canvas.width, canvas.height);
document.getElementsByClassName('scoreBox')[0].style.display = 'none';
document.getElementsByClassName('scoreBox')[1].style.display = 'none';
resetBtn.style.display = 'none';
canvas.style.display = 'block';
canvas.style.marginTop = '170px';
startBtn.style.display = 'block';
manualBtn.style.display = 'block';
loginBtn.style.display = 'block';
rankBtn.style.display = 'block';
})

// 게임을 리셋하는 로직
resetBtn.addEventListener('click', function(){

// 게임을 그릴 캔버스를 보여줍니다.
reset.style.display = 'block';
canvas.style.marginTop = '280px';
startBtn.style.display = 'none';
manualBtn.style.display = 'none';
if (bestScore < score) {
bestScore = score;
}
bestScoreNum.textContent = bestScore;
score = 0;
scoreNum.textContent = 0;
board = new Array(side).fill(0).map(() => new Array(side).fill(0));
updateGame();

// 점수도 초기화해야 함
document.getElementsByClassName('scoreBox')[0].style.display = 'reset';
document.getElementsByClassName('scoreBox')[1].style.display = 'reset ';
})

// 다시 시작 네를 선택할 시
reStartBtn_Yes.addEventListener('click', function(){
document.getElementById('gameOverCheck').style.display = 'none';
reset.style.display = 'block';
canvas.style.marginTop = '280px';
startBtn.style.display = 'none';
manualBtn.style.display = 'none';
if (bestScore < score) {
  bestScore = score;
}
bestScoreNum.textContent = bestScore;
score = 0;
scoreNum.textContent = 0;
board = new Array(side).fill(0).map(() => new Array(side).fill(0));
updateGame();

document.getElementsByClassName('scoreBox')[0].style.display = 'reset';
document.getElementsByClassName('scoreBox')[1].style.display = 'reset ';
})

// 다시 시작 아니오를 선택할 시
reStartBtn_No.addEventListener('click', function(){
document.getElementById('gameOverCheck').style.display = 'none';
document.getElementById('home').style.display = 'none';
score = 0;
scoreNum.textContent = 0;
ctx.clearRect(0, 0, canvas.width, canvas.height);
document.getElementsByClassName('scoreBox')[0].style.display = 'none';
document.getElementsByClassName('scoreBox')[1].style.display = 'none';
resetBtn.style.display = 'none';
canvas.style.display = 'block';
canvas.style.marginTop = '170px';
startBtn.style.display = 'block';
manualBtn.style.display = 'block';
loginBtn.style.display = 'block';
rankBtn.style.display = 'block';
})