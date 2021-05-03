async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.commands.onCommand.addListener(async (command) => {
  // See manifest.json to see which keys trigger this command.
  if (command === 'toggle-event-recording') {
    const tab = await getCurrentTab();
    chrome.storage.local.set({ eventUrl: tab.url }, function () {
      chrome.tabs.create({ url: 'voice-recorder.html' });
    });
  }
});
