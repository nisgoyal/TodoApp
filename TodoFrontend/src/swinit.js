if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((registration) => {
    // Registration was successful
    console.log('TodoFrontend ServiceWorker registration successful with scope: ', registration.scope);
  }).catch((err) => {
  // registration failed
    console.log('TodoFrontend ServiceWorker registration failed: ', err);
  });
}
