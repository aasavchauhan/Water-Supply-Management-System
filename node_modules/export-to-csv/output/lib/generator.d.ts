/// <reference lib="dom" />
import { CsvOutput, ConfigOptions, IO, AcceptedData } from "./types.ts";
/**
 *
 * Generates CsvOutput data from JSON collection using
 * ConfigOptions given.
 *
 * To comfortably use the data as a string around your
 * application, look at {@link asString}.
 *
 * @throws {CsvGenerationError | EmptyHeadersError}
 */
export declare const generateCsv: (config: ConfigOptions) => <T extends {
    [k: string]: AcceptedData;
    [k: number]: AcceptedData;
}>(data: T[]) => CsvOutput;
/**
 * Returns the Blob representation of the CsvOutput generated
 * by `generateCsv`. This is useful if you need to access the
 * data for downloading in other contexts; like browser extensions.
 */
export declare const asBlob: (config: ConfigOptions) => (csvOutput: CsvOutput) => Blob;
/**
 *
 * **Only supported in browser environment.**
 *
 * Will create a hidden anchor link in the page with the
 * download attribute set to a blob version of the CsvOutput data.
 *
 * @throws {CsvDownloadEnvironmentError}
 */
export declare const download: (config: ConfigOptions) => (csvOutput: CsvOutput) => IO;
