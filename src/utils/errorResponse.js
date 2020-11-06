class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorResponseClassInstance = (message, statusCode) => {
  let instance;

  return (() => {
    if (!instance) instance = new ErrorResponse(message, statusCode);
    return instance;
  })();
};

export default errorResponseClassInstance;
