var today = dayjs();
var savedTimeBlockEvents = JSON.parse(
  localStorage.getItem("Saved Time Block Events")
);
var timeBlockEvents = [];
if (savedTimeBlockEvents) {
  timeBlockEvents = savedTimeBlockEvents;
}
$(function () {
  var currentDay = $("#currentDay");
  var schedule = $("#schedule")[0];
  var timeBlock = schedule.children;

  currentDay.text(today.format("dddd, MMMM D"));

  for (var i = 0; i < timeBlock.length; i++) {
    if (timeBlock[i].id < today.$H) {
      $(timeBlock[i]).addClass("past");
    } else if (timeBlock[i].id > today.$H) {
      $(timeBlock[i]).addClass("future");
    } else {
      $(timeBlock[i]).addClass("present");
    }
  }

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

  $(schedule).on("click", ".saveBtn", ".fas", function (event) {
    var savedTime = {
      date: today.format("dddd, MMMM D"),
      hour: $(event.target).closest("div")[0].id,
      toDo: $($(event.target).closest("div")[0].children[1]).val(),
    };
    if (timeBlockEvents.length > 0) {
      var check = "";
      for (var i = 0; i < timeBlockEvents.length; i++) {
        if (timeBlockEvents[i].hour === savedTime.hour) {
          check = "done";
          timeBlockEvents[i] = savedTime;
        }
      }
      if (check !== "done") {
        timeBlockEvents.push(savedTime);
      }
    } else {
      timeBlockEvents.push(savedTime);
    }
    localStorage.setItem(
      "Saved Time Block Events",
      JSON.stringify(timeBlockEvents)
    );
  });
});
