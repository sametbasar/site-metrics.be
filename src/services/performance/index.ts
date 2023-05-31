/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import lighthouse, { RunnerResult } from 'lighthouse';
import chalk from 'chalk';
import chromeLauncher from 'chrome-launcher';

import type { Flags, Config } from 'lighthouse';

import { lighthouseConstants } from '../../utils';
import { getSiteList } from '../../utils/api/store/sites';
import { ISite, ISitePage, ISitePerformance } from '../../@types/interfaces/sites';
import { savePerformanceTest } from '../../utils/api/store/performance';
import { getFileNameWithDateAndName } from '../../utils/get-date';
import { notifyToClient } from '../../utils/socket';


const log = console.log;

class Performance {
  private chrome:chromeLauncher.LaunchedChrome | null = null;

  private options:Flags |  null = null;

  private config:Config | null = null;

  private getMobileConfig() {
    this.config = { 
      extends:'lighthouse:default',
    };
  }

  private getDesktopConfig() {
    this.config = { 
      extends:'lighthouse:default',
      settings:{
        formFactor:'desktop',
        throttling:lighthouseConstants.throttling.desktopDense4G,
        screenEmulation:lighthouseConstants.screenEmulationMetrics.desktop,
        emulatedUserAgent:lighthouseConstants.userAgents.desktop,
      },
    };
  }

  public async prepare() {
    this.chrome = await chromeLauncher.launch({ chromeFlags:['--headless'] });
    this.options = {
      logLevel:'silent',
      output:'html',
      port:this.chrome.port,
    };

    this.getSites();
  }

  private async getSites() {
    log(chalk.bgMagenta.white('[Performance]'), chalk.white('Starting...'));
    const data = await getSiteList();
    for (const site of data) {
      await this.prepareSite(site);
    }
    log(chalk.bgMagenta.white('[Performance]'), chalk.white('End'));

    notifyToClient('Performance Task Completed');
  }

  private async prepareSite(site:ISite) {
    log(chalk.bgBlue.white(`[${site.site_name}]`), chalk.white('Site Preapering...'));
    notifyToClient(`performance: [${site.site_name}]`);
    const filepath = `public/sites/performance/${site.site_name.toLowerCase().replaceAll(' ', '-')}`;
    await this.CleanOlderFiles(filepath);

    if (site.sites.length > 0) {
      for (const page of site.sites) {
        await this.startPerformanceTest(page, filepath, site);
      }
    }
    log(chalk.bgBlue.white(`[${site.site_name}]`), chalk.white('Site End'));
    notifyToClient(`performance: [${site.site_name}] test completed`);
  } 

  private async startPerformanceTest(page:ISitePage, filepath:string, site:ISite) {
    if (!fs.existsSync(filepath)) 
      fs.mkdirSync(filepath, { recursive: true });

    log(chalk.bgYellow.black(`[${page.title}]`), chalk.white('performance test starting...'));
    notifyToClient(`performance: [${site.site_name}] [${page.title}] test starting`);
    const desktopResult = await this.Test(page.value, 'desktop');

    if (desktopResult) {
      const htmlFileName = getFileNameWithDateAndName(`${page.title}_desktop`, 'html');
      fs.writeFileSync(`${filepath}/${htmlFileName}`, desktopResult.report.toString());
      const screenshotFileName = getFileNameWithDateAndName(`${page.title}-desktop`, 'webp');
      this.SaveImage(desktopResult.lhr.fullPageScreenshot?.screenshot.data ?? '', filepath, screenshotFileName);

      const desktopResultObject:ISitePerformance = {
        performance:desktopResult.lhr.categories,
        siteid:site.id,
        sitename:site.site_name,
        pagename:page.title,
        type:'Desktop',
        filename:htmlFileName,
        screenShot:screenshotFileName,
      };
      await savePerformanceTest(desktopResultObject);

      log(chalk.bgGreen.black(`[${page.title}]-[desktop]`), chalk.bold.white(`performance score: ${desktopResult.lhr.categories.performance.score as number * 100}`));
      notifyToClient(`performance: [${site.site_name}] [${page.title}] [desktop] Score: ${desktopResult.lhr.categories.performance.score as number * 100}`);
    }


    const mobileResult = await this.Test(page.value, 'mobile');
    if (mobileResult  &&  mobileResult.report) {
      const htmlFileName = getFileNameWithDateAndName(`${page.title}_mobile`, 'html');
      fs.writeFileSync(`${filepath}/${htmlFileName}`, mobileResult.report.toString());
      const screenshotFileName = getFileNameWithDateAndName(`${page.title}-mobile`, 'webp');
      this.SaveImage(mobileResult.lhr.fullPageScreenshot?.screenshot.data ?? '', filepath, screenshotFileName);

      const mobileResultObject:ISitePerformance = {
        performance:mobileResult.lhr.categories,
        siteid:site.id,
        sitename:site.site_name,
        pagename:page.title,
        type:'Mobile',
        filename:htmlFileName,
        screenShot:screenshotFileName,
      };
      await savePerformanceTest(mobileResultObject);
      
      log(chalk.bgGreen.black(`[${page.title}]-[mobile]`), chalk.bold.white(`performance score: ${mobileResult.lhr.categories.performance.score as number * 100}`));
      notifyToClient(`performance: [${site.site_name}] [${page.title}] [mobile] Score: ${mobileResult.lhr.categories.performance.score as number * 100}`);
    }

    log(chalk.bgYellow.black(`[${page.title}]`), chalk.white('performance test end'));
    notifyToClient(`performance: [${site.site_name}]  [${page.title}] test end`);
  }


  private async Test(url:string, device:'desktop' | 'mobile'):Promise<RunnerResult | undefined> {
    if (device === 'mobile') this.getMobileConfig();
    if (device === 'desktop') this.getDesktopConfig();

    if (this.config && this.options) {
      return lighthouse(url, this.options, this.config ).then((runnerResult)=>{
        return runnerResult;
      });
    }
    return undefined;
  }

  private async SaveImage(screenShot:string, filepath:string, filename:string) {
    var base64Data = screenShot.replace(/^data:image\/webp;base64,/, '');
    if (base64Data) {
      fs.writeFileSync(`${filepath}/${getFileNameWithDateAndName(`${filename}-desktop`, 'webp')}`, base64Data, 'base64');
    }
  }

  private async CleanOlderFiles(filepath:string) {
    try {
      fs.readdirSync(filepath).forEach(file => {
        const dosyaStat = fs.statSync(filepath + '/' + file);
        const fileDate = new Date(dosyaStat.birthtime);
        const nowDate = new Date();
        const difference = nowDate.getTime() - fileDate.getTime();
        const oneWeekTime = 7 * 24 * 60 * 60 * 1000;

        if (difference > oneWeekTime) {
          fs.unlinkSync(filepath + '/' + file);
          console.log(file + ' file remoeved.');
        }
      });
    } catch (err) {
      // console.log(err);
    }
  }
}

const performance = new Performance();

export default performance;

