import cron from 'node-cron';
import performance from '../services/performance';
import { comparePerformance } from '../services/performance/compare-performance';
import { notifyToClient } from '../utils/socket';

const performanceTask = cron.schedule('0 0 * * *', () =>  {
  notifyToClient('Performance Task Started');
  performance.prepare();

  notifyToClient('Performance Compare Task Started');
  comparePerformance.init();
}, {
  scheduled: false,
});

export default performanceTask;
