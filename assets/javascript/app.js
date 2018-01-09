$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAkhbqbEY-w9V0Zp3HPaom7UmfixJDcmt8",
    authDomain: "timesheet-d6a0b.firebaseapp.com",
    databaseURL: "https://timesheet-d6a0b.firebaseio.com",
    projectId: "timesheet-d6a0b",
    storageBucket: "",
    messagingSenderId: "658990346451"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // Initialize Variables
  var name = "";
  var role = "";
  var startDate = ""; // DD/MM/YYYY
  var monthlyRate = 0;

  // List for submit button to be clicked
  $(document).on("click", ".submit", function() {
    event.preventDefault();

    // Get values from form
    name = $("#employeeName").val().trim();
    role = $("#employeeRole").val().trim();
    startDate = $("#employeeStartDate").val().trim();
    monthlyRate = parseInt($("#employeeMonthlyBilled").val().trim());

    var startDateConverted = moment(startDate, "DD/MM/YYYY");
    var startDateUnix = moment(startDateConverted).format("X");

    // Update Firebase
    database.ref().push({
      name : name,
      role : role,
      startDate : startDateUnix,
      monthlyRate : monthlyRate
    });
  });

  // On Child Added Function
  database.ref().on("child_added", function(snapshot) {
    // Convert unix date to DD/MM/YYYY
    var unixDate = moment(snapshot.val().startDate, "X");
    var unixDateConverted = moment(unixDate).format("DD/MM/YYYY");

    // Calculate total months
    var totalMonths = Math.abs(moment(unixDate).diff(moment(), "months"));
    var totalBilled = totalMonths * snapshot.val().monthlyRate;

    // Add a row of data to the table
    $(".populated-table").append(`
      <tr>
        <td>${snapshot.val().name}</td>
        <td>${snapshot.val().role}</td>
        <td>${unixDateConverted}</td>
        <td>${snapshot.val().monthlyRate}</td>
        <td>${totalBilled}
      </tr>
      `);
  })

});

// employeeName
// employeeRole
// employeeStartDate
