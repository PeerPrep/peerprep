self.onmessage = (event) => {
  const { delay, id } = event.data;
  let count = 0;

  function interval() {
    setTimeout(() => {
      count += delay;
      self.postMessage({ id, count });
      interval();
    }, delay);
  }

  interval();
};
