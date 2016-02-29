var STEP_INTERVAL = 0.01;
var GLOBAL_X_BOUND = 800;
var GLOBAL_Y_BOUND = 400;
var GAME_SPEED = 200;
var BLOCK_GENERATION_INTERVAL = 1500;

var Vector = function(x, y){
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    inc: function(point){
        this.x += x;
        this.y += y;
    },
    mag: function(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}

var G = new Vector(0, 40.83);


var WorldObject = function(){}
WorldObject.prototype = {

    advanceObject: function(){

        // v = u + at
        this.v.x += this.a.x * STEP_INTERVAL;
        this.v.y += this.a.y * STEP_INTERVAL;


        // s = ut + 1/2 at^2
        this.pos.x += (this.v.x * STEP_INTERVAL + 0.5 * this.a.x * Math.pow(STEP_INTERVAL, 2));
        this.pos.y += (this.v.y * STEP_INTERVAL + 0.5 * this.a.y * Math.pow(STEP_INTERVAL, 2));

        if(this.pos.x + 10> GLOBAL_X_BOUND ){
            this.pos.x = GLOBAL_X_BOUND - 10;
        }
        if(this.pos.y + 10> GLOBAL_Y_BOUND ){
            this.pos.y = GLOBAL_Y_BOUND - 10;
        }

        console.log(this.pos.x, this.pos.y);
    },

    getPos: function(){
        return new Vector(this.pos.x, this.pos.y);
    },

    setV: function(vel){
        this.v.x = vel.x;
        this.v.y = vel.y;
    },

    setA: function(acc){
        this.a.x = acc.x;
        this.a.y = acc.y;
    }
}

// initialize World
var World = function(){}
World.prototype = {
    objects: [],
    advanceWorld: function(){
        this.objects.forEach(function(object){
            object.advanceObject();
        });
    },
    renderWorld: function(ctx){
        this.objects.forEach(function(object){
            object.draw(ctx);
        });
    },
    createObject: function(objectParams){
        var worldObject = Object.create(WorldObject.prototype);
        for(prop in objectParams){
            if(objectParams.hasOwnProperty(prop)){
                worldObject[prop] = objectParams[prop];
            }
        }
        this.objects.push(worldObject);
        worldObject.id = this.objects.length -1;
        return worldObject.id;
    },

    getWorldObject: function(objectId){
        return this.objects[objectId];
    }
}

//create our canvas
var canvas = document.getElementById("canvas-world");
var ctx = canvas.getContext("2d");


// create our world and our objects
var world = Object.create(World.prototype);
var copterId = world.createObject({
    pos: new Vector(150,80),
    v: new Vector(0, 300),
    a: G,
    draw: function(ctx){
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(this.pos.x,this.pos.y,10,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
});

var BlockGenerator = {
    sizeParams: {
        width: 20,
        height: 120
    },
    generateNextBlock: function(){
        world.createObject({
            a: new Vector(0,0),
            v: new Vector(-(GAME_SPEED),0),
            pos: new Vector(GLOBAL_X_BOUND - 50,Math.random() * (100) + GLOBAL_Y_BOUND/2 -100),
            width: this.sizeParams.width,
            height: this.sizeParams.height,
            draw: function(ctx){
                ctx.beginPath();
                ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.closePath();
            }
        });
    }
}

document.getElementsByTagName("body")[0].onkeydown = function(e){
    if(e.keyCode == 32){
        var copter = world.getWorldObject(copterId);
        copter.setV(new Vector(0, -200));
        copter.setA(new Vector(0,0));
    }
};

document.getElementsByTagName("body")[0].onkeyup = function(e){
    if(e.keyCode == 32){

        var copter = world.getWorldObject(copterId);
        copter.setV(new Vector(0, 300));
        copter.setA(G);
    }
};

//start the world
var gameLoopHandler = setInterval(function(){

    ctx.clearRect(0,0,canvas.width, canvas.height);

    world.advanceWorld();
    world.renderWorld(ctx);

}, STEP_INTERVAL*1000);

var blockGenerationHandler = setInterval(function(){
    BlockGenerator.generateNextBlock();
}, BLOCK_GENERATION_INTERVAL);


// setTimeout(function(){
//     clearInterval(intervalHandler);
// }, 10000);
