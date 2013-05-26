/** Manages the profile extension view.
 * @param {Element} parent View container element. Cannot be null.
 */
ProfileExtension = function (parent) {

  /** Number of milliseconds in a year.
   * @constant
   * @private
   * @memberOf ProfileExtension
   */
  var MILLIS_PER_YEAR = 60 * 60 * 24 * 365 * 1000;

  /** Calculates the age from a date string, in years.
   * @param {String} birthday Reference date. Cannot be null or empty.
   * @return {Number} Returns the age, in years.
   */
  var calculateAge = function (birthday) {
    var now = new Date().getTime();
    var birthdayPart = birthday.split("/");
    var dateRef = new Date(birthdayPart[2], parseInt(birthdayPart[0], 10) - 1,
      birthdayPart[1]).getTime();

    // Be careful, it doesn't take into account the timezone, so it may fail
    // depending on the timezone if today is the user's birthday.
    return Math.floor((now - dateRef) / MILLIS_PER_YEAR);
  };

  /** Sets the status message.
   * @param {String} message Status message. Cannot be null.
   */
  var status = function (message) {
    parent.find(".js-info").html(message);
  };

  /** Displays the user's information.
   * @param {Object} user User information to show. Cannot be null.
   */
  var showProfile = function (user) {
    var profile = parent.find(".js-profile");
    profile.find(".js-full-name").html(user.fullName);
    profile.find(".js-dni").html(user.dni);
    profile.find(".js-address").html(user.address);
    profile.find(".js-location").html(user.location);
    profile.find(".js-cp").html(user.cp);
    profile.find(".js-job").html(user.job);
    profile.show();
  };

  /** Loads Facebook user information.
   * @private
   * @methodOf ProfileExtension#
   */
  var loadUser = function (firstName, lastName, age, errorCallback) {
    status("Hello " + firstName + ", I'm looking for you...");

    jQuery.post("/user", {
      firstName: firstName,
      lastName: lastName,
      age: age
    }, function (user) {
      status("Gotcha!");
      showProfile(user);
    }).error(function () {
      if (errorCallback) {
        errorCallback();
      }
    });
  };

  /** Loads Facebook user information and fetches user's extended profile.
   * @private
   * @methodOf ProfileExtension
   */
  var connect = function () {
    status("Connecting with Facebook...");

    FB.api("/me", function (fbUser) {
      var firstName = fbUser.first_name;
      var age = calculateAge(fbUser.birthday);

      if (fbUser.middle_name) {
        firstName += " " + fbUser.middle_name;
      }

      loadUser(firstName, fbUser.last_name, age, function () {
        status("Good luck, you're quite safe... do you? " +
          "Please, write your REAL full name below and let's see :]");
        parent.find(".js-search-box").show();
      });
    });
  };

  /** Initializes DOM event listeners.
   * @private
   * @methodOf ProfileExtension#
   */
  var initEventListeners = function () {
    parent.find(".js-facebook-connect").click(function () {
      FB.login(function (response) {
        connect();
      }, "user_birthday");
    });
    parent.find(".js-search").click(function (event) {
      var firstName = parent.find("input[name='first-name']").val();
      var lastName = parent.find("input[name='last-name']").val();
      var age = parent.find("input[name='age']").val();

      loadUser(firstName, lastName, age, function () {
        parent.find(".js-profile").hide();
        status("Nice!, you're not registered by argentinian government, but " +
          "you can try some friends :]");
      });
      event.preventDefault();
    });
  };

  return {
    /** Renders this view.
     */
    render: function () {
      initEventListeners();
      FB.getLoginStatus(function(response) {
        if (response.status == "not_authorized") {
          parent.find(".js-facebook-connect").show();
        } else {
          connect();
        }
      });
    }
  };
};
