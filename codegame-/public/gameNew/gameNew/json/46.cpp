#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[])
{
  int i;
  int *x, *y;
  step();
  turnLeft();
  for (i = 0; i < 4; i++){
    step();
  }
  turnLeft();
  step();
  turnRight();
  for (i = 0; i < 3; i++){
    step();
  }
  turnRight();
  step();
  turnLeft();
  for (i = 0; i < 2; i++){
    step();
  }
  turnLeft();
  step();
  turnRight();
  for (i = 0; i < 2; i++){
    step();
  }
  turnRight();
  fire();
  for (i = 0; i < 3; i++){
    step();
  }
  becameTank();
  for (i = 0; i < 2; i++){
    step();
  }
  becameShip();
  fire();
  for (i = 0; i < 2; i++){
    step();
  }
  becameCar();
  step();
  becameShip();
  turnRight();
  step();
  turnLeft();
  step();
  becameTank();
  step();
  turnLeft();
  step();
  becameCar();
  step();
  turnLeft();
  step();
  becameShip();
  step();
  turnLeft();
  for (i = 0; i < 3; i++){
    step();
  }
  turnRight();
  step();
  becameCar();
  turnLeft();
  for (i = 0; i < 2; i++){
    step();
  }
  turnRight();
  fire();
  step();
  turnLeft();
  for (i = 0; i < 3; i++){
    step();
  }
  becameShip();
  step();
  becameTank();
  turnLeft();
  for (i = 0; i < 2; i++){
    step();
  }
  turnRight();
  fire();
  step();
  printf("% d", *x + *y);
  for (i = 0; i < 2; i++){
    step();
  }
  turnLeft();
  step();
  becameCar();
  for (i = 0; i < 2; i++)
  {
    step();
  }

  return 0;
}
