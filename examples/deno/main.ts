import parse from "npm:csv-parse-v";

const csv = `id,title,text,createdAt,updatedAt
1,foo,bar,2022-01-01T00:00:00.000Z,2022-01-02T23:59:59.123Z
2,foo2,bar2💨,2022-02-01T00:00:00.000Z,2022-02-02T23:59:59.123Z`;

const result = parse(csv);
console.log(result);