
/**
 * @usageNotes
 *
 * The Validate class is meant to be static. The class simply serves as a namespace.
 *
 * If you want to validate input in another file (like a route) simply import this class
 * and run the input through one of the verifier methods. It should return `false` if
 * no errors exist, or a string if the input is invalid
 *
 * Whenever wanting to use Validate in mongoose it must put forward it's API for
 * it like so `validator: Validate.mongoose(fieldName)`
 *
 * If you want to add a new validator for mongoose, create a standalone verifier
 * like `username(input)` and then edit the switch-case block in `mongoose(inputType)`
 * so that when the fieldName is entered the class uses the right verifier
 *
 * If you want to add a new verifier simply add a new method and document it!
 * Not all verifiers will be available in `mongoose()`, some may be explicitly used outside of it
 *
 * @description
 *
 * This utility is a collection of methods for verification of user inputs
 */
export default class Validate {

  /**
   * Verifies inputs for usernames
   * @param  {String} input     Input for the username
   * @return {Boolean|String} false if no error, string explaining the occured error
   */
  static username(input) {

    if (input == null || input == undefined) return 'Username is required';
    if (typeof input !== 'string') return 'Username is not a string';
    if (input.length < 5) return 'Username must be larger than 5 characters';
    if (input.length > 25) return 'Username must be smaller than 25 characters';
    if (!(/^[a-zA-Z0-9]+$/.test(input))) return 'Username must only contain letters and digits';

    return false;

  }

  /**
   * Verifies the input for first names
   * @param  {String} input     Input for the first name
   * @return {Boolean|String} false if no error, string explaining the occured error
   */
  static firstName(input) {

    if (input == null || input == undefined) return 'First name is required';
    if (typeof input !== 'string') return 'First name is not a string';
    if (input.length < 5) return 'First name be larger than 5 characters';
    if (input.length > 25) return 'First name be smaller than 25 characters';
    if (!(/^[a-zA-Z\-]+$/.test(input))) return 'First name must only contain letters and hyphens';

    return false;

  }

  /**
   * Verifies the input for canvas descriptions
   * @param  {String} input     Input for the canvas description
   * @return {Boolean|String} false if no error, string explaining the occured error
   */
  static canvasDescription(input) {

    if (input == null || input == undefined) return false;
    if (typeof input !== 'string') return 'Description is not a string';
    if (input.length > 300) return 'Description must be smaller than 300 characters';

    return false;

  }

  /**
   * Interface for the mongoose validator options
   * @param  {String} inputType Type of input mongoose wants validated
   * @return {Function}         A function which returns a promise to mongoose
   */
  static mongoose(inputType) {

    let verifier;

    switch (inputType) {

      case 'username':
        verifier = this.username;
        break;
      case 'firstName':
        verifier = this.firstName;
        break;
      case 'canvasDescription':
        verifier = this.canvasDescription;
        break;
      default:
        return true;

    }

    return (input) => {

      return new Promise((resolve, reject) => {

        const error = verifier(input);

        if (!error) resolve(true);
        else reject(error);

      });

    };

  }

}
