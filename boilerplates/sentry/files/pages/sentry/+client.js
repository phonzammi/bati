/*{ @if (!(it.BATI.has("react") || it.BATI.has("vue") || it.BATI.has("solid"))) }*/
import "../+client";

/**
 * @typedef {Object} SentryClient
 * @property {function(): SentryOptions} getOptions
 */

/**
 * @typedef {Object} SentryOptions
 * @property {string} dsn
 */

/**
 * @type {Window & { Sentry?: { getClient: () => SentryClient } }}
 */
const globalWindow = globalThis?.window;

window.onload = function () {
  const options = globalWindow?.Sentry?.getClient()?.getOptions();
  if (options) {
    const elmSentryState = document?.getElementById("sentry_state");
    if (elmSentryState) elmSentryState.hidden = true;
    if (options?.dsn?.length > 1) {
      const elmSentryDSN = document?.getElementById("sentry_dsn");
      if (elmSentryDSN) elmSentryDSN.hidden = true;
    }
  }
  const elmSentryButton = document?.getElementById("errorButton");
  if (elmSentryButton)
    elmSentryButton.addEventListener("click", function () {
      // @ts-ignore
      throw new Error("This is a SENTRY Browser Test!");
    });
};
/*{ /if }*/
