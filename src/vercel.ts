import app from './app'

export const runtime = 'nodejs'

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: any, res: any) {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value)
        }
    }

    let body: any = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const chunks: Buffer[] = []
        for await (const chunk of req) {
            chunks.push(chunk)
        }
        body = Buffer.concat(chunks)
    }

    const request = new Request(url.toString(), {
        method: req.method,
        headers,
        body,
    })

    const response = await app.fetch(request)

    res.status(response.status)
    response.headers.forEach((value: string, key: string) => {
        res.setHeader(key, value)
    })

    const responseBody = await response.text()
    res.end(responseBody)
}
