"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const vhost_1 = __importDefault(require("vhost"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const servicesPath = path_1.default.join(__dirname, '../data/services.json');
const services = JSON.parse(fs_1.default.readFileSync(servicesPath, 'utf8'));
console.log('Loaded services:', services);
const proxies = services.map(service => {
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
    return { service, proxy };
});
proxies.forEach(({ service, proxy }) => {
    console.log(`traffic http://${service.host} -> http://${service.ip}:${service.port}`);
    app.use((0, vhost_1.default)(service.host, (req, res, next) => {
        console.log(`Routing request to ${service.host}`);
        proxy(req, res, next);
    }));
});
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Reverse proxy running at http://localhost:${PORT}`);
});
app.use((req, res) => {
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    res.status(404).send('Not Found');
});
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).send('Internal Server Error');
});
//# sourceMappingURL=proxy-server.js.map