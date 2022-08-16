export type ParseOption = {
  delimiter: string;
  trim: boolean;
};

declare function parse(str: string, option?: ParseOption): Array<any>;
export default parse;
