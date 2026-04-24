export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const fmt = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);
    const snapshot = () => {
      const m = process.memoryUsage();
      return { rss: fmt(m.rss), heapUsed: fmt(m.heapUsed), heapTotal: fmt(m.heapTotal) };
    };

    console.log('[memory] startup (MB):', snapshot());

    setInterval(() => {
      console.log('[memory] tick (MB):', snapshot());
    }, 60_000).unref();
  }
}
