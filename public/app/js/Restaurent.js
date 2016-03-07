var MapsApi = (function(){
    return{
        getDistance: function(srcLoc, destLoc){
            return Math.sqrt(Math.pow((srcLoc.lat - destLoc.lat),2) +  Math.pow((srcLoc.lng - destLoc.lng),2) )
        },
        getTime: function(srcLoc, destLoc){
            return Math.sqrt(Math.pow((srcLoc.lat - destLoc.lat),2) +  Math.pow((srcLoc.lng - destLoc.lng),2) )/ 2 /*assumed speed*/;
        }
    }
}());

var RestaurentSuggestionEngine = function(){

    return {
        config: {},
        init: function(props){

            for(var prop in props){
                if(props.hasOwnProperty(prop)){
                    this.config[prop] = props[prop];
                }
            }
            /* validate other properties */

            /* validate MapsAPI */
            if(!(this.config.mapsApi &&
                typeof this.config.mapsApi.getDistance === "function" &&
                typeof this.config.mapsApi.getTime === "function")
            ){
                throw Exception("invalid Maps Api");
            }

        },

        getRestaurents: function(restaurants, customer){

            var resultRestaurents = [];
            //filter the nearest restaurents based on DELIVERY_RADIUS
            restaurents.forEach(function(restaurent){

                var distance = this.config.mapsApi.getDistance(customer.location, restaurent.location);
                if( distance < this.config.deliveryRadius){
                    restaurent.distance = distance;
                    resultRestaurents.push(restaurent);
                }

            }.bind(this));

            //calculate the SLA for each restaurent using maps_API
            resultRestaurents.forEach(function(restaurent){
                restaurent.sla = this.config.mapsApi.getTime(customer.location, restaurent.location)
            }.bind(this));


            //calculate each items SLA (prepTime + deliveryTime) and mark those that are not deliverable within MAX_SERVE_ORDER_TIME
            resultRestaurents.forEach(function(restaurent){
                restaurent.itemList.forEach(function(item, i){
                    item.sla = restaurent.sla + item.prepTime;
                    if(item.sla > this.config.maxServeOrderTime && (!item.sensitivity || (item.sensitivity && restaurent.distance < this.config.deliveryRadiusSensitive))  ){
                        item.deliverable = true;
                    }else{
                        item.deliverable = false;
                    }
                }.bind(this));
            }.bind(this));


            return resultRestaurents;

        },

        addToCart: function(cart, restaurent, item){
            if(!cart){
                cart = [];
            }
            if((!cart.restaurent || (cart.restaurent.id !== restaurent.id)) ){
                cart.restaurent = restaurent;
                cart.total = 0;
            }

            cart.push(item);
            cart.total += item.price;
            return cart;
        },

        getCartSLA: function(cart){
            if(cart.length > 0){
                longestSLAItem = cart[0];
                cart.forEach(function(cartItem){
                    if(longestSLAItem.sla <= cartItem.sla){
                        longestSLAItem = cartItem;
                    }
                });
                return longestSLAItem.sla;

            }else{
                return null;
            }

        }
    }

};

var restaurents = [{
    id: 1,
    name: "Esplanade",
    location:{
        lat: 3,
        lng: 3
    },
    itemList: [
        {
            id:1,
            name: "dal",
            price: 8,
            prepTime: 5,
            sensitivity: 1,
        },
        {
            id:2,
            name: "rice",
            price: 30,
            prepTime: 10,
            sensitivity: 2,
        },
        {
            id:3,
            name: "dessert",
            price: 50,
            prepTime: 10,
            sensitivity: 2,
        },

    ]


},{
    id: 2,
    name: "Punjabi Times",
    location:{
        lat: 13,
        lng: 13
    },
    itemList: [
        {
            id:1,
            name: "dal",
            price: 10,
            prepTime: 5,
            sensitivity: 0,
        },
        {
            id:2,
            name: "rice",
            price: 40,
            prepTime: 10,
            sensitivity: 1,
        }
    ]


},{
    id: 2,
    name: "Beijing Bites",
    location:{
        lat: 20,
        lng: 20
    },
    itemList: [
        {
            id:1,
            name: "dal",
            price: 10,
            prepTime: 5,
            sensitivity: 1,
        },
        {
            id:2,
            name: "rice",
            price: 40,
            prepTime: 10,
            sensitivity: 2,
        }
    ]


}];
var customer = {
    name: "Ajay",
    location: {
        lat: 10,
        lng: 10,
    }
}

restaurentSuggestionEngine = RestaurentSuggestionEngine();
restaurentSuggestionEngine.init({

    deliveryRadius: 7,
    deliveryRadiusSensitive: 2,
    maxServeOrderTime: 45,


    mapsApi: MapsApi,
});
var availableRestaurents = restaurentSuggestionEngine.getRestaurents(restaurents, customer);
var myCart = [];
restaurentSuggestionEngine.addToCart(myCart, availableRestaurents[0], availableRestaurents[0].itemList[0]);
console.log(myCart, restaurentSuggestionEngine.getCartSLA(myCart));
