/**
 * Parallel task execution utilities
 *
 * For running multiple analyzers in parallel
 */

/**
 * Execute tasks in parallel with error handling
 *
 * @param tasks - Array of async tasks to execute
 * @returns Array of results (null for failed tasks)
 */
export async function executeInParallel<T>(
  tasks: Array<() => Promise<T>>
): Promise<Array<T | null>> {
  const results = await Promise.allSettled(tasks.map(task => task()));

  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error('Task failed:', result.reason);
      return null;
    }
  });
}

/**
 * Execute tasks in parallel with timeout
 *
 * @param tasks - Array of async tasks
 * @param timeoutMs - Timeout in milliseconds
 * @returns Array of results
 */
export async function executeWithTimeout<T>(
  tasks: Array<() => Promise<T>>,
  timeoutMs: number
): Promise<Array<T | null>> {
  const tasksWithTimeout = tasks.map(task => async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    );
    return Promise.race([task(), timeoutPromise]);
  });

  return executeInParallel(tasksWithTimeout);
}
