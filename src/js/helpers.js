import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const ajax = async (url, recipe = undefined) => {
  try {
    const fetchPro = recipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipe),
        })
      : fetch(url);
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await response.json();

    if (!response.ok) {
      throw Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
