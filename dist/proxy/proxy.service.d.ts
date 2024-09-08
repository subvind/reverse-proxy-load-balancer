import { OnModuleInit } from '@nestjs/common';
export declare class ProxyService implements OnModuleInit {
    private proxies;
    onModuleInit(): void;
    private loadServices;
    getProxies(): {
        service: any;
        proxy: any;
    }[];
}
