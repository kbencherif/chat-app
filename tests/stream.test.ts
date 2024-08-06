import { ReadStream, WriteStream } from "fs";
import { PassThrough } from "stream";
import { StreamService } from '../src/services/streamService'


describe('testing streams', () => {
    let readStream: ReadStream;
    let writeStream: WriteStream;
    let streamService: StreamService;

    beforeEach(() => {
        readStream = new PassThrough() as unknown as ReadStream;
        writeStream = new PassThrough() as unknown as WriteStream;
        streamService = new StreamService(readStream, writeStream);
    });

    test('Read from stream', () => {
        readStream.push("test")
        streamService.getData((lines) => {
            expect(lines.length).toEqual(1)
            expect(lines.pop).toEqual("test")
        })
    })

    test('Write data to stream', () => {
        const dataToWrite = "this is a test"
        const spy = jest.spyOn(writeStream, 'write')

        streamService.writeData(dataToWrite)
        expect(spy).toHaveBeenCalledWith(dataToWrite)
    })

    test('Read the 50 last lines', () => {
        for (let i = 0; i != 53; i++) {
            readStream.push(`line${i}\n`)
        }

        streamService.getData((lines) => {
            expect(lines.length).toEqual(50)
            expect(lines[lines.length - 1]).toEqual("lines52\n")
        })
    })
})
