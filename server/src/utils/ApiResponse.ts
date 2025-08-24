
export interface IApiResponse {
    status: number;
    message: string;
    data: any;
    success: boolean;
}

export class ApiResponse {
    status: number;
    message: string;
    data: any;
    success: boolean;

    constructor({
        status,
        message,
        data = {},
        success
    }: IApiResponse) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data,
            success: this.success
        };
    }
}