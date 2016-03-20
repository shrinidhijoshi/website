var onInput = function(event){
    if(event.keyCode === 32){
        var emailAddressString = event.target.value;
        if(validateEmailAddress(emailAddressString)){

            var addresses = emailAddressString.split(",");
            addresses.forEach(function(address){
                var contactBiscuit = getContactBiscuit(address);
                document.getElementById("toAddress").insertBefore(contactBiscuit, document.getElementById("toAddressInput"));
            });

            event.target.value = "";
        }else{
            event.target.value = event.target.value.substr(0, event.target.value.length);

        }
    }if(event.keyCode === 8){
        if(event.target.value === ""){
            removeLastContactBiscuit(document.getElementById("toAddress"));
        }
    }
}

var validateEmailAddress = function(emailAddress){
    return emailAddress.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
}


var removeContactBiscuit = function(event){
    document.getElementById("toAddress").removeChild(event.target.parentNode);
}

var removeLastContactBiscuit = function(contactBiscuitContainer){

    var lastContactBiscuit = document.getElementById("toAddressInput").previousSibling;
    if(lastContactBiscuit){
        if(lastContactBiscuit.classList.contains("willdelete")){
            contactBiscuitContainer.removeChild(document.getElementById("toAddressInput").previousSibling);
        }else{
            lastContactBiscuit.classList.add("willdelete");
        }
    }

}

var getContactBiscuit = function(emailAddress){

    var contactBiscuit = document.createElement("div");
    contactBiscuit.classList.add("contactBiscuit");

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = 'x';
    deleteButton.classList.add("contactDeleteButton");
    deleteButton.onclick = removeContactBiscuit;

    var contactText = document.createElement("span");
    contactText.innerHTML = emailAddress;

    contactBiscuit.appendChild(contactText);
    contactBiscuit.appendChild(deleteButton);

    return contactBiscuit;

}



document.getElementById("toAddressInput").onkeydown = onInput;
