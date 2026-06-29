import { createServer } from 'node:http'
import { archiveData } from '../web/src/data/archiveData'
import { csvPreviewsByDatasetId } from '../web/src/data/csvPreviews'

const payload = {
  ...archiveData,
  csvPreviewsByDatasetId,
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://127.0.0.1')

  if (url.pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(
      JSON.stringify({
        ok: true,
        datasets: payload.datasets.length,
        terms: payload.terms.length,
        csvPreviews: Object.keys(csvPreviewsByDatasetId).length,
      }),
    )
    return
  }

  if (url.pathname === '/api/archive-payload') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(payload))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify({ error: 'Not found' }))
})

const port = Number(process.env.PORT ?? 3000)

server.listen(port, '0.0.0.0', () => {
  console.log(`Archive backend listening on ${port}`)
})