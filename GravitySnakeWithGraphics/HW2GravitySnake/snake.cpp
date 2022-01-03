#include "pch.h"
#include <iostream>
#include <conio.h>
#include <Box2D/Box2D.h>
#define SFML_STATIC
#include <SFML/Window.hpp>
#include <SFML/Graphics.hpp>
#include "snake.h"
using namespace std;

//Takes in the snake as a paramater
//Checks for keyboard input
//Moves the snake or exits the loop based on input
bool applyForces(b2Body* snake)
{
	float horizontalMove = 100;
	float verticalMove = 250;
	//Leaves the program
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::Escape))
	{
		return false;
	}

	//Move up
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::W) || sf::Keyboard::isKeyPressed(sf::Keyboard::Up))
	{
		snake->ApplyForceToCenter(b2Vec2(0, -verticalMove), true);
	}

	//Move left
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::A) || sf::Keyboard::isKeyPressed(sf::Keyboard::Left))
	{
		snake->ApplyForceToCenter(b2Vec2(-horizontalMove, 0), true);
	}

	//Move down (if you can't wait for gravity... impatiant bastard)
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::S) || sf::Keyboard::isKeyPressed(sf::Keyboard::Down))
	{
		snake->ApplyForceToCenter(b2Vec2(0, verticalMove), true);
	}

	//Move right
	if (sf::Keyboard::isKeyPressed(sf::Keyboard::D) || sf::Keyboard::isKeyPressed(sf::Keyboard::Right))
	{
		snake->ApplyForceToCenter(b2Vec2(horizontalMove, 0), true);
	}

	return true;
}

//Takes in a pointer to the apple's coordinates
//Generates random numbers for the coordinates
//Replaces the coordinates to give it a new position
void moveTarget(b2Vec2* applePos)
{
	float xCoord = rand() % 950;
	xCoord += 20.0f;
	float yCoord = rand() % 950;
	yCoord += 20.0f;

	*applePos = b2Vec2(xCoord, yCoord);
}

//Takes in the snake and the apple
//Calculates how far the snake is in the x and y axis from the apple
//If they are within 0.2, then a collision has occured
//Returns true if there is a collision, false if not
bool checkCollision(b2Vec2 * apple, b2Body * snake)
{
	float tollerance = 17.0f;
	float xDist = abs(apple->x - snake->GetPosition().x);
	float yDist = abs(apple->y - snake->GetPosition().y);

	if (xDist < tollerance && yDist < tollerance) 
	{
		return true;
	}
	return false;
}
