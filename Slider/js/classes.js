class Player extends PIXI.Sprite
{
    constructor(x=0,y=0,speed=500)
    {
        super(PIXI.loader.resources["images/player.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.w = this.width/2;
        this.h = this.height/2;

        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
    }

    //moves the player
    move(dt, sceneWidth, sceneHeight)
    {      
        this.x += this.dx*dt;
        this.y += this.dy*dt;

        if(this.x-this.w < 0)
        {
            this.x = this.w;
        }
        else if(this.x+this.w > sceneWidth)
        {
            this.x = sceneWidth-this.w;
        }
        if(this.y-this.h < 0)
        {
            this.y = this.h;
        }
        else if(this.y+this.h > sceneHeight)
        {
            this.y = sceneHeight-this.h;
        }
    }

    //sees if the player collides with the given object
    collides(obst)
    {
        let minx1 = this.x-this.w;
        let maxx1 = this.x+this.w;
        let miny1 = this.y-this.h;
        let maxy1 = this.y+this.h;
        let minx2 = obst.x-obst.w;
        let maxx2 = obst.x+obst.w;
        let miny2 = obst.y-obst.h;
        let maxy2 = obst.y+obst.h;
        let xcross = false;
        let ycross = false;

        if(maxx1 <= maxx2 && maxx1 >= minx2)
        {
            xcross = true;
        }
        else if(minx1 <= maxx2 && minx1 >= minx2)
        {
            xcross = true;
        }
        else if(minx1 <= minx2 && maxx1 >= maxx2)
        {
            xcross = true;
        }
    
        if(maxy1 <= maxy2 && maxy1 >= miny2)
        {
            ycross = true;
        }
        else if( miny1 <= maxy2 && miny1 >= miny2)
        {
            ycross = true;
        }
        else if(miny1 <= miny2 && maxy1 >= maxy2)
        {
            ycross = true;
        }
    
        //check if colliding in both axies
        if(xcross && ycross)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}

class Spikes extends PIXI.Sprite
{
    constructor(x=0, y=0)
    {
        super(PIXI.loader.resources["images/spikes.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.w = this.width/2;
        this.h = this.height/2;
    }
}

class Wall extends PIXI.Sprite
{
    constructor(x=0, y=0)
    {
        super(PIXI.loader.resources["images/wall.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.w = this.width/2;
        this.h = this.height/2;
    }
}

class NoStop extends PIXI.Sprite
{
    constructor(x=0, y=0)
    {
        super(PIXI.loader.resources["images/noStop.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.w = this.width/2;
        this.h = this.height/2;
    }
}

class ExitPortal extends PIXI.Sprite
{
    constructor(x=0, y=0)
    {
        super(PIXI.loader.resources["images/exit.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
        this.w = this.width/2;
        this.h = this.height/2;
    }
}