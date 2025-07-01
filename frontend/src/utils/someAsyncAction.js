// asyncActions.js
export function someAsyncAction() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('Async action completed');
      }, 500);
    });
  }