export default class HttpException extends Error {
    
    constructor(message, code) {
        super(message);
        this.code = code ?? 500;
    }

    setCode(code) {
        return this.code = code;
    }

    getCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }
}