import { ReadStream, WriteStream } from "fs"

class StreamService {
    private readStream: ReadStream
    private writeStream: WriteStream

    constructor(readStream: ReadStream, writeStream: WriteStream) {
        this.readStream = readStream
        this.writeStream = writeStream
    }

    public getData(): void { }

    public writeData(data: string): void {
        this.writeStream.on('error', (e) => {
            console.error(`Failed to write into stream: ${e}`)
        })

        this.writeStream.write(data)
        console.log("Ca marche")
    }
}

export { StreamService }
