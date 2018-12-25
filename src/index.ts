import { Request, Response, NextFunction } from "express";
const debug = require('debug')('udroppy-dvalidator');

/**
 * Validation scheme
 */
interface IValidateDataDecoretorOptions {
    body?: Array<IValidatorDataDecoratorFields>,
    query?: [{
        fieldName: string
    }]
};


/**
 * Validation template, if the type is an object and objectValidators is not null it will be executed recursively
 */
interface IValidatorDataDecoratorFields {
    fieldName: string,
    type: IValidatorDataDecoratorsTypes,
    optional: boolean,
    objectValidators?: Array<IValidatorDataDecoratorFields>,
    customValidator?: (valToValidate: any, fieldName: string, fieldPrefix: string, 
        objectValidators: Array<IValidatorDataDecoratorFields>) => IValidatorFunctionResponse,
}


/**
 * Function response
 * 
 */
interface IValidatorFunctionResponse {
    hasErrors: boolean,
    errors?: Array<string>,
    invalidTypeFields?: Array<string>,
    invalidValueFields?: Array<string>,
    missingFields?: Array<string>,
}


/**
 * Field types
 */
enum IValidatorDataDecoratorsTypes {
    // Natives
    STRING="string",
    STRING_NOT_EMPTY="not-empty-string",
    NUMBER="number",
    ARRAY="array",
    BOOLEAN="boolean",
    OBJECT="object",
};


/**
 * Returns a message that points out which field has an invalid type
 * @param expectedType 
 * @param fieldName 
 * @param fieldPrefix 
 */
const getInvalidTypeMessage = (expectedType: IValidatorDataDecoratorsTypes, fieldName: string, fieldPrefix: string) => {
    const message = `invalid type: ${fieldPrefix}${fieldName} is expected to be a ${expectedType}`;
    return message;
}


/**
 * Returns a message that points out which field has an invalid value
 * @param fieldName 
 * @param fieldPrefix 
 */
const getInvalidValueMessage = (fieldName: string, fieldPrefix: string) => {
    const message = `invalid value: ${fieldPrefix}${fieldName} has an invalid value`;
    return message;
}


/**
 * Validates a string, empty string is considered as valid
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 */
const stringValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "") : IValidatorFunctionResponse => {
    if (typeof valToValidate !== 'string' && !(valToValidate instanceof String)) {
        return {
            hasErrors: true,
            errors: [getInvalidTypeMessage(IValidatorDataDecoratorsTypes.STRING, fieldName, fieldPrefix)],
            invalidTypeFields: [`${fieldPrefix}${fieldName}`]
        };
    }
    return { hasErrors: false };
}


/**
 * Validates a string, empty string is invalid
 * 
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 */
const stringNotEmptyValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "") : IValidatorFunctionResponse => {
    const stringValidation = stringValidator(valToValidate, fieldName, fieldPrefix);
    if (stringValidation.hasErrors) return stringValidation;
    if (valToValidate === "") return {
        hasErrors: true,
        errors: [getInvalidValueMessage(fieldName, fieldPrefix)],
        invalidValueFields: [`${fieldPrefix}${fieldName}`]
    }
    return { hasErrors: false };
}


/**
 * Validates an object, if objectValidators is provided also the object fields are going to be validated
 * 
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 * @param objectValidators 
 */
const objectValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "", 
        objectValidators: Array<IValidatorDataDecoratorFields>=null) : IValidatorFunctionResponse => {
    if (typeof valToValidate !== 'object' && !(valToValidate instanceof Object)) {
        return {
            hasErrors: true,
            errors: [getInvalidTypeMessage(IValidatorDataDecoratorsTypes.OBJECT, fieldName, fieldPrefix)],
            invalidTypeFields: [`${fieldPrefix}${fieldName}`]
        };
    }
    if (!objectValidators) {
        return { hasErrors: false };
    }
    const subValidations = validateObject(valToValidate, objectValidators, `${fieldPrefix}${fieldName}.`);
    if (subValidations.hasErrors) {
        return subValidations;
    }
    return { hasErrors: false };
}


/**
 * Validates a number
 * 
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 * @param objectValidators 
 */
const numberValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "", 
        objectValidators: Array<IValidatorDataDecoratorFields>=null) : IValidatorFunctionResponse => {
    if (typeof valToValidate !== 'number' && !(valToValidate instanceof Number)) {
        return {
            hasErrors: true,
            errors: [getInvalidTypeMessage(IValidatorDataDecoratorsTypes.NUMBER, fieldName, fieldPrefix)],
            invalidTypeFields: [`${fieldPrefix}${fieldName}`]
        };
    }
    return { hasErrors: false };
}


/**
 * Checks if the given val is an array
 * 
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 * @param objectValidators 
 */
const arrayValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "", 
        objectValidators: Array<IValidatorDataDecoratorFields>=null) : IValidatorFunctionResponse => {
    if (!Array.isArray(valToValidate) && !(valToValidate instanceof Array)) {
        return {
            hasErrors: true,
            errors: [getInvalidTypeMessage(IValidatorDataDecoratorsTypes.ARRAY, fieldName, fieldPrefix)],
            invalidTypeFields: [`${fieldPrefix}${fieldName}`]
        };
    }
    return { hasErrors: false };
}


/**
 * Checks if the given val is a boolean
 * 
 * @param valToValidate 
 * @param fieldName 
 * @param fieldPrefix 
 * @param objectValidators 
 */
const booleanValidator = (valToValidate: any, fieldName: string, fieldPrefix: string = "", 
        objectValidators: Array<IValidatorDataDecoratorFields>=null) : IValidatorFunctionResponse => {
    if (typeof valToValidate !== 'boolean' && !(valToValidate instanceof Boolean)) {
        return {
            hasErrors: true,
            errors: [getInvalidTypeMessage(IValidatorDataDecoratorsTypes.BOOLEAN, fieldName, fieldPrefix)],
            invalidTypeFields: [`${fieldPrefix}${fieldName}`]
        };
    }
    return { hasErrors: false };
}


/**
 * Gets the appropiate validator based on the type
 * 
 * @param valType 
 */
function getValidatorFunc(valType: IValidatorDataDecoratorsTypes) 
    : (valToValidate: any, fieldName: string, fieldPrefix: string, objectValidators: Array<IValidatorDataDecoratorFields>,) => IValidatorFunctionResponse {
    switch(valType) {
        case IValidatorDataDecoratorsTypes.STRING: {
            return stringValidator;
        }
        case IValidatorDataDecoratorsTypes.STRING_NOT_EMPTY: {
            return stringNotEmptyValidator;
        }
        case IValidatorDataDecoratorsTypes.NUMBER: {
            return numberValidator;
        }
        case IValidatorDataDecoratorsTypes.ARRAY: {
            return arrayValidator;
        }
        case IValidatorDataDecoratorsTypes.BOOLEAN: {
            return booleanValidator;
        }
        case IValidatorDataDecoratorsTypes.OBJECT: {
            return objectValidator;
        }
    }
}


/**
 * Validates an object with the objectValidators
 * 
 * @param objectToValidate 
 * @param objectValidators 
 * @param fieldPrefix 
 */
const validateObject = (objectToValidate: any, objectValidators: Array<IValidatorDataDecoratorFields>, fieldPrefix="") : IValidatorFunctionResponse => {
    const mandatoryFields = objectValidators.filter(mf => !mf.optional);
    let hasErrors = false;
    let errors = Array<string>();
    let invalidTypeFields = Array<string>();
    let invalidValueFields = Array<string>();
    let missingFields = Array<string>();

    mandatoryFields.map(mf => {
        debug`validating field: ${fieldPrefix}${mf.fieldName} (${mf.type})`;
        if (!objectToValidate[mf.fieldName]) {
            hasErrors = true;
            const message = `missing required param ${fieldPrefix}${mf.fieldName}`;
            debug(message);
            errors.push(`missing required param ${fieldPrefix}${mf.fieldName}`);
            missingFields.push(`${fieldPrefix}${mf.fieldName}`);
            return;
        }
        let validation: IValidatorFunctionResponse = { hasErrors: false };
        if (mf.customValidator && typeof mf.customValidator === "function") {
            debug(`using custom validator for ${fieldPrefix}${mf.fieldName}`);
            validation = mf.customValidator(objectToValidate[mf.fieldName], mf.fieldName, fieldPrefix, mf.objectValidators);
        } else {
            const validator = getValidatorFunc(mf.type);
            validation = validator(objectToValidate[mf.fieldName], mf.fieldName, fieldPrefix, mf.objectValidators);
        }
        
        if (validation.hasErrors) {
            if (validation.errors) errors = [...errors, ...validation.errors];
            if (validation.invalidTypeFields) invalidTypeFields = [...invalidTypeFields, ...validation.invalidTypeFields];
            if (validation.invalidValueFields) invalidValueFields = [...invalidValueFields, ...validation.invalidValueFields];
            if (validation.missingFields) missingFields = [...missingFields, ...validation.missingFields];
            hasErrors = true;
        }
    });
    return { hasErrors, invalidTypeFields, invalidValueFields, missingFields, errors };
}

/**
 * Decorator that wraps a request and validates its body and query.
 * If at least field is found invalid an HTTP 400 is going to be sent
 * 
 * @param validationOptions 
 */
function uDroppyValidateData(validationOptions: IValidateDataDecoretorOptions,
    failureCallbabck: (response: IValidatorFunctionResponse) => any)  {
    const validateDataInternal = (target, name, descriptor) => {
        debug("Wrapping original function");
        const original = descriptor.value;
        if (typeof original === 'function') {
              descriptor.value = function (req: Request, res: Response, nxt: NextFunction) {
                try {
                    debug("starting validation process");
                    if (validationOptions.body) {
                        debug("validating request's body");
                        const validation = validateObject(req.body, validationOptions.body, "body.");
                        if ( validation.hasErrors ) {
                            debug(`validations not passed, aborting`);
                            failureCallbabck(validation);
                            return;
                        }
                    } 
                    if (validationOptions.query) {
                        let query: Array<IValidatorDataDecoratorFields>;
                        validationOptions.query.forEach(queryEle => {
                            let newEle: IValidatorDataDecoratorFields;
                            newEle.fieldName = queryEle.fieldName;
                            newEle.optional = false;
                            newEle.type = IValidatorDataDecoratorsTypes.OBJECT;
                            query.push(newEle);
                        });
                        debug("validating request's query");
                        const validation = validateObject(req.body, query, "body.");
                        if ( validation.hasErrors ) {
                            debug(`validations not passed, aborting`);
                            return failureCallbabck(validation);
                        }
                    }
                    debug("validation successfuly run without any error");
                    const result = original.apply(this, [req, res, nxt]);
                } catch (e) {
                    debug("could not validate the request through the decorator");
                    debug(e);
                    throw e;
                }
            }
        } else {
            debug("original member of the class is not a function, skipping");
        }
        debug("done wrapping original function");
        return descriptor;
    }
    return validateDataInternal;
};


export { uDroppyValidateData, IValidatorDataDecoratorsTypes, IValidatorDataDecoratorFields };