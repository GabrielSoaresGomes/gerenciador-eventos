class ResultValidation {

    constructor() {
        this.errorList = [];
        this.result = null;
        this.MIN_LENGTH = 0;
    }

    concatErrors(resultValidation) {
        this.errorList = this.errorList.concat(resultValidation.errorList);
    }

    addError(tag, message, isCritical = false) {
        this.errorList.push({'tag': tag, 'message': message, 'critical': isCritical});
    }

    setResult(result) {
        this.result = result;
    }

    hasError() {
        return this.errorList.length > this.MIN_LENGTH;
    }

    hasCriticalError() {
        return this.errorList.filter(error => error.critical).length > this.MIN_LENGTH;
    }

    getErrorList() {
        return this.errorList.map(error => {
            return { 'tag': error.tag, 'message': error.message };
        });
    }

    isResultEmpty() {
        return this.result === undefined || !this.result || this.result.length === this.MIN_LENGTH;
    }

    getResult() {
        return this.result;
    }

    findErrorByTags(tagList) {
        return this.errorList.filter(error => tagList.includes(error.tag)).length > this.MIN_LENGTH;
    }
}

module.exports = ResultValidation;