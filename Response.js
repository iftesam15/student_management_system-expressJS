// Response.js
class ApiResponse {
  constructor(status, data, message) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success(data, message = "Operation successful") {
    return new ApiResponse(200, data, message);
  }

  static error(message = "Operation failed") {
    return new ApiResponse("error", null, message);
  }

  static fail(message = "Resource not found") {
    return new ApiResponse("fail", null, message);
  }
}

module.exports = ApiResponse;
