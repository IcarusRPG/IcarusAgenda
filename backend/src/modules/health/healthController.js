export function healthController(_req, res) {
  res.json({
    status: 'ok',
    service: 'icarus-agenda-api',
    timestamp: new Date().toISOString(),
  });
}
