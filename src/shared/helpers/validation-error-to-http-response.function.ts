import { ValidationError } from 'class-validator';
import { IHttpError } from 'shared/models';

/**
 * Convert the validation error from class-validate to the
 * custom http error response
 * @param  validationError Array of validation errors
 * @return                 Http error
 */
export function validationErrorToHttpResponse(validationError: ValidationError[]): { status: number, content: IHttpError[] } {

  return {
    content: validationError.map((value: ValidationError) => {

      return { title: value.property, detail: value.constraints[Object.keys(value.constraints)[0]] };

    }),
    status: 400,
  };

}
