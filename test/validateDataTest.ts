import { 
    uDroppyValidateData, 
    IValidatorDataDecoratorsTypes, 
    IValidatorDataDecoratorFields
 } from "../src";
 
 var assert = require('assert');

 describe('Validate Data Decorator test', function() {
    
    it("Can detect if the expected array is not passed as the argument", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "arrayData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.ARRAY,
            }
        ];

        const failureCallback = (response: any) => {
            assert(response.hasErrors === true);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
        newDescriptor.value({ body: {}}, {}, function() {});
    })

    it("Can detect if the expected array is passed as the argument", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "arrayData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.ARRAY,
            }
        ];

        const failureCallback = (response: any) => {
            assert(false);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
        newDescriptor.value({ body: { arrayData: new Array<string>("test") }}, {}, function() {});
    })
    
    it("Can detect if the expected string is not passed as the argument", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "stringData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.STRING,
            }
        ];

        const failureCallback = (response: any) => {
            assert(response.hasErrors === true);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
        newDescriptor.value({ body: {}}, {}, function() {});
    })
    
    it("Can detect if the expected string is passed in the argument", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "stringData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.STRING,
            }
        ];

        const failureCallback = (response: any) => {
            assert(false);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
        newDescriptor.value({ body: { stringData: new String() } }, {}, function() {});
    })
    
    it("Can detect if the expected string is not passed as an empty string", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "stringData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.STRING_NOT_EMPTY,
            }
        ];

        const failureCallback = (response: any) => {
            assert(response.hasErrors === true);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
        newDescriptor.value({ body: { stringData: "" }}, {}, function() {});
    })
    
    it("Can detect if the expected string is not empty", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "stringData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.STRING_NOT_EMPTY,
            }
        ];

        const failureCallback = (response: any) => {
            assert(false);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
      
        newDescriptor.value({ body: { stringData: "test" }}, {}, function() {});
    })
    
    it("Can detect if the expected string is not empty", async () => {
        const createValidators : Array<IValidatorDataDecoratorFields> = [
            {
                fieldName: "stringData",
                optional: false,
                type: IValidatorDataDecoratorsTypes.STRING_NOT_EMPTY,
            }
        ];

        const failureCallback = (response: any) => {
            assert(false);
        };

        const validatorFunc = uDroppyValidateData({ body: createValidators }, failureCallback);
        const newDescriptor = validatorFunc({ body: {} }, null, { value: function() {} });
      
        newDescriptor.value({ body: { stringData: "test" }}, {}, function() {});
    })
});

