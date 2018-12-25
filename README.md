## Index
  1. [Intro](#express-request-dvalidator)
  2. [Installation](#Installation)
  3. [How to use it](#How-to-use-it)
  4. [Test](#Test)

# express-request-dvalidator

At uDroppy we love to explore new tech, and of course one of the more hyped new feature of JS are [decorators](https://github.com/tc39/proposal-decorators).

To test decorators we have built a simple package `express-request-dvalidator` that can validate a `request` in express using a scheme writtein in plain js. Example:

    import { 
        uDroppyValidateData, 
        IValidatorDataDecoratorsTypes, 
        IValidatorDataDecoratorFields
    } from "@udroppy/express-request-dvalidator";

    //...
    const createReqBodyValidator = {
         {
            fieldName: "email",
            optional: false,
            type: IValidatorDataDecoratorsTypes.STRING,
            // customValidator: (valToValidate, fieldName, fieldPrefix, objectValidators) => {
            //     return {
            //         hasErrors: false
            //     };
            // }
        },
    };

    const validationFailedCallBack = (data) => {
        console.log(JSON.stringify(data));
        // Handle validation failed
    };
    //...
    class UserController {

        @uDroppyValidateData({ body: createReqBodyValidator}, validationFailedCallBack)
        create = (req, res, nxtFunction) => {
            // this code will be executed if the validation is successful
        };
    };

Example with Typescript:


    import {
        uDroppyValidateData, 
        IValidatorDataDecoratorsTypes, 
        IValidatorDataDecoratorFields
    } from "@udroppy/express-request-dvalidator";

    const createReqBodyValidator : Array<IValidatorDataDecoratorFields> = [
        {
            fieldName: "email",
            optional: false,
            type: IValidatorDataDecoratorsTypes.STRING,
            // customValidator: (valToValidate, fieldName, fieldPrefix, objectValidators) => {
            //     return {
            //         hasErrors: false
            //     };
            // }
        }
    ];


    class UserController {

        @uDroppyValidateData({ body: createValidators})
        create(req: Request, res: Response) : Response {
            // this code will be executed if the validation is successful
        }
    }


## Installation

`npm i @udroppy/express-request-dvalidator`

## How to use it

Import from the package everything you will need:

    import {
            uDroppyValidateData,
            IValidatorDataDecoratorsTypes,
            IValidatorDataDecoratorFields
    } from "@udroppy/express-request-dvalidator";

Define the scheme of the request's body / query:

    const createReqBodyValidator : Array<IValidatorDataDecoratorFields> = [
        {
            fieldName: "email",
            optional: false,
            type: IValidatorDataDecoratorsTypes.STRING,
        }
    ];

Add the decorator to the request handlers:

    @uDroppyValidateData({ body: createValidators})
        create(req: Request, res: Response) : Response {
            // this code will be executed if the validation is successful
    }

You will need to pass a failure call back in order to process the errors if the validation is not successful.

## Test

`npm run test`
