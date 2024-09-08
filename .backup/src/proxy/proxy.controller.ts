import { Controller, All, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async handleProxy(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    const host = req.headers.host;
    const proxies = this.proxyService.getProxies();
    const matchedProxy = proxies.find(p => p.service.host === host);

    if (matchedProxy) {
      console.log(`Routing request to ${matchedProxy.service.host}`);
      return matchedProxy.proxy(req, res, next);
    } else {
      console.log(`Unhandled request: ${req.method} ${req.url}`);
      res.status(404).send('Not Found');
    }
  }
}