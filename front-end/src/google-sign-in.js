function signInViaGoogle(googleIdToken) {
  document.cookie = `googleIdToken=${googleIdToken}; path=/`;
}

function isSignedInViaGoogle() {
  return getCookie('googleIdToken');
}

function getCookie(cookieName) {
  const value = '; ' + document.cookie;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

function signOutViaGoogle() {
  document.cookie = 'googleIdToken=; Max-Age=-99999999; path=/';
}

export { signInViaGoogle, isSignedInViaGoogle, signOutViaGoogle };
