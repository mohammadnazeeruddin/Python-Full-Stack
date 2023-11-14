/*!
 *
 * Angle - Bootstrap Admin Template
 *
 * Version: 4.1.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import './modernizr.js'; // 'npm run modernizr' to create this file

enableProdMode();

let a = platformBrowserDynamic().bootstrapModule(AppModule);
a.then(() => { (<any>window).appBootstrap && (<any>window).appBootstrap(); })
