#include <vector>
#include <iostream>
#include <math.h>
#define SIZE 256
using namespace std;
string system_mapstr;
int system_map[20][20][2] = {0}; // ex: x,y=5,3 system_map[5][3][0]  [1]為元件位置
int systObjMax = 0, systemObj[2048] = {0}, systObjNowL = 0;
int system_mapsize;
int arrowNum = 0, coinNum = 0;
vector<int> arrowLockX, arrowLockY, treasureX, treasureY; //x,y
vector<string> treasureString;
int peopleAdr[7] = {}; // 0 1 2 xyz  hp armor atk  car0tank1bot2
bool peopleFire = false;
int enemyN = 0, enemy[20][5] = {};								  // 0 1 2 xyz  hp  atk
int stepValue[5][2] = {{1, 0}, {0, -1}, {-1, 0}, {0, 1}, {0, 0}}; // x,y

string treasureStr;
char hint = 'X';
void systD(int temp)
{
	cout << "$sD,," << systemObj[temp] << " ";
	systemObj[temp] -= 1;
	for (int i = temp + 1; i < systObjNowL + 100; i++)
	{
		if (systemObj[i] == systemObj[i - 1] + 1)
		{
			systemObj[i] = systemObj[i - 1];
		}
		else
		{
			systemObj[i] = systemObj[i - 1] + 1;
		}
	}
	// cout << "\nTest:";
	// for (int i = 0; i < 15; i++)
	// {
	// 	cout << systemObj[i] << " ";
	// }
	// cout << endl;

	// 	cout << endl;
}
void systBoon(int x, int y)
{
	int temp = system_map[y][x][1]; //僅線消除  炸彈
	system_map[y][x][0] -= 4;
	systD(temp);
	//開始產生 煙霧
	// int nowLen = systemObj[systObjNowL];
	int nowLen = systObjNowL;

	int dLen = 0;
	cout << "$sA";
	for (int i = 0; i < 5; ++i)
	{
		int newX = x + stepValue[i][0];
		int newY = y + stepValue[i][1];
		if (newX > -1 && newY > -1)
		{
			cout << ",," << systemObj[nowLen + dLen] << ",," << newX << "," << newY << ",0,boon_hit";
			// ++nowLen;
			++dLen;
			++systObjNowL;
		}
	}
	dLen = 0;
	cout << "$sW,,";
	// cout << "  dis \n";
	for (int i = 0; i < 5; ++i)
	{
		int newX = x + stepValue[i][0];
		int newY = y + stepValue[i][1];

		if (newX > -1 && newY > -1)
		{
			// cout<<"\n"<<nowLen + dLen;
			systD(nowLen + dLen);
			++dLen;
		}
	}
	// cout << "\nddd \n";
	/* 消除石頭跟樹*/
	for (int i = 0; i < 5; ++i)
	{
		int newX = x + stepValue[i][0];
		int newY = y + stepValue[i][1];
		int stemp = system_map[newY][newX][0];
		if (stemp % 100 == 1)
		{
			int sysTemp = system_map[newY][newX][1];
			systD(sysTemp);
			system_map[newY][newX][0] -= 1;
		}
		else if (newX == peopleAdr[0] && newY == peopleAdr[1])
		{
			cout << "$sM,,-1,,-1,-1,-1";
			cout << "$sE,,6"; //被炸彈炸死
		}
	}
	if (x == peopleAdr[0] && y == peopleAdr[1])
	{
		cout << "$sM,,-1,,-1,-1,-1";
		cout << "$sE,,6"; //被炸彈炸死
	}
}
void bulletHit()
{
	int checkN = 0, checkE[40][6] = {0}; // 0,1,2,3,4 x,y,方向  hp atk  checkE[20][5] 0沒是 1碰到東西 2處理完成  3碰到炸彈 4碰到敵人 5碰到玩家
	for (int i = 0; i < enemyN; ++i)
	{
		int dx = abs(enemy[i][0] - peopleAdr[0]);
		int dy = abs(enemy[i][1] - peopleAdr[1]);
		if (dx < 3 && dy < 3)
		{ //判斷敵人有沒有在攻擊範圍
			for (int ci = 0; ci < 5; ci++)
			{
				checkE[checkN][ci] = enemy[i][ci];
			}
			checkE[checkN][5] = 0;
			++checkN;
		}
	}
	if (peopleFire) //玩家有發射子彈
	{
		peopleFire = false;
		for (int ci = 0; ci < 4; ci++) //0 1 2 3 x y 方向 hp
		{
			checkE[checkN][ci] = peopleAdr[ci];
		}
		checkE[checkN][4] = peopleAdr[5]; // peopleAdr[5] is atk
		checkE[checkN][5] = 0;
		++checkN;
	}
	int nowLen = systObjNowL;
	int dLen = 0;
	bool firstOut = false;
	systObjNowL += checkN;
	for (int i = 0; i < checkN; i++)
	{
		if (!firstOut)
		{
			firstOut = true;
			cout << "$sA"; //創子彈
		}
		cout << ",," << systemObj[nowLen + i] << ",," << checkE[i][0] << "," << checkE[i][1] << "," << checkE[i][2] << ",bullet";
	}
	// cout << " ";

	vector <int>  list;
	for (int fstep = 0; fstep < 2; fstep++)
	{
		firstOut = false;
		int subHPC = 0;
		for (int i = checkN - 1; i > -1; i--)
		{
			if (checkE[i][5] == 0)
			{
				if (!firstOut)
				{
					firstOut = true;
					cout << "$sM"; //第一格 第二格
				}
				int sdx = stepValue[checkE[i][2]][0], sdy = stepValue[checkE[i][2]][1];
				int nx = checkE[i][0] + sdx, ny = checkE[i][1] + sdy;
				checkE[i][0] = nx, checkE[i][1] = ny;
				int condition = system_map[ny][nx][0] % 100;
				if (condition == 1 || condition == 2 || condition == 5 || condition == 6)
				{ //打到樹 石頭  問號石頭   問號鎖頭 輸出石頭
					cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.7 << "," << (double)sdy * 0.7 << "," << checkE[i][2];
					checkE[i][5] = 1;
				}
				else if (condition == 4)
				{ //敵人打到炸彈  //爆炸&顯示
					cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.7 << "," << (double)sdy * 0.7 << "," << checkE[i][2];
					// cout << ",," << systemObj[nowLen + i] << "," << sdx * 0.7 << "," << sdy * 0.7 << checkE[2];
					checkE[i][5] = 3;
				}
				else if (condition == 15)
				{ //敵人打到敵人  //扣寫機制&顯示
					cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.7 << "," << (double)sdy * 0.7 << "," << checkE[i][2];
					checkE[i][5] = 4;
				}
				else if (nx == peopleAdr[0] && ny == peopleAdr[1])
				{ //敵人打到自己  //扣寫機制&顯示
					cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.7 << "," << (double)sdy * 0.7 << "," << checkE[i][2];
					// cout << ",," << systemObj[nowLen + i] << "," << sdx * 0.7 << "," << sdy * 0.7 << checkE[2];
					checkE[i][5] = 5;
				}
				else
				{ //繼續前進
					if (fstep < 12)
					{
						cout << ",," << systemObj[nowLen + i] << ",," << sdx << "," << sdy << "," << checkE[i][2];
					}
					else
					{
						cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.8 << "," << (double)sdy * 0.8 << "," << checkE[i][2];
					}
				}
			}
		}
		cout << " ";
		/*  讓子彈一起消失 */
		for (int i = 0; i < checkN; i++)
		{
			if (checkE[i][5] == 1)
			{
				systD(nowLen + i);
				checkE[i][5] = 2;
			}
			else if (checkE[i][5] == 3)
			{
				systD(nowLen + i);
			}
			else if (checkE[i][5] == 4)
			{
				systD(nowLen + i);
			}
			else if (checkE[i][5] == 5)
			{
				systD(nowLen + i);
			}
		}
		/*  讓炸彈出現 */
		for (int i = 0; i < checkN; i++)
		{
			if (checkE[i][5] == 3)
			{
				checkE[i][5] = 2;
				systBoon(checkE[i][0], checkE[i][1]);
			}
		}
		/*  讓生命條憶起出現 */
		for (int i = 0; i < checkN; i++)
		{
			if (checkE[i][5] == 4)
			{
				++subHPC;
				int nsx = checkE[i][0], nsy = checkE[i][1];
				for (int ci = 0; ci < enemyN; ci++)
				{
					if (enemy[ci][0] == nsx && enemy[ci][1] == nsy)
					{
						enemy[ci][3] = enemy[ci][3] - checkE[i][4];
						if (subHPC == 1)
						{
							cout << "$sA";
						}
						cout << ",," << systemObj[systObjNowL] << ",," << nsx << "," << nsy << "," << enemy[ci][3] << ",HP"; //obj x y hp HP
						++systObjNowL;
						break;
					}
				}
				//打到敵人  //扣寫機制&顯示
			}
			else if (checkE[i][5] == 5)
			{
				++subHPC;
				++systObjNowL;
				if (subHPC == 1)
				{
					cout << "$sA";
				} //// 0 1 2 xyz  hp armor atk  car0tank1bot2
				int hp = peopleAdr[3] + peopleAdr[4] - checkE[i][4];
				cout << ",,-1,," << peopleAdr[0] << "," << peopleAdr[1] << "," << hp << ",HP"; //obj x y hp HP
																							   //敵人打到自己  //扣寫機制&顯示
			}
		}
		cout << " ";
		systObjNowL -= subHPC;
		/*  讓生命條憶起消失 */

		for (int i = 0; i < checkN; i++)
		{
			if (checkE[i][5] == 4)
			{
				checkE[i][5] = 2;
				int nsx = checkE[i][0], nsy = checkE[i][1];
				for (int ci = 0; ci < enemyN; ci++)
				{
					if (enemy[ci][0] == nsx && enemy[ci][1] == nsy)
					{

						if (enemy[ci][3] <= 0)
						{
							// cout << "$sC,," << system_map[nsy][nsx][1] << ",,"<< "enemyDead "; //obj x y hp HP
							cout << "$sC,," << systemObj[system_map[nsy][nsx][1]] << ",,"<< "enemyDead "; //obj x y hp HP
							enemy[ci][0] = 100, enemy[ci][1] = 100, enemy[ci][2] = 0, enemy[ci][3] = 0;
							// systD(systemObj[system_map[nsy][nsx][1]]);
							list.push_back(system_map[nsy][nsx][1]);
							system_map[nsy][nsx][0] -= 15;
						}
						systD(systObjNowL);
						++systObjNowL;
						break;
					}
				}
			}
			else if (checkE[i][5] == 5)
			{
				checkE[i][5] = 2;
				int hp = peopleAdr[3] + peopleAdr[4] - checkE[i][4];
				peopleAdr[4] = peopleAdr[4] - checkE[i][4];
				systD(systObjNowL);
				++systObjNowL;
				if (hp <= 0)
				{
					cout << "$sE,,7 ";
				}
				//敵人打到自己  //扣寫機制&顯示
			}
		}
	}
	// cout << " ";
	firstOut = false;
	for (int i = checkN - 1; i > -1; i--)
	{ //最後都沒打到東西
		if (checkE[i][5] == 0)
		{
			int sdx = stepValue[checkE[i][2]][0], sdy = stepValue[checkE[i][2]][1];
			if (!firstOut)
			{
				firstOut = true;
				cout << "$sM";
			}
			cout << ",," << systemObj[nowLen + i] << ",," << (double)sdx * 0.3 << "," << (double)sdy * 0.3 << "," << checkE[i][2];
		}
	}
	// cout << " ";
	firstOut = false;
	for (int i = 0; i < checkN; i++)
	{ //最後都沒打到東西 刪掉
		if (checkE[i][5] == 0)
		{
			// systD(nowLen + i);
			systD(nowLen + i);
			
		}
	}
	for (int i = 0; i < list.size(); i++)
	{
		systD(list[i]);
		/* code */
	}
	

}

void actionJudgeNowAdr()
{
	int x = peopleAdr[0], y = peopleAdr[1];
	int var = system_map[y][x][0] % 100;
	hint = 'X';

	if (x < 0 || y < 0 || x >= system_mapsize || x >= system_mapsize)
	{
		cout << "$sE,,3"; //駛出地圖
	}
	else if (var == 1 || var == 2 || var == 5 || var == 6 || var == 16)
	{
		cout << "$sE,,4"; //撞到障礙物
	}
	else if (var == 50 || var == 51)
	{						  //終點線
		cout << "$sE,,2"; //抵達終點
	}
	else if (var == 3)
	{ // 3  為硬幣
		int temp = system_map[y][x][1];
		systD(temp);
		system_map[y][x][0] -= 3;
		--coinNum;
		if (coinNum == 0)
		{
			cout << "$sE,,10"; //金幣完成
		}
	}
	else if (var == 4 || var == 15)
	{ // 4  為炸彈
		cout << "$sM,,-1,,-1,-1,-1";
		systBoon(x, y);
		cout << "$sE,,6"; //被炸彈炸死
	}
	else if (var >= 7 && var <= 10)
	{ // 7 8 9 10 為箭頭
		if ((var - 7) == peopleAdr[2])
		{
			int temp = system_map[y][x][1];
			cout << "$sC,," << systemObj[temp] << ",,arrowWite ";
			--arrowNum;
			system_map[y][x][0] -= var;
			if (arrowNum == 0)
			{
				for (int di = 0; di < arrowLockX.size(); di++)
				{
					int tempd = system_map[arrowLockY[di]][arrowLockX[di]][1];
					cout << "$sC,," << systemObj[tempd] << ",,unlock ";
					// cout << "  systW,,  ";
					systD(tempd);
					system_map[arrowLockY[di]][arrowLockX[di]][0] -= 5;
				}
				// cout << "  systW,,  ";
				// for (int di = 0; di < arrowLockX.size(); di++)
				// {
				// 	int tempd = system_map[arrowLockY[di]][arrowLockX[di]][1];
				// 	// cout << " systC,," << systemObj[tempd] << ",,unlock ";
				// 	systD(tempd);
				// 	system_map[arrowLockY[di]][arrowLockX[di]][0] -= 5;
				// }
			}
		}
	}
	else if (var >= 11 && var <= 14)
	{ // 11 12 13 14 為問號的亂數   0右 1上 2左 3下
		int temp = system_map[y][x][1];
		int systRand = var - 11;
		string systStr = "RFL";
		if (peopleAdr[2] == 0)
		{
			cout << "$sC,," << systemObj[temp] << ",," << systStr[(systRand + 1) % 4] << " ";
			hint = systStr[(systRand + 1) % 4];
		}
		else if (peopleAdr[2] == 1)
		{
			cout << "$sC,," << systemObj[temp] << ",," << systStr[systRand] << " ";
			hint = systStr[systRand];
		}
		else if (peopleAdr[2] == 2)
		{
			cout << "$sC,," << systemObj[temp] << ",," << systStr[systRand - 1] << " ";
			hint = systStr[systRand - 1];
		}
		else if (peopleAdr[2] == 3)
		{
			cout << "$sC,," << systemObj[temp] << ",," << systStr[(systRand + 2) % 4] << " ";
			hint = systStr[(systRand + 2) % 4];
		}
		system_map[y][x][0] -= var;
		int sdX = x + stepValue[systRand][0], sdY = y + stepValue[systRand][1];
		int sdtemp = system_map[sdY][sdX][1];
		systD(sdtemp);
		system_map[sdY][sdX][0] -= 2;
	}
	bulletHit();
}
void actionJudgeNextAdr(int x, int y)
{
	int nx = x + stepValue[peopleAdr[2]][0], ny = y + stepValue[peopleAdr[2]][1];
	int varS = system_map[ny][nx][0] % 100;
	if (varS == 16)
	{ // 16  為寶箱
		int temp = system_map[ny][nx][1];
		for (int i = 0; i < treasureX.size(); i++)
		{
			if (treasureX[i] == nx && treasureY[i] == ny)
			{
				treasureStr = treasureString[i];
				treasureX.erase(treasureX.begin() + i);
				treasureY.erase(treasureY.begin() + i);
				treasureString.erase(treasureString.begin() + i);
				break;
			}
		}
		systD(temp);
		system_map[ny][nx][0] -= 16;
	}
	for (int i = 0; i < 4; ++i)
	{
		int var = system_map[y + stepValue[i][1]][x + stepValue[i][0]][0] % 100;
		if (var == 6)
		{ // 6  為輸出鎖頭
			int temp = system_map[y + stepValue[i][1]][x + stepValue[i][0]][1];
			// cout << " systI,," << systemObj[temp] << ",,";
			cout << "$sI,," << x + stepValue[i][0] << "," << y + stepValue[i][1] << ",,";
			break;
		}
	}
}
void step()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	// cout << "user: " << peopleAdr[6] << "  map:" << mapEvloution;
	hint = 'X';
	if (peopleAdr[6] == mapEvloution)
	{
		int addx = stepValue[peopleAdr[2]][0];
		int addy = stepValue[peopleAdr[2]][1];
		peopleAdr[0] += addx;
		peopleAdr[1] += addy;
		// cout << " px: " << peopleAdr[0]<< " py:" <<peopleAdr[1];
		cout << "$sM,,-1,," << addx << "," << addy << ",0";
		// 	cout << endl;
		actionJudgeNowAdr();
		// actionJudgeNextAdr(peopleAdr[0] + addx, peopleAdr[1] + addy);
		actionJudgeNextAdr(peopleAdr[0], peopleAdr[1]);
	}
	else
	{
		cout << "$sM,,-1,,0,0,0";
		// 	cout << endl;
	}
}
void turnRight()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	if (peopleAdr[6] == mapEvloution)
	{
		cout << "$sM,,-1,,0,0,-1";
		peopleAdr[2] = (peopleAdr[2] + 3) % 4;
		actionJudgeNowAdr();
		actionJudgeNextAdr(dx, dy);
	}
	else
	{
		cout << "$sM,,-1,,0,0,0";
	}
}
void turnLeft()
{
	int dx = peopleAdr[0], dy = peopleAdr[1];
	int mapEvloution = (system_map[dy][dx][0] / 100) - 1;
	if (peopleAdr[6] == mapEvloution)
	{
		cout << "$sM,,-1,,0,0,1";
		peopleAdr[2] = (peopleAdr[2] + 1) % 4;
		actionJudgeNowAdr();
		actionJudgeNextAdr(dx, dy);
	}
	else
	{
		cout << "$sM,,-1,,0,0,0";
	}
}
void becameCar()
{
	peopleAdr[6] = 0;
	cout << "$sC,,-1,,car";
	// 	cout << endl;
	bulletHit();
}
void becameTank()
{
	peopleAdr[6] = 1;
	cout << "$sC,,-1,,tank";
	// 	cout << endl;
	bulletHit();
}
void becameShip()
{
	peopleAdr[6] = 2;
	cout << "$sC,,-1,,bot";
	// 	cout << endl;
	bulletHit();
}
void fire()
{
	peopleFire = true;
	bulletHit();
}
void input_init()
{
	//system_map string
	int x = 0, y = 0, r = 0, num = 0, hp, armor, atk, type;
	string temp;
	cin >> system_mapstr;
	system_mapsize = sqrt(system_mapstr.length());
	for (int i = 0; i < system_mapsize; ++i)
	{
		for (int j = 0; j < system_mapsize; ++j)
		{
			if (system_mapstr[i * system_mapsize + j] == '0')
			{
				system_map[i][j][0] += 100;
			}
			else if (system_mapstr[i * system_mapsize + j] == '1')
			{
				system_map[i][j][0] += 200;
			}
			else if (system_mapstr[i * system_mapsize + j] == '2')
			{
				system_map[i][j][0] += 300;
			}
		}
	}
	systObjMax = system_mapsize * system_mapsize + 10;
	for (int i = 0; i < systObjMax; i++)
	{
		systemObj[i] = i;
	}

	cin >> x >> y >> r >> hp >> armor >> atk >> type;
	peopleAdr[0] = x, peopleAdr[1] = y, peopleAdr[2] = r;
	peopleAdr[3] = hp, peopleAdr[4] = armor, peopleAdr[5] = atk;
	peopleAdr[6] = type;
	cin >> num;
	for (int i = 0; i < num; ++i)
	{
		cin >> x >> y >> r;
		system_map[y][x][0] += r + 50; //50- 51| 為終點線
	}
	cin >> num;
	systObjNowL = num;
	for (int i = 0; i < num; ++i)
	{
		cin >> temp;
		cin >> x >> y;
		if (temp == "tree" || temp == "stone")
		{
			system_map[y][x][0] += 1; //1 為障礙物
			system_map[y][x][1] = i;
		}
		else if (temp == "questionstone")
		{
			system_map[y][x][0] += 2; //2 為問號石頭
			system_map[y][x][1] = i;
		}
		else if (temp == "coin")
		{
			system_map[y][x][0] += 3; //3  為硬幣
			system_map[y][x][1] = i;

			++coinNum;
		}
		else if (temp == "boon")
		{
			system_map[y][x][0] += 4; //4  為炸彈
			system_map[y][x][1] = i;
		}
		else if (temp == "lock_arrow")
		{
			system_map[y][x][0] += 5; //5  為箭頭鎖頭
			system_map[y][x][1] = i;
			arrowLockX.push_back(x);
			arrowLockY.push_back(y);
		}
		else if (temp == "lock_output")
		{
			system_map[y][x][0] += 6; //6  為輸出鎖頭
			system_map[y][x][1] = i;
		}
		else if (temp == "arrow")
		{
			cin >> r;
			system_map[y][x][0] += 7 + r; //7 8 9 10 為箭頭  分別為0 90 180 270 度
			system_map[y][x][1] = i;
			++arrowNum;
		}
		else if (temp == "questionMark")
		{
			cin >> r;
			system_map[y][x][0] += 11 + r; // 11 12 13 14  為問號的亂數  0-- |1 --2  3|
			system_map[y][x][1] = i;
		}
		else if (temp == "enemyTank")
		{
			cin >> r >> hp >> atk;
			enemy[enemyN][0] = x, enemy[enemyN][1] = y, enemy[enemyN][2] = r;
			enemy[enemyN][3] = hp, enemy[enemyN][4] = atk;
			++enemyN;
			system_map[y][x][0] += 15; //15 敵人
			system_map[y][x][1] = i;
		}
		else if (temp == "treasure")
		{
			cin >> temp;
			treasureString.push_back(temp);
			treasureX.push_back(x);
			treasureY.push_back(y);
			system_map[y][x][0] += 16; //16 寶箱
			system_map[y][x][1] = i;
		}
	}
	if (coinNum > 0)
	{
		cout << "$sE,,9"; //金幣未完成
	}
	//	//test//
	// for (int i = 0; i < 7; ++i)
	// {
	// 	cout << peopleAdr[i];
	// 	if (i < 6)
	// 	{
	// 		cout << " ";
	// 	}
	// 	else
	// 	{
	// 		// 	cout << endl;
	// 	}
	// }
	// for (int i = 0; i < enemyN; ++i)
	// {
	// 	for (int j = 0; j < 5; ++j)
	// 	{
	// 		cout << enemy[i][j] << " ";
	// 	}
	// 	// 	cout << endl;
	// }
	// for (int i = 0; i < system_mapsize; ++i)
	// {
	// 	for (int j = 0; j < system_mapsize; ++j)
	// 	{
	// 		cout << system_map[i][j][0] << "  ";
	// 	}
	// 	// 	cout << endl;
	// }

	//  //
}
void getBox(char *str)
{
	for (int i = 0; i < treasureStr.length(); i++)
	{
		str[i] = treasureStr[i];
	}
}


#include <stdio.h>
#include <stdlib.h>
#include <string.h>
int main(int argc, char *argv[])
{
    input_init();
    step();step();
	return 0;
 }


