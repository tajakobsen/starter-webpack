import { listener } from '/lib/xp/event';

const logEvent = (event) => {
  log.info(JSON.stringify(event));
};

export function init() {
  try {
    listener({
      type: 'node.*',
      localOnly: false,
      callback: logEvent
    });

  } catch (e) {
    log.error(e);
  }
}
 