"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ProxyService = class ProxyService {
    constructor() {
        this.proxies = [];
    }
    onModuleInit() {
        this.loadServices();
    }
    loadServices() {
        const servicesPath = path.join(__dirname, '../../data/services.json');
        const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
        console.log('Loaded services:', services);
        this.proxies = services.map(service => {
            const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
                target: `http://${service.ip}:${service.port}`,
                changeOrigin: true,
                on: {
                    proxyReq: (proxyReq, req, res) => {
                        console.log(`Proxying request to ${service.host}: ${req.method} ${req.url}`);
                    },
                    proxyRes: (proxyRes, req, res) => {
                        console.log(`Received response from ${service.host}: ${proxyRes.statusCode}`);
                    },
                }
            });
            console.log(`traffic http://${service.host} -> http://${service.ip}:${service.port}`);
            return { service, proxy };
        });
    }
    getProxies() {
        return this.proxies;
    }
};
exports.ProxyService = ProxyService;
exports.ProxyService = ProxyService = __decorate([
    (0, common_1.Injectable)()
], ProxyService);
//# sourceMappingURL=proxy.service.js.map