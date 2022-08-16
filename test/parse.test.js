import { describe, expect, it } from "vitest";
import parse from "../lib/parse";

describe("csv-parse-v", () => {
  it("basic pattern", () => {
    const csv = `id,title,text,createdAt,updatedAt
1,foo,bar,2022-01-01T00:00:00.000Z,2022-01-02T23:59:59.123Z
2,foo2,bar2💨,2022-02-01T00:00:00.000Z,2022-02-02T23:59:59.123Z`;
    const result = parse(csv);
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("foo");
    expect(result[0].text).eq("bar");
    expect(result[0].createdAt).eq("2022-01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("foo2");
    expect(result[1].text).eq("bar2💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-02T23:59:59.123Z");
  });

  it("enable specify delimiter(|)", () => {
    const csv = `id|title|text|createdAt|updatedAt
1|foo|bar|2022-01-01T00:00:00.000Z|2022-01-02T23:59:59.123Z
2|foo2|bar2💨|2022-02-01T00:00:00.000Z|2022-02-02T23:59:59.123Z`;

    const result = parse(csv, { delimiter: "|" });
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("foo");
    expect(result[0].text).eq("bar");
    expect(result[0].createdAt).eq("2022-01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("foo2");
    expect(result[1].text).eq("bar2💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-02T23:59:59.123Z");
  });

  it("enable trim option", () => {
    const csv = `id ,title  , text,  createdAt,   updatedAt
                1  ,  foo,  bar ,  2022-01-01T00:00:00.000Z    ,  2022-01-02T23:59:59.123Z  
                2  ,  fo o,  ba r ,  2022-02-01T00:00:00.000Z      , 2022-02-02T23:59:59.123Z  `;

    const result = parse(csv, { trim: true });
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("foo");
    expect(result[0].text).eq("bar");
    expect(result[0].createdAt).eq("2022-01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("fo o");
    expect(result[1].text).eq("ba r");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-02T23:59:59.123Z");
  });

  it("double quote pattern", () => {
    const csv = `id,title,text,createdAt,updatedAt
"1","foo","bar","2022-01-01T00:00:00.000Z","2022-01-02T23:59:59.123Z"
"2","foo2","bar2💨","2022-02-01T00:00:00.000Z","2022-02-02T23:59:59.123Z"`;

    const result = parse(csv);
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("foo");
    expect(result[0].text).eq("bar");
    expect(result[0].createdAt).eq("2022-01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("foo2");
    expect(result[1].text).eq("bar2💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-02T23:59:59.123Z");
  });

  it("double quote pattern with newlinie", () => {
    const csv = `id,title,text,createdAt,updatedAt
"1","f
o
o","
b
a
r","2022-
01-01T00:00:00.000Z","2022-01-02T23:59:59.123Z"
"2","f
o
o2","b
a
r2💨","2022-02-01T00:00:00.000Z","2022-02-
02T23:59:59.123Z"`;

    const result = parse(csv);
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("f\no\no");
    expect(result[0].text).eq("\nb\na\nr");
    expect(result[0].createdAt).eq("2022-\n01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("f\no\no2");
    expect(result[1].text).eq("b\na\nr2💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-\n02T23:59:59.123Z");
  });

  it("double quote pattern with newlinie with spaces", () => {
    const csv = `id,title,text,createdAt,updatedAt
"1","f
  o
o","
  b
a
r","2022-
01-01T00:00:00.000Z","2022-01-02T23:59:59.123Z"
"2","f
  o
o2","b
a
r2  💨","2022-02-01T00:00:00.000Z","2022-02-
02T23:59:59.123Z"`;

    const result = parse(csv);
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("f\n  o\no");
    expect(result[0].text).eq("\n  b\na\nr");
    expect(result[0].createdAt).eq("2022-\n01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("f\n  o\no2");
    expect(result[1].text).eq("b\na\nr2  💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-\n02T23:59:59.123Z");
  });

  it("double quote pattern with newlinie with spaces (Enable trim option)", () => {
    const csv = `id,title,text,createdAt,updatedAt
"1","  f
o
o  ","  
b
a
r","  2022-
01-01T00:00:00.000Z","2022-01-02T23:59:59.123Z  "
"2","   f
o
o2  ","
b
a
r2💨
","  2022-02-01T00:00:00.000Z","2022-02-
02T23:59:59.123Z



"`;

    const result = parse(csv, { trim: true });
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("f\no\no");
    //
    expect(result[0].text).eq("b\na\nr");
    expect(result[0].createdAt).eq("2022-\n01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("f\no\no2");
    expect(result[1].text).eq("b\na\nr2💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-\n02T23:59:59.123Z");
  });

  it("double quote pattern with newline with spaces (enable specify delimiter(|))", () => {
    const csv = `id:title:text:createdAt:updatedAt
"1":"f
  o
o":"
  b
a
r":"2022-
01-01T00:00:00.000Z":"2022-01-02T23:59:59.123Z"
"2":"f
  o
o2":"b
a
r2  💨":"2022-02-01T00:00:00.000Z":"2022-02-
02T23:59:59.123Z"`;

    const result = parse(csv, { delimiter: ":" });
    expect(result.length).eq(2);

    // result[0]
    expect(result[0].id).eq("1");
    expect(result[0].title).eq("f\n  o\no");
    expect(result[0].text).eq("\n  b\na\nr");
    expect(result[0].createdAt).eq("2022-\n01-01T00:00:00.000Z");
    expect(result[0].updatedAt).eq("2022-01-02T23:59:59.123Z");

    // result[1]
    expect(result[1].id).eq("2");
    expect(result[1].title).eq("f\n  o\no2");
    expect(result[1].text).eq("b\na\nr2  💨");
    expect(result[1].createdAt).eq("2022-02-01T00:00:00.000Z");
    expect(result[1].updatedAt).eq("2022-02-\n02T23:59:59.123Z");
  });
});
