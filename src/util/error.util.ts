
/**
 * This utility is a collection of methods for verification of user inputs
 *
 * @usageNotes
 *
 * The Error class is meant to be static. The class simply serves as a namespace.
 *
 * If you want to validate input in another file (like a route) simply import this class
 * and run the input through one of the verifier methods. It should return `false` if
 * no errors exist, or a string if the input is invalid
 *
 * Whenever wanting to use Error in mongoose it must put forward it's API for
 * it like so `validator: Error.mongoose(fieldName)`
 *
 * If you want to add a new validator for mongoose, create a standalone verifier
 * like `username(input)` and then edit the switch-case block in `mongoose(inputType)`
 * so that when the fieldName is entered the class uses the right verifier
 *
 * If you want to add a new verifier simply add a new method and document it!
 * Not all verifiers will be available in `mongoose()`, some may be explicitly used outside of it
 */
export default class Error {

  /**
   * Verifies inputs for usernames
   * @param input Input for the username
   * @return false if no error, string explaining the occured error
   */
  public static username(input: string): boolean | string {

    if (input == null || input == undefined) return 'Username is required';
    if (typeof input !== 'string') return 'Username is not a string';
    if (input.length < 5) return 'Username must be larger than 5 characters';
    if (input.length > 25) return 'Username must be smaller than 25 characters';
    if (!(/^[a-zA-Z0-9]+$/.test(input))) return 'Username must only contain letters and digits';

    return false;

  }

  /**
   * Verifies the input for first names
   * @param input Input for the first name
   * @return false if no error, string explaining the occured error
   */
  public static firstName(input: string): boolean | string {

    if (input == null || input == undefined) return 'First name is required';
    if (typeof input !== 'string') return 'First name is not a string';
    if (input.length < 5) return 'First name be larger than 5 characters';
    if (input.length > 25) return 'First name be smaller than 25 characters';
    if (!(/^[a-zA-Z\-]+$/.test(input))) return 'First name must only contain letters and hyphens';

    return false;

  }

  /**
   * Verifies the input for canvas descriptions
   * @param input     Input for the canvas description
   * @return false if no error, string explaining the occured error
   */
  public static canvasDescription(input: string): boolean | string {

    if (input == null || input == undefined) return false;
    if (typeof input !== 'string') return 'Description is not a string';
    if (input.length > 300) return 'Description must be smaller than 300 characters';

    return false;

  }

  /**
   * Validate if the request contains the nessecary information to proceed
   * @param  params   A list of objects describing the required parameters
   * @param  request  The request objects provided by express.js
   * @return False if all parameters check out
   */
  public static routeParams(params: { name: string, type: string, location: 'body' | 'query' }[], request: any): boolean {

    for (let param of params) {

      if (typeof request[param.location][param.name] == param.type) continue;
      else return true;

    }

    return false;

  }

  /**
   * Interface for the mongoose validator options
   * @param inputType Type of input mongoose wants validated
   * @return A function which returns a promise to mongoose
   */
  public static mongoose(inputType: string): (input: string) => Promise<boolean | string> {

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

    }

    return (input: string): Promise<boolean | string> => {

      return new Promise((resolve, reject) => {

        const error = verifier(input);

        if (!error) resolve(true);
        else reject(error);

      });

    };

  }

}
