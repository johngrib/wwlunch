# wwlunch
* 우아한 형제들의 날짜별 식사 메뉴를 커맨드라인에서 조회할 수 있습니다.

## 설치하는 방법
* node.js 와 npm 이 설치되어 있어야 합니다.
```
git clone https://github.com/johngrib/wwlunch.git
cd wwlunch
npm install -g
npm link
```

## 사용법
* 도움말과 예제를 본다.
```
wwlunch --help
```
* 오늘의 식사 메뉴를 조회한다.
```
wwlunch
```
* 3일간의 식사 메뉴를 조회한다.
```
wwlunch 3
```
* 지난 5일간의 식사 메뉴를 조회한다.
```
wwlunch -5
```
* 8월 8일의 식사 메뉴를 조회한다.
```
wwlunch 2016.08.08
wwlunch 08.08
```
* 8월 8일부터 4일 간의 식사 메뉴를 조회한다.
```
wwlunch 2016.08.08 4
wwlunch 4 2016.08.08
```
* 8월 9일부터 지난 3일 간의 식사 메뉴를 조회한다.
```
wwlunch 2016.08.09 -3
wwlunch -3 2016.08.09
```
