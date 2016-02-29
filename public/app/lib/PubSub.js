var PubSub = function(){}

PubSub.prototype = {
    registry: {},
    pub: function(eventType, data){
        var cbs = this.registry[eventType];
        if(cbs){
            cbs.forEach(function(cb){
                cb(data);
            });
        }
    },

    sub: function(eventType, cb){
        var cbs = this.registry[eventType];
        if(!cbs){
            this.registry[eventType] = [];
        }

        this.registry[eventType].push(cb);
        return (eventType + "_#_" + this.registry[eventType].length -1)
    },

    unsub: function(subId){
        var ss = subId.split("_#_"), eventType = ss[0], cbId = ss[1];
        if(this.registry[eventType]){
            /* do not splice the cb out as this will implicitly change the id (pos) of other registered callbacks */
            this.registry[eventType][cbId] = null;
        }

    }

}

window.pubsub = new PubSub();
