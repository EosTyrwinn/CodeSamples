#pragma once
#include <Box2D/Box2D.h>
//Forward Declarations of methods
void display(b2Vec2 pos, b2Vec2* appPos, int goal, int got);
bool applyForces(b2Body* snake);
void moveTarget(b2Vec2* applePos);
bool checkCollision(b2Vec2* apple, b2Body* snake);