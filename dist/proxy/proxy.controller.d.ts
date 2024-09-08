import { Request, Response, NextFunction } from 'express';
import { ProxyService } from './proxy.service';
export declare class ProxyController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    handleProxy(req: Request, res: Response, next: NextFunction): Promise<any>;
}
