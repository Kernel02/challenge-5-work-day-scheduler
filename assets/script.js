//uses a third party api to determine time from a millisecond to the year
var today = dayjs();
//declares savedTimeBlockEvents as the parsed local storage if there was any
var savedTimeBlockEvents = JSON.parse(
  localStorage.getItem("Saved Time Block Events")
);
var timeBlockEvents = [];
//If local storage had already existed, savedTimeBlockEvents will be truthy, thus giving timeBlockEvents the value from the stored data
if (savedTimeBlockEvents) {
  timeBlockEvents = savedTimeBlockEvents;
}
$(function () {
  var currentDay = $("#currentDay");
  var schedule = $("#schedule")[0];
  var timeBlock = schedule.children;

  currentDay.text(today.format("dddd, MMMM D"));
  //loops through all of the div elements that contain our text area and buttons, compares the id, which is the hour the ddiv represents, with the current hour retrieved from dayjs. Once we know how the timeBlock id compares to the current hour, we add a new class to change the css of the past, present and future hours
  for (var i = 0; i < timeBlock.length; i++) {
    if (timeBlock[i].id < today.$H) {
      $(timeBlock[i]).addClass("past");
    } else if (timeBlock[i].id > today.$H) {
      $(timeBlock[i]).addClass("future");
    } else {
      $(timeBlock[i]).addClass("present");
    }
  }
  //loops through the stored events if there are any. Checks whether or not the date property, which is given when the local storage is saved, matches the current day. If it does, it will display the text/events in the text area
  for (var i = 0; i < timeBlockEvents.length; i++) {
    if (timeBlockEvents[i].date === today.format("dddd, MMMM D")) {
      var index = i;
      var setHour = timeBlockEvents[i].hour;
      for (var x = 0; x < timeBlock.length; x++) {
        if (timeBlock[x].id === setHour) {
          timeBlock[x].children[1].textContent = timeBlockEvents[index].toDo;
        }
      }
    }
  }
  //When the div element with shcedule is clicked, check whether the element clicked has a class of eiher saveBtn or fas. If the element does have either of those classes, create an object containing properties of the date, hour(finds the closest div element, which holds the id of the hour) and toDo(once again finds the closest div element, then it's second child, which is the text area, and grabs the value)
  $(schedule).on("click", ".saveBtn", ".fas", function (event) {
    var savedTime = {
      date: today.format("dddd, MMMM D"),
      hour: $(event.target).closest("div")[0].id,
      toDo: $($(event.target).closest("div")[0].children[1]).val(),
    };
    //If there was any local storage or events saved prior, timeBlockEvents length will be at least 1, thus will run through the loop, else it will push the savedTime object into the timeBlockEvents array
    if (timeBlockEvents.length > 0) {
      //This check variable will be used later to essentially determine if a timeBlockEvents item was replaced
      var check = "";
      //loops through timeBlockEvents array
      for (var i = 0; i < timeBlockEvents.length; i++) {
        //checks if the object created already has an object saved for that hour in the timeBlockEvents array. If it does, it will give the variable check a value of "done" and replace the item of timeBlockEvents for the hour it matches
        if (timeBlockEvents[i].hour === savedTime.hour) {
          check = "done";
          timeBlockEvents[i] = savedTime;
        }
      }
      //if check was given a value of done, then an item was replaced in the timeBlockEvents array, if not, then we need to push a new item into the array
      if (check !== "done") {
        timeBlockEvents.push(savedTime);
      }
      //If there were no items in timeBlockEvents, then this will add the first item into the array
    } else {
      timeBlockEvents.push(savedTime);
    }
    //saves the timeBlockEvents array as a string in local storage
    localStorage.setItem(
      "Saved Time Block Events",
      JSON.stringify(timeBlockEvents)
    );
  });
});
