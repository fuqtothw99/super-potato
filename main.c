#include <stdio.h>
#include <stdlib.h>
#include <Windows.h>
#include <conio.h>
#include "screen.h"
#include "util.h"

struct SnakeBody
{
	int posX;
	int posY;
	int active;
};

struct Apple
{
	int posX;
	int posY;
	int active;
};

struct Player
{
	int posX;
	int posY;
};

#define BODY_LENGTH 1400

int Initialize();
int Release();
int DrawBuffer(int DeltaTime);
void HandleInput();

int GameState = 0;

struct SnakeBody skin[BODY_LENGTH];
struct Apple apple;
struct Player player;

int snakeBodyLength = 2;
int MovingTime = 1000;
int deltaTimeSum = 0;
int appleCount = 0;

int isGameOver = 0;

int main()
{
	const int KEY_1 = '1';
	const int KEY_2 = '2';

	int isGameRunning = 1;
	int isGameStarted = 0;

	CHECKERROR(Initialize());

	unsigned long time_end = GetTickCount();
	unsigned long deltaTime = GetTickCount();

	WriteToBuffer(25, 10, "지렁이");
	WriteToBuffer(25, 12, "1. 게임시작");
	WriteToBuffer(25, 13, "2. 게임종료");

	DrawBuffer(deltaTime);
	deltaTime = GetTickCount() - time_end;
	time_end = GetTickCount();
	if (deltaTime < 33)
		Sleep(33 - deltaTime);

	while (isGameRunning)
	{
		if (_kbhit())
		{
			int key = _getch();  // 키보드 입력 받기
			if (key == KEY_1 && !isGameStarted)
			{
				isGameStarted = 1;
				ClearBuffer(); // 화면 지우기
				DrawBuffer(deltaTime); // 초기 상태 그리기
				deltaTime = GetTickCount() - time_end;
				time_end = GetTickCount();
				if (deltaTime < 33)
					Sleep(33 - deltaTime);
				continue;
			}
			else if (key == KEY_2)
			{
				printf("게임을 종료합니다.\n");
				isGameRunning = 0;
				exit(0);
			}
		}
		if (!isGameStarted) // 게임이 시작되지 않은 상태
			continue;

		DrawBuffer(deltaTime);
		deltaTime = GetTickCount() - time_end;
		time_end = GetTickCount();
		if (deltaTime < 33)
			Sleep(33 - deltaTime);

		HandleInput();
	}

	CHECKERROR(Release());

	exit(1);
	return 0;
}

void initApplePos()
{
	srand(time(NULL));

	//사과 데이터 초기화
	apple.active = 0;
	apple.posX = rand() % 70;
	apple.posY = rand() % 20;
	int i = 0;
	while (i < BODY_LENGTH)
	{
		if (skin[i].posX == apple.posX && skin[i].posY == apple.posY)
		{
			apple.posX = rand() % 70;
			apple.posY = rand() % 20;
			i = 0;
		}
		else
		{
			i = i + 1;
		}
	}
}


int Initialize()
{
	//게임 상태
	GameState = 0;
	deltaTimeSum = 0;
	MovingTime = 300;

	//플레이어 초기화
	player.posX = 35;
	player.posY = 10;

	//뱀 데이터 초기화
	snakeBodyLength = 2;
	int i = 0;
	while (i < BODY_LENGTH)
	{
		skin[i].active = 0;
		skin[i].posX = player.posX;
		skin[i].posY = player.posY;

		i = i + 1;
	}

	//사과 초기화
	initApplePos();

	//사용할 뱀 데이터 초기화
	snakeBodyLength = 2;
	i = 0;
	while (i < snakeBodyLength)
	{
		skin[i].active = 1;
		skin[i].posX = player.posX;
		skin[i].posY = player.posY - i;

		i = i + 1;
	}

	//화면 초기화
	setScreenSize(70, 20);
	setCursorIcon(0);
	ClearBuffer();

	return 0;
}

int Release()
{
	return 0;
}

int CheckCollision()
{
	// 사과와 충돌 체크
	if (player.posX == apple.posX && player.posY == apple.posY)
	{
		snakeBodyLength++; // 꼬리 길이 증가
		skin[snakeBodyLength - 1].active = 1; // 새로운 꼬리 활성화
		initApplePos(); // 사과 위치 초기화
		return 1; // 충돌 발생
	}
	return 0; // 충돌 없음
}


int DrawBuffer(int DeltaTime)
{
	//배경 그리기
	SetColor(0b0000, 0b0111);
	setCursorPos(0, 0);
	printf("%s", ScreenBuffer);

	//뱀 업데이트
	if (DeltaTime > 0)
		deltaTimeSum = deltaTimeSum + DeltaTime;

	if (deltaTimeSum >= MovingTime)
	{
		player.posX = player.posX + 1;
		int i = snakeBodyLength - 1;
		while (i >= 0)
		{
			if (i > 0)
			{
				skin[i].posX = skin[i - 1].posX;
				skin[i].posY = skin[i - 1].posY;
			}
			else
			{
				skin[i].posX = player.posX;
				skin[i].posY = player.posY;
			}
			i = i - 1;
		}
		if (CheckCollision())
		{
			// 충돌 시 꼬리 길이 증가와 새로운 꼬리 활성화를 처리
			int i = snakeBodyLength - 2;
			while (i >= 0)
			{
				skin[i + 1].posX = skin[i].posX;
				skin[i + 1].posY = skin[i].posY;
				i--;
			}
			skin[0].posX = player.posX;
			skin[0].posY = player.posY;
		}
		deltaTimeSum = 0;
	}


	//뱀 그리기
	SetColor(0b0000, 0b1010);
	int i = snakeBodyLength - 1;
	while (i >= 0)
	{
		setCursorPos(skin[i].posX, skin[i].posY);
		printf("0");
		i = i - 1;
	}

	//사과 그리기
	setCursorPos(apple.posX, apple.posY);
	SetColor(0b0000, 0b0100);
	printf("*");

	//색상 초기화
	SetColor(0b0000, 0b0111);
	setCursorPos(0, 22);
	if (DeltaTime != 0)
		printf("Delta Time : %d              \nfps :%d\n          ", DeltaTime, 1000 / DeltaTime);

	return 0;
}
void HandleInput()
{
	if (_kbhit())
	{
		int key = _getch();
		switch (key)
		{
		case 'a':
			player.posX -= 1;  // 왼쪽으로 이동
			break;
		case 'd':
			player.posX += 1;  // 오른쪽으로 이동
			break;
		case 'w':
			player.posY -= 1;  // 위로 이동
			break;
		case 's':
			player.posY += 1;  // 아래로 이동
			break;
		}
	}
}