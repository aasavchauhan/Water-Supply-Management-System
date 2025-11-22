import { AcceptedData, ColumnHeader, ConfigOptions, CsvOutput, CsvRow, FormattedData, Newtype, WithDefaults } from "./types.ts";
export declare const thread: <T>(initialValue: T, ...fns: Array<Function>) => T;
export declare const addBOM: (config: WithDefaults<ConfigOptions>) => (output: CsvOutput) => CsvOutput;
export declare const addTitle: (config: WithDefaults<ConfigOptions>) => (output: CsvOutput) => CsvOutput;
export declare const addEndOfLine: (output: CsvOutput) => (row: CsvRow) => CsvOutput;
export declare const buildRow: (config: WithDefaults<ConfigOptions>) => (row: CsvRow, data: FormattedData) => CsvRow;
export declare const addFieldSeparator: (config: WithDefaults<ConfigOptions>) => <T extends Newtype<any, string>>(output: T) => T;
export declare const addHeaders: (config: WithDefaults<ConfigOptions>, headers: Array<ColumnHeader>) => (output: CsvOutput) => CsvOutput;
export declare const addBody: <T extends {
    [k: string]: AcceptedData;
}[]>(config: WithDefaults<ConfigOptions>, headers: Array<ColumnHeader>, bodyData: T) => (output: CsvOutput) => CsvOutput;
/**
 *
 * Convert CsvOutput => string for the typechecker.
 *
 * Useful if you need to take the return value and
 * treat is as a string in the rest of your program.
 */
export declare const asString: (newtype: Newtype<any, string>) => string;
export declare const formatData: (config: ConfigOptions, data: AcceptedData) => FormattedData;
