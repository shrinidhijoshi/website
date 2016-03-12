
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
            draw: function(ctx){
                ctx.beginPath();
                ctx.rect(this.pos.x - this.width/2, this.pos.y - this.height/2, this.width, this.height);
                ctx.fillStyle = "#fff";
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

                if(!(block.pos.y + block.height < copter.pos.y - 10 || block.pos.y - block.height > copter.pos.y + 10)){
                    if(((copter.pos.y >= blockTopCorner.y && copter.pos.y <= blockBottomCorner.y) && (copter.pos.x+10 >= block.pos.x-block.width/2 && copter.pos.x < block.pos.x))){
                        console.log("copter hit head on!!", copter.pos, block.pos )
                        world.stop();
                    }
                    else if(isHittingCopter(blockTopCorner)){
                        console.log("copter hit blockTopCorner!!", copter.pos, block.pos )
                        world.stop();
                    }
                    else if(isHittingCopter(blockBottomCorner)){
                        console.log("copter hit blockBottomCorner!!", copter.pos, block.pos )
                        world.stop();
                    }
                    else if(isHittingCopter(blockTopRearCorner)){
                        console.log("copter hit blockTopRearCorner!!", copter.pos, block.pos )
                        world.stop();
                    }
                    else if(isHittingCopter(blockBottomRearCorner)){
                        console.log("copter hit blockBottomRearCorner!!", copter.pos, block.pos )
                        world.stop();
                    }
                    else if(n)

                    posstring = "copter: " + copter.pos.x + " " + copter.pos.y;
                    blockposString = ">> block: " + block.pos.x + " " + block.pos.y;
                    console.log(posstring + blockposString);

                    document.getElementById("canvas-world").getContext("2d").font = "15px Monaco";
                    document.getElementById("canvas-world").getContext("2d").fillText(posstring + blockposString,100,390);
                }
            },
            emitState: function(){
                if(this.pos.x < COPTER_X_POSITION + COPTER_COLLISION_SEARCH_WIDTH && this.pos.x > COPTER_X_POSITION - COPTER_COLLISION_SEARCH_WIDTH){
                    pubsub.pub("block-entered-collision-area", this);
                }

                if(this.pos.x < 0){
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

    // var copter = world.getWorldObject(copterId);
    // blockTopCorner = {
    //     x:block.pos.x - block.width/2,
    //     y:block.pos.y - block.height/2
    // },
    // blockBottomCorner = {
    //     x:block.pos.x - block.width/2,
    //     y:block.pos.y + block.height/2
    // }
    //
    // if(!(block.pos.y + block.height < copter.pos.y - 10 || block.pos.y - block.height > copter.pos.y + 10)){
    //     if(((copter.pos.y >= blockTopCorner.y && copter.pos.y <= blockBottomCorner.y) && copter.pos.x+10 >= block.pos.x-block.width/2)){
    //         console.log("copter hit head on!!", copter.pos, block.pos )
    //         world.stop();
    //     }
    //     else if(isHittingCopter(blockTopCorner)){
    //         console.log("copter hit top!!", copter.pos, block.pos )
    //         world.stop();
    //     }
    //     else if(isHittingCopter(blockBottomCorner)){
    //         console.log("copter hit bottom!!", copter.pos, block.pos )
    //         world.stop();
    //     }
    //
    //
    //
    //     posstring = "copter: " + copter.pos.x + " " + copter.pos.y;
    //     blockposString = ">> block: " + block.pos.x + " " + block.pos.y;
    //     console.log(posstring + blockposString);
    //
    //     document.getElementById("canvas-world").getContext("2d").font = "15px Monaco";
    //     document.getElementById("canvas-world").getContext("2d").fillText(posstring + blockposString,400,390);
    // }
});

pubsub.sub("block-exited-viewport", function(block){
    // console.log(block.id, block.pos.x, block.pos.y, block.width, block.height);
});

var isHittingCopter = function(pos){
    var copter = world.getWorldObject(copterId);
    return (Math.sqrt(Math.pow(copter.pos.x - pos.x,2) + Math.pow(copter.pos.y - pos.y,2) ) <= 10);
}

world.start();
