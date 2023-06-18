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

	WriteToBuffer(25, 10, "������");
	WriteToBuffer(25, 12, "1. ���ӽ���");
	WriteToBuffer(25, 13, "2. ��������");

	DrawBuffer(deltaTime);
	deltaTime = GetTickCount() - time_end;
	time_end = GetTickCount();
	if (deltaTime < 33)
		Sleep(33 - deltaTime);

	while (isGameRunning)
	{
		if (_kbhit())
		{
			int key = _getch();  // Ű���� �Է� �ޱ�
			if (key == KEY_1 && !isGameStarted)
			{
				isGameStarted = 1;
				ClearBuffer(); // ȭ�� �����
				DrawBuffer(deltaTime); // �ʱ� ���� �׸���
				deltaTime = GetTickCount() - time_end;
				time_end = GetTickCount();
				if (deltaTime < 33)
					Sleep(33 - deltaTime);
				continue;
			}
			else if (key == KEY_2)
			{
				printf("������ �����մϴ�.\n");
				isGameRunning = 0;
				exit(0);
			}
		}
		if (!isGameStarted) // ������ ���۵��� ���� ����
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

	//��� ������ �ʱ�ȭ
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
	//���� ����
	GameState = 0;
	deltaTimeSum = 0;
	MovingTime = 300;

	//�÷��̾� �ʱ�ȭ
	player.posX = 35;
	player.posY = 10;

	//�� ������ �ʱ�ȭ
	snakeBodyLength = 2;
	int i = 0;
	while (i < BODY_LENGTH)
	{
		skin[i].active = 0;
		skin[i].posX = player.posX;
		skin[i].posY = player.posY;

		i = i + 1;
	}

	//��� �ʱ�ȭ
	initApplePos();

	//����� �� ������ �ʱ�ȭ
	snakeBodyLength = 2;
	i = 0;
	while (i < snakeBodyLength)
	{
		skin[i].active = 1;
		skin[i].posX = player.posX;
		skin[i].posY = player.posY - i;

		i = i + 1;
	}

	//ȭ�� �ʱ�ȭ
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
	// ����� �浹 üũ
	if (player.posX == apple.posX && player.posY == apple.posY)
	{
		snakeBodyLength++; // ���� ���� ����
		skin[snakeBodyLength - 1].active = 1; // ���ο� ���� Ȱ��ȭ
		initApplePos(); // ��� ��ġ �ʱ�ȭ
		return 1; // �浹 �߻�
	}
	return 0; // �浹 ����
}


int DrawBuffer(int DeltaTime)
{
	//��� �׸���
	SetColor(0b0000, 0b0111);
	setCursorPos(0, 0);
	printf("%s", ScreenBuffer);

	//�� ������Ʈ
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
			// �浹 �� ���� ���� ������ ���ο� ���� Ȱ��ȭ�� ó��
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


	//�� �׸���
	SetColor(0b0000, 0b1010);
	int i = snakeBodyLength - 1;
	while (i >= 0)
	{
		setCursorPos(skin[i].posX, skin[i].posY);
		printf("0");
		i = i - 1;
	}

	//��� �׸���
	setCursorPos(apple.posX, apple.posY);
	SetColor(0b0000, 0b0100);
	printf("*");

	//���� �ʱ�ȭ
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
			player.posX -= 1;  // �������� �̵�
			break;
		case 'd':
			player.posX += 1;  // ���������� �̵�
			break;
		case 'w':
			player.posY -= 1;  // ���� �̵�
			break;
		case 's':
			player.posY += 1;  // �Ʒ��� �̵�
			break;
		}
	}
}