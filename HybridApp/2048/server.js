const express = require('express'); // Express 웹 프레임워크
const fs = require('fs');           // 파일 시스템 모듈
const jwt = require('jsonwebtoken');// JSON 웹 토큰 모듈
const cors = require('cors');       // CORS 미들웨어 모듈

// Express 앱 생성
const app = express();

// CORS 미들웨어 설정 - 모든 origin으로부터의 요청 허용
app.use(cors());

// 파일 경로 설정
const filePath = 'loginData.txt';

// 토큰 시크릿 키 설정
const secretKey = 'your-secret-key';

// 토큰 생성 함수
function generateToken(username) {
  return jwt.sign({ username }, secretKey, { expiresIn: '1h' });
}

// CORS 설정 미들웨어
app.use((req, res, next) => {
  // 헤더 설정 - 요청 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// body-parser 미들웨어 설정 - JSON 및 폼 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로그인 정보를 기록하고 최고 기록 저장하는 엔드포인트 설정
app.post('/login', async (req, res) => {
  try {
    // 요청 바디에서 데이터 추출
    const { username, password, bestScore } = req.body;

    // 파일에서 데이터 불러옴
    var fileData = fs.readFileSync(filePath, 'utf8');
    var loadedDataArray = fileData.split('\n').filter(Boolean).map(JSON.parse);

    // 사용자 정보를 찾아서 업데이트 또는 추가
    const index = loadedDataArray.findIndex(user => user.username === username && user.password === password);
    if (index !== -1) {
      // 사용자가 이미 존재하는 경우
      loadedDataArray[index].bestScore = Math.max(loadedDataArray[index].bestScore, bestScore);
    } else {
      // 새로운 사용자인 경우
      loadedDataArray.push({ username, password, bestScore });
    }

    // 파일에 데이터 쓰기
    const updatedDataString = loadedDataArray.map(user => JSON.stringify(user)).join('\n');
    fs.writeFileSync(filePath, updatedDataString);

    // 토큰 생성
    const token = generateToken(username);

    res.status(200).json({ message: '로그인 정보가 저장되었습니다.', token });
  } catch (error) {
    res.status(500).json({ error: '서버 오류입니다.' });
  }
});

// 랭킹 데이터를 반환하는 엔드포인트 설정
app.get('/getRanking', (req, res) => {
  try {
    // 파일에서 데이터 불러옴
    var fileData = fs.readFileSync(filePath, 'utf8');
    // JSON 문자열을 JavaScript 객체로 파싱
    var loadedDataArray = fileData.split('\n').filter(Boolean).map(JSON.parse);
    // 최고 점수 정렬
    loadedDataArray.sort((a, b) => b.bestScore - a.bestScore);

    // 상위 5개 항목만 출력
    const top5 = loadedDataArray.slice(0, 5);
    res.status(200).json(top5);
  } catch (e) {
    console.error('파일 읽는 중 오류 발생:', e);
    res.status(500).json({ error: '서버 오류입니다.' });
  }
});

// 랭킹 업데이트를 위한 새로운 엔드포인트 추가
app.post('/updateScore', async (req, res) => {
  try {
    const { score } = req.body;

    // 현재 사용자의 토큰을 확인하고 사용자 식별 가능
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], secretKey);
    const username = decoded.username;

    // 파일에서 데이터 불러옴
    var fileData = fs.readFileSync(filePath, 'utf8');
    var loadedDataArray = fileData.split('\n').filter(Boolean).map(JSON.parse);

    // 사용자 정보를 찾아서 업데이트 또는 추가
    const index = loadedDataArray.findIndex(user => user.username === username);
    if (index !== -1) {
      // 사용자가 이미 존재하는 경우
      loadedDataArray[index].bestScore = Math.max(loadedDataArray[index].bestScore, score);

      // 파일에 데이터 쓰기
      const updatedDataString = loadedDataArray.map(user => JSON.stringify(user)).join('\n');
      fs.writeFileSync(filePath, updatedDataString);

      res.status(200).json({ message: '랭킹이 업데이트되었습니다.' });
    } else {
      res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('랭킹 업데이트 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류입니다.' });
  }
});

// 사용자 이름을 반환하는 엔드포인트 설정
app.get('/getUsername', (req, res)=>{
  try {
    // 현재 사용자의 토큰을 확인하고 사용자 식별 가능
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], secretKey);
    const username = decoded.username;

    // 사용자 이름 반환
    res.status(200).json({ username });
  } catch (error) {
    console.error('사용자 이름을 불러오는 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류입니다.' });
  }
})

// 포트 설정 및 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
