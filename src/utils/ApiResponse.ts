class ApiResponse {
    readonly statusCode: number;
    readonly data: any;
    readonly message: string;
    readonly success: boolean;
  
    constructor(statusCode: number, data: any, message: string = "Success") {
      this.statusCode = statusCode;
      this.data = data;
      this.message = message;
      this.success = statusCode < 400;
    }
  }
  
  export { ApiResponse };