import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../../package.json');

@Injectable()
export class AppService {
  getVersion(): string {
    return packageJson.version;
  }
}
