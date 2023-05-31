import chalk from 'chalk';
import { MailTemplates } from '../../@types/enums/mail-templates';
import { ISitePage } from '../../@types/interfaces/sites';

import { getPerformanceTestByPageName } from '../../utils/api/store/performance';
import { getSiteList } from '../../utils/api/store/sites';
import { mailer } from '../../utils/mail';
import { notifyToClient } from '../../utils/socket';

const log = console.log;

class ComparePerformance {

  init() {
    log(chalk.bgMagenta.white('[Performance Compare]'), chalk.white('Starting...'));
    notifyToClient('Performance Compare Test Started');
    this.getSites();
  }

  private async getSites() {
    const sites = await getSiteList();
    for (const site of sites) {
      log(chalk.bgBlue.white(`[${site.site_name}]`), chalk.white('Site Preapering...'));
      for (const page of site.sites) {
        await this.comparePage(page, site.site_name);
      }
    }
    notifyToClient('Performance Compare Test End');
  }

  private async comparePage(page:ISitePage, sitename:string) {
    log(chalk.bgYellow.black(`[${page.title}]`), chalk.white('performance compare test starting...'));
    const desktopData = await getPerformanceTestByPageName(sitename, page.title, 'Desktop');
    if (desktopData && desktopData.length > 0) {
      desktopData.reduce((prevValue, currentValue):any=> {
        if (prevValue) {
          const prevScore = prevValue.performance.performance.score ?? 0;
          const currentScore = currentValue.performance.performance.score ?? 0;

          log('prevS:', prevScore * 100);
          log('currentS:', currentScore * 100);
          if (prevScore > currentScore) {
            log(page.title, sitename);
            mailer.sendMail({
              templateName:MailTemplates.PERFORMANCE, 
              message:`${sitename} ${page.title} Desktop Score: ${currentScore} but before score ${prevScore}`, 
              reportLink:currentValue.filename, 
            });
          } 
        }
      });
    }
  }
}

export const comparePerformance = new ComparePerformance();

export default ComparePerformance;
