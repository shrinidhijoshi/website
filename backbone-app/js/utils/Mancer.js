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

var WorldObject = function(world){}
WorldObject.prototype = {

    advanceObject: function(){
        if(this.tick && (this.tick instanceof Function)){
            this.tick();
        }

        if(this.emitState && (this.emitState instanceof Function)){
            this.emitState();
        }
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
var World = function(){};
World.prototype = {
    objects: [],
    init: function(params){
        this.canvas = params.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.tickSpeed = params.tickSpeed;
        this.keyMap = params.keyMap;
        //process keyMap
        for(key in this.keyMap){
            if(this.keyMap.hasOwnProperty(key)){

                for(keyCode in this.keyMap[key]){
                    if(this.keyMap[key].hasOwnProperty(keyCode)){

                        (function(keyCode, key){
                            document.body["on" + key] = function(e){
                                if(e.keyCode === Number(keyCode)){
                                    this.keyMap[key][keyCode](this);
                                }
                            }.bind(this);
                        }.apply(this, [keyCode, key]));
                    }
                }
            }
        }

        //setup jobs
        this.jobs = params.jobs;
        for(jobName in this.jobs){
            if(params.jobs.hasOwnProperty(jobName)){

                (function(job){
                    if(!job.from){
                        job.from = 0;
                    }

                    setTimeout(function(){
                        job.jobIntervalHandler = setInterval(job.worker.bind(this, this), job.interval);
                    }.bind(this), job.from);

                    if(job.period){
                        setTimeout(function(){
                            clearInterval(job.jobIntervalHandler);
                        }, job.from + job.period);
                    }


                }.apply(this, [this.jobs[jobName]]));


            }
        }

    },
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
    },

    start: function(){
        //start the world
        this.gameLoopHandler = setInterval(function(){

            if(!this.stopped){
                this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

                world.advanceWorld();
                world.renderWorld(this.ctx);
            }


        }.bind(this), this.tickSpeed*1000);
    },

    stop: function(){
        this.stopped = true;
        clearInterval(this.gameLoopHandler);
    }
}
