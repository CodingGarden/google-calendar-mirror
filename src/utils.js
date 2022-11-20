async function waterfall(promises, cb) {
  await promises.reduce(async (promise, event) => {
    await promise;
    try {
      await cb(event);
    } catch (error) {
      console.error(error.response.data);
    }
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, Promise.resolve());
}

module.exports = {
  waterfall,
};
