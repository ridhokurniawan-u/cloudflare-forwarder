/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const originalIP = request.headers.get('cf-connecting-ip') || 'unknown'
    return new Response(JSON.stringify({
    MyIP: originalIP,
    forwardedFor: request.headers.get('x-forwarded-for')
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  })
  
  const targetUrl = new URL(request.url)
  targetUrl.hostname = '{BaseURL}'

  const newHeaders = new Headers(request.headers)
  newHeaders.set('X-Forwarded-For', originalIP)

  const forwardedRequest = new Request(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'manual'
  })

  const response = await fetch(forwardedRequest)
  return response
}
