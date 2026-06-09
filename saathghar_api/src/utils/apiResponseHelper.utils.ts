import {Response} from "express";

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
}

export class ApiResponseHelper {
    
    static success<T>(
        res: Response,
        data: T,
        message: string = "Success",
        status: number = 200
    ): Response {
        const response: ApiResponse<T> = {
            status,
            success: true,  
            message,       
            data          
        };
        return res.status(status).json(response);
    }

    static error(
        res: Response,
        message: string = "Error",
        status: number = 500
    ): Response {
        const response: ApiResponse<null> = {
            status,
            success: false, 
            message,       
            data: null      
        };
        return res.status(status).json(response);
    }
}