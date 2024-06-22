chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

const YOUTUBE_ORIGIN = 'https://www.youtube.com';

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    sidePanelDisplay(tab, activeInfo.tabId);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  chrome.tabs.query({'active': true}, function (activeTabs) {
      var activeTab = activeTabs[0];

      if (activeTab == tab) {
        sidePanelDisplay(tab, tabId);
      }
  });
});

async function sidePanelDisplay(tab, tabId) {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === YOUTUBE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'index.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
}