/* 三星:55個動作包含55個動作以內  
   二星:58個動作包含58個動作以內55個動作以上  
   一星限為滿足過關條件即可*/ 

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
  int i;
  int x, y;
  getKey(&x,&y);
  moveForward();
  turnLeft();
  for (i = 0; i < 4; i++){
    moveForward();
  }
  turnLeft();
  moveForward();
  turnRight();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  turnRight();
  moveForward();
  turnLeft();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  turnLeft();
  moveForward();
  turnRight();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  turnRight();
  fire();
  for (i = 0; i < 3; i++){
    moveForward();
  }
  becameTank();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  fire();
  becameShip();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  becameCar();
  moveForward();
  becameShip();
  turnRight();
  moveForward();
  turnLeft();
  moveForward();
  becameTank();
  moveForward();
  turnLeft();
  moveForward();
  becameCar();
  moveForward();
  turnLeft();
  moveForward();
  becameShip();
  moveForward();
  turnLeft();
  for (i = 0; i < 3; i++){
    moveForward();
  }
  turnRight();
  moveForward();
  becameCar();
  turnLeft();
  for (i = 0; i < 2; i++){
    moveForward();
  }
becameTank();
  turnRight();
  moveForward();
becameCar();
  turnLeft();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  becameShip();
  moveForward();
  becameTank();
  turnLeft();
  for (i = 0; i < 2; i++){
    moveForward();
  }
  turnRight();
  fire();
  moveForward();
becameShip();
  printf("%d",x+y);
  for (i = 0; i < 2; i++){
    moveForward();
  }
  turnLeft();
  moveForward();
  becameCar();
  for (i = 0; i < 2; i++)
  {
    moveForward();
  }

  return 0;
}