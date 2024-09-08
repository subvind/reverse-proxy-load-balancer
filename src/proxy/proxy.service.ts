import { Injectable, OnModuleInit } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProxyService implements OnModuleInit {
  private proxies: Array<{ service: any; proxy: any }> = [];

  onModuleInit() {
    this.loadServices();
  }

  private loadServices() {
    const servicesPath = path.join(__dirname, '../../data/services.json');
    const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

    console.log('Loaded services:', services);

    this.proxies = services.map(service => {
      const proxy = createProxyMiddleware({
        target: `http://${service.ip}:${service.port}`,
        changeOrigin: true,
        on: {
          proxyReq: (proxyReq: any, req: any, res: any) => {
            console.log(`Proxying request to ${service.host}: ${req.method} ${req.url}`);
          },
          proxyRes: (proxyRes: any, req: any, res: any) => {
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
}