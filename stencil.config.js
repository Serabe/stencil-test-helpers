exports.config = {
  namespace: 'stentil-test-helpers',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: false,
    },
  ],
};
