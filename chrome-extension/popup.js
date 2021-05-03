function isNonEmptyString(string) {
  return typeof string === 'string' && string !== '';
}

window.onload = function () {
  chrome.storage.local.get(['frictionLogSecretId'], ({ frictionLogSecretId }) => {
    if (isNonEmptyString(frictionLogSecretId)) {
      const secretIdInput = document.getElementById('frictionLogSecretId');
      secretIdInput.value = frictionLogSecretId;
    }
  });

  document.getElementById('frictionLogSecretId').addEventListener('input', (e) => {
    const frictionLogSecretId = e.target.value;
    if (!isNonEmptyString(frictionLogSecretId)) {
      return;
    }
    chrome.storage.local.set({ frictionLogSecretId }, () => { });
  });
};
