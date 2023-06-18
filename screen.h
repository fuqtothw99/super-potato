#pragma once

char ScreenBuffer[65536];

void setScreenSize(int width, int height);
void setCursorIcon(int isActive);
void setCursorPos(int x, int y);
void SetColor(unsigned short backgroundColor, unsigned short textColor);

void ClearBuffer();
int WriteToBuffer(int x, int y, const char* str);