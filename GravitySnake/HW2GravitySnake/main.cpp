#include "pch.h"
#include "snake.h"
#include <iostream>
#include <time.h>
#include <conio.h>
#include <stdio.h>
#include <string>

#include <Box2D/Box2D.h>

#define SFML_STATIC
#include <SFML/Window.hpp>
#include <SFML/Graphics.hpp>
#include <SFML/Audio.hpp>

#define _CRTDBG_MAP_ALLOC
#include <cstdlib>
#include <crtdbg.h>
using namespace std;

void Wrapper()
{
	//Make window
	sf::RenderWindow window(sf::VideoMode(1600, 1000), "Gravity Snake");

	//Making the world
	b2Vec2 gravity(0.0f, 25.0f);
	b2World world(gravity);

	//Make ground (Now ceiling)
	b2BodyDef groundBodyDef;
	groundBodyDef.position.Set(0.0f, -10.0f);
	b2Body* groundBody = world.CreateBody(&groundBodyDef);

	b2PolygonShape groundBox;
	groundBox.SetAsBox(1600.0f, 20.0f);
	groundBody->CreateFixture(&groundBox, 0.0f);

	//Make ceiling (now ground)
	b2BodyDef ceilingBodyDef;
	ceilingBodyDef.position.Set(0.0f, 990.0f);
	b2Body* ceilingBody = world.CreateBody(&ceilingBodyDef);

	b2PolygonShape ceilingBox;
	ceilingBox.SetAsBox(1600.0f, 20.0f);
	ceilingBody->CreateFixture(&ceilingBox, 0.0f);

	//Make walls
	b2BodyDef wallBodyDef;
	wallBodyDef.position.Set(-10.0f, 50.0f);
	b2Body* wallBody1 = world.CreateBody(&wallBodyDef);

	b2PolygonShape wallBox1;
	wallBox1.SetAsBox(20.0f, 1000.0f);
	wallBody1->CreateFixture(&wallBox1, 0.0f);

	wallBodyDef.position.Set(1590.0f, 50.0f);
	b2Body* wallBody2 = world.CreateBody(&wallBodyDef);

	b2PolygonShape wallBox2;
	wallBox2.SetAsBox(20.0f, 1000.0f);
	wallBody2->CreateFixture(&wallBox2, 0.0f);

	//make the apple
	b2Vec2* appleCoords = new b2Vec2();
	srand(time(NULL));
	moveTarget(appleCoords);

	//Make the snake dynamic body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(0.0f, 4.0f);
	b2Body* snake = world.CreateBody(&bodyDef);

	b2PolygonShape dynamicBox;
	dynamicBox.SetAsBox(1.0f, 1.0f);

	b2FixtureDef fixtureDef;
	fixtureDef.shape = &dynamicBox;
	fixtureDef.density = 1.0f;
	fixtureDef.friction = 0.3f;
	snake->CreateFixture(&fixtureDef);

	//Start Music
	//This is my extra additon here. I play music. There is also sounds later.
	sf::Music music;									//<---Extra
	if (music.openFromFile("backMusic.wav"))			//<---Extra
	{													//<---Extra
		music.play();									//<---Extra
	}													//<---Extra
	else												//<---Extra
	{													//<---Extra
		cout << "Error loading music" << endl;			//<---Extra
	}													//<---Extra

	sf::Font font;
	//Display controls
	bool startScreen = true;
	while (startScreen)
	{
		window.clear(sf::Color::Black);

		//Text
		if (font.loadFromFile("nasalization-rg.ttf"))
		{
			sf::Text text;
			text.setFont(font);
			text.setString("Welcome to gravity snake.");
			text.setCharacterSize(48);
			text.setFillColor(sf::Color::Red);
			text.setPosition(500.0f, 300.0f);
			window.draw(text);

			//controls
			sf::Text up;
			up.setFont(font);
			up.setString("Up - w or up");
			up.setCharacterSize(24);
			up.setFillColor(sf::Color::White);
			up.setPosition(650.0f, 430.0f);
			window.draw(up);

			sf::Text down;
			down.setFont(font);
			down.setString("Down - s or down");
			down.setCharacterSize(24);
			down.setFillColor(sf::Color::White);
			down.setPosition(650.0f, 460.0f);
			window.draw(down);

			sf::Text left;
			left.setFont(font);
			left.setString("Left - a or left");
			left.setCharacterSize(24);
			left.setFillColor(sf::Color::White);
			left.setPosition(650.0f, 490.0f);
			window.draw(left);

			sf::Text right;
			right.setFont(font);
			right.setString("Right - d or right");
			right.setCharacterSize(24);
			right.setFillColor(sf::Color::White);
			right.setPosition(650.0f, 520.0f);
			window.draw(right);

			//Click to continue
			sf::Text cont;
			cont.setFont(font);
			cont.setString("Click to continue");
			cont.setCharacterSize(48);
			cont.setFillColor(sf::Color::Red);
			cont.setPosition(580.0f, 650.0f);
			window.draw(cont);

			window.display();

			//Check if the player clicks to play
			if (sf::Mouse::isButtonPressed(sf::Mouse::Left))
			{
				startScreen = false;
			}

		}
		else
		{
			window.close();
			cout << "Error loading font";
		}

	}

	//Time step and stuff
	float timeStep = 1.0f / 60.0f;
	int velcoityIterations = 6;
	int positionIterations = 2;

	//Initializes some scoring stuff
	int targetsGot = 0;
	int numOfTargets = 5;
	float time = 0;
	bool loop = true;
	while (loop && window.isOpen())
	{
		//get the coord of the snake
		b2Vec2 pos = snake->GetPosition();
		time += timeStep;
		if (time >= 15)
		{
			time = 0;
			numOfTargets++;
		}
		//Apply forces and check input
		loop = applyForces(snake);

		//Advance the simulation
		world.Step(timeStep, velcoityIterations, positionIterations);

		//Check for collisions and handle them, also checks the win
		if (checkCollision(appleCoords, snake))
		{
			moveTarget(appleCoords);
			targetsGot++;
			if (targetsGot >= numOfTargets)
			{
				loop = false;
			}

			//Hit sound
			//This is my extra additon here. I play a sound when an apple is eatten.
			sf::SoundBuffer buffer;								//<---Extra
			if (!buffer.loadFromFile("hit.wav"))				//<---Extra
			{													//<---Extra
				cout << "Error loading Hit sound" << endl;		//<---Extra
			}													//<---Extra
			else												//<---Extra
			{													//<---Extra
				sf::Sound sound;								//<---Extra
				sound.setBuffer(buffer);						//<---Extra
				sound.setVolume(100.0f);						//<---Extra
				sound.play();									//<---Extra
				cout << "Sound playing" << endl;				//<---Extra
			}													//<---Extra

		}
		//Output coords of the apple and player
		window.clear(sf::Color::Black);
		//Snake drawing
		sf::CircleShape snakeDraw(10.0f);
		snakeDraw.setFillColor(sf::Color::Green);
		snakeDraw.setPosition(snake->GetPosition().x, snake->GetPosition().y);
		window.draw(snakeDraw);
		//Apple drawing
		sf::CircleShape appleDraw(5.0f);
		appleDraw.setFillColor(sf::Color::Red);
		appleDraw.setPosition(appleCoords->x, appleCoords->y);
		window.draw(appleDraw);
		//Draw Edges
		sf::RectangleShape ceiling(sf::Vector2f(1600.0f, 10.0f));
		ceiling.setPosition(0.0f, 0.0f);
		ceiling.setFillColor(sf::Color(128, 128, 128));
		window.draw(ceiling);

		sf::RectangleShape floor(sf::Vector2f(1600.0f, 10.0f));
		floor.setPosition(0.0f, 990.0f);
		floor.setFillColor(sf::Color(128, 128, 128));
		window.draw(floor);

		sf::RectangleShape wallLeft(sf::Vector2f(10.0f, 1000.0f));
		wallLeft.setPosition(0.0f, 0.0f);
		wallLeft.setFillColor(sf::Color(128, 128, 128));
		window.draw(wallLeft);

		sf::RectangleShape wallRight(sf::Vector2f(10.0f, 1000.0f));
		wallRight.setPosition(1590.0f, 0.0f);
		wallRight.setFillColor(sf::Color(128, 128, 128));
		window.draw(wallRight);
		//Draw text
		if (font.loadFromFile("nasalization-rg.ttf"))
		{
			sf::Text text;
			text.setFont(font);
			string score = "You have collected " + to_string(targetsGot) + " of " + to_string(numOfTargets) + " targets";
			text.setString(score);
			text.setCharacterSize(24);
			text.setFillColor(sf::Color::White);
			text.setPosition(10.0f, 10.0f);
			window.draw(text);
		}
		else
		{
			window.close();
			cout << "Error loading font";
		}

		window.display();

		//Check if closed window
		sf::Event event;
		while (window.pollEvent(event))
		{
			if (event.type == sf::Event::Closed)
			{
				loop = false;
			}
		}
	}

	//Display Final Score
	bool endScreen = true;
	while (endScreen)
	{
		window.clear(sf::Color::Black);

		//Text
		if (font.loadFromFile("nasalization-rg.ttf"))
		{
			sf::Text text;
			text.setFont(font);
			text.setString("Your final score was " + to_string(numOfTargets));
			text.setCharacterSize(48);
			text.setFillColor(sf::Color::Red);
			text.setPosition(500.0f, 300.0f);
			window.draw(text);

			//Click to continue
			sf::Text cont;
			cont.setFont(font);
			cont.setString("Click to exit");
			cont.setCharacterSize(48);
			cont.setFillColor(sf::Color::Red);
			cont.setPosition(580.0f, 650.0f);
			window.draw(cont);

			window.display();

			//Check if the player clicks to play
			if (sf::Mouse::isButtonPressed(sf::Mouse::Left))
			{
				endScreen = false;
			}

		}
		else
		{
			window.close();
			cout << "Error loading font";
		}

	}


	delete appleCoords;
	appleCoords = nullptr;

	window.close();

}

int main()
{
	Wrapper();
	_CrtDumpMemoryLeaks();
}
