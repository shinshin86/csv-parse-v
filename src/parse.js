const useDoubleQuote = (char) => char === '"';

const DEFAULT_DELIMITER = ",";
const DEFAULT_TRIM = false;

const parse = (
  str,
  option = { delimiter: DEFAULT_DELIMITER, trim: DEFAULT_TRIM },
) => {
  // set default value
  if (!option.delimiter) option.delimiter = DEFAULT_DELIMITER;
  if (!option.trim) option.trim = DEFAULT_TRIM;

  const { delimiter, trim } = option;

  let header = str.split("\n")[0].split(delimiter);
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
    for (let col = 0, c = 0; c < str.length; c++) {
      const currentChar = str[c], nextChar = str[c + 1];

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
        parsedStr = parsedStr + str[c];
        continue;
      }
    }
  } else {
    const recoreds = str.split("\n");
    const lineLength = recoreds.length;

    for (let currentRecord = 1; currentRecord < lineLength; currentRecord++) {
      const record = recoreds[currentRecord];

      for (let col = 0, c = 0; c < record.length; c++) {
        const currentChar = record[c], nextChar = record[c + 1];

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
            c === record.length - 1) && isParse
        ) {
          isParse = false;
          prevChar = currentChar;

          // The last character is not a delimiter but a value.
          if (col === colLength - 1) {
            parsedStr = parsedStr + record[c];
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
          parsedStr = parsedStr + record[c];
          continue;
        }

        if (isParse) {
          parsedStr = parsedStr + record[c];
          continue;
        }
      }
    }
  }

  return arr;
};

export default parse;
