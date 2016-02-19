var calculateEventPositions = function(eventList){

    eventList.sort(function(e1, e2){
        if(e1.startTime <= e2.startTime){
            return -1;
        }else{
            return 1;
        }
    });

    for(var startPos = 0, endPos = 0; endPos < eventList.length; endPos ++){

        if((endPos == eventList.length -1) || eventList[endPos + 1].startTime >=  eventList[endPos].endTime ){

            for(var i = startPos; i <= endPos; i++ ){
                eventList[i].top = ( 720/12 ) * eventList[i].startTime;
                eventList[i].left = ( 600 / (endPos - startPos + 1) ) * ( i - startPos );
                eventList[i].width = 600/(endPos - startPos + 1) - 2;
            }

            startPos = endPos + 1;
        }
    }

    console.log(eventList);
}

var populateCalendar = function(eventList, containerDiv){

    eventList.forEach(function(event){
        if(!event.domNode){
            calendarEventNode = document.createElement("div");
            calendarEventNode.classList.add("eventDiv");
            calendarEventNode.style.position = "absolute";

            // calculate horizontal position based on day
            calendarEventNode.style.left = event.left + "px";

            //calculate vertical position based on time
            calendarEventNode.style.top = event.top + "px";

            //calculate the width and height
            calendarEventNode.style.height = ((event.endTime-event.startTime) * 60) + "px";
            calendarEventNode.style.width = event.width + "px";

            calendarEventNode.innerHTML = event.meetingTitle;

            event.domNode = calendarEventNode;

            calendarContainer.appendChild(calendarEventNode);
        }
    });

}



var sampleEventsList = [
    {
        day: "Monday",
        startTime: 4,
        endTime: 5,
        meetingTitle: "Chai with Obama"

    },

    {
        day: "Tuesday",
        startTime: 6.5,
        endTime: 7.5,
        meetingTitle: "Lunch with Putin"


    },

    {
        day: "Tuesday",
        startTime: 5,
        endTime: 7,
        meetingTitle: "Walk with kittu"


    },
    {
        day: "Thursday",
        startTime: 6.9,
        endTime: 9,
        meetingTitle: "Movie with kittu"


    },

];

calculateEventPositions(sampleEventsList);

populateCalendar(sampleEventsList, document.getElementById("calendarContainer"));
