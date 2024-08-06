import { ReadStream, WriteStream } from "fs"
import readline from 'readline'

class StreamService {
    private readStream: ReadStream
    private writeStream: WriteStream

    constructor(readStream: ReadStream, writeStream: WriteStream) {
        this.readStream = readStream
        this.writeStream = writeStream
    }

    public getData(callback: (lines: string[]) => void): void {
        let lines: string[] = []
        const rl = readline.createInterface({
            input: this.readStream,
            crlfDelay: Infinity
        })

        rl.on('line', (line) => {
            lines.push(line)
        })

        rl.on('close', () => {
            callback(lines.splice(-50))
        })
    }

    public writeData(data: string): void {
        this.writeStream.on('error', (e) => {
            console.error(`Failed to write into stream: ${e}`)
        })

        this.writeStream.write(data)
    }
}

export { StreamService }
