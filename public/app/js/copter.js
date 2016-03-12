
var STEP_INTERVAL = 0.01,
    GLOBAL_X_BOUND = 800,
    GLOBAL_Y_BOUND = 400,
    GAME_SPEED = 200,
    BLOCK_GENERATION_INTERVAL = 1500,
    COPTER_X_POSITION = 150,

    //internal-parameters
    COPTER_COLLISION_SEARCH_WIDTH = 5

var pubsub = new PubSub();

var G = new Vector(0, 40.83);


// create our world and our objects
var world = Object.create(World.prototype);

//create our copter
var copterId = world.createObject({
    pos: new Vector(COPTER_X_POSITION,80),
    v: new Vector(0, 300),
    a: G,
    draw: function(ctx){
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.arc(this.pos.x,this.pos.y,10,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    },
    tick: function(){
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
    }
});

//create block generator
var BlockGenerator = {
    sizeParams: {
        width: 20,
        height: 120
    },
    generateNextBlock: function(world){
        world.createObject({
            a: new Vector(0,0),
            v: new Vector(-(GAME_SPEED),0),
            pos: new Vector(GLOBAL_X_BOUND - 50,Math.random() * (100) + GLOBAL_Y_BOUND/2 -100),
            width: this.sizeParams.width,
            height: this.sizeParams.height,
            inGame: true,
            draw: function(ctx){
                ctx.beginPath();
                ctx.rect(this.pos.x - this.width/2, this.pos.y - this.height/2, this.width, this.height);
                ctx.fillStyle = "#fff";
                ctx.fill();
                ctx.closePath();
            },
            tick: function(){
                if(this.inGame){
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


                    var copter = world.getWorldObject(copterId);
                    var block = this;
                    blockTopCorner = {
                        x:block.pos.x - block.width/2,
                        y:block.pos.y - block.height/2
                    },
                    blockBottomCorner = {
                        x:block.pos.x - block.width/2,
                        y:block.pos.y + block.height/2
                    },
                    blockTopRearCorner = {
                        x:block.pos.x + block.width/2,
                        y:block.pos.y - block.height/2
                    },
                    blockBottomRearCorner = {
                        x:block.pos.x + block.width/2,
                        y:block.pos.y + block.height/2
                    }
                    if(true || this.pos.x < COPTER_X_POSITION + COPTER_COLLISION_SEARCH_WIDTH && this.pos.x > COPTER_X_POSITION - COPTER_COLLISION_SEARCH_WIDTH){
                        copter.radius = 10;
                        if(areCircleAndRectangleIntersecting(copter, block)){
                            posstring = "copter: " + copter.pos.x + " " + copter.pos.y;
                            blockposString = ">> block: " + block.pos.x + " " + block.pos.y;
                            console.log(posstring + blockposString);
                            world.stop();
                            document.getElementById("canvas-world").getContext("2d").font = "15px Monaco";
                            document.getElementById("canvas-world").getContext("2d").fillText(posstring + blockposString,100,390);
                        }
                    }

                }


            },
            emitState: function(){
                if(this.pos.x < COPTER_X_POSITION + COPTER_COLLISION_SEARCH_WIDTH && this.pos.x > COPTER_X_POSITION - COPTER_COLLISION_SEARCH_WIDTH){
                    pubsub.pub("block-entered-collision-area", this);
                }

                if(this.pos.x < -20){
                    pubsub.pub("block-exited-viewport", this);
                }
            }
        });
    }
}

world.init({
    canvas: document.getElementById("canvas-world"),
    tickSpeed: 0.01,
    keyMap: {
        keyup : {
            32: function(world){
                var copter = world.getWorldObject(copterId);
                copter.setV(new Vector(0, 300));
                copter.setA(G);
            }
        },
        keydown: {
            32: function(world){
                var copter = world.getWorldObject(copterId);
                copter.setV(new Vector(0, -200));
                copter.setA(new Vector(0,0));
            }
        }
    },
    jobs: {

        blockGenerator:{
            name: "blockGenerator",
            worker: function(world){
                BlockGenerator.generateNextBlock(world);
            },
            interval: BLOCK_GENERATION_INTERVAL,
            from: 0
        }
    }

});

pubsub.sub("block-entered-collision-area", function(block){

});

pubsub.sub("block-exited-viewport", function(block){
    console.log(block.id, block.pos.x, block.pos.y, block.width, block.height);
    block.inGame = false;
});


var areCircleAndRectangleIntersecting = function(circle, rect) {

    var calcRect1 = {
        topleft: {
            x: circle.pos.x - circle.radius,
            y: circle.pos.y - circle.radius
        },
        bottomleft: {
            x: circle.pos.x - circle.radius,
            y: circle.pos.y + circle.radius
        },
        bottomright: {
            x: circle.pos.x + circle.radius,
            y: circle.pos.y + circle.radius
        },
        topright: {
            x: circle.pos.x + circle.radius,
            y: circle.pos.y - circle.radius
        }
    },

    rectwhalf = rect.width/2,
    recthhalf = rect.height/2,

    calcRect2 = {
        topleft: {
            x: rect.pos.x - rectwhalf,
            y: rect.pos.y - recthhalf
        },
        bottomleft: {
            x: rect.pos.x - rectwhalf,
            y: rect.pos.y + recthhalf
        },
        bottomright:{
            x: rect.pos.x + rectwhalf,
            y: rect.pos.y + recthhalf
        },
        topright: {
            x: rect.pos.x + rectwhalf,
            y: rect.pos.y - recthhalf
        },
    };

    count = 0;

    if((calcRect1.topleft.x > calcRect2.topright.x)){ count++; l("exclusing right") }

    if (calcRect1.topright.x < calcRect2.topleft.x){ count++; l("exclusing left") }

    if (calcRect1.topright.y > calcRect2.bottomright.y) { count++; l("exclusing bottom") }

    if (calcRect1.bottomright.y < calcRect2.topright.y) { count++; l("exclusing top") }

    if((circle.pos.y < calcRect2.topleft.y && circle.pos.x < calcRect2.topleft.x)  && Math.sqrt(Math.pow((calcRect2.topleft.x - circle.pos.x),2) + Math.pow((calcRect2.topleft.y - circle.pos.y),2)) >= circle.radius ) { count++; l("exclusing topleft corner hit") }

    if ((circle.pos.y > calcRect2.bottomleft.y && circle.pos.x < calcRect2.bottomleft.x)  && Math.sqrt(Math.pow((calcRect2.bottomleft.x - circle.pos.x),2) + Math.pow((calcRect2.bottomleft.y - circle.pos.y),2)) >= circle.radius ) { count++; l("exclusing bottomleft corner hit") }

    if ((circle.pos.y > calcRect2.bottomright.y && circle.pos.x > calcRect2.bottomright.x)  && Math.sqrt(Math.pow((calcRect2.bottomright.x - circle.pos.x),2) + Math.pow((calcRect2.bottomright.y - circle.pos.y),2)) >= circle.radius ) { count++; l("exclusing bottomright corner hit") }

    if((circle.pos.y < calcRect2.topright.y && circle.pos.x > calcRect2.topright.x)  && Math.sqrt(Math.pow((calcRect2.topright.x - circle.pos.x),2) + Math.pow((calcRect2.topright.y - circle.pos.y),2)) >= circle.radius ){ count++; l("exclusing topright corner hit") }

    return count ? false : true;
}

world.start();
var l = console.log.bind(console);
