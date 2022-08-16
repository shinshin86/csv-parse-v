const useDoubleQuote = (char) => char === '"';

const DEFAULT_DELIMITER = ",";
const DEFAULT_TRIM = false;

const MSG_INVALID_CSV = "This is invalid csv data";

const parse = (
  str,
  option = { delimiter: DEFAULT_DELIMITER, trim: DEFAULT_TRIM },
) => {
  // set default value
  if (!option.delimiter) option.delimiter = DEFAULT_DELIMITER;
  if (!option.trim) option.trim = DEFAULT_TRIM;

  const { delimiter, trim } = option;

  let header = str.split("\n")[0].split(delimiter);

  if (header.length === 0 || !header[0]) {
    throw new Error(MSG_INVALID_CSV);
  }

  if (trim) {
    let i = 0;

    for (const h of str.split("\n")[0].split(delimiter)) {
      header[i] = h.trim();
      i++;
    }
  }

  const colLength = header.length;
  const arr = [];

  let obj = {};
  let isParse = false;
  let prevChar = "";
  let parsedStr = "";

  // check use double quote
  const isUseDoubleQuote = useDoubleQuote(str.split("\n")[1].trim()[0]);

  if (isUseDoubleQuote) {
    for (let col = 0, charIndex = 0; charIndex < str.length; charIndex++) {
      const currentChar = str[charIndex], nextChar = str[charIndex + 1];

      if (currentChar === delimiter && prevChar === '"' && !isParse) {
        continue;
      }

      if (currentChar === '"' && nextChar === '"') {
        obj[header[col]] = "";

        if (col === colLength) {
          arr.push(obj);
          col = 0;
        } else {
          col++;
        }
      }

      if (currentChar === '"' && isParse) {
        isParse = false;
        prevChar = currentChar;

        obj[header[col]] = trim ? parsedStr.trim() : parsedStr;
        parsedStr = "";

        if (col === colLength - 1) {
          arr.push(obj);
          obj = {};
          col = 0;
          continue;
        } else {
          col++;
          continue;
        }
      }

      if (currentChar === '"' && !isParse) {
        isParse = true;
        continue;
      }

      if (isParse) {
        parsedStr = parsedStr + str[charIndex];
        continue;
      }
    }
  } else {
    const recoreds = str.split("\n");
    const lineLength = recoreds.length;

    for (let currentRecord = 1; currentRecord < lineLength; currentRecord++) {
      const record = recoreds[currentRecord];

      for (let col = 0, charIndex = 0; charIndex < record.length; charIndex++) {
        const currentChar = record[charIndex], nextChar = record[charIndex + 1];

        if (
          [delimiter, "\n"].includes(currentChar) &&
          [delimiter, "\n"].includes(nextChar)
        ) {
          obj[header[col]] = "";

          if (col === colLength) {
            arr.push(obj);
            col = 0;
          } else {
            col++;
          }
        }

        if (
          ([delimiter, "\n"].includes(currentChar) ||
            charIndex === record.length - 1) && isParse
        ) {
          isParse = false;
          prevChar = currentChar;

          // The last character is not a delimiter but a value.
          if (col === colLength - 1) {
            parsedStr = parsedStr + record[charIndex];
          }

          obj[header[col]] = trim ? parsedStr.trim() : parsedStr;
          parsedStr = "";

          if (col === colLength - 1) {
            arr.push(obj);
            obj = {};
            col = 0;
            continue;
          } else {
            col++;
            continue;
          }
        }

        if (![delimiter, "\n"].includes(currentChar) && !isParse) {
          isParse = true;
          parsedStr = parsedStr + record[charIndex];
          continue;
        }

        if (isParse) {
          parsedStr = parsedStr + record[charIndex];
          continue;
        }
      }
    }
  }

  return arr;
};

export default parse;
