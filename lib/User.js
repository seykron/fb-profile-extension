/** Represents a real person in the real life.
 * @constructor
 */
module.exports = function User(firstName, lastName, age) {

  /** Url to search for user data.
   * @constant
   * @private
   * @fieldOf User#
   */
  var DATA_HOST = "http://www.buscardatos.com/Personas/Apellido/apellido.php?" +
    "nombre=%s&apellido=%s&Sex=&desde=1900&hasta=2020"

  /** Libraries required to parse results.
   * @constant
   * @private
   * @fieldOf User#
   */
  var INCLUDES = ["http://code.jquery.com/jquery.js"];

  /** User information; it's populated by fetch().
   * @type Object
   * @private
   * @fieldOf User#
   */
  var user = {};

  /** JSDom library to parse results.
   * @type Object
   * @private
   * @fieldOf User#
   */
  var jsdom = require("jsdom");

  /**
   * Extends an object with the methods and attributes from another. It
   * includes the full prototype chain. This performs only a shallow copy.
   *
   * @param {Object} to Object to augment. Cannot be null.
   * @param {Object} from Object(s) to copy. Cannot be null.
   * @return {Object} Returns the target object, for convenience.
   * @private
   * @methodOf User#
   */
  var extend = function(to/**, [from]*/) {
    var property;
    var target = to;
    var from;
    var i;

    for (i = 1; i < arguments.length; i++) {
      from = arguments[i];

      for (property in from) {
        to[property] = from[property];
      }
    }

    return target;
  };

  /** Fetches user data.
   * @param {Function} callback Function invoked when user is available. It
   *    receives the error as parameter, if any.
   * @private
   * @methodOf User#
   */
  var fetch = function (callback) {
    var requestUrl = DATA_HOST.replace("%s", firstName).replace("%s", lastName);

    jsdom.env(requestUrl, [INCLUDES], function (errors, window) {
      var jQuery = window.jQuery;
      var rows;
      var cols;
      var profile;
      var i;

      if (errors) {
        return callback(new Error(errors));
      }

      rows = jQuery("tr");

      for (i = 0; i < rows.length; i++) {
        cols = jQuery(rows.get(i)).find("td");

        if (cols.length) {
          profile = {
            cuit: jQuery(cols.get(1)).text(),
            dni: jQuery(cols.get(2)).text(),
            age: parseInt(jQuery(cols.get(3)).text(), 10),
            fullName: jQuery(cols.get(4)).text(),
            firstName: firstName,
            lastName: lastName,
            address: jQuery(cols.get(5)).text(),
            location: jQuery(cols.get(6)).text(),
            cp: jQuery(cols.get(7)).text(),
            job: jQuery(cols.get(8)).text()
          };
          if (profile.age === age) {
            extend(user, profile);

            return callback(null);
          }
        }
      }
      callback(new Error("User " + firstName + " " + lastName + " not found."));
    });
  };

  return extend(user, {
    /** Fetches user information.
     * @param {Function} callback Function invoked when data is available. It
     *    takes an error as parameter.
     */
    fetch: function (callback) {
      fetch(callback);
    }
  });
};
