
/**
 * Performance function to run a specific async function a number of times quickly
 * @todo go through spec's and ensure performance for bulk asyncs are optimised
 * @param  fun    Async function to run
 * @param  rounds Number of times to run async function
 */
export async function runAsyncConcurrently<T>(fun: () => Promise<T>, rounds: number): Promise<T[]> {
  const runConcurrently: (() => Promise<T>)[] = [];
  for (let i = 0; i < rounds; i += 1) runConcurrently.push(fun);

  return Promise.all(runConcurrently.map(fn => fn()));
}
