import moment from 'moment';
import { Log } from '~app/backend/common/logger/logger';
import { loadLastConnection } from '~app/common/service';

const logger = new Log();

export const normalizedActiveValidators = (eventLogs: Record<string, any>[] | [] | null): Record<string, any>[] => {
  const lastConnection = loadLastConnection();
  logger.debug(`App Last Connection Time: ${lastConnection}`);
  return eventLogs.filter((eventLog: Record<string, any>) => {
    return eventLog.type === 'validator_assigned'
      && moment(lastConnection).isBefore(eventLog.createdAt);
  });
};
