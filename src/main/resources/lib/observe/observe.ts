const { listener } = __non_webpack_require__('/lib/xp/event');

const logEvent = (event: any) => {
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
 