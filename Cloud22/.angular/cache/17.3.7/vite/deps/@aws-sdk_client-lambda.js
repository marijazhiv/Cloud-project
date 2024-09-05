import {
  __awaiter,
  __generator,
  __values
} from "./chunk-7VQPY5UX.js";
import {
  __async,
  __asyncGenerator,
  __await,
  __commonJS,
  __forAwait,
  __objRest,
  __spreadProps,
  __spreadValues,
  __toESM
} from "./chunk-CDW57LCT.js";

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v2) {
      return typeof v2 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a2, arrayMode) {
      if (a2) {
        const keys = Object.keys(a2);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          if (arrayMode === "strict") {
            target[keys[i2]] = [a2[keys[i2]]];
          } else {
            target[keys[i2]] = a2[keys[i2]];
          }
        }
      }
    };
    exports.getValue = function(v2) {
      if (exports.isExist(v2)) {
        return v2;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<" && xmlData[i2 + 1] === "?") {
          i2 += 2;
          i2 = readPI(xmlData, i2);
          if (i2.err)
            return i2;
        } else if (xmlData[i2] === "<") {
          let tagStartPos = i2;
          i2++;
          if (xmlData[i2] === "!") {
            i2 = readCommentAndCDATA(xmlData, i2);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i2] === "/") {
              closingTag = true;
              i2++;
            }
            let tagName = "";
            for (; i2 < xmlData.length && xmlData[i2] !== ">" && xmlData[i2] !== " " && xmlData[i2] !== "	" && xmlData[i2] !== "\n" && xmlData[i2] !== "\r"; i2++) {
              tagName += xmlData[i2];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i2--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i2));
            }
            const result = readAttributeStr(xmlData, i2);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i2));
            }
            let attrStr = result.value;
            i2 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i2 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i2));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i2 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i2));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i2++; i2 < xmlData.length; i2++) {
              if (xmlData[i2] === "<") {
                if (xmlData[i2 + 1] === "!") {
                  i2++;
                  i2 = readCommentAndCDATA(xmlData, i2);
                  continue;
                } else if (xmlData[i2 + 1] === "?") {
                  i2 = readPI(xmlData, ++i2);
                  if (i2.err)
                    return i2;
                } else {
                  break;
                }
              } else if (xmlData[i2] === "&") {
                const afterAmp = validateAmpersand(xmlData, i2);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i2));
                i2 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i2])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i2));
                }
              }
            }
            if (xmlData[i2] === "<") {
              i2--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i2])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i2] + "' is not expected.", getLineNumberForPosition(xmlData, i2));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t2) => t2.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i2) {
      const start = i2;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] == "?" || xmlData[i2] == " ") {
          const tagname = xmlData.substr(start, i2 - start);
          if (i2 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i2));
          } else if (xmlData[i2] == "?" && xmlData[i2 + 1] == ">") {
            i2++;
            break;
          } else {
            continue;
          }
        }
      }
      return i2;
    }
    function readCommentAndCDATA(xmlData, i2) {
      if (xmlData.length > i2 + 5 && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === "-") {
        for (i2 += 3; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "-" && xmlData[i2 + 1] === "-" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      } else if (xmlData.length > i2 + 8 && xmlData[i2 + 1] === "D" && xmlData[i2 + 2] === "O" && xmlData[i2 + 3] === "C" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "Y" && xmlData[i2 + 6] === "P" && xmlData[i2 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i2] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i2 + 9 && xmlData[i2 + 1] === "[" && xmlData[i2 + 2] === "C" && xmlData[i2 + 3] === "D" && xmlData[i2 + 4] === "A" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "A" && xmlData[i2 + 7] === "[") {
        for (i2 += 8; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "]" && xmlData[i2 + 1] === "]" && xmlData[i2 + 2] === ">") {
            i2 += 2;
            break;
          }
        }
      }
      return i2;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i2) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === doubleQuote || xmlData[i2] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i2];
          } else if (startChar !== xmlData[i2]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i2] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i2];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i2,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i2 = 0; i2 < matches.length; i2++) {
        if (matches[i2][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' has no space in starting.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] !== void 0 && matches[i2][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i2][2] + "' is without value.", getPositionFromMatch(matches[i2]));
        } else if (matches[i2][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i2][2] + "' is not allowed.", getPositionFromMatch(matches[i2]));
        }
        const attrName = matches[i2][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i2]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i2]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i2) {
      let re = /\d/;
      if (xmlData[i2] === "x") {
        i2++;
        re = /[\da-fA-F]/;
      }
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === ";")
          return i2;
        if (!xmlData[i2].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i2) {
      i2++;
      if (xmlData[i2] === ";")
        return -1;
      if (xmlData[i2] === "#") {
        i2++;
        return validateNumberAmpersand(xmlData, i2);
      }
      let count = 0;
      for (; i2 < xmlData.length; i2++, count++) {
        if (xmlData[i2].match(/\w/) && count < 20)
          continue;
        if (xmlData[i2] === ";")
          break;
        return -1;
      }
      return i2;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val2) {
        return val2;
      },
      attributeValueProcessor: function(attrName, val2) {
        return val2;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      }
      // skipEmptyListItem: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    var XmlNode = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val2) {
        if (key === "__proto__")
          key = "#__proto__";
        this.child.push({ [key]: val2 });
      }
      addChild(node) {
        if (node.tagname === "__proto__")
          node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    var util = require_util();
    function readDocType(xmlData, i2) {
      const entities = {};
      if (xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "C" && xmlData[i2 + 5] === "T" && xmlData[i2 + 6] === "Y" && xmlData[i2 + 7] === "P" && xmlData[i2 + 8] === "E") {
        i2 = i2 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i2 < xmlData.length; i2++) {
          if (xmlData[i2] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i2)) {
              i2 += 7;
              [entityName, val, i2] = readEntityExp(xmlData, i2 + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i2))
              i2 += 8;
            else if (hasBody && isAttlist(xmlData, i2))
              i2 += 8;
            else if (hasBody && isNotation(xmlData, i2))
              i2 += 9;
            else if (isComment)
              comment = true;
            else
              throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i2] === ">") {
            if (comment) {
              if (xmlData[i2 - 1] === "-" && xmlData[i2 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i2] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i2];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i: i2 };
    }
    function readEntityExp(xmlData, i2) {
      let entityName2 = "";
      for (; i2 < xmlData.length && (xmlData[i2] !== "'" && xmlData[i2] !== '"'); i2++) {
        entityName2 += xmlData[i2];
      }
      entityName2 = entityName2.trim();
      if (entityName2.indexOf(" ") !== -1)
        throw new Error("External entites are not supported");
      const startChar = xmlData[i2++];
      let val2 = "";
      for (; i2 < xmlData.length && xmlData[i2] !== startChar; i2++) {
        val2 += xmlData[i2];
      }
      return [entityName2, val2, i2];
    }
    function isComment(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "-" && xmlData[i2 + 3] === "-")
        return true;
      return false;
    }
    function isEntity(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "N" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "I" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "Y")
        return true;
      return false;
    }
    function isElement(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "E" && xmlData[i2 + 3] === "L" && xmlData[i2 + 4] === "E" && xmlData[i2 + 5] === "M" && xmlData[i2 + 6] === "E" && xmlData[i2 + 7] === "N" && xmlData[i2 + 8] === "T")
        return true;
      return false;
    }
    function isAttlist(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "A" && xmlData[i2 + 3] === "T" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "L" && xmlData[i2 + 6] === "I" && xmlData[i2 + 7] === "S" && xmlData[i2 + 8] === "T")
        return true;
      return false;
    }
    function isNotation(xmlData, i2) {
      if (xmlData[i2 + 1] === "!" && xmlData[i2 + 2] === "N" && xmlData[i2 + 3] === "O" && xmlData[i2 + 4] === "T" && xmlData[i2 + 5] === "A" && xmlData[i2 + 6] === "T" && xmlData[i2 + 7] === "I" && xmlData[i2 + 8] === "O" && xmlData[i2 + 9] === "N")
        return true;
      return false;
    }
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    module.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module) {
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string")
        return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr))
        return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
            return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
            return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (eNotation) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "")
                return num;
              else if (numStr === numTrimmedByZeros)
                return num;
              else if (sign && numStr === "-" + numTrimmedByZeros)
                return num;
              else
                return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr)
                return num;
              else if (sign + numTrimmedByZeros === numStr)
                return num;
              else
                return str;
            }
            if (trimmedStr === numStr)
              return num;
            else if (trimmedStr === sign + numStr)
              return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".")
          numStr = "0";
        else if (numStr[0] === ".")
          numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".")
          numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    module.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "¢" },
          "pound": { regex: /&(pound|#163);/g, val: "£" },
          "yen": { regex: /&(yen|#165);/g, val: "¥" },
          "euro": { regex: /&(euro|#8364);/g, val: "€" },
          "copyright": { regex: /&(copy|#169);/g, val: "©" },
          "reg": { regex: /&(reg|#174);/g, val: "®" },
          "inr": { regex: /&(inr|#8377);/g, val: "₹" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 10)) },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: (_, str) => String.fromCharCode(Number.parseInt(str, 16)) }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i2 = 0; i2 < entKeys.length; i2++) {
        const ent = entKeys[i2];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val2 !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val2 = val2.trim();
        }
        if (val2.length > 0) {
          if (!escapeEntities)
            val2 = this.replaceEntitiesValue(val2);
          const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val2;
          } else if (typeof newval !== typeof val2 || newval !== val2) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val2.trim();
            if (trimmedVal === val2) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val2;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i2 = 0; i2 < len; i2++) {
          const attrName = this.resolveNameSpace(matches[i2][1]);
          let oldVal = matches[i2][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__")
              aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i2 = 0; i2 < xmlData.length; i2++) {
        const ch = xmlData[i2];
        if (ch === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            let tagData = readTagExp(xmlData, i2, false, "?>");
            if (!tagData)
              throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i2 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i2 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i2 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i2 = endIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i2);
            this.docTypeEntities = result.entities;
            i2 = result.i;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i2 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val2 == void 0)
              val2 = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val2);
            }
            i2 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i2, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i2 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i2 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2)
                  throw new Error(`Unexpected end of ${rawTagName}`);
                i2 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i2 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i2];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    var replaceEntitiesValue = function(val2) {
      if (this.options.processEntities) {
        for (let entityName2 in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName2];
          val2 = val2.replace(entity.regx, entity.val);
        }
        for (let entityName2 in this.lastEntities) {
          const entity = this.lastEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName2 in this.htmlEntities) {
            const entity = this.htmlEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
        }
        val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val2;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0)
          isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp)
          return true;
      }
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i2, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i2; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i2, errMsg) {
      const closingIndex = xmlData.indexOf(str, i2);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i2, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i2 + 1, closingChar);
      if (!result)
        return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    function readStopNodeData(xmlData, tagName, i2) {
      const startIndex = i2;
      let openTagCount = 1;
      for (; i2 < xmlData.length; i2++) {
        if (xmlData[i2] === "<") {
          if (xmlData[i2 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i2, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i2 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i2),
                  i: closeIndex
                };
              }
            }
            i2 = closeIndex;
          } else if (xmlData[i2 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i2 + 1, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i2 + 3, "StopNode is not closed.");
            i2 = closeIndex;
          } else if (xmlData.substr(i2 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i2, "StopNode is not closed.") - 2;
            i2 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i2, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i2 = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val2, shouldParse, options) {
      if (shouldParse && typeof val2 === "string") {
        const newval = val2.trim();
        if (newval === "true")
          return true;
        else if (newval === "false")
          return false;
        else
          return toNumber(val2, options);
      } else {
        if (util.isExist(val2)) {
          return val2;
        } else {
          return "";
        }
      }
    }
    module.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0)
          newJpath = property;
        else
          newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0)
            text = tagObj[property];
          else
            text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val2 = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val2, options);
          if (tagObj[":@"]) {
            assignAttributes(val2, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val2 = val2[options.textNodeName];
          } else if (Object.keys(val2).length === 0) {
            if (options.alwaysCreateTextNode)
              val2[options.textNodeName] = "";
            else
              val2 = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val2);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val2];
            } else {
              compressedObj[property] = val2;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0)
          compressedObj[options.textNodeName] = text;
      } else if (text !== void 0)
        compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (key !== ":@")
          return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i2 = 0; i2 < len; i2++) {
          const atrrName = keys[i2];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true)
            validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0)
          return orderedResult;
        else
          return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i2 = 0; i2 < arr.length; i2++) {
        const tagObj = arr[i2];
        const tagName = propName(tagObj);
        if (tagName === void 0)
          continue;
        let newJPath = "";
        if (jPath.length === 0)
          newJPath = tagName;
        else
          newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode)
            xmlStr += tagStart + ">";
          else
            xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i2 = 0; i2 < keys.length; i2++) {
        const key = keys[i2];
        if (!obj.hasOwnProperty(key))
          continue;
        if (key !== ":@")
          return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!attrMap.hasOwnProperty(attr))
            continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName)
          return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i2 = 0; i2 < options.entities.length; i2++) {
          const entity = options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a2) {
        return a2;
      },
      attributeValueProcessor: function(attrName, a2) {
        return a2;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val2 = "";
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key))
          continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val2 += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val2 += "";
          } else if (key[0] === "?") {
            val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val2 += this.replaceEntitiesValue(newval);
            } else {
              val2 += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j2 = 0; j2 < arrLen; j2++) {
            const item = jObj[key][j2];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?")
                val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else
                val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1);
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val2 += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j2 = 0; j2 < L; j2++) {
              attrStr += this.buildAttrPairStr(Ks[j2], "" + jObj[key][Ks[j2]]);
            }
          } else {
            val2 += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val: val2 };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val2) {
      val2 = this.options.attributeValueProcessor(attrName, "" + val2);
      val2 = this.replaceEntitiesValue(val2);
      if (this.options.suppressBooleanAttributes && val2 === "true") {
        return " " + attrName;
      } else
        return " " + attrName + '="' + val2 + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
      if (val2 === "") {
        if (key[0] === "?")
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val2.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode)
          closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val2);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i2 = 0; i2 < this.options.entities.length; i2++) {
          const entity = this.options.entities[i2];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js
var getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
  let httpHandler = runtimeConfig.httpHandler;
  return {
    setHttpHandler(handler) {
      httpHandler = handler;
    },
    httpHandler() {
      return httpHandler;
    },
    updateHttpClientConfig(key, value) {
      httpHandler.updateHttpClientConfig(key, value);
    },
    httpHandlerConfigs() {
      return httpHandler.httpHandlerConfigs();
    }
  };
};
var resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
  return {
    httpHandler: httpHandlerExtensionConfiguration.httpHandler()
  };
};

// node_modules/@smithy/types/dist-es/auth/auth.js
var HttpAuthLocation;
(function(HttpAuthLocation2) {
  HttpAuthLocation2["HEADER"] = "header";
  HttpAuthLocation2["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));

// node_modules/@smithy/types/dist-es/auth/HttpApiKeyAuth.js
var HttpApiKeyAuthLocation;
(function(HttpApiKeyAuthLocation2) {
  HttpApiKeyAuthLocation2["HEADER"] = "header";
  HttpApiKeyAuthLocation2["QUERY"] = "query";
})(HttpApiKeyAuthLocation || (HttpApiKeyAuthLocation = {}));

// node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));

// node_modules/@smithy/types/dist-es/http.js
var FieldPosition;
(function(FieldPosition2) {
  FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
  FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));

// node_modules/@smithy/types/dist-es/middleware.js
var SMITHY_CONTEXT_KEY = "__smithy_context";

// node_modules/@smithy/types/dist-es/profile.js
var IniSectionType;
(function(IniSectionType2) {
  IniSectionType2["PROFILE"] = "profile";
  IniSectionType2["SSO_SESSION"] = "sso-session";
  IniSectionType2["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));

// node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol;
(function(RequestHandlerProtocol2) {
  RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));

// node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var HttpRequest = class _HttpRequest {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static clone(request) {
    const cloned = new _HttpRequest(__spreadProps(__spreadValues({}, request), {
      headers: __spreadValues({}, request.headers)
    }));
    if (cloned.query) {
      cloned.query = cloneQuery(cloned.query);
    }
    return cloned;
  }
  static isInstance(request) {
    if (!request) {
      return false;
    }
    const req = request;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    return _HttpRequest.clone(this);
  }
};
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return __spreadProps(__spreadValues({}, carry), {
      [paramName]: Array.isArray(param) ? [...param] : param
    });
  }, {});
}

// node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var HttpResponse = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};

// node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
function resolveHostHeaderConfig(input) {
  return input;
}
var hostHeaderMiddleware = (options) => (next) => (args) => __async(void 0, null, function* () {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
    delete request.headers["host"];
    request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
  } else if (!request.headers["host"]) {
    let host = request.hostname;
    if (request.port != null)
      host += `:${request.port}`;
    request.headers["host"] = host;
  }
  return next(args);
});
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});

// node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = () => (next, context) => (args) => __async(void 0, null, function* () {
  try {
    const response = yield next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
    const _a = response.output, { $metadata } = _a, outputWithoutMetadata = __objRest(_a, ["$metadata"]);
    logger2?.info?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
    logger2?.error?.({
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
});
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});

// node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = (options) => (next) => (args) => __async(void 0, null, function* () {
  const { request } = args;
  if (!HttpRequest.isInstance(request) || options.runtime !== "node" || request.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
});

// node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
function resolveUserAgentConfig(input) {
  return __spreadProps(__spreadValues({}, input), {
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent
  });
}

// node_modules/@smithy/util-endpoints/dist-es/lib/isIpAddress.js
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");

// node_modules/@smithy/util-endpoints/dist-es/lib/isValidHostLabel.js
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};

// node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = {};

// node_modules/@smithy/util-endpoints/dist-es/debug/debugId.js
var debugId = "endpoints";

// node_modules/@smithy/util-endpoints/dist-es/debug/toDebugString.js
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}

// node_modules/@smithy/util-endpoints/dist-es/types/EndpointError.js
var EndpointError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};

// node_modules/@smithy/util-endpoints/dist-es/lib/booleanEquals.js
var booleanEquals = (value1, value2) => value1 === value2;

// node_modules/@smithy/util-endpoints/dist-es/lib/getAttrPathList.js
var getAttrPathList = (path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};

// node_modules/@smithy/util-endpoints/dist-es/lib/getAttr.js
var getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value);

// node_modules/@smithy/util-endpoints/dist-es/lib/isSet.js
var isSet = (value) => value != null;

// node_modules/@smithy/util-endpoints/dist-es/lib/not.js
var not = (value) => !value;

// node_modules/@smithy/util-endpoints/dist-es/lib/parseURL.js
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k2, v2]) => `${k2}=${v2}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};

// node_modules/@smithy/util-endpoints/dist-es/lib/stringEquals.js
var stringEquals = (value1, value2) => value1 === value2;

// node_modules/@smithy/util-endpoints/dist-es/lib/substring.js
var substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};

// node_modules/@smithy/util-endpoints/dist-es/lib/uriEncode.js
var uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`);

// node_modules/@smithy/util-endpoints/dist-es/utils/endpointFunctions.js
var endpointFunctions = {
  booleanEquals,
  getAttr,
  isSet,
  isValidHostLabel,
  not,
  parseURL,
  stringEquals,
  substring,
  uriEncode
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTemplate.js
var evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = __spreadValues(__spreadValues({}, options.endpointParams), options.referenceRecord);
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};

// node_modules/@smithy/util-endpoints/dist-es/utils/getReferenceValue.js
var getReferenceValue = ({ ref }, options) => {
  const referenceRecord = __spreadValues(__spreadValues({}, options.endpointParams), options.referenceRecord);
  return referenceRecord[ref];
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateExpression.js
var evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};

// node_modules/@smithy/util-endpoints/dist-es/utils/callFunction.js
var callFunction = ({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  const fnSegments = fn.split(".");
  if (fnSegments[0] in customEndpointFunctions && fnSegments[1] != null) {
    return customEndpointFunctions[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
  }
  return endpointFunctions[fn](...evaluatedArgs);
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateCondition.js
var evaluateCondition = (_a, options) => {
  var _b = _a, { assign } = _b, fnArgs = __objRest(_b, ["assign"]);
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return __spreadValues({
    result: value === "" ? true : !!value
  }, assign != null && { toAssign: { name: assign, value } });
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateConditions.js
var evaluateConditions = (conditions = [], options) => {
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, __spreadProps(__spreadValues({}, options), {
      referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), conditionsReferenceRecord)
    }));
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
};

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointHeaders.js
var getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => __spreadProps(__spreadValues({}, acc), {
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperty.js
var getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperties.js
var getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => __spreadProps(__spreadValues({}, acc), {
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {});

// node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointUrl.js
var getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateEndpointRule.js
var evaluateEndpointRule = (endpointRule, options) => {
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  });
  const { url, properties, headers } = endpoint;
  options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return __spreadProps(__spreadValues(__spreadValues({}, headers != void 0 && {
    headers: getEndpointHeaders(headers, endpointRuleOptions)
  }), properties != void 0 && {
    properties: getEndpointProperties(properties, endpointRuleOptions)
  }), {
    url: getEndpointUrl(url, endpointRuleOptions)
  });
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateErrorRule.js
var evaluateErrorRule = (errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  })));
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTreeRule.js
var evaluateTreeRule = (treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, __spreadProps(__spreadValues({}, options), {
    referenceRecord: __spreadValues(__spreadValues({}, options.referenceRecord), referenceRecord)
  }));
};

// node_modules/@smithy/util-endpoints/dist-es/utils/evaluateRules.js
var evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};

// node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js
var resolveEndpoint = (ruleSetObject, options) => {
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v2]) => v2.default != null).map(([k2, v2]) => [k2, v2.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v2]) => v2.required).map(([k2]) => k2);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  if (options.endpointParams?.Endpoint) {
    try {
      const givenEndpoint = new URL(options.endpointParams.Endpoint);
      const { protocol, port } = givenEndpoint;
      endpoint.url.protocol = protocol;
      endpoint.url.port = port;
    } catch (e2) {
    }
  }
  options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
var isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
var ARN_DELIMITER = ":";
var RESOURCE_DELIMITER = "/";
var parseArn = (value) => {
  const segments = value.split(ARN_DELIMITER);
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourcePath] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
    return null;
  const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId
  };
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-east-1",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "ap-southeast-5": {
        description: "Asia Pacific (Malaysia)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "ca-west-1": {
        description: "Canada West (Calgary)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "il-central-1": {
        description: "Israel (Tel Aviv)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      implicitGlobalRegion: "cn-northwest-1",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      implicitGlobalRegion: "us-gov-west-1",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      implicitGlobalRegion: "us-iso-east-1",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      implicitGlobalRegion: "us-isob-east-1",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      implicitGlobalRegion: "eu-isoe-west-1",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {
      "eu-isoe-west-1": {
        description: "EU ISOE West"
      }
    }
  }, {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      implicitGlobalRegion: "us-isof-south-1",
      name: "aws-iso-f",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {}
  }],
  version: "1.1"
};

// node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = (value) => {
  const { partitions } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return __spreadValues(__spreadValues({}, outputs), regionData);
      }
    }
  }
  for (const partition2 of partitions) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return __spreadValues({}, outputs);
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return __spreadValues({}, DEFAULT_PARTITION.outputs);
};
var getUserAgentPrefix = () => selectedUserAgentPrefix;

// node_modules/@aws-sdk/util-endpoints/dist-es/aws.js
var awsEndpointFunctions = {
  isVirtualHostableS3Bucket,
  parseArn,
  partition
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_NAME_SEPARATOR = "/";
var UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
var UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
var UA_ESCAPE_CHAR = "-";

// node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = (options) => (next, context) => (args) => __async(void 0, null, function* () {
  const { request } = args;
  if (!HttpRequest.isInstance(request))
    return next(args);
  const { headers } = request;
  const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
  const defaultUserAgent2 = (yield options.defaultUserAgentProvider()).map(escapeUserAgent);
  const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
  const prefix = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent2, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent2.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});
var escapeUserAgent = (userAgentPair) => {
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});

// node_modules/@smithy/util-config-provider/dist-es/types.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var DEFAULT_USE_DUALSTACK_ENDPOINT = false;

// node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var DEFAULT_USE_FIPS_ENDPOINT = false;

// node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = (context) => context[SMITHY_CONTEXT_KEY] || (context[SMITHY_CONTEXT_KEY] = {});

// node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};

// node_modules/@smithy/config-resolver/dist-es/regionConfig/isFipsRegion.js
var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));

// node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;

// node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = (input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return __spreadProps(__spreadValues({}, input), {
    region: () => __async(void 0, null, function* () {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = yield region();
      return getRealRegion(providedRegion);
    }),
    useFipsEndpoint: () => __async(void 0, null, function* () {
      const providedRegion = typeof region === "string" ? region : yield region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    })
  });
};

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js
function convertHttpAuthSchemesToMap(httpAuthSchemes) {
  const map2 = /* @__PURE__ */ new Map();
  for (const scheme of httpAuthSchemes) {
    map2.set(scheme.schemeId, scheme);
  }
  return map2;
}
var httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => (args) => __async(void 0, null, function* () {
  const options = config.httpAuthSchemeProvider(yield mwOptions.httpAuthSchemeParametersProvider(config, context, args.input));
  const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
  const smithyContext = getSmithyContext(context);
  const failureReasons = [];
  for (const option of options) {
    const scheme = authSchemes.get(option.schemeId);
    if (!scheme) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
      continue;
    }
    const identityProvider = scheme.identityProvider(yield mwOptions.identityProviderConfigProvider(config));
    if (!identityProvider) {
      failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
      continue;
    }
    const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
    option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
    option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
    smithyContext.selectedHttpAuthScheme = {
      httpAuthOption: option,
      identity: yield identityProvider(option.identityProperties),
      signer: scheme.signer
    };
    break;
  }
  if (!smithyContext.selectedHttpAuthScheme) {
    throw new Error(failureReasons.join("\n"));
  }
  return next(args);
});

// node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/s3.js
var resolveParamsForS3 = (endpointParams) => __async(void 0, null, function* () {
  const bucket = endpointParams?.Bucket || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
});
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
var isArnBucketName = (bucketName) => {
  const [arn, partition2, service, , , bucket] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = Boolean(isArn && partition2 && service && bucket);
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return isValidArn;
};

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
var createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
  const configProvider = () => __async(void 0, null, function* () {
    const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  });
  if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
    return () => __async(void 0, null, function* () {
      const credentials = typeof config.credentials === "function" ? yield config.credentials() : config.credentials;
      const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
      return configValue;
    });
  }
  if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
    return () => __async(void 0, null, function* () {
      const credentials = typeof config.credentials === "function" ? yield config.credentials() : config.credentials;
      const configValue = credentials?.accountId ?? credentials?.AccountId;
      return configValue;
    });
  }
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return () => __async(void 0, null, function* () {
      const endpoint = yield configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    });
  }
  return configProvider;
};

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromConfig.browser.js
var getEndpointFromConfig = (serviceId) => __async(void 0, null, function* () {
  return void 0;
});

// node_modules/@smithy/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}

// node_modules/@smithy/url-parser/dist-es/index.js
var parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};

// node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
var getEndpointFromInstructions = (commandInput, instructionsSupplier, clientConfig, context) => __async(void 0, null, function* () {
  if (!clientConfig.endpoint) {
    const endpointFromConfig = yield getEndpointFromConfig(clientConfig.serviceId || "");
    if (endpointFromConfig) {
      clientConfig.endpoint = () => Promise.resolve(toEndpointV1(endpointFromConfig));
    }
  }
  const endpointParams = yield resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
});
var resolveParams = (commandInput, instructionsSupplier, clientConfig) => __async(void 0, null, function* () {
  const endpointParams = {};
  const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = yield createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    yield resolveParamsForS3(endpointParams);
  }
  return endpointParams;
});

// node_modules/@smithy/middleware-endpoint/dist-es/endpointMiddleware.js
var endpointMiddleware = ({ config, instructions }) => {
  return (next, context) => (args) => __async(void 0, null, function* () {
    const endpoint = yield getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, __spreadValues({}, config), context);
    context.endpointV2 = endpoint;
    context.authSchemes = endpoint.properties?.authSchemes;
    const authScheme = context.authSchemes?.[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
      const smithyContext = getSmithyContext(context);
      const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
      if (httpAuthOption) {
        httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
          signing_region: authScheme.signingRegion,
          signingRegion: authScheme.signingRegion,
          signing_service: authScheme.signingName,
          signingName: authScheme.signingName,
          signingRegionSet: authScheme.signingRegionSet
        }, authScheme.properties);
      }
    }
    return next(__spreadValues({}, args));
  });
};

// node_modules/@smithy/middleware-serde/dist-es/deserializerMiddleware.js
var deserializerMiddleware = (options, deserializer) => (next) => (args) => __async(void 0, null, function* () {
  const { response } = yield next(args);
  try {
    const parsed = yield deserializer(response, options);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      error.message += "\n  " + hint;
      if (typeof error.$responseBodyText !== "undefined") {
        if (error.$response) {
          error.$response.body = error.$responseBodyText;
        }
      }
    }
    throw error;
  }
});

// node_modules/@smithy/middleware-serde/dist-es/serializerMiddleware.js
var serializerMiddleware = (options, serializer) => (next, context) => (args) => __async(void 0, null, function* () {
  const endpoint = context.endpointV2?.url && options.urlParser ? () => __async(void 0, null, function* () {
    return options.urlParser(context.endpointV2.url);
  }) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request = yield serializer(args.input, __spreadProps(__spreadValues({}, options), { endpoint }));
  return next(__spreadProps(__spreadValues({}, args), {
    request
  }));
});

// node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}

// node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = (config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
});

// node_modules/@smithy/middleware-endpoint/dist-es/resolveEndpointConfig.js
var resolveEndpointConfig = (input) => {
  const tls = input.tls ?? true;
  const { endpoint } = input;
  const customEndpointProvider = endpoint != null ? () => __async(void 0, null, function* () {
    return toEndpointV1(yield normalizeProvider(endpoint)());
  }) : void 0;
  const isCustomEndpoint = !!endpoint;
  return __spreadProps(__spreadValues({}, input), {
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider(input.useDualstackEndpoint ?? false),
    useFipsEndpoint: normalizeProvider(input.useFipsEndpoint ?? false)
  });
};

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js
var httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: endpointMiddlewareOptions.name
};
var getHttpAuthSchemeEndpointRuleSetPlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider }) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
      httpAuthSchemeParametersProvider,
      identityProviderConfigProvider
    }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
  }
});

// node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemePlugin.js
var httpAuthSchemeMiddlewareOptions = {
  step: "serialize",
  tags: ["HTTP_AUTH_SCHEME"],
  name: "httpAuthSchemeMiddleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};

// node_modules/@smithy/core/dist-es/middleware-http-signing/httpSigningMiddleware.js
var defaultErrorHandler = (signingProperties) => (error) => {
  throw error;
};
var defaultSuccessHandler = (httpResponse, signingProperties) => {
};
var httpSigningMiddleware = (config) => (next, context) => (args) => __async(void 0, null, function* () {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const smithyContext = getSmithyContext(context);
  const scheme = smithyContext.selectedHttpAuthScheme;
  if (!scheme) {
    throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
  }
  const { httpAuthOption: { signingProperties = {} }, identity, signer } = scheme;
  const output = yield next(__spreadProps(__spreadValues({}, args), {
    request: yield signer.sign(args.request, identity, signingProperties)
  })).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
  (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
  return output;
});

// node_modules/@smithy/util-retry/dist-es/config.js
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// node_modules/@smithy/service-error-classification/dist-es/constants.js
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];

// node_modules/@smithy/service-error-classification/dist-es/index.js
var isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
var isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 || THROTTLING_ERROR_CODES.includes(error.name) || error.$retryable?.throttling == true;
var isTransientError = (error) => isClockSkewCorrectedError(error) || TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") || TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0);
var isServerError = (error) => {
  if (error.$metadata?.httpStatusCode !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
};

// node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = class {
  constructor(options) {
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = options?.beta ?? 0.7;
    this.minCapacity = options?.minCapacity ?? 1;
    this.minFillRate = options?.minFillRate ?? 0.5;
    this.scaleConstant = options?.scaleConstant ?? 0.4;
    this.smooth = options?.smooth ?? 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  getSendToken() {
    return __async(this, null, function* () {
      return this.acquireTokenBucket(1);
    });
  }
  acquireTokenBucket(amount) {
    return __async(this, null, function* () {
      if (!this.enabled) {
        return;
      }
      this.refillTokenBucket();
      if (amount > this.currentCapacity) {
        const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
        yield new Promise((resolve) => setTimeout(resolve, delay));
      }
      this.currentCapacity = this.currentCapacity - amount;
    });
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t2 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t2 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};

// node_modules/@smithy/util-retry/dist-es/constants.js
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// node_modules/@smithy/util-retry/dist-es/defaultRetryBackoffStrategy.js
var getDefaultRetryBackoffStrategy = () => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = (attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  };
  const setDelayBase = (delay) => {
    delayBase = delay;
  };
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
};

// node_modules/@smithy/util-retry/dist-es/defaultRetryToken.js
var createDefaultRetryToken = ({ retryDelay, retryCount, retryCost }) => {
  const getRetryCount = () => retryCount;
  const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
  const getRetryCost = () => retryCost;
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
};

// node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = class {
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.capacity = INITIAL_RETRY_TOKENS;
    this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : () => __async(this, null, function* () {
      return maxAttempts;
    });
  }
  acquireInitialRetryToken(retryTokenScope) {
    return __async(this, null, function* () {
      return createDefaultRetryToken({
        retryDelay: DEFAULT_RETRY_DELAY_BASE,
        retryCount: 0
      });
    });
  }
  refreshRetryTokenForRetry(token, errorInfo) {
    return __async(this, null, function* () {
      const maxAttempts = yield this.getMaxAttempts();
      if (this.shouldRetry(token, errorInfo, maxAttempts)) {
        const errorType = errorInfo.errorType;
        this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
        const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
        const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
        const capacityCost = this.getCapacityCost(errorType);
        this.capacity -= capacityCost;
        return createDefaultRetryToken({
          retryDelay,
          retryCount: token.getRetryCount() + 1,
          retryCost: capacityCost
        });
      }
      throw new Error("No retry token available");
    });
  }
  recordSuccess(token) {
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + (token.getRetryCost() ?? NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  getMaxAttempts() {
    return __async(this, null, function* () {
      try {
        return yield this.maxAttemptsProvider();
      } catch (error) {
        console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
        return DEFAULT_MAX_ATTEMPTS;
      }
    });
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};

// node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = class {
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const { rateLimiter } = options ?? {};
    this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  acquireInitialRetryToken(retryTokenScope) {
    return __async(this, null, function* () {
      yield this.rateLimiter.getSendToken();
      return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
    });
  }
  refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    return __async(this, null, function* () {
      this.rateLimiter.updateClientSendingRate(errorInfo);
      return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
    });
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v2;
  const arr = new Uint8Array(16);
  arr[0] = (v2 = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v2 >>> 16 & 255;
  arr[2] = v2 >>> 8 & 255;
  arr[3] = v2 & 255;
  arr[4] = (v2 = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v2 & 255;
  arr[6] = (v2 = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v2 & 255;
  arr[8] = (v2 = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v2 & 255;
  arr[10] = (v2 = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v2 / 4294967296 & 255;
  arr[12] = v2 >>> 24 & 255;
  arr[13] = v2 >>> 16 & 255;
  arr[14] = v2 >>> 8 & 255;
  arr[15] = v2 & 255;
  return arr;
}
var parse_default = parse;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = [];
  for (let i2 = 0; i2 < str.length; ++i2) {
    bytes.push(str.charCodeAt(i2));
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL2 = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 15 | version;
    bytes[8] = bytes[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i2 = 0; i2 < 16; ++i2) {
        buf[offset + i2] = bytes[i2];
      }
      return buf;
    }
    return unsafeStringify(bytes);
  }
  try {
    generateUUID.name = name;
  } catch (err) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL2;
  return generateUUID;
}

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/md5.js
function md5(bytes) {
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = new Uint8Array(msg.length);
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes[i2] = msg.charCodeAt(i2);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = "0123456789abcdef";
  for (let i2 = 0; i2 < length32; i2 += 8) {
    const x = input[i2 >> 5] >>> i2 % 32 & 255;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
    output.push(hex);
  }
  return output;
}
function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
function wordsToMd5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a2 = 1732584193;
  let b2 = -271733879;
  let c2 = -1732584194;
  let d2 = 271733878;
  for (let i2 = 0; i2 < x.length; i2 += 16) {
    const olda = a2;
    const oldb = b2;
    const oldc = c2;
    const oldd = d2;
    a2 = md5ff(a2, b2, c2, d2, x[i2], 7, -680876936);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 1], 12, -389564586);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 2], 17, 606105819);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 3], 22, -1044525330);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 4], 7, -176418897);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 5], 12, 1200080426);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 6], 17, -1473231341);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 7], 22, -45705983);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 8], 7, 1770035416);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 9], 12, -1958414417);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 10], 17, -42063);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 11], 22, -1990404162);
    a2 = md5ff(a2, b2, c2, d2, x[i2 + 12], 7, 1804603682);
    d2 = md5ff(d2, a2, b2, c2, x[i2 + 13], 12, -40341101);
    c2 = md5ff(c2, d2, a2, b2, x[i2 + 14], 17, -1502002290);
    b2 = md5ff(b2, c2, d2, a2, x[i2 + 15], 22, 1236535329);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 1], 5, -165796510);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 6], 9, -1069501632);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 11], 14, 643717713);
    b2 = md5gg(b2, c2, d2, a2, x[i2], 20, -373897302);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 5], 5, -701558691);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 10], 9, 38016083);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 15], 14, -660478335);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 4], 20, -405537848);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 9], 5, 568446438);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 14], 9, -1019803690);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 3], 14, -187363961);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 8], 20, 1163531501);
    a2 = md5gg(a2, b2, c2, d2, x[i2 + 13], 5, -1444681467);
    d2 = md5gg(d2, a2, b2, c2, x[i2 + 2], 9, -51403784);
    c2 = md5gg(c2, d2, a2, b2, x[i2 + 7], 14, 1735328473);
    b2 = md5gg(b2, c2, d2, a2, x[i2 + 12], 20, -1926607734);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 5], 4, -378558);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 8], 11, -2022574463);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 11], 16, 1839030562);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 14], 23, -35309556);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 1], 4, -1530992060);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 4], 11, 1272893353);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 7], 16, -155497632);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 10], 23, -1094730640);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 13], 4, 681279174);
    d2 = md5hh(d2, a2, b2, c2, x[i2], 11, -358537222);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 3], 16, -722521979);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 6], 23, 76029189);
    a2 = md5hh(a2, b2, c2, d2, x[i2 + 9], 4, -640364487);
    d2 = md5hh(d2, a2, b2, c2, x[i2 + 12], 11, -421815835);
    c2 = md5hh(c2, d2, a2, b2, x[i2 + 15], 16, 530742520);
    b2 = md5hh(b2, c2, d2, a2, x[i2 + 2], 23, -995338651);
    a2 = md5ii(a2, b2, c2, d2, x[i2], 6, -198630844);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 7], 10, 1126891415);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 14], 15, -1416354905);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 5], 21, -57434055);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 12], 6, 1700485571);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 3], 10, -1894986606);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 10], 15, -1051523);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 1], 21, -2054922799);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 8], 6, 1873313359);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 15], 10, -30611744);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 6], 15, -1560198380);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 13], 21, 1309151649);
    a2 = md5ii(a2, b2, c2, d2, x[i2 + 4], 6, -145523070);
    d2 = md5ii(d2, a2, b2, c2, x[i2 + 11], 10, -1120210379);
    c2 = md5ii(c2, d2, a2, b2, x[i2 + 2], 15, 718787259);
    b2 = md5ii(b2, c2, d2, a2, x[i2 + 9], 21, -343485551);
    a2 = safeAdd(a2, olda);
    b2 = safeAdd(b2, oldb);
    c2 = safeAdd(c2, oldc);
    d2 = safeAdd(d2, oldd);
  }
  return [a2, b2, c2, d2];
}
function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));
  for (let i2 = 0; i2 < length8; i2 += 8) {
    output[i2 >> 5] |= (input[i2 / 8] & 255) << i2 % 32;
  }
  return output;
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q2, a2, b2, x, s2, t2) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a2, q2), safeAdd(x, t2)), s2), b2);
}
function md5ff(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 & c2 | ~b2 & d2, a2, b2, x, s2, t2);
}
function md5gg(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 & d2 | c2 & ~d2, a2, b2, x, s2, t2);
}
function md5hh(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(b2 ^ c2 ^ d2, a2, b2, x, s2, t2);
}
function md5ii(a2, b2, c2, d2, x, s2, t2) {
  return md5cmn(c2 ^ (b2 | ~d2), a2, b2, x, s2, t2);
}
var md5_default = md5;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v3.js
var v3 = v35("v3", 48, md5_default);

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i2 = 0; i2 < 16; ++i2) {
      buf[offset + i2] = rnds[i2];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/sha1.js
function f(s2, x, y, z) {
  switch (s2) {
    case 0:
      return x & y ^ ~x & z;
    case 1:
      return x ^ y ^ z;
    case 2:
      return x & y ^ x & z ^ y & z;
    case 3:
      return x ^ y ^ z;
  }
}
function ROTL(x, n2) {
  return x << n2 | x >>> 32 - n2;
}
function sha1(bytes) {
  const K = [1518500249, 1859775393, 2400959708, 3395469782];
  const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = [];
    for (let i2 = 0; i2 < msg.length; ++i2) {
      bytes.push(msg.charCodeAt(i2));
    }
  } else if (!Array.isArray(bytes)) {
    bytes = Array.prototype.slice.call(bytes);
  }
  bytes.push(128);
  const l2 = bytes.length / 4 + 2;
  const N = Math.ceil(l2 / 16);
  const M = new Array(N);
  for (let i2 = 0; i2 < N; ++i2) {
    const arr = new Uint32Array(16);
    for (let j2 = 0; j2 < 16; ++j2) {
      arr[j2] = bytes[i2 * 64 + j2 * 4] << 24 | bytes[i2 * 64 + j2 * 4 + 1] << 16 | bytes[i2 * 64 + j2 * 4 + 2] << 8 | bytes[i2 * 64 + j2 * 4 + 3];
    }
    M[i2] = arr;
  }
  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
  for (let i2 = 0; i2 < N; ++i2) {
    const W = new Uint32Array(80);
    for (let t2 = 0; t2 < 16; ++t2) {
      W[t2] = M[i2][t2];
    }
    for (let t2 = 16; t2 < 80; ++t2) {
      W[t2] = ROTL(W[t2 - 3] ^ W[t2 - 8] ^ W[t2 - 14] ^ W[t2 - 16], 1);
    }
    let a2 = H[0];
    let b2 = H[1];
    let c2 = H[2];
    let d2 = H[3];
    let e2 = H[4];
    for (let t2 = 0; t2 < 80; ++t2) {
      const s2 = Math.floor(t2 / 20);
      const T = ROTL(a2, 5) + f(s2, b2, c2, d2) + e2 + K[s2] + W[t2] >>> 0;
      e2 = d2;
      d2 = c2;
      c2 = ROTL(b2, 30) >>> 0;
      b2 = a2;
      a2 = T;
    }
    H[0] = H[0] + a2 >>> 0;
    H[1] = H[1] + b2 >>> 0;
    H[2] = H[2] + c2 >>> 0;
    H[3] = H[3] + d2 >>> 0;
    H[4] = H[4] + e2 >>> 0;
  }
  return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
}
var sha1_default = sha1;

// node_modules/@smithy/middleware-retry/node_modules/uuid/dist/esm-browser/v5.js
var v5 = v35("v5", 80, sha1_default);

// node_modules/@smithy/middleware-retry/dist-es/util.js
var asSdkError = (error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
};

// node_modules/@smithy/middleware-retry/dist-es/configurations.js
var resolveRetryConfig = (input) => {
  const { retryStrategy } = input;
  const maxAttempts = normalizeProvider(input.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  return __spreadProps(__spreadValues({}, input), {
    maxAttempts,
    retryStrategy: () => __async(void 0, null, function* () {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = yield normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    })
  });
};

// node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = class {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};

// node_modules/@smithy/middleware-stack/dist-es/MiddlewareStack.js
var getAllAliases = (name, aliases) => {
  const _aliases = [];
  if (name) {
    _aliases.push(name);
  }
  if (aliases) {
    for (const alias of aliases) {
      _aliases.push(alias);
    }
  }
  return _aliases;
};
var getMiddlewareNameWithAliases = (name, aliases) => {
  return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
};
var constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  let identifyOnResolve = false;
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a2, b2) => stepWeights[b2.step] - stepWeights[a2.step] || priorityWeights[b2.priority || "normal"] - priorityWeights[a2.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      const aliases = getAllAliases(entry.name, entry.aliases);
      if (aliases.includes(toRemove)) {
        isRemoved = true;
        for (const alias of aliases) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        for (const alias of getAllAliases(entry.name, entry.aliases)) {
          entriesNameSet.delete(alias);
        }
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, __spreadValues({}, entry));
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, __spreadValues({}, entry));
    });
    toStack.identifyOnResolve?.(stack.identifyOnResolve());
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = __spreadProps(__spreadValues({}, entry), {
        before: [],
        after: []
      });
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = __spreadProps(__spreadValues({}, entry), {
        before: [],
        after: []
      });
      for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
        normalizedEntriesNameMap[alias] = normalizedEntry;
      }
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${getMiddlewareNameWithAliases(entry.name, entry.aliases)} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override, aliases: _aliases } = options;
      const entry = __spreadValues({
        step: "initialize",
        priority: "normal",
        middleware
      }, options);
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = absoluteEntries[toOverrideIndex];
            if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ${entry.priority} priority in ${entry.step} step.`);
            }
            absoluteEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override, aliases: _aliases } = options;
      const entry = __spreadValues({
        middleware
      }, options);
      const aliases = getAllAliases(name, _aliases);
      if (aliases.length > 0) {
        if (aliases.some((alias) => entriesNameSet.has(alias))) {
          if (!override)
            throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
          for (const alias of aliases) {
            const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === alias || entry2.aliases?.some((a2) => a2 === alias));
            if (toOverrideIndex === -1) {
              continue;
            }
            const toOverride = relativeEntries[toOverrideIndex];
            if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
              throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
            }
            relativeEntries.splice(toOverrideIndex, 1);
          }
        }
        for (const alias of aliases) {
          entriesNameSet.add(alias);
        }
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry) => {
        const { tags, name, aliases: _aliases } = entry;
        if (tags && tags.includes(toRemove)) {
          const aliases = getAllAliases(name, _aliases);
          for (const alias of aliases) {
            entriesNameSet.delete(alias);
          }
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        const step = mw.step ?? mw.relation + " " + mw.toMiddleware;
        return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
      });
    },
    identifyOnResolve(toggle) {
      if (typeof toggle === "boolean")
        identifyOnResolve = toggle;
      return identifyOnResolve;
    },
    resolve: (handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      if (identifyOnResolve) {
        console.log(stack.identify());
      }
      return handler;
    }
  };
  return stack;
};
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// node_modules/@smithy/smithy-client/dist-es/client.js
var Client = class {
  constructor(config) {
    this.middlewareStack = constructStack();
    this.config = config;
  }
  send(command, optionsOrCb, cb) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    const handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    if (this.config.requestHandler.destroy)
      this.config.requestHandler.destroy();
  }
};

// node_modules/@smithy/util-base64/dist-es/constants.browser.js
var alphabetByEncoding = {};
var alphabetByValue = new Array(64);
for (let i2 = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  alphabetByEncoding[char] = i2;
  alphabetByValue[i2] = char;
}
for (let i2 = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i2 + start <= limit; i2++) {
  const char = String.fromCharCode(i2 + start);
  const index = i2 + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i2 = 0; i2 < 10; i2++) {
  alphabetByEncoding[i2.toString(10)] = i2 + 52;
  const char = i2.toString(10);
  const index = i2 + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["+"] = 62;
alphabetByValue[62] = "+";
alphabetByEncoding["/"] = 63;
alphabetByValue[63] = "/";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;

// node_modules/@smithy/util-base64/dist-es/fromBase64.browser.js
var fromBase64 = (input) => {
  let totalByteLength = input.length / 4 * 3;
  if (input.slice(-2) === "==") {
    totalByteLength -= 2;
  } else if (input.slice(-1) === "=") {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i2 = 0; i2 < input.length; i2 += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = i2 + 3; j2 <= limit; j2++) {
      if (input[j2] !== "=") {
        if (!(input[j2] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j2]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j2]] << (limit - j2) * bitsPerLetter;
        bitLength += bitsPerLetter;
      } else {
        bits >>= bitsPerLetter;
      }
    }
    const chunkOffset = i2 / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k2 = 0; k2 < byteLength; k2++) {
      const offset = (byteLength - k2 - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k2, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};

// node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
var fromUtf8 = (input) => new TextEncoder().encode(input);

// node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
var toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf8(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};

// node_modules/@smithy/util-utf8/dist-es/toUtf8.browser.js
var toUtf8 = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return new TextDecoder("utf-8").decode(input);
};

// node_modules/@smithy/util-base64/dist-es/toBase64.browser.js
function toBase64(_input) {
  let input;
  if (typeof _input === "string") {
    input = fromUtf8(_input);
  } else {
    input = _input;
  }
  const isArrayLike = typeof input === "object" && typeof input.length === "number";
  const isUint8Array = typeof input === "object" && typeof input.byteOffset === "number" && typeof input.byteLength === "number";
  if (!isArrayLike && !isUint8Array) {
    throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  }
  let str = "";
  for (let i2 = 0; i2 < input.length; i2 += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j2 = i2, limit = Math.min(i2 + 3, input.length); j2 < limit; j2++) {
      bits |= input[j2] << (limit - j2 - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k2 = 1; k2 <= bitClusterCount; k2++) {
      const offset = (bitClusterCount - k2) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
    str += "==".slice(0, 4 - bitClusterCount);
  }
  return str;
}

// node_modules/@smithy/util-stream/dist-es/blob/transforms.js
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64") {
    return toBase64(payload);
  }
  return toUtf8(payload);
}
function transformFromString(str, encoding) {
  if (encoding === "base64") {
    return Uint8ArrayBlobAdapter.mutate(fromBase64(str));
  }
  return Uint8ArrayBlobAdapter.mutate(fromUtf8(str));
}

// node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js
var Uint8ArrayBlobAdapter = class _Uint8ArrayBlobAdapter extends Uint8Array {
  static fromString(source, encoding = "utf-8") {
    switch (typeof source) {
      case "string":
        return transformFromString(source, encoding);
      default:
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
  }
  static mutate(source) {
    Object.setPrototypeOf(source, _Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    return transformToString(this, encoding);
  }
};

// node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
var hexEncode = (c2) => `%${c2.charCodeAt(0).toString(16).toUpperCase()}`;

// node_modules/@smithy/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i2 = 0, iLen = value.length; i2 < iLen; i2++) {
        parts.push(`${key}=${escapeUri(value[i2])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}

// node_modules/@smithy/fetch-http-handler/dist-es/request-timeout.js
function requestTimeout(timeoutInMs = 0) {
  return new Promise((resolve, reject) => {
    if (timeoutInMs) {
      setTimeout(() => {
        const timeoutError = new Error(`Request did not complete within ${timeoutInMs} ms`);
        timeoutError.name = "TimeoutError";
        reject(timeoutError);
      }, timeoutInMs);
    }
  });
}

// node_modules/@smithy/fetch-http-handler/dist-es/fetch-http-handler.js
var keepAliveSupport = {
  supported: void 0
};
var FetchHttpHandler = class _FetchHttpHandler {
  static create(instanceOrOptions) {
    if (typeof instanceOrOptions?.handle === "function") {
      return instanceOrOptions;
    }
    return new _FetchHttpHandler(instanceOrOptions);
  }
  constructor(options) {
    if (typeof options === "function") {
      this.configProvider = options().then((opts) => opts || {});
    } else {
      this.config = options ?? {};
      this.configProvider = Promise.resolve(this.config);
    }
    if (keepAliveSupport.supported === void 0) {
      keepAliveSupport.supported = Boolean(typeof Request !== "undefined" && "keepalive" in new Request("https://[::1]"));
    }
  }
  destroy() {
  }
  handle(_0) {
    return __async(this, arguments, function* (request, { abortSignal } = {}) {
      if (!this.config) {
        this.config = yield this.configProvider;
      }
      const requestTimeoutInMs = this.config.requestTimeout;
      const keepAlive = this.config.keepAlive === true;
      const credentials = this.config.credentials;
      if (abortSignal?.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        return Promise.reject(abortError);
      }
      let path = request.path;
      const queryString = buildQueryString(request.query || {});
      if (queryString) {
        path += `?${queryString}`;
      }
      if (request.fragment) {
        path += `#${request.fragment}`;
      }
      let auth = "";
      if (request.username != null || request.password != null) {
        const username = request.username ?? "";
        const password = request.password ?? "";
        auth = `${username}:${password}@`;
      }
      const { port, method } = request;
      const url = `${request.protocol}//${auth}${request.hostname}${port ? `:${port}` : ""}${path}`;
      const body = method === "GET" || method === "HEAD" ? void 0 : request.body;
      const requestOptions = {
        body,
        headers: new Headers(request.headers),
        method,
        credentials
      };
      if (body) {
        requestOptions.duplex = "half";
      }
      if (typeof AbortController !== "undefined") {
        requestOptions.signal = abortSignal;
      }
      if (keepAliveSupport.supported) {
        requestOptions.keepalive = keepAlive;
      }
      let removeSignalEventListener = () => {
      };
      const fetchRequest = new Request(url, requestOptions);
      const raceOfPromises = [
        fetch(fetchRequest).then((response) => {
          const fetchHeaders = response.headers;
          const transformedHeaders = {};
          for (const pair of fetchHeaders.entries()) {
            transformedHeaders[pair[0]] = pair[1];
          }
          const hasReadableStream = response.body != void 0;
          if (!hasReadableStream) {
            return response.blob().then((body2) => ({
              response: new HttpResponse({
                headers: transformedHeaders,
                reason: response.statusText,
                statusCode: response.status,
                body: body2
              })
            }));
          }
          return {
            response: new HttpResponse({
              headers: transformedHeaders,
              reason: response.statusText,
              statusCode: response.status,
              body: response.body
            })
          };
        }),
        requestTimeout(requestTimeoutInMs)
      ];
      if (abortSignal) {
        raceOfPromises.push(new Promise((resolve, reject) => {
          const onAbort = () => {
            const abortError = new Error("Request aborted");
            abortError.name = "AbortError";
            reject(abortError);
          };
          if (typeof abortSignal.addEventListener === "function") {
            const signal = abortSignal;
            signal.addEventListener("abort", onAbort, { once: true });
            removeSignalEventListener = () => signal.removeEventListener("abort", onAbort);
          } else {
            abortSignal.onabort = onAbort;
          }
        }));
      }
      return Promise.race(raceOfPromises).finally(removeSignalEventListener);
    });
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config) => {
      config[key] = value;
      return config;
    });
  }
  httpHandlerConfigs() {
    return this.config ?? {};
  }
};

// node_modules/@smithy/fetch-http-handler/dist-es/stream-collector.js
var streamCollector = (stream) => {
  if (typeof Blob === "function" && stream instanceof Blob) {
    return collectBlob(stream);
  }
  return collectStream(stream);
};
function collectBlob(blob) {
  return __async(this, null, function* () {
    const base64 = yield readToBase64(blob);
    const arrayBuffer = fromBase64(base64);
    return new Uint8Array(arrayBuffer);
  });
}
function collectStream(stream) {
  return __async(this, null, function* () {
    const chunks = [];
    const reader = stream.getReader();
    let isDone = false;
    let length = 0;
    while (!isDone) {
      const { done, value } = yield reader.read();
      if (value) {
        chunks.push(value);
        length += value.length;
      }
      isDone = done;
    }
    const collected = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      collected.set(chunk, offset);
      offset += chunk.length;
    }
    return collected;
  });
}
function readToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.readyState !== 2) {
        return reject(new Error("Reader aborted too early"));
      }
      const result = reader.result ?? "";
      const commaIndex = result.indexOf(",");
      const dataOffset = commaIndex > -1 ? commaIndex + 1 : result.length;
      resolve(result.substring(dataOffset));
    };
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i2 = 0; i2 < 256; i2++) {
  let encodedByte = i2.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i2] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i2;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i2 = 0; i2 < encoded.length; i2 += 2) {
    const encodedByte = encoded.slice(i2, i2 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i2 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2++) {
    out += SHORT_TO_HEX[bytes[i2]];
  }
  return out;
}

// node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var collectBody = (..._0) => __async(void 0, [..._0], function* (streamBody = new Uint8Array(), context) {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(yield fromContext);
});

// node_modules/@smithy/smithy-client/dist-es/command.js
var Command = class {
  constructor() {
    this.middlewareStack = constructStack();
  }
  static classBuilder() {
    return new ClassBuilder();
  }
  resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor }) {
    for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
      this.middlewareStack.use(mw);
    }
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const handlerExecutionContext = __spreadValues({
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog,
      outputFilterSensitiveLog,
      [SMITHY_CONTEXT_KEY]: __spreadValues({
        commandInstance: this
      }, smithyContext)
    }, additionalContext);
    const { requestHandler } = configuration;
    return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
  }
};
var ClassBuilder = class {
  constructor() {
    this._init = () => {
    };
    this._ep = {};
    this._middlewareFn = () => [];
    this._commandName = "";
    this._clientName = "";
    this._additionalContext = {};
    this._smithyContext = {};
    this._inputFilterSensitiveLog = (_) => _;
    this._outputFilterSensitiveLog = (_) => _;
    this._serializer = null;
    this._deserializer = null;
  }
  init(cb) {
    this._init = cb;
  }
  ep(endpointParameterInstructions) {
    this._ep = endpointParameterInstructions;
    return this;
  }
  m(middlewareSupplier) {
    this._middlewareFn = middlewareSupplier;
    return this;
  }
  s(service, operation, smithyContext = {}) {
    this._smithyContext = __spreadValues({
      service,
      operation
    }, smithyContext);
    return this;
  }
  c(additionalContext = {}) {
    this._additionalContext = additionalContext;
    return this;
  }
  n(clientName, commandName) {
    this._clientName = clientName;
    this._commandName = commandName;
    return this;
  }
  f(inputFilter = (_) => _, outputFilter = (_) => _) {
    this._inputFilterSensitiveLog = inputFilter;
    this._outputFilterSensitiveLog = outputFilter;
    return this;
  }
  ser(serializer) {
    this._serializer = serializer;
    return this;
  }
  de(deserializer) {
    this._deserializer = deserializer;
    return this;
  }
  build() {
    const closure = this;
    let CommandRef;
    return CommandRef = class extends Command {
      static getEndpointParameterInstructions() {
        return closure._ep;
      }
      constructor(...[input]) {
        super();
        this.serialize = closure._serializer;
        this.deserialize = closure._deserializer;
        this.input = input ?? {};
        closure._init(this);
      }
      resolveMiddleware(stack, configuration, options) {
        return this.resolveMiddlewareWithContext(stack, configuration, options, {
          CommandCtor: CommandRef,
          middlewareFn: closure._middlewareFn,
          clientName: closure._clientName,
          commandName: closure._commandName,
          inputFilterSensitiveLog: closure._inputFilterSensitiveLog,
          outputFilterSensitiveLog: closure._outputFilterSensitiveLog,
          smithyContext: closure._smithyContext,
          additionalContext: closure._additionalContext
        });
      }
    };
  }
};

// node_modules/@smithy/smithy-client/dist-es/constants.js
var SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient = (commands2, Client2) => {
  for (const command of Object.keys(commands2)) {
    const CommandCtor = commands2[command];
    const methodImpl = function(args, optionsOrCb, cb) {
      return __async(this, null, function* () {
        const command2 = new CommandCtor(args);
        if (typeof optionsOrCb === "function") {
          this.send(command2, optionsOrCb);
        } else if (typeof cb === "function") {
          if (typeof optionsOrCb !== "object")
            throw new Error(`Expected http options but got ${typeof optionsOrCb}`);
          this.send(command2, optionsOrCb || {}, cb);
        } else {
          return this.send(command2, optionsOrCb);
        }
      });
    };
    const methodName = (command[0].toLowerCase() + command.slice(1)).replace(/Command$/, "");
    Client2.prototype[methodName] = methodImpl;
  }
};

// node_modules/@smithy/smithy-client/dist-es/parse-utils.js
var expectBoolean = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    if (value === 0 || value === 1) {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (value === 0) {
      return false;
    }
    if (value === 1) {
      return true;
    }
  }
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "false" || lower === "true") {
      logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
    }
    if (lower === "false") {
      return false;
    }
    if (lower === "true") {
      return true;
    }
  }
  if (typeof value === "boolean") {
    return value;
  }
  throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
};
var expectNumber = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectLong = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
var expectInt32 = (value) => expectSizedInt(value, 32);
var expectSizedInt = (value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
};
var castInt = (value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
var expectNonNull = (value, location) => {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError(`Expected a non-null value for ${location}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
};
var expectObject = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  const receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
var expectString = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
var strictParseDouble = (value) => {
  if (typeof value == "string") {
    return expectNumber(parseNumber(value));
  }
  return expectNumber(value);
};
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = (value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
};
var limitedParseDouble = (value) => {
  if (typeof value == "string") {
    return parseFloatString(value);
  }
  return expectNumber(value);
};
var parseFloatString = (value) => {
  switch (value) {
    case "NaN":
      return NaN;
    case "Infinity":
      return Infinity;
    case "-Infinity":
      return -Infinity;
    default:
      throw new Error(`Unable to parse float value: ${value}`);
  }
};
var stackTraceWarning = (message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s2) => !s2.includes("stackTraceWarning")).join("\n");
};
var logger = {
  warn: console.warn
};

// node_modules/@smithy/smithy-client/dist-es/date-utils.js
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var parseEpochTimestamp = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  let valueAsDouble;
  if (typeof value === "number") {
    valueAsDouble = value;
  } else if (typeof value === "string") {
    valueAsDouble = strictParseDouble(value);
  } else if (typeof value === "object" && value.tag === 1) {
    valueAsDouble = value.value;
  } else {
    throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
  }
  if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
    throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
  }
  return new Date(Math.round(valueAsDouble * 1e3));
};
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;

// node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException = class _ServiceException extends Error {
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
};
var decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v2]) => v2 !== void 0).forEach(([k2, v2]) => {
    if (exception[k2] == void 0 || exception[k2] === "") {
      exception[k2] = v2;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};

// node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response = new exceptionCtor({
    name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
};
var withBaseException = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
};
var deserializeMetadata = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});

// node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
var loadConfigsForDefaultMode = (mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};

// node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var getChecksumConfiguration2 = (runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  return {
    _checksumAlgorithms: checksumAlgorithms,
    addChecksumAlgorithm(algo) {
      this._checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return this._checksumAlgorithms;
    }
  };
};
var resolveChecksumRuntimeConfig2 = (clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
  });
  return runtimeConfig;
};

// node_modules/@smithy/smithy-client/dist-es/extensions/retry.js
var getRetryConfiguration = (runtimeConfig) => {
  let _retryStrategy = runtimeConfig.retryStrategy;
  return {
    setRetryStrategy(retryStrategy) {
      _retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return _retryStrategy;
    }
  };
};
var resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
};

// node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js
var getDefaultExtensionConfiguration = (runtimeConfig) => {
  return __spreadValues(__spreadValues({}, getChecksumConfiguration2(runtimeConfig)), getRetryConfiguration(runtimeConfig));
};
var resolveDefaultRuntimeConfig = (config) => {
  return __spreadValues(__spreadValues({}, resolveChecksumRuntimeConfig2(config)), resolveRetryRuntimeConfig(config));
};

// node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c2) {
    return "%" + c2.charCodeAt(0).toString(16).toUpperCase();
  });
}

// node_modules/@smithy/smithy-client/dist-es/lazy-json.js
var StringWrapper = function() {
  const Class = Object.getPrototypeOf(this).constructor;
  const Constructor = Function.bind.apply(String, [null, ...arguments]);
  const instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
};
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);

// node_modules/@smithy/smithy-client/dist-es/object-mapping.js
function map(arg0, arg1, arg2) {
  let target;
  let filter;
  let instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter, instructions);
    } else {
      instructions = arg1;
    }
  }
  for (const key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction(target, null, instructions, key);
  }
  return target;
}
var take = (source, instructions) => {
  const out = {};
  for (const key in instructions) {
    applyInstruction(out, source, instructions, key);
  }
  return out;
};
var mapWithFilter = (target, filter, instructions) => {
  return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter, value()];
      } else {
        _instructions[key] = [filter, value];
      }
    }
    return _instructions;
  }, {}));
};
var applyInstruction = (target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
};
var nonNullish = (_) => _ != null;
var pass = (_) => _;

// node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var resolvedPath = (resolvedPath2, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
  if (input != null && input[memberName] !== void 0) {
    const labelValue = labelValueProvider();
    if (labelValue.length <= 0) {
      throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
    }
    resolvedPath2 = resolvedPath2.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error("No value provided for input HTTP label: " + memberName + ".");
  }
  return resolvedPath2;
};

// node_modules/@smithy/smithy-client/dist-es/ser-utils.js
var serializeFloat = (value) => {
  if (value !== value) {
    return "NaN";
  }
  switch (value) {
    case Infinity:
      return "Infinity";
    case -Infinity:
      return "-Infinity";
    default:
      return value;
  }
};

// node_modules/@smithy/smithy-client/dist-es/serde-json.js
var _json = (obj) => {
  if (obj == null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.filter((_) => _ != null).map(_json);
  }
  if (typeof obj === "object") {
    const target = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) {
        continue;
      }
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};

// node_modules/@smithy/middleware-retry/dist-es/isStreamingPayload/isStreamingPayload.browser.js
var isStreamingPayload = (request) => request?.body instanceof ReadableStream;

// node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = (options) => (next, context) => (args) => __async(void 0, null, function* () {
  let retryStrategy = yield options.retryStrategy();
  const maxAttempts = yield options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = yield retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request } = args;
    const isRequest = HttpRequest.isInstance(request);
    if (isRequest) {
      request.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (isRequest) {
          request.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = yield next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e2) {
        const retryErrorInfo = getRetryErrorInfo(e2);
        lastError = asSdkError(e2);
        if (isRequest && isStreamingPayload(request)) {
          (context.logger instanceof NoOpLogger ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
          throw lastError;
        }
        try {
          retryToken = yield retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        yield new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy?.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
});
var isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
var getRetryErrorInfo = (error) => {
  const errorInfo = {
    error,
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
var getRetryErrorType = (error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
var getRetryAfterHint = (response) => {
  if (!HttpResponse.isInstance(response))
    return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
};

// node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js
var httpSigningMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["HTTP_SIGNING"],
  name: "httpSigningMiddleware",
  aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
  override: true,
  relation: "after",
  toMiddleware: retryMiddlewareOptions.name
};
var getHttpSigningPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(httpSigningMiddleware(config), httpSigningMiddlewareOptions);
  }
});

// node_modules/@smithy/core/dist-es/util-identity-and-auth/DefaultIdentityProviderConfig.js
var DefaultIdentityProviderConfig = class {
  constructor(config) {
    this.authSchemes = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(config)) {
      if (value !== void 0) {
        this.authSchemes.set(key, value);
      }
    }
  }
  getIdentityProvider(schemeId) {
    return this.authSchemes.get(schemeId);
  }
};

// node_modules/@smithy/core/dist-es/util-identity-and-auth/memoizeIdentityProvider.js
var createIsIdentityExpiredFunction = (expirationMs) => (identity) => doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
var EXPIRATION_MS = 3e5;
var isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
var doesIdentityRequireRefresh = (identity) => identity.expiration !== void 0;
var memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
  if (provider === void 0) {
    return void 0;
  }
  const normalizedProvider = typeof provider !== "function" ? () => __async(void 0, null, function* () {
    return Promise.resolve(provider);
  }) : provider;
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = (options) => __async(void 0, null, function* () {
    if (!pending) {
      pending = normalizedProvider(options);
    }
    try {
      resolved = yield pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  });
  if (isExpired === void 0) {
    return (options) => __async(void 0, null, function* () {
      if (!hasResult || options?.forceRefresh) {
        resolved = yield coalesceProvider(options);
      }
      return resolved;
    });
  }
  return (options) => __async(void 0, null, function* () {
    if (!hasResult || options?.forceRefresh) {
      resolved = yield coalesceProvider(options);
    }
    if (isConstant) {
      return resolved;
    }
    if (!requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      yield coalesceProvider(options);
      return resolved;
    }
    return resolved;
  });
};

// node_modules/@smithy/core/dist-es/normalizeProvider.js
var normalizeProvider2 = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};

// node_modules/@smithy/core/dist-es/protocols/requestBuilder.js
function requestBuilder(input, context) {
  return new RequestBuilder(input, context);
}
var RequestBuilder = class {
  constructor(input, context) {
    this.input = input;
    this.context = context;
    this.query = {};
    this.method = "";
    this.headers = {};
    this.path = "";
    this.body = null;
    this.hostname = "";
    this.resolvePathStack = [];
  }
  build() {
    return __async(this, null, function* () {
      const { hostname, protocol = "https", port, path: basePath } = yield this.context.endpoint();
      this.path = basePath;
      for (const resolvePath of this.resolvePathStack) {
        resolvePath(this.path);
      }
      return new HttpRequest({
        protocol,
        hostname: this.hostname || hostname,
        port,
        method: this.method,
        path: this.path,
        query: this.query,
        body: this.body,
        headers: this.headers
      });
    });
  }
  hn(hostname) {
    this.hostname = hostname;
    return this;
  }
  bp(uriLabel) {
    this.resolvePathStack.push((basePath) => {
      this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
    });
    return this;
  }
  p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
    this.resolvePathStack.push((path) => {
      this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
    });
    return this;
  }
  h(headers) {
    this.headers = headers;
    return this;
  }
  q(query) {
    this.query = query;
    return this;
  }
  b(body) {
    this.body = body;
    return this;
  }
  m(method) {
    this.method = method;
    return this;
  }
};

// node_modules/@smithy/core/dist-es/pagination/createPaginator.js
var makePagedClientRequest = (CommandCtor, client, input, ...args) => __async(void 0, null, function* () {
  return yield client.send(new CommandCtor(input), ...args);
});
function createPaginator(ClientCtor, CommandCtor, inputTokenName, outputTokenName, pageSizeTokenName) {
  return function paginateOperation(config, input, ...additionalArguments) {
    return __asyncGenerator(this, null, function* () {
      let token = config.startingToken || void 0;
      let hasNext = true;
      let page;
      while (hasNext) {
        input[inputTokenName] = token;
        if (pageSizeTokenName) {
          input[pageSizeTokenName] = input[pageSizeTokenName] ?? config.pageSize;
        }
        if (config.client instanceof ClientCtor) {
          page = yield new __await(makePagedClientRequest(CommandCtor, config.client, input, ...additionalArguments));
        } else {
          throw new Error(`Invalid client, expected instance of ${ClientCtor.name}`);
        }
        yield page;
        const prevToken = token;
        token = get(page, outputTokenName);
        hasNext = !!(token && (!config.stopOnSameToken || token !== prevToken));
      }
      return void 0;
    });
  };
}
var get = (fromObject, path) => {
  let cursor = fromObject;
  const pathComponents = path.split(".");
  for (const step of pathComponents) {
    if (!cursor || typeof cursor !== "object") {
      return void 0;
    }
    cursor = cursor[step];
  }
  return cursor;
};

// node_modules/@smithy/eventstream-serde-config-resolver/dist-es/EventStreamSerdeConfig.js
var resolveEventStreamSerdeConfig = (input) => __spreadProps(__spreadValues({}, input), {
  eventStreamMarshaller: input.eventStreamSerdeProvider(input)
});

// node_modules/@smithy/middleware-content-length/dist-es/index.js
var CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => (args) => __async(this, null, function* () {
    const request = args.request;
    if (HttpRequest.isInstance(request)) {
      const { body, headers } = request;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request.headers = __spreadProps(__spreadValues({}, request.headers), {
            [CONTENT_LENGTH_HEADER]: String(length)
          });
        } catch (error) {
        }
      }
    }
    return next(__spreadProps(__spreadValues({}, args), {
      request
    }));
  });
}
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js
var getDateHeader = (response) => HttpResponse.isInstance(response) ? response.headers?.date ?? response.headers?.Date : void 0;

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/isClockSkewed.js
var isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js
var throwSigningPropertyError = (name, property) => {
  if (!property) {
    throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
  }
  return property;
};
var validateSigningProperties = (signingProperties) => __async(void 0, null, function* () {
  const context = throwSigningPropertyError("context", signingProperties.context);
  const config = throwSigningPropertyError("config", signingProperties.config);
  const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
  const signerFunction = throwSigningPropertyError("signer", config.signer);
  const signer = yield signerFunction(authScheme);
  const signingRegion = signingProperties?.signingRegion;
  const signingRegionSet = signingProperties?.signingRegionSet;
  const signingName = signingProperties?.signingName;
  return {
    config,
    signer,
    signingRegion,
    signingRegionSet,
    signingName
  };
});
var AwsSdkSigV4Signer = class {
  sign(httpRequest, identity, signingProperties) {
    return __async(this, null, function* () {
      if (!HttpRequest.isInstance(httpRequest)) {
        throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
      }
      const validatedProps = yield validateSigningProperties(signingProperties);
      const { config, signer } = validatedProps;
      let { signingRegion, signingName } = validatedProps;
      const handlerExecutionContext = signingProperties.context;
      if (handlerExecutionContext?.authSchemes?.length ?? 0 > 1) {
        const [first, second] = handlerExecutionContext.authSchemes;
        if (first?.name === "sigv4a" && second?.name === "sigv4") {
          signingRegion = second?.signingRegion ?? signingRegion;
          signingName = second?.signingName ?? signingName;
        }
      }
      const signedRequest = yield signer.sign(httpRequest, {
        signingDate: getSkewCorrectedDate(config.systemClockOffset),
        signingRegion,
        signingService: signingName
      });
      return signedRequest;
    });
  }
  errorHandler(signingProperties) {
    return (error) => {
      const serverTime = error.ServerTime ?? getDateHeader(error.$response);
      if (serverTime) {
        const config = throwSigningPropertyError("config", signingProperties.config);
        const initialSystemClockOffset = config.systemClockOffset;
        config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
        const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
        if (clockSkewCorrected && error.$metadata) {
          error.$metadata.clockSkewCorrected = true;
        }
      }
      throw error;
    };
  }
  successHandler(httpResponse, signingProperties) {
    const dateHeader = getDateHeader(httpResponse);
    if (dateHeader) {
      const config = throwSigningPropertyError("config", signingProperties.config);
      config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
    }
  }
};

// node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = () => __async(void 0, null, function* () {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = yield pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  });
  if (isExpired === void 0) {
    return (options) => __async(void 0, null, function* () {
      if (!hasResult || options?.forceRefresh) {
        resolved = yield coalesceProvider();
      }
      return resolved;
    });
  }
  return (options) => __async(void 0, null, function* () {
    if (!hasResult || options?.forceRefresh) {
      resolved = yield coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      yield coalesceProvider();
      return resolved;
    }
    return resolved;
  });
};

// node_modules/@smithy/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
var signingKeyCache = {};
var cacheQueue = [];
var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
var getSigningKey = (sha256Constructor, credentials, shortDate, region, service) => __async(void 0, null, function* () {
  const credsHash = yield hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = yield hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
});
var hmac = (ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
};

// node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || unsignableHeaders?.has(canonicalHeaderName) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};

// node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
var getCanonicalQuery = ({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query).sort()) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    keys.push(key);
    const value = query[key];
    if (typeof value === "string") {
      serialized[key] = `${escapeUri(key)}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[key] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${escapeUri(key)}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};

// node_modules/@smithy/is-array-buffer/dist-es/index.js
var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

// node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = (_0, _1) => __async(void 0, [_0, _1], function* ({ headers, body }, hashConstructor) {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(yield hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
});

// node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js
var HeaderFormatter = class {
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE3) {
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["short"] = 3] = "short";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["long"] = 5] = "long";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["string"] = 7] = "string";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
var Int64 = class _Int64 {
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}

// node_modules/@smithy/signature-v4/dist-es/headerUtil.js
var hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js
var moveHeadersToQuery = (request, options = {}) => {
  const { headers, query = {} } = HttpRequest.clone(request);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname)) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return __spreadProps(__spreadValues({}, request), {
    headers,
    query
  });
};

// node_modules/@smithy/signature-v4/dist-es/prepareRequest.js
var prepareRequest = (request) => {
  request = HttpRequest.clone(request);
  for (const headerName of Object.keys(request.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request.headers[headerName];
    }
  }
  return request;
};

// node_modules/@smithy/signature-v4/dist-es/utilDate.js
var iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
var toDate = (time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};

// node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = class {
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.headerFormatter = new HeaderFormatter();
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  presign(_0) {
    return __async(this, arguments, function* (originalRequest, options = {}) {
      const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const { longDate, shortDate } = formatDate(signingDate);
      if (expiresIn > MAX_PRESIGNED_TTL) {
        return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
      }
      const scope = createScope(shortDate, region, signingService ?? this.service);
      const request = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
      if (credentials.sessionToken) {
        request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
      }
      request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
      request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
      request.query[AMZ_DATE_QUERY_PARAM] = longDate;
      request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
      const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
      request.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
      request.query[SIGNATURE_QUERY_PARAM] = yield this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, yield getPayloadHash(originalRequest, this.sha256)));
      return request;
    });
  }
  sign(toSign, options) {
    return __async(this, null, function* () {
      if (typeof toSign === "string") {
        return this.signString(toSign, options);
      } else if (toSign.headers && toSign.payload) {
        return this.signEvent(toSign, options);
      } else if (toSign.message) {
        return this.signMessage(toSign, options);
      } else {
        return this.signRequest(toSign, options);
      }
    });
  }
  signEvent(_0, _1) {
    return __async(this, arguments, function* ({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
      const region = signingRegion ?? (yield this.regionProvider());
      const { shortDate, longDate } = formatDate(signingDate);
      const scope = createScope(shortDate, region, signingService ?? this.service);
      const hashedPayload = yield getPayloadHash({ headers: {}, body: payload }, this.sha256);
      const hash = new this.sha256();
      hash.update(headers);
      const hashedHeaders = toHex(yield hash.digest());
      const stringToSign = [
        EVENT_ALGORITHM_IDENTIFIER,
        longDate,
        scope,
        priorSignature,
        hashedHeaders,
        hashedPayload
      ].join("\n");
      return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
    });
  }
  signMessage(_0, _1) {
    return __async(this, arguments, function* (signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
      const promise = this.signEvent({
        headers: this.headerFormatter.format(signableMessage.message.headers),
        payload: signableMessage.message.body
      }, {
        signingDate,
        signingRegion,
        signingService,
        priorSignature: signableMessage.priorSignature
      });
      return promise.then((signature) => {
        return { message: signableMessage.message, signature };
      });
    });
  }
  signString(_0) {
    return __async(this, arguments, function* (stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const { shortDate } = formatDate(signingDate);
      const hash = new this.sha256(yield this.getSigningKey(credentials, region, shortDate, signingService));
      hash.update(toUint8Array(stringToSign));
      return toHex(yield hash.digest());
    });
  }
  signRequest(_0) {
    return __async(this, arguments, function* (requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
      const credentials = yield this.credentialProvider();
      this.validateResolvedCredentials(credentials);
      const region = signingRegion ?? (yield this.regionProvider());
      const request = prepareRequest(requestToSign);
      const { longDate, shortDate } = formatDate(signingDate);
      const scope = createScope(shortDate, region, signingService ?? this.service);
      request.headers[AMZ_DATE_HEADER] = longDate;
      if (credentials.sessionToken) {
        request.headers[TOKEN_HEADER] = credentials.sessionToken;
      }
      const payloadHash = yield getPayloadHash(request, this.sha256);
      if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) {
        request.headers[SHA256_HEADER] = payloadHash;
      }
      const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
      const signature = yield this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
      request.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
      return request;
    });
  }
  createCanonicalRequest(request, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  createStringToSign(longDate, credentialScope, canonicalRequest) {
    return __async(this, null, function* () {
      const hash = new this.sha256();
      hash.update(toUint8Array(canonicalRequest));
      const hashedRequest = yield hash.digest();
      return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
    });
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if (pathSegment?.length === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
      const doubleEncoded = escapeUri(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    return __async(this, null, function* () {
      const stringToSign = yield this.createStringToSign(longDate, credentialScope, canonicalRequest);
      const hash = new this.sha256(yield keyPromise);
      hash.update(toUint8Array(stringToSign));
      return toHex(yield hash.digest());
    });
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
var formatDate = (now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
};
var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");

// node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js
var resolveAwsSdkSigV4Config = (config) => {
  let normalizedCreds;
  if (config.credentials) {
    normalizedCreds = memoizeIdentityProvider(config.credentials, isIdentityExpired, doesIdentityRequireRefresh);
  }
  if (!normalizedCreds) {
    if (config.credentialDefaultProvider) {
      normalizedCreds = normalizeProvider2(config.credentialDefaultProvider(Object.assign({}, config, {
        parentClientConfig: config
      })));
    } else {
      normalizedCreds = () => __async(void 0, null, function* () {
        throw new Error("`credentials` is missing");
      });
    }
  }
  const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256 } = config;
  let signer;
  if (config.signer) {
    signer = normalizeProvider2(config.signer);
  } else if (config.regionInfoProvider) {
    signer = () => normalizeProvider2(config.region)().then((region) => __async(void 0, null, function* () {
      return [
        (yield config.regionInfoProvider(region, {
          useFipsEndpoint: yield config.useFipsEndpoint(),
          useDualstackEndpoint: yield config.useDualstackEndpoint()
        })) || {},
        region
      ];
    })).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      config.signingRegion = config.signingRegion || signingRegion || region;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = __spreadProps(__spreadValues({}, config), {
        credentials: normalizedCreds,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      });
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = (authScheme) => __async(void 0, null, function* () {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: config.signingName || config.defaultSigningName,
        signingRegion: yield normalizeProvider2(config.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      config.signingRegion = config.signingRegion || signingRegion;
      config.signingName = config.signingName || signingService || config.serviceId;
      const params = __spreadProps(__spreadValues({}, config), {
        credentials: normalizedCreds,
        region: config.signingRegion,
        service: config.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      });
      const SignerCtor = config.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  }
  return __spreadProps(__spreadValues({}, config), {
    systemClockOffset,
    signingEscapePath,
    credentials: normalizedCreds,
    signer
  });
};

// node_modules/@aws-sdk/core/dist-es/submodules/protocols/common.js
var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));

// node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/parseJsonBody.js
var parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    try {
      return JSON.parse(encoded);
    } catch (e2) {
      if (e2?.name === "SyntaxError") {
        Object.defineProperty(e2, "$responseBodyText", {
          value: encoded
        });
      }
      throw e2;
    }
  }
  return {};
});
var parseJsonErrorBody = (errorBody, context) => __async(void 0, null, function* () {
  const value = yield parseJsonBody(errorBody, context);
  value.message = value.message ?? value.Message;
  return value;
});
var loadRestJsonErrorCode = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k2) => k2.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};

// node_modules/@aws-sdk/core/dist-es/submodules/protocols/xml/parseXmlBody.js
var import_fast_xml_parser = __toESM(require_fxp());

// node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthSchemeProvider.js
var defaultLambdaHttpAuthSchemeParametersProvider = (config, context, input) => __async(void 0, null, function* () {
  return {
    operation: getSmithyContext(context).operation,
    region: (yield normalizeProvider(config.region)()) || (() => {
      throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
    })()
  };
});
function createAwsAuthSigv4HttpAuthOption(authParameters) {
  return {
    schemeId: "aws.auth#sigv4",
    signingProperties: {
      name: "lambda",
      region: authParameters.region
    },
    propertiesExtractor: (config, context) => ({
      signingProperties: {
        config,
        context
      }
    })
  };
}
var defaultLambdaHttpAuthSchemeProvider = (authParameters) => {
  const options = [];
  switch (authParameters.operation) {
    default: {
      options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
    }
  }
  return options;
};
var resolveHttpAuthSchemeConfig = (config) => {
  const config_0 = resolveAwsSdkSigV4Config(config);
  return __spreadValues({}, config_0);
};

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  return __spreadProps(__spreadValues({}, options), {
    useDualstackEndpoint: options.useDualstackEndpoint ?? false,
    useFipsEndpoint: options.useFipsEndpoint ?? false,
    defaultSigningName: "lambda"
  });
};
var commonParams = {
  UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
  Endpoint: { type: "builtInParams", name: "endpoint" },
  Region: { type: "builtInParams", name: "region" },
  UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
};

// node_modules/@aws-sdk/client-lambda/package.json
var package_default = {
  name: "@aws-sdk/client-lambda",
  description: "AWS SDK for JavaScript Lambda Client for Node.js, Browser and React Native",
  version: "3.645.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "node ../../scripts/compilation/inline client-lambda",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo lambda"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "5.2.0",
    "@aws-crypto/sha256-js": "5.2.0",
    "@aws-sdk/client-sso-oidc": "3.645.0",
    "@aws-sdk/client-sts": "3.645.0",
    "@aws-sdk/core": "3.635.0",
    "@aws-sdk/credential-provider-node": "3.645.0",
    "@aws-sdk/middleware-host-header": "3.620.0",
    "@aws-sdk/middleware-logger": "3.609.0",
    "@aws-sdk/middleware-recursion-detection": "3.620.0",
    "@aws-sdk/middleware-user-agent": "3.645.0",
    "@aws-sdk/region-config-resolver": "3.614.0",
    "@aws-sdk/types": "3.609.0",
    "@aws-sdk/util-endpoints": "3.645.0",
    "@aws-sdk/util-user-agent-browser": "3.609.0",
    "@aws-sdk/util-user-agent-node": "3.614.0",
    "@smithy/config-resolver": "^3.0.5",
    "@smithy/core": "^2.4.0",
    "@smithy/eventstream-serde-browser": "^3.0.6",
    "@smithy/eventstream-serde-config-resolver": "^3.0.3",
    "@smithy/eventstream-serde-node": "^3.0.5",
    "@smithy/fetch-http-handler": "^3.2.4",
    "@smithy/hash-node": "^3.0.3",
    "@smithy/invalid-dependency": "^3.0.3",
    "@smithy/middleware-content-length": "^3.0.5",
    "@smithy/middleware-endpoint": "^3.1.0",
    "@smithy/middleware-retry": "^3.0.15",
    "@smithy/middleware-serde": "^3.0.3",
    "@smithy/middleware-stack": "^3.0.3",
    "@smithy/node-config-provider": "^3.1.4",
    "@smithy/node-http-handler": "^3.1.4",
    "@smithy/protocol-http": "^4.1.0",
    "@smithy/smithy-client": "^3.2.0",
    "@smithy/types": "^3.3.0",
    "@smithy/url-parser": "^3.0.3",
    "@smithy/util-base64": "^3.0.0",
    "@smithy/util-body-length-browser": "^3.0.0",
    "@smithy/util-body-length-node": "^3.0.0",
    "@smithy/util-defaults-mode-browser": "^3.0.15",
    "@smithy/util-defaults-mode-node": "^3.0.15",
    "@smithy/util-endpoints": "^2.0.5",
    "@smithy/util-middleware": "^3.0.3",
    "@smithy/util-retry": "^3.0.3",
    "@smithy/util-stream": "^3.1.3",
    "@smithy/util-utf8": "^3.0.0",
    "@smithy/util-waiter": "^3.1.2",
    tslib: "^2.6.2"
  },
  devDependencies: {
    "@tsconfig/node16": "16.1.3",
    "@types/node": "^16.18.96",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=16.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-lambda",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-lambda"
  }
};

// node_modules/@aws-crypto/sha256-browser/node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
var fromUtf82 = (input) => new TextEncoder().encode(input);

// node_modules/@aws-crypto/sha256-browser/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf83 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf82;
function convertToBuffer(data) {
  if (data instanceof Uint8Array)
    return data;
  if (typeof data === "string") {
    return fromUtf83(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}

// node_modules/@aws-crypto/sha256-browser/node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}

// node_modules/@aws-crypto/sha256-browser/build/module/constants.js
var SHA_256_HASH = { name: "SHA-256" };
var SHA_256_HMAC_ALGO = {
  name: "HMAC",
  hash: SHA_256_HASH
};
var EMPTY_DATA_SHA_256 = new Uint8Array([
  227,
  176,
  196,
  66,
  152,
  252,
  28,
  20,
  154,
  251,
  244,
  200,
  153,
  111,
  185,
  36,
  39,
  174,
  65,
  228,
  100,
  155,
  147,
  76,
  164,
  149,
  153,
  27,
  120,
  82,
  184,
  85
]);

// node_modules/@aws-sdk/util-locate-window/dist-es/index.js
var fallbackWindow = {};
function locateWindow() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof self !== "undefined") {
    return self;
  }
  return fallbackWindow;
}

// node_modules/@aws-crypto/sha256-browser/build/module/webCryptoSha256.js
var Sha256 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.toHash = new Uint8Array(0);
      this.secret = secret;
      this.reset();
    }
    Sha2564.prototype.update = function(data) {
      if (isEmptyData(data)) {
        return;
      }
      var update = convertToBuffer(data);
      var typedArray = new Uint8Array(this.toHash.byteLength + update.byteLength);
      typedArray.set(this.toHash, 0);
      typedArray.set(update, this.toHash.byteLength);
      this.toHash = typedArray;
    };
    Sha2564.prototype.digest = function() {
      var _this = this;
      if (this.key) {
        return this.key.then(function(key) {
          return locateWindow().crypto.subtle.sign(SHA_256_HMAC_ALGO, key, _this.toHash).then(function(data) {
            return new Uint8Array(data);
          });
        });
      }
      if (isEmptyData(this.toHash)) {
        return Promise.resolve(EMPTY_DATA_SHA_256);
      }
      return Promise.resolve().then(function() {
        return locateWindow().crypto.subtle.digest(SHA_256_HASH, _this.toHash);
      }).then(function(data) {
        return Promise.resolve(new Uint8Array(data));
      });
    };
    Sha2564.prototype.reset = function() {
      var _this = this;
      this.toHash = new Uint8Array(0);
      if (this.secret && this.secret !== void 0) {
        this.key = new Promise(function(resolve, reject) {
          locateWindow().crypto.subtle.importKey("raw", convertToBuffer(_this.secret), SHA_256_HMAC_ALGO, false, ["sign"]).then(resolve, reject);
        });
        this.key.catch(function() {
        });
      }
    };
    return Sha2564;
  }()
);

// node_modules/@aws-crypto/sha256-browser/node_modules/@aws-crypto/sha256-js/build/module/constants.js
var BLOCK_SIZE = 64;
var DIGEST_LENGTH = 32;
var KEY = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]);
var INIT = [
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
];
var MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;

// node_modules/@aws-crypto/sha256-browser/node_modules/@aws-crypto/sha256-js/build/module/RawSha256.js
var RawSha256 = (
  /** @class */
  function() {
    function RawSha2562() {
      this.state = Int32Array.from(INIT);
      this.temp = new Int32Array(64);
      this.buffer = new Uint8Array(64);
      this.bufferLength = 0;
      this.bytesHashed = 0;
      this.finished = false;
    }
    RawSha2562.prototype.update = function(data) {
      if (this.finished) {
        throw new Error("Attempted to update an already finished hash.");
      }
      var position = 0;
      var byteLength = data.byteLength;
      this.bytesHashed += byteLength;
      if (this.bytesHashed * 8 > MAX_HASHABLE_LENGTH) {
        throw new Error("Cannot hash more than 2^53 - 1 bits");
      }
      while (byteLength > 0) {
        this.buffer[this.bufferLength++] = data[position++];
        byteLength--;
        if (this.bufferLength === BLOCK_SIZE) {
          this.hashBuffer();
          this.bufferLength = 0;
        }
      }
    };
    RawSha2562.prototype.digest = function() {
      if (!this.finished) {
        var bitsHashed = this.bytesHashed * 8;
        var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
        var undecoratedLength = this.bufferLength;
        bufferView.setUint8(this.bufferLength++, 128);
        if (undecoratedLength % BLOCK_SIZE >= BLOCK_SIZE - 8) {
          for (var i2 = this.bufferLength; i2 < BLOCK_SIZE; i2++) {
            bufferView.setUint8(i2, 0);
          }
          this.hashBuffer();
          this.bufferLength = 0;
        }
        for (var i2 = this.bufferLength; i2 < BLOCK_SIZE - 8; i2++) {
          bufferView.setUint8(i2, 0);
        }
        bufferView.setUint32(BLOCK_SIZE - 8, Math.floor(bitsHashed / 4294967296), true);
        bufferView.setUint32(BLOCK_SIZE - 4, bitsHashed);
        this.hashBuffer();
        this.finished = true;
      }
      var out = new Uint8Array(DIGEST_LENGTH);
      for (var i2 = 0; i2 < 8; i2++) {
        out[i2 * 4] = this.state[i2] >>> 24 & 255;
        out[i2 * 4 + 1] = this.state[i2] >>> 16 & 255;
        out[i2 * 4 + 2] = this.state[i2] >>> 8 & 255;
        out[i2 * 4 + 3] = this.state[i2] >>> 0 & 255;
      }
      return out;
    };
    RawSha2562.prototype.hashBuffer = function() {
      var _a = this, buffer = _a.buffer, state = _a.state;
      var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
      for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
        if (i2 < 16) {
          this.temp[i2] = (buffer[i2 * 4] & 255) << 24 | (buffer[i2 * 4 + 1] & 255) << 16 | (buffer[i2 * 4 + 2] & 255) << 8 | buffer[i2 * 4 + 3] & 255;
        } else {
          var u2 = this.temp[i2 - 2];
          var t1_1 = (u2 >>> 17 | u2 << 15) ^ (u2 >>> 19 | u2 << 13) ^ u2 >>> 10;
          u2 = this.temp[i2 - 15];
          var t2_1 = (u2 >>> 7 | u2 << 25) ^ (u2 >>> 18 | u2 << 14) ^ u2 >>> 3;
          this.temp[i2] = (t1_1 + this.temp[i2 - 7] | 0) + (t2_1 + this.temp[i2 - 16] | 0);
        }
        var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (KEY[i2] + this.temp[i2] | 0) | 0) | 0;
        var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
        state7 = state6;
        state6 = state5;
        state5 = state4;
        state4 = state3 + t1 | 0;
        state3 = state2;
        state2 = state1;
        state1 = state0;
        state0 = t1 + t2 | 0;
      }
      state[0] += state0;
      state[1] += state1;
      state[2] += state2;
      state[3] += state3;
      state[4] += state4;
      state[5] += state5;
      state[6] += state6;
      state[7] += state7;
    };
    return RawSha2562;
  }()
);

// node_modules/@aws-crypto/sha256-browser/node_modules/@aws-crypto/sha256-js/build/module/jsSha256.js
var Sha2562 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      this.secret = secret;
      this.hash = new RawSha256();
      this.reset();
    }
    Sha2564.prototype.update = function(toHash) {
      if (isEmptyData(toHash) || this.error) {
        return;
      }
      try {
        this.hash.update(convertToBuffer(toHash));
      } catch (e2) {
        this.error = e2;
      }
    };
    Sha2564.prototype.digestSync = function() {
      if (this.error) {
        throw this.error;
      }
      if (this.outer) {
        if (!this.outer.finished) {
          this.outer.update(this.hash.digest());
        }
        return this.outer.digest();
      }
      return this.hash.digest();
    };
    Sha2564.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, this.digestSync()];
        });
      });
    };
    Sha2564.prototype.reset = function() {
      this.hash = new RawSha256();
      if (this.secret) {
        this.outer = new RawSha256();
        var inner = bufferFromSecret(this.secret);
        var outer = new Uint8Array(BLOCK_SIZE);
        outer.set(inner);
        for (var i2 = 0; i2 < BLOCK_SIZE; i2++) {
          inner[i2] ^= 54;
          outer[i2] ^= 92;
        }
        this.hash.update(inner);
        this.outer.update(outer);
        for (var i2 = 0; i2 < inner.byteLength; i2++) {
          inner[i2] = 0;
        }
      }
    };
    return Sha2564;
  }()
);
function bufferFromSecret(secret) {
  var input = convertToBuffer(secret);
  if (input.byteLength > BLOCK_SIZE) {
    var bufferHash = new RawSha256();
    bufferHash.update(input);
    input = bufferHash.digest();
  }
  var buffer = new Uint8Array(BLOCK_SIZE);
  buffer.set(input);
  return buffer;
}

// node_modules/@aws-crypto/supports-web-crypto/build/module/supportsWebCrypto.js
var subtleCryptoMethods = [
  "decrypt",
  "digest",
  "encrypt",
  "exportKey",
  "generateKey",
  "importKey",
  "sign",
  "verify"
];
function supportsWebCrypto(window2) {
  if (supportsSecureRandom(window2) && typeof window2.crypto.subtle === "object") {
    var subtle = window2.crypto.subtle;
    return supportsSubtleCrypto(subtle);
  }
  return false;
}
function supportsSecureRandom(window2) {
  if (typeof window2 === "object" && typeof window2.crypto === "object") {
    var getRandomValues2 = window2.crypto.getRandomValues;
    return typeof getRandomValues2 === "function";
  }
  return false;
}
function supportsSubtleCrypto(subtle) {
  return subtle && subtleCryptoMethods.every(function(methodName) {
    return typeof subtle[methodName] === "function";
  });
}

// node_modules/@aws-crypto/sha256-browser/build/module/crossPlatformSha256.js
var Sha2563 = (
  /** @class */
  function() {
    function Sha2564(secret) {
      if (supportsWebCrypto(locateWindow())) {
        this.hash = new Sha256(secret);
      } else {
        this.hash = new Sha2562(secret);
      }
    }
    Sha2564.prototype.update = function(data, encoding) {
      this.hash.update(convertToBuffer(data));
    };
    Sha2564.prototype.digest = function() {
      return this.hash.digest();
    };
    Sha2564.prototype.reset = function() {
      this.hash.reset();
    };
    return Sha2564;
  }()
);

// node_modules/bowser/src/constants.js
var BROWSER_ALIASES_MAP = {
  "Amazon Silk": "amazon_silk",
  "Android Browser": "android",
  Bada: "bada",
  BlackBerry: "blackberry",
  Chrome: "chrome",
  Chromium: "chromium",
  Electron: "electron",
  Epiphany: "epiphany",
  Firefox: "firefox",
  Focus: "focus",
  Generic: "generic",
  "Google Search": "google_search",
  Googlebot: "googlebot",
  "Internet Explorer": "ie",
  "K-Meleon": "k_meleon",
  Maxthon: "maxthon",
  "Microsoft Edge": "edge",
  "MZ Browser": "mz",
  "NAVER Whale Browser": "naver",
  Opera: "opera",
  "Opera Coast": "opera_coast",
  PhantomJS: "phantomjs",
  Puffin: "puffin",
  QupZilla: "qupzilla",
  QQ: "qq",
  QQLite: "qqlite",
  Safari: "safari",
  Sailfish: "sailfish",
  "Samsung Internet for Android": "samsung_internet",
  SeaMonkey: "seamonkey",
  Sleipnir: "sleipnir",
  Swing: "swing",
  Tizen: "tizen",
  "UC Browser": "uc",
  Vivaldi: "vivaldi",
  "WebOS Browser": "webos",
  WeChat: "wechat",
  "Yandex Browser": "yandex",
  Roku: "roku"
};
var BROWSER_MAP = {
  amazon_silk: "Amazon Silk",
  android: "Android Browser",
  bada: "Bada",
  blackberry: "BlackBerry",
  chrome: "Chrome",
  chromium: "Chromium",
  electron: "Electron",
  epiphany: "Epiphany",
  firefox: "Firefox",
  focus: "Focus",
  generic: "Generic",
  googlebot: "Googlebot",
  google_search: "Google Search",
  ie: "Internet Explorer",
  k_meleon: "K-Meleon",
  maxthon: "Maxthon",
  edge: "Microsoft Edge",
  mz: "MZ Browser",
  naver: "NAVER Whale Browser",
  opera: "Opera",
  opera_coast: "Opera Coast",
  phantomjs: "PhantomJS",
  puffin: "Puffin",
  qupzilla: "QupZilla",
  qq: "QQ Browser",
  qqlite: "QQ Browser Lite",
  safari: "Safari",
  sailfish: "Sailfish",
  samsung_internet: "Samsung Internet for Android",
  seamonkey: "SeaMonkey",
  sleipnir: "Sleipnir",
  swing: "Swing",
  tizen: "Tizen",
  uc: "UC Browser",
  vivaldi: "Vivaldi",
  webos: "WebOS Browser",
  wechat: "WeChat",
  yandex: "Yandex Browser"
};
var PLATFORMS_MAP = {
  tablet: "tablet",
  mobile: "mobile",
  desktop: "desktop",
  tv: "tv"
};
var OS_MAP = {
  WindowsPhone: "Windows Phone",
  Windows: "Windows",
  MacOS: "macOS",
  iOS: "iOS",
  Android: "Android",
  WebOS: "WebOS",
  BlackBerry: "BlackBerry",
  Bada: "Bada",
  Tizen: "Tizen",
  Linux: "Linux",
  ChromeOS: "Chrome OS",
  PlayStation4: "PlayStation 4",
  Roku: "Roku"
};
var ENGINE_MAP = {
  EdgeHTML: "EdgeHTML",
  Blink: "Blink",
  Trident: "Trident",
  Presto: "Presto",
  Gecko: "Gecko",
  WebKit: "WebKit"
};

// node_modules/bowser/src/utils.js
var Utils = class _Utils {
  /**
   * Get first matched item for a string
   * @param {RegExp} regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 0 && match[1] || "";
  }
  /**
   * Get second matched item for a string
   * @param regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return match && match.length > 1 && match[2] || "";
  }
  /**
   * Match a regexp and return a constant or undefined
   * @param {RegExp} regexp
   * @param {String} ua
   * @param {*} _const Any const that will be returned if regexp matches the string
   * @return {*}
   */
  static matchAndReturnConst(regexp, ua, _const) {
    if (regexp.test(ua)) {
      return _const;
    }
    return void 0;
  }
  static getWindowsVersionName(version) {
    switch (version) {
      case "NT":
        return "NT";
      case "XP":
        return "XP";
      case "NT 5.0":
        return "2000";
      case "NT 5.1":
        return "XP";
      case "NT 5.2":
        return "2003";
      case "NT 6.0":
        return "Vista";
      case "NT 6.1":
        return "7";
      case "NT 6.2":
        return "8";
      case "NT 6.3":
        return "8.1";
      case "NT 10.0":
        return "10";
      default:
        return void 0;
    }
  }
  /**
   * Get macOS version name
   *    10.5 - Leopard
   *    10.6 - Snow Leopard
   *    10.7 - Lion
   *    10.8 - Mountain Lion
   *    10.9 - Mavericks
   *    10.10 - Yosemite
   *    10.11 - El Capitan
   *    10.12 - Sierra
   *    10.13 - High Sierra
   *    10.14 - Mojave
   *    10.15 - Catalina
   *
   * @example
   *   getMacOSVersionName("10.14") // 'Mojave'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getMacOSVersionName(version) {
    const v2 = version.split(".").splice(0, 2).map((s2) => parseInt(s2, 10) || 0);
    v2.push(0);
    if (v2[0] !== 10)
      return void 0;
    switch (v2[1]) {
      case 5:
        return "Leopard";
      case 6:
        return "Snow Leopard";
      case 7:
        return "Lion";
      case 8:
        return "Mountain Lion";
      case 9:
        return "Mavericks";
      case 10:
        return "Yosemite";
      case 11:
        return "El Capitan";
      case 12:
        return "Sierra";
      case 13:
        return "High Sierra";
      case 14:
        return "Mojave";
      case 15:
        return "Catalina";
      default:
        return void 0;
    }
  }
  /**
   * Get Android version name
   *    1.5 - Cupcake
   *    1.6 - Donut
   *    2.0 - Eclair
   *    2.1 - Eclair
   *    2.2 - Froyo
   *    2.x - Gingerbread
   *    3.x - Honeycomb
   *    4.0 - Ice Cream Sandwich
   *    4.1 - Jelly Bean
   *    4.4 - KitKat
   *    5.x - Lollipop
   *    6.x - Marshmallow
   *    7.x - Nougat
   *    8.x - Oreo
   *    9.x - Pie
   *
   * @example
   *   getAndroidVersionName("7.0") // 'Nougat'
   *
   * @param  {string} version
   * @return {string} versionName
   */
  static getAndroidVersionName(version) {
    const v2 = version.split(".").splice(0, 2).map((s2) => parseInt(s2, 10) || 0);
    v2.push(0);
    if (v2[0] === 1 && v2[1] < 5)
      return void 0;
    if (v2[0] === 1 && v2[1] < 6)
      return "Cupcake";
    if (v2[0] === 1 && v2[1] >= 6)
      return "Donut";
    if (v2[0] === 2 && v2[1] < 2)
      return "Eclair";
    if (v2[0] === 2 && v2[1] === 2)
      return "Froyo";
    if (v2[0] === 2 && v2[1] > 2)
      return "Gingerbread";
    if (v2[0] === 3)
      return "Honeycomb";
    if (v2[0] === 4 && v2[1] < 1)
      return "Ice Cream Sandwich";
    if (v2[0] === 4 && v2[1] < 4)
      return "Jelly Bean";
    if (v2[0] === 4 && v2[1] >= 4)
      return "KitKat";
    if (v2[0] === 5)
      return "Lollipop";
    if (v2[0] === 6)
      return "Marshmallow";
    if (v2[0] === 7)
      return "Nougat";
    if (v2[0] === 8)
      return "Oreo";
    if (v2[0] === 9)
      return "Pie";
    return void 0;
  }
  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  static getVersionPrecision(version) {
    return version.split(".").length;
  }
  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions('1.10.2.1',  '1.8.2.1.90')    // 1
   *   compareVersions('1.010.2.1', '1.09.2.1.90');  // 1
   *   compareVersions('1.10.2.1',  '1.10.2.1');     // 0
   *   compareVersions('1.10.2.1',  '1.0800.2');     // -1
   *   compareVersions('1.10.2.1',  '1.10',  true);  // 0
   *
   * @param {String} versionA versions versions to compare
   * @param {String} versionB versions versions to compare
   * @param {boolean} [isLoose] enable loose comparison
   * @return {Number} comparison result: -1 when versionA is lower,
   * 1 when versionA is bigger, 0 when both equal
   */
  /* eslint consistent-return: 1 */
  static compareVersions(versionA, versionB, isLoose = false) {
    const versionAPrecision = _Utils.getVersionPrecision(versionA);
    const versionBPrecision = _Utils.getVersionPrecision(versionB);
    let precision = Math.max(versionAPrecision, versionBPrecision);
    let lastPrecision = 0;
    const chunks = _Utils.map([versionA, versionB], (version) => {
      const delta = precision - _Utils.getVersionPrecision(version);
      const _version = version + new Array(delta + 1).join(".0");
      return _Utils.map(_version.split("."), (chunk) => new Array(20 - chunk.length).join("0") + chunk).reverse();
    });
    if (isLoose) {
      lastPrecision = precision - Math.min(versionAPrecision, versionBPrecision);
    }
    precision -= 1;
    while (precision >= lastPrecision) {
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      }
      if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === lastPrecision) {
          return 0;
        }
        precision -= 1;
      } else if (chunks[0][precision] < chunks[1][precision]) {
        return -1;
      }
    }
    return void 0;
  }
  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  static map(arr, iterator) {
    const result = [];
    let i2;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i2 = 0; i2 < arr.length; i2 += 1) {
      result.push(iterator(arr[i2]));
    }
    return result;
  }
  /**
   * Array::find polyfill
   *
   * @param  {Array} arr
   * @param  {Function} predicate
   * @return {Array}
   */
  static find(arr, predicate) {
    let i2;
    let l2;
    if (Array.prototype.find) {
      return Array.prototype.find.call(arr, predicate);
    }
    for (i2 = 0, l2 = arr.length; i2 < l2; i2 += 1) {
      const value = arr[i2];
      if (predicate(value, i2)) {
        return value;
      }
    }
    return void 0;
  }
  /**
   * Object::assign polyfill
   *
   * @param  {Object} obj
   * @param  {Object} ...objs
   * @return {Object}
   */
  static assign(obj, ...assigners) {
    const result = obj;
    let i2;
    let l2;
    if (Object.assign) {
      return Object.assign(obj, ...assigners);
    }
    for (i2 = 0, l2 = assigners.length; i2 < l2; i2 += 1) {
      const assigner = assigners[i2];
      if (typeof assigner === "object" && assigner !== null) {
        const keys = Object.keys(assigner);
        keys.forEach((key) => {
          result[key] = assigner[key];
        });
      }
    }
    return obj;
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('Microsoft Edge') // edge
   *
   * @param  {string} browserName
   * @return {string}
   */
  static getBrowserAlias(browserName) {
    return BROWSER_ALIASES_MAP[browserName];
  }
  /**
   * Get short version/alias for a browser name
   *
   * @example
   *   getBrowserAlias('edge') // Microsoft Edge
   *
   * @param  {string} browserAlias
   * @return {string}
   */
  static getBrowserTypeByAlias(browserAlias) {
    return BROWSER_MAP[browserAlias] || "";
  }
};

// node_modules/bowser/src/parser-browsers.js
var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;
var browsersList = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe(ua) {
      const browser = {
        name: "Googlebot"
      };
      const version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera < 13.0 */
  {
    test: [/opera/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Opera > 13.0 */
  {
    test: [/opr\/|opios/i],
    describe(ua) {
      const browser = {
        name: "Opera"
      };
      const version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/SamsungBrowser/i],
    describe(ua) {
      const browser = {
        name: "Samsung Internet for Android"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Whale/i],
    describe(ua) {
      const browser = {
        name: "NAVER Whale Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MZBrowser/i],
    describe(ua) {
      const browser = {
        name: "MZ Browser"
      };
      const version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/focus/i],
    describe(ua) {
      const browser = {
        name: "Focus"
      };
      const version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/swing/i],
    describe(ua) {
      const browser = {
        name: "Swing"
      };
      const version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/coast/i],
    describe(ua) {
      const browser = {
        name: "Opera Coast"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/opt\/\d+(?:.?_?\d+)+/i],
    describe(ua) {
      const browser = {
        name: "Opera Touch"
      };
      const version = Utils.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/yabrowser/i],
    describe(ua) {
      const browser = {
        name: "Yandex Browser"
      };
      const version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/ucbrowser/i],
    describe(ua) {
      const browser = {
        name: "UC Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/Maxthon|mxios/i],
    describe(ua) {
      const browser = {
        name: "Maxthon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/epiphany/i],
    describe(ua) {
      const browser = {
        name: "Epiphany"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/puffin/i],
    describe(ua) {
      const browser = {
        name: "Puffin"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sleipnir/i],
    describe(ua) {
      const browser = {
        name: "Sleipnir"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/k-meleon/i],
    describe(ua) {
      const browser = {
        name: "K-Meleon"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/micromessenger/i],
    describe(ua) {
      const browser = {
        name: "WeChat"
      };
      const version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qqbrowser/i],
    describe(ua) {
      const browser = {
        name: /qqbrowserlite/i.test(ua) ? "QQ Browser Lite" : "QQ Browser"
      };
      const version = Utils.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/msie|trident/i],
    describe(ua) {
      const browser = {
        name: "Internet Explorer"
      };
      const version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/\sedg\//i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/edg([ea]|ios)/i],
    describe(ua) {
      const browser = {
        name: "Microsoft Edge"
      };
      const version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/vivaldi/i],
    describe(ua) {
      const browser = {
        name: "Vivaldi"
      };
      const version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/seamonkey/i],
    describe(ua) {
      const browser = {
        name: "SeaMonkey"
      };
      const version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/sailfish/i],
    describe(ua) {
      const browser = {
        name: "Sailfish"
      };
      const version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/silk/i],
    describe(ua) {
      const browser = {
        name: "Amazon Silk"
      };
      const version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/phantom/i],
    describe(ua) {
      const browser = {
        name: "PhantomJS"
      };
      const version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/slimerjs/i],
    describe(ua) {
      const browser = {
        name: "SlimerJS"
      };
      const version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const browser = {
        name: "BlackBerry"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const browser = {
        name: "WebOS Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/bada/i],
    describe(ua) {
      const browser = {
        name: "Bada"
      };
      const version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/tizen/i],
    describe(ua) {
      const browser = {
        name: "Tizen"
      };
      const version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/qupzilla/i],
    describe(ua) {
      const browser = {
        name: "QupZilla"
      };
      const version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/firefox|iceweasel|fxios/i],
    describe(ua) {
      const browser = {
        name: "Firefox"
      };
      const version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/electron/i],
    describe(ua) {
      const browser = {
        name: "Electron"
      };
      const version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/MiuiBrowser/i],
    describe(ua) {
      const browser = {
        name: "Miui"
      };
      const version = Utils.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chromium/i],
    describe(ua) {
      const browser = {
        name: "Chromium"
      };
      const version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/chrome|crios|crmo/i],
    describe(ua) {
      const browser = {
        name: "Chrome"
      };
      const version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  {
    test: [/GSA/i],
    describe(ua) {
      const browser = {
        name: "Google Search"
      };
      const version = Utils.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Android Browser */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const browser = {
        name: "Android Browser"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* PlayStation 4 */
  {
    test: [/playstation 4/i],
    describe(ua) {
      const browser = {
        name: "PlayStation 4"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Safari */
  {
    test: [/safari|applewebkit/i],
    describe(ua) {
      const browser = {
        name: "Safari"
      };
      const version = Utils.getFirstMatch(commonVersionIdentifier, ua);
      if (version) {
        browser.version = version;
      }
      return browser;
    }
  },
  /* Something else */
  {
    test: [/.*/i],
    describe(ua) {
      const regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
      const regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
      const hasDeviceSpec = ua.search("\\(") !== -1;
      const regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
      return {
        name: Utils.getFirstMatch(regexp, ua),
        version: Utils.getSecondMatch(regexp, ua)
      };
    }
  }
];
var parser_browsers_default = browsersList;

// node_modules/bowser/src/parser-os.js
var parser_os_default = [
  /* Roku */
  {
    test: [/Roku\/DVP/],
    describe(ua) {
      const version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
      return {
        name: OS_MAP.Roku,
        version
      };
    }
  },
  /* Windows Phone */
  {
    test: [/windows phone/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.WindowsPhone,
        version
      };
    }
  },
  /* Windows */
  {
    test: [/windows /i],
    describe(ua) {
      const version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
      const versionName = Utils.getWindowsVersionName(version);
      return {
        name: OS_MAP.Windows,
        version,
        versionName
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe(ua) {
      const result = {
        name: OS_MAP.iOS
      };
      const version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
      if (version) {
        result.version = version;
      }
      return result;
    }
  },
  /* macOS */
  {
    test: [/macintosh/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, ".");
      const versionName = Utils.getMacOSVersionName(version);
      const os = {
        name: OS_MAP.MacOS,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* iOS */
  {
    test: [/(ipod|iphone|ipad)/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, ".");
      return {
        name: OS_MAP.iOS,
        version
      };
    }
  },
  /* Android */
  {
    test(parser) {
      const notLikeAndroid = !parser.test(/like android/i);
      const butAndroid = parser.test(/android/i);
      return notLikeAndroid && butAndroid;
    },
    describe(ua) {
      const version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
      const versionName = Utils.getAndroidVersionName(version);
      const os = {
        name: OS_MAP.Android,
        version
      };
      if (versionName) {
        os.versionName = versionName;
      }
      return os;
    }
  },
  /* WebOS */
  {
    test: [/(web|hpw)[o0]s/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
      const os = {
        name: OS_MAP.WebOS
      };
      if (version && version.length) {
        os.version = version;
      }
      return os;
    }
  },
  /* BlackBerry */
  {
    test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) || Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) || Utils.getFirstMatch(/\bbb(\d+)/i, ua);
      return {
        name: OS_MAP.BlackBerry,
        version
      };
    }
  },
  /* Bada */
  {
    test: [/bada/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Bada,
        version
      };
    }
  },
  /* Tizen */
  {
    test: [/tizen/i],
    describe(ua) {
      const version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.Tizen,
        version
      };
    }
  },
  /* Linux */
  {
    test: [/linux/i],
    describe() {
      return {
        name: OS_MAP.Linux
      };
    }
  },
  /* Chrome OS */
  {
    test: [/CrOS/],
    describe() {
      return {
        name: OS_MAP.ChromeOS
      };
    }
  },
  /* Playstation 4 */
  {
    test: [/PlayStation 4/],
    describe(ua) {
      const version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
      return {
        name: OS_MAP.PlayStation4,
        version
      };
    }
  }
];

// node_modules/bowser/src/parser-platforms.js
var parser_platforms_default = [
  /* Googlebot */
  {
    test: [/googlebot/i],
    describe() {
      return {
        type: "bot",
        vendor: "Google"
      };
    }
  },
  /* Huawei */
  {
    test: [/huawei/i],
    describe(ua) {
      const model = Utils.getFirstMatch(/(can-l01)/i, ua) && "Nova";
      const platform = {
        type: PLATFORMS_MAP.mobile,
        vendor: "Huawei"
      };
      if (model) {
        platform.model = model;
      }
      return platform;
    }
  },
  /* Nexus Tablet */
  {
    test: [/nexus\s*(?:7|8|9|10).*/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Nexus"
      };
    }
  },
  /* iPad */
  {
    test: [/ipad/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Firefox on iPad */
  {
    test: [/Macintosh(.*?) FxiOS(.*?)\//],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Apple",
        model: "iPad"
      };
    }
  },
  /* Amazon Kindle Fire */
  {
    test: [/kftt build/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon",
        model: "Kindle Fire HD 7"
      };
    }
  },
  /* Another Amazon Tablet with Silk */
  {
    test: [/silk/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet,
        vendor: "Amazon"
      };
    }
  },
  /* Tablet */
  {
    test: [/tablet(?! pc)/i],
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* iPod/iPhone */
  {
    test(parser) {
      const iDevice = parser.test(/ipod|iphone/i);
      const likeIDevice = parser.test(/like (ipod|iphone)/i);
      return iDevice && !likeIDevice;
    },
    describe(ua) {
      const model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Apple",
        model
      };
    }
  },
  /* Nexus Mobile */
  {
    test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Nexus"
      };
    }
  },
  /* Mobile */
  {
    test: [/[^-]mobi/i],
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* BlackBerry */
  {
    test(parser) {
      return parser.getBrowserName(true) === "blackberry";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "BlackBerry"
      };
    }
  },
  /* Bada */
  {
    test(parser) {
      return parser.getBrowserName(true) === "bada";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* Windows Phone */
  {
    test(parser) {
      return parser.getBrowserName() === "windows phone";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile,
        vendor: "Microsoft"
      };
    }
  },
  /* Android Tablet */
  {
    test(parser) {
      const osMajorVersion = Number(String(parser.getOSVersion()).split(".")[0]);
      return parser.getOSName(true) === "android" && osMajorVersion >= 3;
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tablet
      };
    }
  },
  /* Android Mobile */
  {
    test(parser) {
      return parser.getOSName(true) === "android";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.mobile
      };
    }
  },
  /* desktop */
  {
    test(parser) {
      return parser.getOSName(true) === "macos";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop,
        vendor: "Apple"
      };
    }
  },
  /* Windows */
  {
    test(parser) {
      return parser.getOSName(true) === "windows";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* Linux */
  {
    test(parser) {
      return parser.getOSName(true) === "linux";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.desktop
      };
    }
  },
  /* PlayStation 4 */
  {
    test(parser) {
      return parser.getOSName(true) === "playstation 4";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  },
  /* Roku */
  {
    test(parser) {
      return parser.getOSName(true) === "roku";
    },
    describe() {
      return {
        type: PLATFORMS_MAP.tv
      };
    }
  }
];

// node_modules/bowser/src/parser-engines.js
var parser_engines_default = [
  /* EdgeHTML */
  {
    test(parser) {
      return parser.getBrowserName(true) === "microsoft edge";
    },
    describe(ua) {
      const isBlinkBased = /\sedg\//i.test(ua);
      if (isBlinkBased) {
        return {
          name: ENGINE_MAP.Blink
        };
      }
      const version = Utils.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, ua);
      return {
        name: ENGINE_MAP.EdgeHTML,
        version
      };
    }
  },
  /* Trident */
  {
    test: [/trident/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Trident
      };
      const version = Utils.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Presto */
  {
    test(parser) {
      return parser.test(/presto/i);
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Presto
      };
      const version = Utils.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Gecko */
  {
    test(parser) {
      const isGecko = parser.test(/gecko/i);
      const likeGecko = parser.test(/like gecko/i);
      return isGecko && !likeGecko;
    },
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.Gecko
      };
      const version = Utils.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  },
  /* Blink */
  {
    test: [/(apple)?webkit\/537\.36/i],
    describe() {
      return {
        name: ENGINE_MAP.Blink
      };
    }
  },
  /* WebKit */
  {
    test: [/(apple)?webkit/i],
    describe(ua) {
      const engine = {
        name: ENGINE_MAP.WebKit
      };
      const version = Utils.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, ua);
      if (version) {
        engine.version = version;
      }
      return engine;
    }
  }
];

// node_modules/bowser/src/parser.js
var Parser = class {
  /**
   * Create instance of Parser
   *
   * @param {String} UA User-Agent string
   * @param {Boolean} [skipParsing=false] parser can skip parsing in purpose of performance
   * improvements if you need to make a more particular parsing
   * like {@link Parser#parseBrowser} or {@link Parser#parsePlatform}
   *
   * @throw {Error} in case of empty UA String
   *
   * @constructor
   */
  constructor(UA, skipParsing = false) {
    if (UA === void 0 || UA === null || UA === "") {
      throw new Error("UserAgent parameter can't be empty");
    }
    this._ua = UA;
    this.parsedResult = {};
    if (skipParsing !== true) {
      this.parse();
    }
  }
  /**
   * Get UserAgent string of current Parser instance
   * @return {String} User-Agent String of the current <Parser> object
   *
   * @public
   */
  getUA() {
    return this._ua;
  }
  /**
   * Test a UA string for a regexp
   * @param {RegExp} regex
   * @return {Boolean}
   */
  test(regex) {
    return regex.test(this._ua);
  }
  /**
   * Get parsed browser object
   * @return {Object}
   */
  parseBrowser() {
    this.parsedResult.browser = {};
    const browserDescriptor = Utils.find(parser_browsers_default, (_browser) => {
      if (typeof _browser.test === "function") {
        return _browser.test(this);
      }
      if (_browser.test instanceof Array) {
        return _browser.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (browserDescriptor) {
      this.parsedResult.browser = browserDescriptor.describe(this.getUA());
    }
    return this.parsedResult.browser;
  }
  /**
   * Get parsed browser object
   * @return {Object}
   *
   * @public
   */
  getBrowser() {
    if (this.parsedResult.browser) {
      return this.parsedResult.browser;
    }
    return this.parseBrowser();
  }
  /**
   * Get browser's name
   * @return {String} Browser's name or an empty string
   *
   * @public
   */
  getBrowserName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getBrowser().name).toLowerCase() || "";
    }
    return this.getBrowser().name || "";
  }
  /**
   * Get browser's version
   * @return {String} version of browser
   *
   * @public
   */
  getBrowserVersion() {
    return this.getBrowser().version;
  }
  /**
   * Get OS
   * @return {Object}
   *
   * @example
   * this.getOS();
   * {
   *   name: 'macOS',
   *   version: '10.11.12'
   * }
   */
  getOS() {
    if (this.parsedResult.os) {
      return this.parsedResult.os;
    }
    return this.parseOS();
  }
  /**
   * Parse OS and save it to this.parsedResult.os
   * @return {*|{}}
   */
  parseOS() {
    this.parsedResult.os = {};
    const os = Utils.find(parser_os_default, (_os) => {
      if (typeof _os.test === "function") {
        return _os.test(this);
      }
      if (_os.test instanceof Array) {
        return _os.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (os) {
      this.parsedResult.os = os.describe(this.getUA());
    }
    return this.parsedResult.os;
  }
  /**
   * Get OS name
   * @param {Boolean} [toLowerCase] return lower-cased value
   * @return {String} name of the OS — macOS, Windows, Linux, etc.
   */
  getOSName(toLowerCase) {
    const { name } = this.getOS();
    if (toLowerCase) {
      return String(name).toLowerCase() || "";
    }
    return name || "";
  }
  /**
   * Get OS version
   * @return {String} full version with dots ('10.11.12', '5.6', etc)
   */
  getOSVersion() {
    return this.getOS().version;
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  getPlatform() {
    if (this.parsedResult.platform) {
      return this.parsedResult.platform;
    }
    return this.parsePlatform();
  }
  /**
   * Get platform name
   * @param {Boolean} [toLowerCase=false]
   * @return {*}
   */
  getPlatformType(toLowerCase = false) {
    const { type } = this.getPlatform();
    if (toLowerCase) {
      return String(type).toLowerCase() || "";
    }
    return type || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parsePlatform() {
    this.parsedResult.platform = {};
    const platform = Utils.find(parser_platforms_default, (_platform) => {
      if (typeof _platform.test === "function") {
        return _platform.test(this);
      }
      if (_platform.test instanceof Array) {
        return _platform.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (platform) {
      this.parsedResult.platform = platform.describe(this.getUA());
    }
    return this.parsedResult.platform;
  }
  /**
   * Get parsed engine
   * @return {{}}
   */
  getEngine() {
    if (this.parsedResult.engine) {
      return this.parsedResult.engine;
    }
    return this.parseEngine();
  }
  /**
   * Get engines's name
   * @return {String} Engines's name or an empty string
   *
   * @public
   */
  getEngineName(toLowerCase) {
    if (toLowerCase) {
      return String(this.getEngine().name).toLowerCase() || "";
    }
    return this.getEngine().name || "";
  }
  /**
   * Get parsed platform
   * @return {{}}
   */
  parseEngine() {
    this.parsedResult.engine = {};
    const engine = Utils.find(parser_engines_default, (_engine) => {
      if (typeof _engine.test === "function") {
        return _engine.test(this);
      }
      if (_engine.test instanceof Array) {
        return _engine.test.some((condition) => this.test(condition));
      }
      throw new Error("Browser's test function is not valid");
    });
    if (engine) {
      this.parsedResult.engine = engine.describe(this.getUA());
    }
    return this.parsedResult.engine;
  }
  /**
   * Parse full information about the browser
   * @returns {Parser}
   */
  parse() {
    this.parseBrowser();
    this.parseOS();
    this.parsePlatform();
    this.parseEngine();
    return this;
  }
  /**
   * Get parsed result
   * @return {ParsedResult}
   */
  getResult() {
    return Utils.assign({}, this.parsedResult);
  }
  /**
   * Check if parsed browser matches certain conditions
   *
   * @param {Object} checkTree It's one or two layered object,
   * which can include a platform or an OS on the first layer
   * and should have browsers specs on the bottom-laying layer
   *
   * @returns {Boolean|undefined} Whether the browser satisfies the set conditions or not.
   * Returns `undefined` when the browser is no described in the checkTree object.
   *
   * @example
   * const browser = Bowser.getParser(window.navigator.userAgent);
   * if (browser.satisfies({chrome: '>118.01.1322' }))
   * // or with os
   * if (browser.satisfies({windows: { chrome: '>118.01.1322' } }))
   * // or with platforms
   * if (browser.satisfies({desktop: { chrome: '>118.01.1322' } }))
   */
  satisfies(checkTree) {
    const platformsAndOSes = {};
    let platformsAndOSCounter = 0;
    const browsers = {};
    let browsersCounter = 0;
    const allDefinitions = Object.keys(checkTree);
    allDefinitions.forEach((key) => {
      const currentDefinition = checkTree[key];
      if (typeof currentDefinition === "string") {
        browsers[key] = currentDefinition;
        browsersCounter += 1;
      } else if (typeof currentDefinition === "object") {
        platformsAndOSes[key] = currentDefinition;
        platformsAndOSCounter += 1;
      }
    });
    if (platformsAndOSCounter > 0) {
      const platformsAndOSNames = Object.keys(platformsAndOSes);
      const OSMatchingDefinition = Utils.find(platformsAndOSNames, (name) => this.isOS(name));
      if (OSMatchingDefinition) {
        const osResult = this.satisfies(platformsAndOSes[OSMatchingDefinition]);
        if (osResult !== void 0) {
          return osResult;
        }
      }
      const platformMatchingDefinition = Utils.find(
        platformsAndOSNames,
        (name) => this.isPlatform(name)
      );
      if (platformMatchingDefinition) {
        const platformResult = this.satisfies(platformsAndOSes[platformMatchingDefinition]);
        if (platformResult !== void 0) {
          return platformResult;
        }
      }
    }
    if (browsersCounter > 0) {
      const browserNames = Object.keys(browsers);
      const matchingDefinition = Utils.find(browserNames, (name) => this.isBrowser(name, true));
      if (matchingDefinition !== void 0) {
        return this.compareVersion(browsers[matchingDefinition]);
      }
    }
    return void 0;
  }
  /**
   * Check if the browser name equals the passed string
   * @param browserName The string to compare with the browser name
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {boolean}
   */
  isBrowser(browserName, includingAlias = false) {
    const defaultBrowserName = this.getBrowserName().toLowerCase();
    let browserNameLower = browserName.toLowerCase();
    const alias = Utils.getBrowserTypeByAlias(browserNameLower);
    if (includingAlias && alias) {
      browserNameLower = alias.toLowerCase();
    }
    return browserNameLower === defaultBrowserName;
  }
  compareVersion(version) {
    let expectedResults = [0];
    let comparableVersion = version;
    let isLoose = false;
    const currentBrowserVersion = this.getBrowserVersion();
    if (typeof currentBrowserVersion !== "string") {
      return void 0;
    }
    if (version[0] === ">" || version[0] === "<") {
      comparableVersion = version.substr(1);
      if (version[1] === "=") {
        isLoose = true;
        comparableVersion = version.substr(2);
      } else {
        expectedResults = [];
      }
      if (version[0] === ">") {
        expectedResults.push(1);
      } else {
        expectedResults.push(-1);
      }
    } else if (version[0] === "=") {
      comparableVersion = version.substr(1);
    } else if (version[0] === "~") {
      isLoose = true;
      comparableVersion = version.substr(1);
    }
    return expectedResults.indexOf(
      Utils.compareVersions(currentBrowserVersion, comparableVersion, isLoose)
    ) > -1;
  }
  isOS(osName) {
    return this.getOSName(true) === String(osName).toLowerCase();
  }
  isPlatform(platformType) {
    return this.getPlatformType(true) === String(platformType).toLowerCase();
  }
  isEngine(engineName) {
    return this.getEngineName(true) === String(engineName).toLowerCase();
  }
  /**
   * Is anything? Check if the browser is called "anything",
   * the OS called "anything" or the platform called "anything"
   * @param {String} anything
   * @param [includingAlias=false] The flag showing whether alias will be included into comparison
   * @returns {Boolean}
   */
  is(anything, includingAlias = false) {
    return this.isBrowser(anything, includingAlias) || this.isOS(anything) || this.isPlatform(anything);
  }
  /**
   * Check if any of the given values satisfies this.is(anything)
   * @param {String[]} anythings
   * @returns {Boolean}
   */
  some(anythings = []) {
    return anythings.some((anything) => this.is(anything));
  }
};
var parser_default = Parser;

// node_modules/bowser/src/bowser.js
var Bowser = class {
  /**
   * Creates a {@link Parser} instance
   *
   * @param {String} UA UserAgent string
   * @param {Boolean} [skipParsing=false] Will make the Parser postpone parsing until you ask it
   * explicitly. Same as `skipParsing` for {@link Parser}.
   * @returns {Parser}
   * @throws {Error} when UA is not a String
   *
   * @example
   * const parser = Bowser.getParser(window.navigator.userAgent);
   * const result = parser.getResult();
   */
  static getParser(UA, skipParsing = false) {
    if (typeof UA !== "string") {
      throw new Error("UserAgent should be a string");
    }
    return new parser_default(UA, skipParsing);
  }
  /**
   * Creates a {@link Parser} instance and runs {@link Parser.getResult} immediately
   *
   * @param UA
   * @return {ParsedResult}
   *
   * @example
   * const result = Bowser.parse(window.navigator.userAgent);
   */
  static parse(UA) {
    return new parser_default(UA).getResult();
  }
  static get BROWSER_MAP() {
    return BROWSER_MAP;
  }
  static get ENGINE_MAP() {
    return ENGINE_MAP;
  }
  static get OS_MAP() {
    return OS_MAP;
  }
  static get PLATFORMS_MAP() {
    return PLATFORMS_MAP;
  }
};
var bowser_default = Bowser;

// node_modules/@aws-sdk/util-user-agent-browser/dist-es/index.js
var defaultUserAgent = ({ serviceId, clientVersion }) => () => __async(void 0, null, function* () {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? bowser_default.parse(window.navigator.userAgent) : void 0;
  const sections = [
    ["aws-sdk-js", clientVersion],
    ["ua", "2.0"],
    [`os/${parsedUA?.os?.name || "other"}`, parsedUA?.os?.version],
    ["lang/js"],
    ["md/browser", `${parsedUA?.browser?.name ?? "unknown"}_${parsedUA?.browser?.version ?? "unknown"}`]
  ];
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  return sections;
});

// node_modules/@aws-crypto/crc32/node_modules/@smithy/util-utf8/dist-es/fromUtf8.browser.js
var fromUtf84 = (input) => new TextEncoder().encode(input);

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf85 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf84;
function convertToBuffer2(data) {
  if (data instanceof Uint8Array)
    return data;
  if (typeof data === "string") {
    return fromUtf85(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData2(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/numToUint8.js
function numToUint82(num) {
  return new Uint8Array([
    (num & 4278190080) >> 24,
    (num & 16711680) >> 16,
    (num & 65280) >> 8,
    num & 255
  ]);
}

// node_modules/@aws-crypto/crc32/node_modules/@aws-crypto/util/build/module/uint32ArrayFrom.js
function uint32ArrayFrom2(a_lookUpTable2) {
  if (!Uint32Array.from) {
    var return_array = new Uint32Array(a_lookUpTable2.length);
    var a_index = 0;
    while (a_index < a_lookUpTable2.length) {
      return_array[a_index] = a_lookUpTable2[a_index];
      a_index += 1;
    }
    return return_array;
  }
  return Uint32Array.from(a_lookUpTable2);
}

// node_modules/@aws-crypto/crc32/build/module/aws_crc32.js
var AwsCrc32 = (
  /** @class */
  function() {
    function AwsCrc322() {
      this.crc32 = new Crc32();
    }
    AwsCrc322.prototype.update = function(toHash) {
      if (isEmptyData2(toHash))
        return;
      this.crc32.update(convertToBuffer2(toHash));
    };
    AwsCrc322.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, numToUint82(this.crc32.digest())];
        });
      });
    };
    AwsCrc322.prototype.reset = function() {
      this.crc32 = new Crc32();
    };
    return AwsCrc322;
  }()
);

// node_modules/@aws-crypto/crc32/build/module/index.js
var Crc32 = (
  /** @class */
  function() {
    function Crc322() {
      this.checksum = 4294967295;
    }
    Crc322.prototype.update = function(data) {
      var e_1, _a;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a = data_1.return))
            _a.call(data_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return this;
    };
    Crc322.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc322;
  }()
);
var a_lookUpTable = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
var lookupTable = uint32ArrayFrom2(a_lookUpTable);

// node_modules/@smithy/eventstream-codec/dist-es/Int64.js
var Int642 = class _Int64 {
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i2 = 7, remaining = Math.abs(Math.round(number)); i2 > -1 && remaining > 0; i2--, remaining /= 256) {
      bytes[i2] = remaining;
    }
    if (number < 0) {
      negate2(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate2(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate2(bytes) {
  for (let i2 = 0; i2 < 8; i2++) {
    bytes[i2] ^= 255;
  }
  for (let i2 = 7; i2 > -1; i2--) {
    bytes[i2]++;
    if (bytes[i2] !== 0)
      break;
  }
}

// node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
var HeaderMarshaller = class {
  constructor(toUtf82, fromUtf86) {
    this.toUtf8 = toUtf82;
    this.fromUtf8 = fromUtf86;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int642.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN2.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG,
            value: new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int642(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
};
var HEADER_VALUE_TYPE2;
(function(HEADER_VALUE_TYPE3) {
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["short"] = 3] = "short";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["long"] = 5] = "long";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["string"] = 7] = "string";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE3[HEADER_VALUE_TYPE3["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE2 || (HEADER_VALUE_TYPE2 = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN2 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

// node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js
var PRELUDE_MEMBER_LENGTH = 4;
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
var CHECKSUM_LENGTH = 4;
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}

// node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
var EventStreamCodec = class {
  constructor(toUtf82, fromUtf86) {
    this.headerMarshaller = new HeaderMarshaller(toUtf82, fromUtf86);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/MessageDecoderStream.js
var MessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  asyncIterator() {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(this.options.inputStream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const bytes = temp.value;
          const decoded = this.options.decoder.decode(bytes);
          yield decoded;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/MessageEncoderStream.js
var MessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  asyncIterator() {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(this.options.messageStream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const msg = temp.value;
          const encoded = this.options.encoder.encode(msg);
          yield encoded;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
      if (this.options.includeEndFrame) {
        yield new Uint8Array(0);
      }
    });
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageDecoderStream.js
var SmithyMessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  asyncIterator() {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(this.options.messageStream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const message = temp.value;
          const deserialized = yield new __await(this.options.deserializer(message));
          if (deserialized === void 0)
            continue;
          yield deserialized;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  }
};

// node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageEncoderStream.js
var SmithyMessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  asyncIterator() {
    return __asyncGenerator(this, null, function* () {
      try {
        for (var iter = __forAwait(this.options.inputStream), more, temp, error; more = !(temp = yield new __await(iter.next())).done; more = false) {
          const chunk = temp.value;
          const payloadBuf = this.options.serializer(chunk);
          yield payloadBuf;
        }
      } catch (temp) {
        error = [temp];
      } finally {
        try {
          more && (temp = iter.return) && (yield new __await(temp.call(iter)));
        } finally {
          if (error)
            throw error[0];
        }
      }
    });
  }
};

// node_modules/@smithy/eventstream-serde-universal/dist-es/getChunkedStream.js
function getChunkedStream(source) {
  let currentMessageTotalLength = 0;
  let currentMessagePendingLength = 0;
  let currentMessage = null;
  let messageLengthBuffer = null;
  const allocateMessage = (size) => {
    if (typeof size !== "number") {
      throw new Error("Attempted to allocate an event message where size was not a number: " + size);
    }
    currentMessageTotalLength = size;
    currentMessagePendingLength = 4;
    currentMessage = new Uint8Array(size);
    const currentMessageView = new DataView(currentMessage.buffer);
    currentMessageView.setUint32(0, size, false);
  };
  const iterator = function() {
    return __asyncGenerator(this, null, function* () {
      const sourceIterator = source[Symbol.asyncIterator]();
      while (true) {
        const { value, done } = yield new __await(sourceIterator.next());
        if (done) {
          if (!currentMessageTotalLength) {
            return;
          } else if (currentMessageTotalLength === currentMessagePendingLength) {
            yield currentMessage;
          } else {
            throw new Error("Truncated event message received.");
          }
          return;
        }
        const chunkLength = value.length;
        let currentOffset = 0;
        while (currentOffset < chunkLength) {
          if (!currentMessage) {
            const bytesRemaining = chunkLength - currentOffset;
            if (!messageLengthBuffer) {
              messageLengthBuffer = new Uint8Array(4);
            }
            const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
            messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
            currentMessagePendingLength += numBytesForTotal;
            currentOffset += numBytesForTotal;
            if (currentMessagePendingLength < 4) {
              break;
            }
            allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
            messageLengthBuffer = null;
          }
          const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
          currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
          currentMessagePendingLength += numBytesToWrite;
          currentOffset += numBytesToWrite;
          if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
            yield currentMessage;
            currentMessage = null;
            currentMessageTotalLength = 0;
            currentMessagePendingLength = 0;
          }
        }
      }
    });
  };
  return {
    [Symbol.asyncIterator]: iterator
  };
}

// node_modules/@smithy/eventstream-serde-universal/dist-es/getUnmarshalledStream.js
function getMessageUnmarshaller(deserializer, toUtf82) {
  return function(message) {
    return __async(this, null, function* () {
      const { value: messageType } = message.headers[":message-type"];
      if (messageType === "error") {
        const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
        unmodeledError.name = message.headers[":error-code"].value;
        throw unmodeledError;
      } else if (messageType === "exception") {
        const code = message.headers[":exception-type"].value;
        const exception = { [code]: message };
        const deserializedException = yield deserializer(exception);
        if (deserializedException.$unknown) {
          const error = new Error(toUtf82(message.body));
          error.name = code;
          throw error;
        }
        throw deserializedException[code];
      } else if (messageType === "event") {
        const event = {
          [message.headers[":event-type"].value]: message
        };
        const deserialized = yield deserializer(event);
        if (deserialized.$unknown)
          return;
        return deserialized;
      } else {
        throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
      }
    });
  };
}

// node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
    this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    const inputStream = getChunkedStream(body);
    return new SmithyMessageDecoderStream({
      messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream({
      messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: true
    });
  }
};

// node_modules/@smithy/eventstream-serde-browser/dist-es/utils.js
var readableStreamtoIterable = (readableStream) => ({
  [Symbol.asyncIterator]: function() {
    return __asyncGenerator(this, null, function* () {
      const reader = readableStream.getReader();
      try {
        while (true) {
          const { done, value } = yield new __await(reader.read());
          if (done)
            return;
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    });
  }
});
var iterableToReadableStream = (asyncIterable) => {
  const iterator = asyncIterable[Symbol.asyncIterator]();
  return new ReadableStream({
    pull(controller) {
      return __async(this, null, function* () {
        const { done, value } = yield iterator.next();
        if (done) {
          return controller.close();
        }
        controller.enqueue(value);
      });
    }
  });
};

// node_modules/@smithy/eventstream-serde-browser/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller2 = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    const bodyIterable = isReadableStream2(body) ? readableStreamtoIterable(body) : body;
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    const serialziedIterable = this.universalMarshaller.serialize(input, serializer);
    return typeof ReadableStream === "function" ? iterableToReadableStream(serialziedIterable) : serialziedIterable;
  }
};
var isReadableStream2 = (body) => typeof ReadableStream === "function" && body instanceof ReadableStream;

// node_modules/@smithy/eventstream-serde-browser/dist-es/provider.js
var eventStreamSerdeProvider = (options) => new EventStreamMarshaller2(options);

// node_modules/@smithy/invalid-dependency/dist-es/invalidProvider.js
var invalidProvider = (message) => () => Promise.reject(message);

// node_modules/@smithy/util-body-length-browser/dist-es/calculateBodyLength.js
var TEXT_ENCODER = typeof TextEncoder == "function" ? new TextEncoder() : null;
var calculateBodyLength = (body) => {
  if (typeof body === "string") {
    if (TEXT_ENCODER) {
      return TEXT_ENCODER.encode(body).byteLength;
    }
    let len = body.length;
    for (let i2 = len - 1; i2 >= 0; i2--) {
      const code = body.charCodeAt(i2);
      if (code > 127 && code <= 2047)
        len++;
      else if (code > 2047 && code <= 65535)
        len += 2;
      if (code >= 56320 && code <= 57343)
        i2--;
    }
    return len;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
};

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/ruleset.js
var s = "required";
var t = "fn";
var u = "argv";
var v = "ref";
var a = true;
var b = "isSet";
var c = "booleanEquals";
var d = "error";
var e = "endpoint";
var f2 = "tree";
var g = "PartitionResult";
var h = { [s]: false, "type": "String" };
var i = { [s]: true, "default": false, "type": "Boolean" };
var j = { [v]: "Endpoint" };
var k = { [t]: c, [u]: [{ [v]: "UseFIPS" }, true] };
var l = { [t]: c, [u]: [{ [v]: "UseDualStack" }, true] };
var m = {};
var n = { [t]: "getAttr", [u]: [{ [v]: g }, "supportsFIPS"] };
var o = { [t]: c, [u]: [true, { [t]: "getAttr", [u]: [{ [v]: g }, "supportsDualStack"] }] };
var p = [k];
var q = [l];
var r = [{ [v]: "Region" }];
var _data = { version: "1.0", parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h }, rules: [{ conditions: [{ [t]: b, [u]: [j] }], rules: [{ conditions: p, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: q, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: j, properties: m, headers: m }, type: e }], type: f2 }, { conditions: [{ [t]: b, [u]: r }], rules: [{ conditions: [{ [t]: "aws.partition", [u]: r, assign: g }], rules: [{ conditions: [k, l], rules: [{ conditions: [{ [t]: c, [u]: [a, n] }, o], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f2 }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f2 }, { conditions: p, rules: [{ conditions: [{ [t]: c, [u]: [n, a] }], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f2 }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f2 }, { conditions: q, rules: [{ conditions: [o], rules: [{ endpoint: { url: "https://lambda.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f2 }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f2 }, { endpoint: { url: "https://lambda.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f2 }], type: f2 }, { error: "Invalid Configuration: Missing Region", type: d }] };
var ruleSet = _data;

// node_modules/@aws-sdk/client-lambda/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};
customEndpointFunctions.aws = awsEndpointFunctions;

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  return {
    apiVersion: "2015-03-31",
    base64Decoder: config?.base64Decoder ?? fromBase64,
    base64Encoder: config?.base64Encoder ?? toBase64,
    disableHostPrefix: config?.disableHostPrefix ?? false,
    endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
    extensions: config?.extensions ?? [],
    httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultLambdaHttpAuthSchemeProvider,
    httpAuthSchemes: config?.httpAuthSchemes ?? [
      {
        schemeId: "aws.auth#sigv4",
        identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
        signer: new AwsSdkSigV4Signer()
      }
    ],
    logger: config?.logger ?? new NoOpLogger(),
    serviceId: config?.serviceId ?? "Lambda",
    urlParser: config?.urlParser ?? parseUrl,
    utf8Decoder: config?.utf8Decoder ?? fromUtf8,
    utf8Encoder: config?.utf8Encoder ?? toUtf8
  };
};

// node_modules/@smithy/util-defaults-mode-browser/dist-es/constants.js
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];

// node_modules/@smithy/util-defaults-mode-browser/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = ({ defaultsMode } = {}) => memoize(() => __async(void 0, null, function* () {
  const mode = typeof defaultsMode === "function" ? yield defaultsMode() : defaultsMode;
  switch (mode?.toLowerCase()) {
    case "auto":
      return Promise.resolve(isMobileBrowser() ? "mobile" : "standard");
    case "mobile":
    case "in-region":
    case "cross-region":
    case "standard":
    case "legacy":
      return Promise.resolve(mode?.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
}));
var isMobileBrowser = () => {
  const parsedUA = typeof window !== "undefined" && window?.navigator?.userAgent ? bowser_default.parse(window.navigator.userAgent) : void 0;
  const platform = parsedUA?.platform?.type;
  return platform === "tablet" || platform === "mobile";
};

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.browser.js
var getRuntimeConfig2 = (config) => {
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return __spreadProps(__spreadValues(__spreadValues({}, clientSharedValues), config), {
    runtime: "browser",
    defaultsMode,
    bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength,
    credentialDefaultProvider: config?.credentialDefaultProvider ?? ((_) => () => Promise.reject(new Error("Credential is missing"))),
    defaultUserAgentProvider: config?.defaultUserAgentProvider ?? defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    eventStreamSerdeProvider: config?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
    maxAttempts: config?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    region: config?.region ?? invalidProvider("Region is missing"),
    requestHandler: FetchHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
    retryMode: config?.retryMode ?? (() => __async(void 0, null, function* () {
      return (yield defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE;
    })),
    sha256: config?.sha256 ?? Sha2563,
    streamCollector: config?.streamCollector ?? streamCollector,
    useDualstackEndpoint: config?.useDualstackEndpoint ?? (() => Promise.resolve(DEFAULT_USE_DUALSTACK_ENDPOINT)),
    useFipsEndpoint: config?.useFipsEndpoint ?? (() => Promise.resolve(DEFAULT_USE_FIPS_ENDPOINT))
  });
};

// node_modules/@aws-sdk/region-config-resolver/dist-es/extensions/index.js
var getAwsRegionExtensionConfiguration = (runtimeConfig) => {
  let runtimeConfigRegion = () => __async(void 0, null, function* () {
    if (runtimeConfig.region === void 0) {
      throw new Error("Region is missing from runtimeConfig");
    }
    const region = runtimeConfig.region;
    if (typeof region === "string") {
      return region;
    }
    return region();
  });
  return {
    setRegion(region) {
      runtimeConfigRegion = region;
    },
    region() {
      return runtimeConfigRegion;
    }
  };
};
var resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
  return {
    region: awsRegionExtensionConfiguration.region()
  };
};

// node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthExtensionConfiguration.js
var getHttpAuthExtensionConfiguration = (runtimeConfig) => {
  const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
  let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
  let _credentials = runtimeConfig.credentials;
  return {
    setHttpAuthScheme(httpAuthScheme) {
      const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
      if (index === -1) {
        _httpAuthSchemes.push(httpAuthScheme);
      } else {
        _httpAuthSchemes.splice(index, 1, httpAuthScheme);
      }
    },
    httpAuthSchemes() {
      return _httpAuthSchemes;
    },
    setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
      _httpAuthSchemeProvider = httpAuthSchemeProvider;
    },
    httpAuthSchemeProvider() {
      return _httpAuthSchemeProvider;
    },
    setCredentials(credentials) {
      _credentials = credentials;
    },
    credentials() {
      return _credentials;
    }
  };
};
var resolveHttpAuthRuntimeConfig = (config) => {
  return {
    httpAuthSchemes: config.httpAuthSchemes(),
    httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
    credentials: config.credentials()
  };
};

// node_modules/@aws-sdk/client-lambda/dist-es/runtimeExtensions.js
var asPartial = (t2) => t2;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, asPartial(getAwsRegionExtensionConfiguration(runtimeConfig))), asPartial(getDefaultExtensionConfiguration(runtimeConfig))), asPartial(getHttpHandlerExtensionConfiguration(runtimeConfig))), asPartial(getHttpAuthExtensionConfiguration(runtimeConfig)));
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, runtimeConfig), resolveAwsRegionExtensionConfiguration(extensionConfiguration)), resolveDefaultRuntimeConfig(extensionConfiguration)), resolveHttpHandlerRuntimeConfig(extensionConfiguration)), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

// node_modules/@aws-sdk/client-lambda/dist-es/LambdaClient.js
var LambdaClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveUserAgentConfig(_config_1);
    const _config_3 = resolveRetryConfig(_config_2);
    const _config_4 = resolveRegionConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveEndpointConfig(_config_5);
    const _config_7 = resolveEventStreamSerdeConfig(_config_6);
    const _config_8 = resolveHttpAuthSchemeConfig(_config_7);
    const _config_9 = resolveRuntimeExtensions(_config_8, configuration?.extensions || []);
    super(_config_9);
    this.config = _config_9;
    this.middlewareStack.use(getUserAgentPlugin(this.config));
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
      httpAuthSchemeParametersProvider: defaultLambdaHttpAuthSchemeParametersProvider,
      identityProviderConfigProvider: (config) => __async(this, null, function* () {
        return new DefaultIdentityProviderConfig({
          "aws.auth#sigv4": config.credentials
        });
      })
    }));
    this.middlewareStack.use(getHttpSigningPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/@aws-sdk/client-lambda/dist-es/models/LambdaServiceException.js
var LambdaServiceException = class _LambdaServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _LambdaServiceException.prototype);
  }
};

// node_modules/@aws-sdk/client-lambda/dist-es/models/models_0.js
var InvalidParameterValueException = class _InvalidParameterValueException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidParameterValueException",
      $fault: "client"
    }, opts));
    this.name = "InvalidParameterValueException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidParameterValueException.prototype);
    this.Type = opts.Type;
  }
};
var PolicyLengthExceededException = class _PolicyLengthExceededException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PolicyLengthExceededException",
      $fault: "client"
    }, opts));
    this.name = "PolicyLengthExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PolicyLengthExceededException.prototype);
    this.Type = opts.Type;
  }
};
var PreconditionFailedException = class _PreconditionFailedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "PreconditionFailedException",
      $fault: "client"
    }, opts));
    this.name = "PreconditionFailedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PreconditionFailedException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceConflictException = class _ResourceConflictException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceConflictException",
      $fault: "client"
    }, opts));
    this.name = "ResourceConflictException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceConflictException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ServiceException2 = class _ServiceException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ServiceException",
      $fault: "server"
    }, opts));
    this.name = "ServiceException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ThrottleReason = {
  CallerRateLimitExceeded: "CallerRateLimitExceeded",
  ConcurrentInvocationLimitExceeded: "ConcurrentInvocationLimitExceeded",
  ConcurrentSnapshotCreateLimitExceeded: "ConcurrentSnapshotCreateLimitExceeded",
  FunctionInvocationRateLimitExceeded: "FunctionInvocationRateLimitExceeded",
  ReservedFunctionConcurrentInvocationLimitExceeded: "ReservedFunctionConcurrentInvocationLimitExceeded",
  ReservedFunctionInvocationRateLimitExceeded: "ReservedFunctionInvocationRateLimitExceeded"
};
var TooManyRequestsException = class _TooManyRequestsException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "TooManyRequestsException",
      $fault: "client"
    }, opts));
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
    this.retryAfterSeconds = opts.retryAfterSeconds;
    this.Type = opts.Type;
    this.Reason = opts.Reason;
  }
};
var FunctionUrlAuthType = {
  AWS_IAM: "AWS_IAM",
  NONE: "NONE"
};
var ApplicationLogLevel = {
  Debug: "DEBUG",
  Error: "ERROR",
  Fatal: "FATAL",
  Info: "INFO",
  Trace: "TRACE",
  Warn: "WARN"
};
var Architecture = {
  arm64: "arm64",
  x86_64: "x86_64"
};
var CodeSigningPolicy = {
  Enforce: "Enforce",
  Warn: "Warn"
};
var FullDocument = {
  Default: "Default",
  UpdateLookup: "UpdateLookup"
};
var FunctionResponseType = {
  ReportBatchItemFailures: "ReportBatchItemFailures"
};
var EndPointType = {
  KAFKA_BOOTSTRAP_SERVERS: "KAFKA_BOOTSTRAP_SERVERS"
};
var SourceAccessType = {
  BASIC_AUTH: "BASIC_AUTH",
  CLIENT_CERTIFICATE_TLS_AUTH: "CLIENT_CERTIFICATE_TLS_AUTH",
  SASL_SCRAM_256_AUTH: "SASL_SCRAM_256_AUTH",
  SASL_SCRAM_512_AUTH: "SASL_SCRAM_512_AUTH",
  SERVER_ROOT_CA_CERTIFICATE: "SERVER_ROOT_CA_CERTIFICATE",
  VIRTUAL_HOST: "VIRTUAL_HOST",
  VPC_SECURITY_GROUP: "VPC_SECURITY_GROUP",
  VPC_SUBNET: "VPC_SUBNET"
};
var EventSourcePosition = {
  AT_TIMESTAMP: "AT_TIMESTAMP",
  LATEST: "LATEST",
  TRIM_HORIZON: "TRIM_HORIZON"
};
var CodeSigningConfigNotFoundException = class _CodeSigningConfigNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeSigningConfigNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "CodeSigningConfigNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeSigningConfigNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var CodeStorageExceededException = class _CodeStorageExceededException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeStorageExceededException",
      $fault: "client"
    }, opts));
    this.name = "CodeStorageExceededException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeStorageExceededException.prototype);
    this.Type = opts.Type;
  }
};
var CodeVerificationFailedException = class _CodeVerificationFailedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "CodeVerificationFailedException",
      $fault: "client"
    }, opts));
    this.name = "CodeVerificationFailedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _CodeVerificationFailedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var LogFormat = {
  Json: "JSON",
  Text: "Text"
};
var SystemLogLevel = {
  Debug: "DEBUG",
  Info: "INFO",
  Warn: "WARN"
};
var PackageType = {
  Image: "Image",
  Zip: "Zip"
};
var Runtime = {
  dotnet6: "dotnet6",
  dotnet8: "dotnet8",
  dotnetcore10: "dotnetcore1.0",
  dotnetcore20: "dotnetcore2.0",
  dotnetcore21: "dotnetcore2.1",
  dotnetcore31: "dotnetcore3.1",
  go1x: "go1.x",
  java11: "java11",
  java17: "java17",
  java21: "java21",
  java8: "java8",
  java8al2: "java8.al2",
  nodejs: "nodejs",
  nodejs10x: "nodejs10.x",
  nodejs12x: "nodejs12.x",
  nodejs14x: "nodejs14.x",
  nodejs16x: "nodejs16.x",
  nodejs18x: "nodejs18.x",
  nodejs20x: "nodejs20.x",
  nodejs43: "nodejs4.3",
  nodejs43edge: "nodejs4.3-edge",
  nodejs610: "nodejs6.10",
  nodejs810: "nodejs8.10",
  provided: "provided",
  providedal2: "provided.al2",
  providedal2023: "provided.al2023",
  python27: "python2.7",
  python310: "python3.10",
  python311: "python3.11",
  python312: "python3.12",
  python36: "python3.6",
  python37: "python3.7",
  python38: "python3.8",
  python39: "python3.9",
  ruby25: "ruby2.5",
  ruby27: "ruby2.7",
  ruby32: "ruby3.2",
  ruby33: "ruby3.3"
};
var SnapStartApplyOn = {
  None: "None",
  PublishedVersions: "PublishedVersions"
};
var TracingMode = {
  Active: "Active",
  PassThrough: "PassThrough"
};
var LastUpdateStatus = {
  Failed: "Failed",
  InProgress: "InProgress",
  Successful: "Successful"
};
var LastUpdateStatusReasonCode = {
  DisabledKMSKey: "DisabledKMSKey",
  EFSIOError: "EFSIOError",
  EFSMountConnectivityError: "EFSMountConnectivityError",
  EFSMountFailure: "EFSMountFailure",
  EFSMountTimeout: "EFSMountTimeout",
  EniLimitExceeded: "EniLimitExceeded",
  FunctionError: "FunctionError",
  ImageAccessDenied: "ImageAccessDenied",
  ImageDeleted: "ImageDeleted",
  InsufficientRolePermissions: "InsufficientRolePermissions",
  InternalError: "InternalError",
  InvalidConfiguration: "InvalidConfiguration",
  InvalidImage: "InvalidImage",
  InvalidRuntime: "InvalidRuntime",
  InvalidSecurityGroup: "InvalidSecurityGroup",
  InvalidStateKMSKey: "InvalidStateKMSKey",
  InvalidSubnet: "InvalidSubnet",
  InvalidZipFileException: "InvalidZipFileException",
  KMSKeyAccessDenied: "KMSKeyAccessDenied",
  KMSKeyNotFound: "KMSKeyNotFound",
  SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses"
};
var SnapStartOptimizationStatus = {
  Off: "Off",
  On: "On"
};
var State = {
  Active: "Active",
  Failed: "Failed",
  Inactive: "Inactive",
  Pending: "Pending"
};
var StateReasonCode = {
  Creating: "Creating",
  DisabledKMSKey: "DisabledKMSKey",
  EFSIOError: "EFSIOError",
  EFSMountConnectivityError: "EFSMountConnectivityError",
  EFSMountFailure: "EFSMountFailure",
  EFSMountTimeout: "EFSMountTimeout",
  EniLimitExceeded: "EniLimitExceeded",
  FunctionError: "FunctionError",
  Idle: "Idle",
  ImageAccessDenied: "ImageAccessDenied",
  ImageDeleted: "ImageDeleted",
  InsufficientRolePermissions: "InsufficientRolePermissions",
  InternalError: "InternalError",
  InvalidConfiguration: "InvalidConfiguration",
  InvalidImage: "InvalidImage",
  InvalidRuntime: "InvalidRuntime",
  InvalidSecurityGroup: "InvalidSecurityGroup",
  InvalidStateKMSKey: "InvalidStateKMSKey",
  InvalidSubnet: "InvalidSubnet",
  InvalidZipFileException: "InvalidZipFileException",
  KMSKeyAccessDenied: "KMSKeyAccessDenied",
  KMSKeyNotFound: "KMSKeyNotFound",
  Restoring: "Restoring",
  SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses"
};
var InvalidCodeSignatureException = class _InvalidCodeSignatureException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidCodeSignatureException",
      $fault: "client"
    }, opts));
    this.name = "InvalidCodeSignatureException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidCodeSignatureException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvokeMode = {
  BUFFERED: "BUFFERED",
  RESPONSE_STREAM: "RESPONSE_STREAM"
};
var ResourceInUseException = class _ResourceInUseException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceInUseException",
      $fault: "client"
    }, opts));
    this.name = "ResourceInUseException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceInUseException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RecursiveLoop = {
  Allow: "Allow",
  Terminate: "Terminate"
};
var ProvisionedConcurrencyStatusEnum = {
  FAILED: "FAILED",
  IN_PROGRESS: "IN_PROGRESS",
  READY: "READY"
};
var ProvisionedConcurrencyConfigNotFoundException = class _ProvisionedConcurrencyConfigNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ProvisionedConcurrencyConfigNotFoundException",
      $fault: "client"
    }, opts));
    this.name = "ProvisionedConcurrencyConfigNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ProvisionedConcurrencyConfigNotFoundException.prototype);
    this.Type = opts.Type;
  }
};
var UpdateRuntimeOn = {
  Auto: "Auto",
  FunctionUpdate: "FunctionUpdate",
  Manual: "Manual"
};
var EC2AccessDeniedException = class _EC2AccessDeniedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2AccessDeniedException",
      $fault: "server"
    }, opts));
    this.name = "EC2AccessDeniedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2AccessDeniedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EC2ThrottledException = class _EC2ThrottledException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2ThrottledException",
      $fault: "server"
    }, opts));
    this.name = "EC2ThrottledException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2ThrottledException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EC2UnexpectedException = class _EC2UnexpectedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EC2UnexpectedException",
      $fault: "server"
    }, opts));
    this.name = "EC2UnexpectedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _EC2UnexpectedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
    this.EC2ErrorCode = opts.EC2ErrorCode;
  }
};
var EFSIOException = class _EFSIOException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSIOException",
      $fault: "client"
    }, opts));
    this.name = "EFSIOException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSIOException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountConnectivityException = class _EFSMountConnectivityException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountConnectivityException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountConnectivityException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountConnectivityException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountFailureException = class _EFSMountFailureException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountFailureException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountFailureException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountFailureException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var EFSMountTimeoutException = class _EFSMountTimeoutException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "EFSMountTimeoutException",
      $fault: "client"
    }, opts));
    this.name = "EFSMountTimeoutException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _EFSMountTimeoutException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var ENILimitReachedException = class _ENILimitReachedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ENILimitReachedException",
      $fault: "server"
    }, opts));
    this.name = "ENILimitReachedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ENILimitReachedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidRequestContentException = class _InvalidRequestContentException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRequestContentException",
      $fault: "client"
    }, opts));
    this.name = "InvalidRequestContentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestContentException.prototype);
    this.Type = opts.Type;
  }
};
var InvalidRuntimeException = class _InvalidRuntimeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidRuntimeException",
      $fault: "server"
    }, opts));
    this.name = "InvalidRuntimeException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidRuntimeException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidSecurityGroupIDException = class _InvalidSecurityGroupIDException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSecurityGroupIDException",
      $fault: "server"
    }, opts));
    this.name = "InvalidSecurityGroupIDException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidSecurityGroupIDException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidSubnetIDException = class _InvalidSubnetIDException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidSubnetIDException",
      $fault: "server"
    }, opts));
    this.name = "InvalidSubnetIDException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidSubnetIDException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvalidZipFileException = class _InvalidZipFileException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "InvalidZipFileException",
      $fault: "server"
    }, opts));
    this.name = "InvalidZipFileException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InvalidZipFileException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var InvocationType = {
  DryRun: "DryRun",
  Event: "Event",
  RequestResponse: "RequestResponse"
};
var LogType = {
  None: "None",
  Tail: "Tail"
};
var KMSAccessDeniedException = class _KMSAccessDeniedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSAccessDeniedException",
      $fault: "server"
    }, opts));
    this.name = "KMSAccessDeniedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSAccessDeniedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSDisabledException = class _KMSDisabledException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSDisabledException",
      $fault: "server"
    }, opts));
    this.name = "KMSDisabledException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSDisabledException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSInvalidStateException = class _KMSInvalidStateException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSInvalidStateException",
      $fault: "server"
    }, opts));
    this.name = "KMSInvalidStateException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSInvalidStateException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var KMSNotFoundException = class _KMSNotFoundException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "KMSNotFoundException",
      $fault: "server"
    }, opts));
    this.name = "KMSNotFoundException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _KMSNotFoundException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RecursiveInvocationException = class _RecursiveInvocationException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RecursiveInvocationException",
      $fault: "client"
    }, opts));
    this.name = "RecursiveInvocationException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RecursiveInvocationException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var RequestTooLargeException = class _RequestTooLargeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "RequestTooLargeException",
      $fault: "client"
    }, opts));
    this.name = "RequestTooLargeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RequestTooLargeException.prototype);
    this.Type = opts.Type;
  }
};
var ResourceNotReadyException = class _ResourceNotReadyException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "ResourceNotReadyException",
      $fault: "server"
    }, opts));
    this.name = "ResourceNotReadyException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _ResourceNotReadyException.prototype);
    this.Type = opts.Type;
  }
};
var SnapStartException = class _SnapStartException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SnapStartNotReadyException = class _SnapStartNotReadyException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartNotReadyException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartNotReadyException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartNotReadyException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SnapStartTimeoutException = class _SnapStartTimeoutException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SnapStartTimeoutException",
      $fault: "client"
    }, opts));
    this.name = "SnapStartTimeoutException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SnapStartTimeoutException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var SubnetIPAddressLimitReachedException = class _SubnetIPAddressLimitReachedException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "SubnetIPAddressLimitReachedException",
      $fault: "server"
    }, opts));
    this.name = "SubnetIPAddressLimitReachedException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _SubnetIPAddressLimitReachedException.prototype);
    this.Type = opts.Type;
    this.Message = opts.Message;
  }
};
var UnsupportedMediaTypeException = class _UnsupportedMediaTypeException extends LambdaServiceException {
  constructor(opts) {
    super(__spreadValues({
      name: "UnsupportedMediaTypeException",
      $fault: "client"
    }, opts));
    this.name = "UnsupportedMediaTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedMediaTypeException.prototype);
    this.Type = opts.Type;
  }
};
var ResponseStreamingInvocationType = {
  DryRun: "DryRun",
  RequestResponse: "RequestResponse"
};
var InvokeWithResponseStreamResponseEvent;
(function(InvokeWithResponseStreamResponseEvent2) {
  InvokeWithResponseStreamResponseEvent2.visit = (value, visitor) => {
    if (value.PayloadChunk !== void 0)
      return visitor.PayloadChunk(value.PayloadChunk);
    if (value.InvokeComplete !== void 0)
      return visitor.InvokeComplete(value.InvokeComplete);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(InvokeWithResponseStreamResponseEvent || (InvokeWithResponseStreamResponseEvent = {}));
var FunctionVersion = {
  ALL: "ALL"
};
var FunctionCodeFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var EnvironmentFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Variables && { Variables: SENSITIVE_STRING });
var CreateFunctionRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Code && { Code: FunctionCodeFilterSensitiveLog(obj.Code) }), obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) });
var EnvironmentErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var EnvironmentResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues({}, obj), obj.Variables && { Variables: SENSITIVE_STRING }), obj.Error && { Error: EnvironmentErrorFilterSensitiveLog(obj.Error) });
var ImageConfigErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var ImageConfigResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Error && { Error: ImageConfigErrorFilterSensitiveLog(obj.Error) });
var RuntimeVersionErrorFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Message && { Message: SENSITIVE_STRING });
var RuntimeVersionConfigFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Error && { Error: RuntimeVersionErrorFilterSensitiveLog(obj.Error) });
var FunctionConfigurationFilterSensitiveLog = (obj) => __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, obj), obj.Environment && { Environment: EnvironmentResponseFilterSensitiveLog(obj.Environment) }), obj.ImageConfigResponse && {
  ImageConfigResponse: ImageConfigResponseFilterSensitiveLog(obj.ImageConfigResponse)
}), obj.RuntimeVersionConfig && {
  RuntimeVersionConfig: RuntimeVersionConfigFilterSensitiveLog(obj.RuntimeVersionConfig)
});
var GetFunctionResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Configuration && { Configuration: FunctionConfigurationFilterSensitiveLog(obj.Configuration) });
var InvocationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvocationResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeAsyncRequestFilterSensitiveLog = (obj) => __spreadValues({}, obj);
var InvokeWithResponseStreamRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeResponseStreamUpdateFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Payload && { Payload: SENSITIVE_STRING });
var InvokeWithResponseStreamResponseEventFilterSensitiveLog = (obj) => {
  if (obj.PayloadChunk !== void 0)
    return { PayloadChunk: InvokeResponseStreamUpdateFilterSensitiveLog(obj.PayloadChunk) };
  if (obj.InvokeComplete !== void 0)
    return { InvokeComplete: obj.InvokeComplete };
  if (obj.$unknown !== void 0)
    return { [obj.$unknown[0]]: "UNKNOWN" };
};
var InvokeWithResponseStreamResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.EventStream && { EventStream: "STREAMING_CONTENT" });
var ListFunctionsResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Functions && { Functions: obj.Functions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) });
var ListVersionsByFunctionResponseFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Versions && { Versions: obj.Versions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) });
var LayerVersionContentInputFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var PublishLayerVersionRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Content && { Content: LayerVersionContentInputFilterSensitiveLog(obj.Content) });
var UpdateFunctionCodeRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.ZipFile && { ZipFile: SENSITIVE_STRING });
var UpdateFunctionConfigurationRequestFilterSensitiveLog = (obj) => __spreadValues(__spreadValues({}, obj), obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) });

// node_modules/@aws-sdk/client-lambda/dist-es/protocols/Aws_restJson1.js
var se_AddLayerVersionPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  const query = map({
    [_RI]: [, input[_RI]]
  });
  let body;
  body = JSON.stringify(take(input, {
    Action: [],
    OrganizationId: [],
    Principal: [],
    StatementId: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_AddPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/policy");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    Action: [],
    EventSourceToken: [],
    FunctionUrlAuthType: [],
    Principal: [],
    PrincipalOrgID: [],
    RevisionId: [],
    SourceAccount: [],
    SourceArn: [],
    StatementId: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_CreateAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    Description: [],
    FunctionVersion: [],
    Name: [],
    RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-04-22/code-signing-configs");
  let body;
  body = JSON.stringify(take(input, {
    AllowedPublishers: (_) => _json(_),
    CodeSigningPolicies: (_) => _json(_),
    Description: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/event-source-mappings");
  let body;
  body = JSON.stringify(take(input, {
    AmazonManagedKafkaEventSourceConfig: (_) => _json(_),
    BatchSize: [],
    BisectBatchOnFunctionError: [],
    DestinationConfig: (_) => _json(_),
    DocumentDBEventSourceConfig: (_) => _json(_),
    Enabled: [],
    EventSourceArn: [],
    FilterCriteria: (_) => _json(_),
    FunctionName: [],
    FunctionResponseTypes: (_) => _json(_),
    KMSKeyArn: [],
    MaximumBatchingWindowInSeconds: [],
    MaximumRecordAgeInSeconds: [],
    MaximumRetryAttempts: [],
    ParallelizationFactor: [],
    Queues: (_) => _json(_),
    ScalingConfig: (_) => _json(_),
    SelfManagedEventSource: (_) => _json(_),
    SelfManagedKafkaEventSourceConfig: (_) => _json(_),
    SourceAccessConfigurations: (_) => _json(_),
    StartingPosition: [],
    StartingPositionTimestamp: (_) => _.getTime() / 1e3,
    Topics: (_) => _json(_),
    TumblingWindowInSeconds: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions");
  let body;
  body = JSON.stringify(take(input, {
    Architectures: (_) => _json(_),
    Code: (_) => se_FunctionCode(_, context),
    CodeSigningConfigArn: [],
    DeadLetterConfig: (_) => _json(_),
    Description: [],
    Environment: (_) => _json(_),
    EphemeralStorage: (_) => _json(_),
    FileSystemConfigs: (_) => _json(_),
    FunctionName: [],
    Handler: [],
    ImageConfig: (_) => _json(_),
    KMSKeyArn: [],
    Layers: (_) => _json(_),
    LoggingConfig: (_) => _json(_),
    MemorySize: [],
    PackageType: [],
    Publish: [],
    Role: [],
    Runtime: [],
    SnapStart: (_) => _json(_),
    Tags: (_) => _json(_),
    Timeout: [],
    TracingConfig: (_) => _json(_),
    VpcConfig: (_) => _json(_)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_CreateFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    AuthType: [],
    Cors: (_) => _json(_),
    InvokeMode: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-10-31/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_DeleteLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("DELETE").h(headers).b(body);
  return b2.build();
});
var se_DeleteProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetAccountSettingsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2016-08-19/account-settings");
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/configuration");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetFunctionRecursionConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetLayerVersionByArnCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers");
  const query = map({
    [_f]: [, "LayerVersion"],
    [_A]: [, expectNonNull(input[_A], `Arn`)]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetLayerVersionPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_GetPolicyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/policy");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_GetRuntimeManagementConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_InvokeCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    "content-type": "application/octet-stream",
    [_xait]: input[_IT],
    [_xalt]: input[_LT],
    [_xacc]: input[_CC]
  });
  b2.bp("/2015-03-31/functions/{FunctionName}/invocations");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  if (input.Payload !== void 0) {
    body = input.Payload;
  }
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_InvokeAsyncCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/octet-stream"
  };
  b2.bp("/2014-11-13/functions/{FunctionName}/invoke-async");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  if (input.InvokeArgs !== void 0) {
    body = input.InvokeArgs;
  }
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_InvokeWithResponseStreamCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = map({}, isSerializableHeaderValue, {
    "content-type": "application/octet-stream",
    [_xait]: input[_IT],
    [_xalt]: input[_LT],
    [_xacc]: input[_CC]
  });
  b2.bp("/2021-11-15/functions/{FunctionName}/response-streaming-invocations");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  if (input.Payload !== void 0) {
    body = input.Payload;
  }
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListAliasesCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_FV]: [, input[_FV]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListCodeSigningConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs");
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListEventSourceMappingsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/event-source-mappings");
  const query = map({
    [_ESA]: [, input[_ESA]],
    [_FN]: [, input[_FN]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionEventInvokeConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config/list");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions");
  const query = map({
    [_MR]: [, input[_MR]],
    [_FV]: [, input[_FV]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionsByCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}/functions");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListFunctionUrlConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2021-10-31/functions/{FunctionName}/urls");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListLayersCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers");
  const query = map({
    [_CR]: [, input[_CR]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    [_CA]: [, input[_CA]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListLayerVersionsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  const query = map({
    [_CR]: [, input[_CR]],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    [_CA]: [, input[_CA]]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListProvisionedConcurrencyConfigsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_L]: [, "ALL"],
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_ListTagsCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  let body;
  b2.m("GET").h(headers).b(body);
  return b2.build();
});
var se_ListVersionsByFunctionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/versions");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_M]: [, input[_M]],
    [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()]
  });
  let body;
  b2.m("GET").h(headers).q(query).b(body);
  return b2.build();
});
var se_PublishLayerVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2018-10-31/layers/{LayerName}/versions");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CompatibleArchitectures: (_) => _json(_),
    CompatibleRuntimes: (_) => _json(_),
    Content: (_) => se_LayerVersionContentInput(_, context),
    Description: [],
    LicenseInfo: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_PublishVersionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/versions");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CodeSha256: [],
    Description: [],
    RevisionId: []
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    CodeSigningConfigArn: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionConcurrencyCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2017-10-31/functions/{FunctionName}/concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    ReservedConcurrentExecutions: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    DestinationConfig: (_) => _json(_),
    MaximumEventAgeInSeconds: [],
    MaximumRetryAttempts: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_PutFunctionRecursionConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    RecursiveLoop: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_PutProvisionedConcurrencyConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, expectNonNull(input[_Q], `Qualifier`)]
  });
  let body;
  body = JSON.stringify(take(input, {
    ProvisionedConcurrentExecutions: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_PutRuntimeManagementConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    RuntimeVersionArn: [],
    UpdateRuntimeOn: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var se_RemoveLayerVersionPermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy/{StatementId}");
  b2.p("LayerName", () => input.LayerName, "{LayerName}", false);
  b2.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
  b2.p("StatementId", () => input.StatementId, "{StatementId}", false);
  const query = map({
    [_RI]: [, input[_RI]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_RemovePermissionCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2015-03-31/functions/{FunctionName}/policy/{StatementId}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("StatementId", () => input.StatementId, "{StatementId}", false);
  const query = map({
    [_Q]: [, input[_Q]],
    [_RI]: [, input[_RI]]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_TagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  let body;
  body = JSON.stringify(take(input, {
    Tags: (_) => _json(_)
  }));
  b2.m("POST").h(headers).b(body);
  return b2.build();
});
var se_UntagResourceCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {};
  b2.bp("/2017-03-31/tags/{Resource}");
  b2.p("Resource", () => input.Resource, "{Resource}", false);
  const query = map({
    [_tK]: [
      expectNonNull(input.TagKeys, `TagKeys`) != null,
      () => (input[_TK] || []).map((_entry) => _entry)
    ]
  });
  let body;
  b2.m("DELETE").h(headers).q(query).b(body);
  return b2.build();
});
var se_UpdateAliasCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  b2.p("Name", () => input.Name, "{Name}", false);
  let body;
  body = JSON.stringify(take(input, {
    Description: [],
    FunctionVersion: [],
    RevisionId: [],
    RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateCodeSigningConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
  b2.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
  let body;
  body = JSON.stringify(take(input, {
    AllowedPublishers: (_) => _json(_),
    CodeSigningPolicies: (_) => _json(_),
    Description: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateEventSourceMappingCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/event-source-mappings/{UUID}");
  b2.p("UUID", () => input.UUID, "{UUID}", false);
  let body;
  body = JSON.stringify(take(input, {
    BatchSize: [],
    BisectBatchOnFunctionError: [],
    DestinationConfig: (_) => _json(_),
    DocumentDBEventSourceConfig: (_) => _json(_),
    Enabled: [],
    FilterCriteria: (_) => _json(_),
    FunctionName: [],
    FunctionResponseTypes: (_) => _json(_),
    KMSKeyArn: [],
    MaximumBatchingWindowInSeconds: [],
    MaximumRecordAgeInSeconds: [],
    MaximumRetryAttempts: [],
    ParallelizationFactor: [],
    ScalingConfig: (_) => _json(_),
    SourceAccessConfigurations: (_) => _json(_),
    TumblingWindowInSeconds: []
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionCodeCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/code");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    Architectures: (_) => _json(_),
    DryRun: [],
    ImageUri: [],
    Publish: [],
    RevisionId: [],
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: (_) => context.base64Encoder(_)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionConfigurationCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2015-03-31/functions/{FunctionName}/configuration");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  let body;
  body = JSON.stringify(take(input, {
    DeadLetterConfig: (_) => _json(_),
    Description: [],
    Environment: (_) => _json(_),
    EphemeralStorage: (_) => _json(_),
    FileSystemConfigs: (_) => _json(_),
    Handler: [],
    ImageConfig: (_) => _json(_),
    KMSKeyArn: [],
    Layers: (_) => _json(_),
    LoggingConfig: (_) => _json(_),
    MemorySize: [],
    RevisionId: [],
    Role: [],
    Runtime: [],
    SnapStart: (_) => _json(_),
    Timeout: [],
    TracingConfig: (_) => _json(_),
    VpcConfig: (_) => _json(_)
  }));
  b2.m("PUT").h(headers).b(body);
  return b2.build();
});
var se_UpdateFunctionEventInvokeConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    DestinationConfig: (_) => _json(_),
    MaximumEventAgeInSeconds: [],
    MaximumRetryAttempts: []
  }));
  b2.m("POST").h(headers).q(query).b(body);
  return b2.build();
});
var se_UpdateFunctionUrlConfigCommand = (input, context) => __async(void 0, null, function* () {
  const b2 = requestBuilder(input, context);
  const headers = {
    "content-type": "application/json"
  };
  b2.bp("/2021-10-31/functions/{FunctionName}/url");
  b2.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
  const query = map({
    [_Q]: [, input[_Q]]
  });
  let body;
  body = JSON.stringify(take(input, {
    AuthType: [],
    Cors: (_) => _json(_),
    InvokeMode: []
  }));
  b2.m("PUT").h(headers).q(query).b(body);
  return b2.build();
});
var de_AddLayerVersionPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RevisionId: expectString,
    Statement: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_AddPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Statement: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CreateFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_DeleteAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_DeleteFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_DeleteProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_GetAccountSettingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AccountLimit: _json,
    AccountUsage: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Code: _json,
    Concurrency: _json,
    Configuration: _json,
    Tags: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigArn: expectString,
    FunctionName: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    ReservedConcurrentExecutions: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionRecursionConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RecursiveLoop: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString,
    LastModifiedTime: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionByArnCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetLayerVersionPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Policy: expectString,
    RevisionId: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetPolicyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Policy: expectString,
    RevisionId: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AllocatedProvisionedConcurrentExecutions: expectInt32,
    AvailableProvisionedConcurrentExecutions: expectInt32,
    LastModified: expectString,
    RequestedProvisionedConcurrentExecutions: expectInt32,
    Status: expectString,
    StatusReason: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_GetRuntimeManagementConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArn: expectString,
    RuntimeVersionArn: expectString,
    UpdateRuntimeOn: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_InvokeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output),
    [_FE]: [, output.headers[_xafe]],
    [_LR]: [, output.headers[_xalr]],
    [_EV]: [, output.headers[_xaev]]
  });
  const data = yield collectBody(output.body, context);
  contents.Payload = data;
  map(contents, {
    StatusCode: [, output.statusCode]
  });
  return contents;
});
var de_InvokeAsyncCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  map(contents, {
    Status: [, output.statusCode]
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_InvokeWithResponseStreamCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output),
    [_EV]: [, output.headers[_xaev]],
    [_RSCT]: [, output.headers[_ct]]
  });
  const data = output.body;
  contents.EventStream = de_InvokeWithResponseStreamResponseEvent(data, context);
  map(contents, {
    StatusCode: [, output.statusCode]
  });
  return contents;
});
var de_ListAliasesCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Aliases: (_) => de_AliasList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListCodeSigningConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigs: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListEventSourceMappingsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    EventSourceMappings: (_) => de_EventSourceMappingsList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionEventInvokeConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionEventInvokeConfigs: (_) => de_FunctionEventInvokeConfigList(_, context),
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Functions: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionsByCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArns: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListFunctionUrlConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionUrlConfigs: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListLayersCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Layers: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListLayerVersionsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    LayerVersions: _json,
    NextMarker: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListProvisionedConcurrencyConfigsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    NextMarker: expectString,
    ProvisionedConcurrencyConfigs: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListTagsCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Tags: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_ListVersionsByFunctionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    NextMarker: expectString,
    Versions: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PublishLayerVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CompatibleArchitectures: _json,
    CompatibleRuntimes: _json,
    Content: _json,
    CreatedDate: expectString,
    Description: expectString,
    LayerArn: expectString,
    LayerVersionArn: expectString,
    LicenseInfo: expectString,
    Version: expectLong
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PublishVersionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 201 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfigArn: expectString,
    FunctionName: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionConcurrencyCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    ReservedConcurrentExecutions: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutFunctionRecursionConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    RecursiveLoop: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutProvisionedConcurrencyConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AllocatedProvisionedConcurrentExecutions: expectInt32,
    AvailableProvisionedConcurrentExecutions: expectInt32,
    LastModified: expectString,
    RequestedProvisionedConcurrentExecutions: expectInt32,
    Status: expectString,
    StatusReason: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_PutRuntimeManagementConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    FunctionArn: expectString,
    RuntimeVersionArn: expectString,
    UpdateRuntimeOn: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_RemoveLayerVersionPermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_RemovePermissionCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_TagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_UntagResourceCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  yield collectBody(output.body, context);
  return contents;
});
var de_UpdateAliasCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateCodeSigningConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    CodeSigningConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateEventSourceMappingCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 202 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionCodeCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionConfigurationCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    Architectures: _json,
    CodeSha256: expectString,
    CodeSize: expectLong,
    DeadLetterConfig: _json,
    Description: expectString,
    Environment: _json,
    EphemeralStorage: _json,
    FileSystemConfigs: _json,
    FunctionArn: expectString,
    FunctionName: expectString,
    Handler: expectString,
    ImageConfigResponse: _json,
    KMSKeyArn: expectString,
    LastModified: expectString,
    LastUpdateStatus: expectString,
    LastUpdateStatusReason: expectString,
    LastUpdateStatusReasonCode: expectString,
    Layers: _json,
    LoggingConfig: _json,
    MasterArn: expectString,
    MemorySize: expectInt32,
    PackageType: expectString,
    RevisionId: expectString,
    Role: expectString,
    Runtime: expectString,
    RuntimeVersionConfig: _json,
    SigningJobArn: expectString,
    SigningProfileVersionArn: expectString,
    SnapStart: _json,
    State: expectString,
    StateReason: expectString,
    StateReasonCode: expectString,
    Timeout: expectInt32,
    TracingConfig: _json,
    Version: expectString,
    VpcConfig: _json
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionEventInvokeConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
  Object.assign(contents, doc);
  return contents;
});
var de_UpdateFunctionUrlConfigCommand = (output, context) => __async(void 0, null, function* () {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata2(output)
  });
  const data = expectNonNull(expectObject(yield parseJsonBody(output.body, context)), "body");
  const doc = take(data, {
    AuthType: expectString,
    Cors: _json,
    CreationTime: expectString,
    FunctionArn: expectString,
    FunctionUrl: expectString,
    InvokeMode: expectString,
    LastModifiedTime: expectString
  });
  Object.assign(contents, doc);
  return contents;
});
var de_CommandError = (output, context) => __async(void 0, null, function* () {
  const parsedOutput = __spreadProps(__spreadValues({}, output), {
    body: yield parseJsonErrorBody(output.body, context)
  });
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidParameterValueException":
    case "com.amazonaws.lambda#InvalidParameterValueException":
      throw yield de_InvalidParameterValueExceptionRes(parsedOutput, context);
    case "PolicyLengthExceededException":
    case "com.amazonaws.lambda#PolicyLengthExceededException":
      throw yield de_PolicyLengthExceededExceptionRes(parsedOutput, context);
    case "PreconditionFailedException":
    case "com.amazonaws.lambda#PreconditionFailedException":
      throw yield de_PreconditionFailedExceptionRes(parsedOutput, context);
    case "ResourceConflictException":
    case "com.amazonaws.lambda#ResourceConflictException":
      throw yield de_ResourceConflictExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.lambda#ResourceNotFoundException":
      throw yield de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "ServiceException":
    case "com.amazonaws.lambda#ServiceException":
      throw yield de_ServiceExceptionRes(parsedOutput, context);
    case "TooManyRequestsException":
    case "com.amazonaws.lambda#TooManyRequestsException":
      throw yield de_TooManyRequestsExceptionRes(parsedOutput, context);
    case "CodeSigningConfigNotFoundException":
    case "com.amazonaws.lambda#CodeSigningConfigNotFoundException":
      throw yield de_CodeSigningConfigNotFoundExceptionRes(parsedOutput, context);
    case "CodeStorageExceededException":
    case "com.amazonaws.lambda#CodeStorageExceededException":
      throw yield de_CodeStorageExceededExceptionRes(parsedOutput, context);
    case "CodeVerificationFailedException":
    case "com.amazonaws.lambda#CodeVerificationFailedException":
      throw yield de_CodeVerificationFailedExceptionRes(parsedOutput, context);
    case "InvalidCodeSignatureException":
    case "com.amazonaws.lambda#InvalidCodeSignatureException":
      throw yield de_InvalidCodeSignatureExceptionRes(parsedOutput, context);
    case "ResourceInUseException":
    case "com.amazonaws.lambda#ResourceInUseException":
      throw yield de_ResourceInUseExceptionRes(parsedOutput, context);
    case "ProvisionedConcurrencyConfigNotFoundException":
    case "com.amazonaws.lambda#ProvisionedConcurrencyConfigNotFoundException":
      throw yield de_ProvisionedConcurrencyConfigNotFoundExceptionRes(parsedOutput, context);
    case "EC2AccessDeniedException":
    case "com.amazonaws.lambda#EC2AccessDeniedException":
      throw yield de_EC2AccessDeniedExceptionRes(parsedOutput, context);
    case "EC2ThrottledException":
    case "com.amazonaws.lambda#EC2ThrottledException":
      throw yield de_EC2ThrottledExceptionRes(parsedOutput, context);
    case "EC2UnexpectedException":
    case "com.amazonaws.lambda#EC2UnexpectedException":
      throw yield de_EC2UnexpectedExceptionRes(parsedOutput, context);
    case "EFSIOException":
    case "com.amazonaws.lambda#EFSIOException":
      throw yield de_EFSIOExceptionRes(parsedOutput, context);
    case "EFSMountConnectivityException":
    case "com.amazonaws.lambda#EFSMountConnectivityException":
      throw yield de_EFSMountConnectivityExceptionRes(parsedOutput, context);
    case "EFSMountFailureException":
    case "com.amazonaws.lambda#EFSMountFailureException":
      throw yield de_EFSMountFailureExceptionRes(parsedOutput, context);
    case "EFSMountTimeoutException":
    case "com.amazonaws.lambda#EFSMountTimeoutException":
      throw yield de_EFSMountTimeoutExceptionRes(parsedOutput, context);
    case "ENILimitReachedException":
    case "com.amazonaws.lambda#ENILimitReachedException":
      throw yield de_ENILimitReachedExceptionRes(parsedOutput, context);
    case "InvalidRequestContentException":
    case "com.amazonaws.lambda#InvalidRequestContentException":
      throw yield de_InvalidRequestContentExceptionRes(parsedOutput, context);
    case "InvalidRuntimeException":
    case "com.amazonaws.lambda#InvalidRuntimeException":
      throw yield de_InvalidRuntimeExceptionRes(parsedOutput, context);
    case "InvalidSecurityGroupIDException":
    case "com.amazonaws.lambda#InvalidSecurityGroupIDException":
      throw yield de_InvalidSecurityGroupIDExceptionRes(parsedOutput, context);
    case "InvalidSubnetIDException":
    case "com.amazonaws.lambda#InvalidSubnetIDException":
      throw yield de_InvalidSubnetIDExceptionRes(parsedOutput, context);
    case "InvalidZipFileException":
    case "com.amazonaws.lambda#InvalidZipFileException":
      throw yield de_InvalidZipFileExceptionRes(parsedOutput, context);
    case "KMSAccessDeniedException":
    case "com.amazonaws.lambda#KMSAccessDeniedException":
      throw yield de_KMSAccessDeniedExceptionRes(parsedOutput, context);
    case "KMSDisabledException":
    case "com.amazonaws.lambda#KMSDisabledException":
      throw yield de_KMSDisabledExceptionRes(parsedOutput, context);
    case "KMSInvalidStateException":
    case "com.amazonaws.lambda#KMSInvalidStateException":
      throw yield de_KMSInvalidStateExceptionRes(parsedOutput, context);
    case "KMSNotFoundException":
    case "com.amazonaws.lambda#KMSNotFoundException":
      throw yield de_KMSNotFoundExceptionRes(parsedOutput, context);
    case "RecursiveInvocationException":
    case "com.amazonaws.lambda#RecursiveInvocationException":
      throw yield de_RecursiveInvocationExceptionRes(parsedOutput, context);
    case "RequestTooLargeException":
    case "com.amazonaws.lambda#RequestTooLargeException":
      throw yield de_RequestTooLargeExceptionRes(parsedOutput, context);
    case "ResourceNotReadyException":
    case "com.amazonaws.lambda#ResourceNotReadyException":
      throw yield de_ResourceNotReadyExceptionRes(parsedOutput, context);
    case "SnapStartException":
    case "com.amazonaws.lambda#SnapStartException":
      throw yield de_SnapStartExceptionRes(parsedOutput, context);
    case "SnapStartNotReadyException":
    case "com.amazonaws.lambda#SnapStartNotReadyException":
      throw yield de_SnapStartNotReadyExceptionRes(parsedOutput, context);
    case "SnapStartTimeoutException":
    case "com.amazonaws.lambda#SnapStartTimeoutException":
      throw yield de_SnapStartTimeoutExceptionRes(parsedOutput, context);
    case "SubnetIPAddressLimitReachedException":
    case "com.amazonaws.lambda#SubnetIPAddressLimitReachedException":
      throw yield de_SubnetIPAddressLimitReachedExceptionRes(parsedOutput, context);
    case "UnsupportedMediaTypeException":
    case "com.amazonaws.lambda#UnsupportedMediaTypeException":
      throw yield de_UnsupportedMediaTypeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody,
        errorCode
      });
  }
});
var throwDefaultError2 = withBaseException(LambdaServiceException);
var de_CodeSigningConfigNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeSigningConfigNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_CodeStorageExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeStorageExceededException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_CodeVerificationFailedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new CodeVerificationFailedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2AccessDeniedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2AccessDeniedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2ThrottledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2ThrottledException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EC2UnexpectedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    EC2ErrorCode: expectString,
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EC2UnexpectedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSIOExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSIOException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountConnectivityExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountConnectivityException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountFailureExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountFailureException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_EFSMountTimeoutExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new EFSMountTimeoutException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ENILimitReachedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ENILimitReachedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidCodeSignatureExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidCodeSignatureException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidParameterValueExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidParameterValueException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidRequestContentExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestContentException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidRuntimeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRuntimeException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidSecurityGroupIDExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidSecurityGroupIDException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidSubnetIDExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidSubnetIDException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvalidZipFileExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidZipFileException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSAccessDeniedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSAccessDeniedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSDisabledExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSDisabledException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSInvalidStateExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSInvalidStateException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_KMSNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new KMSNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_PolicyLengthExceededExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new PolicyLengthExceededException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_PreconditionFailedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new PreconditionFailedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ProvisionedConcurrencyConfigNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ProvisionedConcurrencyConfigNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_RecursiveInvocationExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new RecursiveInvocationException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_RequestTooLargeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new RequestTooLargeException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceConflictExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceConflictException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceInUseExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceInUseException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceNotFoundExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ResourceNotReadyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotReadyException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_ServiceExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new ServiceException2(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartNotReadyExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartNotReadyException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SnapStartTimeoutExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SnapStartTimeoutException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_SubnetIPAddressLimitReachedExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Message: expectString,
    Type: expectString
  });
  Object.assign(contents, doc);
  const exception = new SubnetIPAddressLimitReachedException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_TooManyRequestsExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({
    [_rAS]: [, parsedOutput.headers[_ra]]
  });
  const data = parsedOutput.body;
  const doc = take(data, {
    Reason: expectString,
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new TooManyRequestsException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_UnsupportedMediaTypeExceptionRes = (parsedOutput, context) => __async(void 0, null, function* () {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    Type: expectString,
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnsupportedMediaTypeException(__spreadValues({
    $metadata: deserializeMetadata2(parsedOutput)
  }, contents));
  return decorateServiceException(exception, parsedOutput.body);
});
var de_InvokeWithResponseStreamResponseEvent = (output, context) => {
  return context.eventStreamMarshaller.deserialize(output, (event) => __async(void 0, null, function* () {
    if (event["PayloadChunk"] != null) {
      return {
        PayloadChunk: yield de_InvokeResponseStreamUpdate_event(event["PayloadChunk"], context)
      };
    }
    if (event["InvokeComplete"] != null) {
      return {
        InvokeComplete: yield de_InvokeWithResponseStreamCompleteEvent_event(event["InvokeComplete"], context)
      };
    }
    return { $unknown: output };
  }));
};
var de_InvokeResponseStreamUpdate_event = (output, context) => __async(void 0, null, function* () {
  const contents = {};
  contents.Payload = output.body;
  return contents;
});
var de_InvokeWithResponseStreamCompleteEvent_event = (output, context) => __async(void 0, null, function* () {
  const contents = {};
  const data = yield parseJsonBody(output.body, context);
  Object.assign(contents, _json(data));
  return contents;
});
var se_AdditionalVersionWeights = (input, context) => {
  return Object.entries(input).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = serializeFloat(value);
    return acc;
  }, {});
};
var se_AliasRoutingConfiguration = (input, context) => {
  return take(input, {
    AdditionalVersionWeights: (_) => se_AdditionalVersionWeights(_, context)
  });
};
var se_FunctionCode = (input, context) => {
  return take(input, {
    ImageUri: [],
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: context.base64Encoder
  });
};
var se_LayerVersionContentInput = (input, context) => {
  return take(input, {
    S3Bucket: [],
    S3Key: [],
    S3ObjectVersion: [],
    ZipFile: context.base64Encoder
  });
};
var de_AdditionalVersionWeights = (output, context) => {
  return Object.entries(output).reduce((acc, [key, value]) => {
    if (value === null) {
      return acc;
    }
    acc[key] = limitedParseDouble(value);
    return acc;
  }, {});
};
var de_AliasConfiguration = (output, context) => {
  return take(output, {
    AliasArn: expectString,
    Description: expectString,
    FunctionVersion: expectString,
    Name: expectString,
    RevisionId: expectString,
    RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context)
  });
};
var de_AliasList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_AliasConfiguration(entry, context);
  });
  return retVal;
};
var de_AliasRoutingConfiguration = (output, context) => {
  return take(output, {
    AdditionalVersionWeights: (_) => de_AdditionalVersionWeights(_, context)
  });
};
var de_EventSourceMappingConfiguration = (output, context) => {
  return take(output, {
    AmazonManagedKafkaEventSourceConfig: _json,
    BatchSize: expectInt32,
    BisectBatchOnFunctionError: expectBoolean,
    DestinationConfig: _json,
    DocumentDBEventSourceConfig: _json,
    EventSourceArn: expectString,
    FilterCriteria: _json,
    FilterCriteriaError: _json,
    FunctionArn: expectString,
    FunctionResponseTypes: _json,
    KMSKeyArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    LastProcessingResult: expectString,
    MaximumBatchingWindowInSeconds: expectInt32,
    MaximumRecordAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32,
    ParallelizationFactor: expectInt32,
    Queues: _json,
    ScalingConfig: _json,
    SelfManagedEventSource: _json,
    SelfManagedKafkaEventSourceConfig: _json,
    SourceAccessConfigurations: _json,
    StartingPosition: expectString,
    StartingPositionTimestamp: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    State: expectString,
    StateTransitionReason: expectString,
    Topics: _json,
    TumblingWindowInSeconds: expectInt32,
    UUID: expectString
  });
};
var de_EventSourceMappingsList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_EventSourceMappingConfiguration(entry, context);
  });
  return retVal;
};
var de_FunctionEventInvokeConfig = (output, context) => {
  return take(output, {
    DestinationConfig: _json,
    FunctionArn: expectString,
    LastModified: (_) => expectNonNull(parseEpochTimestamp(expectNumber(_))),
    MaximumEventAgeInSeconds: expectInt32,
    MaximumRetryAttempts: expectInt32
  });
};
var de_FunctionEventInvokeConfigList = (output, context) => {
  const retVal = (output || []).filter((e2) => e2 != null).map((entry) => {
    return de_FunctionEventInvokeConfig(entry, context);
  });
  return retVal;
};
var deserializeMetadata2 = (output) => ({
  httpStatusCode: output.statusCode,
  requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
  extendedRequestId: output.headers["x-amz-id-2"],
  cfId: output.headers["x-amz-cf-id"]
});
var isSerializableHeaderValue = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var _A = "Arn";
var _CA = "CompatibleArchitecture";
var _CC = "ClientContext";
var _CR = "CompatibleRuntime";
var _ESA = "EventSourceArn";
var _EV = "ExecutedVersion";
var _FE = "FunctionError";
var _FN = "FunctionName";
var _FV = "FunctionVersion";
var _IT = "InvocationType";
var _L = "List";
var _LR = "LogResult";
var _LT = "LogType";
var _M = "Marker";
var _MI = "MaxItems";
var _MR = "MasterRegion";
var _Q = "Qualifier";
var _RI = "RevisionId";
var _RSCT = "ResponseStreamContentType";
var _TK = "TagKeys";
var _ct = "content-type";
var _f = "find";
var _rAS = "retryAfterSeconds";
var _ra = "retry-after";
var _tK = "tagKeys";
var _xacc = "x-amz-client-context";
var _xaev = "x-amz-executed-version";
var _xafe = "x-amz-function-error";
var _xait = "x-amz-invocation-type";
var _xalr = "x-amz-log-result";
var _xalt = "x-amz-log-type";

// node_modules/@aws-sdk/client-lambda/dist-es/commands/AddLayerVersionPermissionCommand.js
var AddLayerVersionPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "AddLayerVersionPermission", {}).n("LambdaClient", "AddLayerVersionPermissionCommand").f(void 0, void 0).ser(se_AddLayerVersionPermissionCommand).de(de_AddLayerVersionPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/AddPermissionCommand.js
var AddPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "AddPermission", {}).n("LambdaClient", "AddPermissionCommand").f(void 0, void 0).ser(se_AddPermissionCommand).de(de_AddPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateAliasCommand.js
var CreateAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateAlias", {}).n("LambdaClient", "CreateAliasCommand").f(void 0, void 0).ser(se_CreateAliasCommand).de(de_CreateAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateCodeSigningConfigCommand.js
var CreateCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateCodeSigningConfig", {}).n("LambdaClient", "CreateCodeSigningConfigCommand").f(void 0, void 0).ser(se_CreateCodeSigningConfigCommand).de(de_CreateCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateEventSourceMappingCommand.js
var CreateEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateEventSourceMapping", {}).n("LambdaClient", "CreateEventSourceMappingCommand").f(void 0, void 0).ser(se_CreateEventSourceMappingCommand).de(de_CreateEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateFunctionCommand.js
var CreateFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateFunction", {}).n("LambdaClient", "CreateFunctionCommand").f(CreateFunctionRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_CreateFunctionCommand).de(de_CreateFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/CreateFunctionUrlConfigCommand.js
var CreateFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "CreateFunctionUrlConfig", {}).n("LambdaClient", "CreateFunctionUrlConfigCommand").f(void 0, void 0).ser(se_CreateFunctionUrlConfigCommand).de(de_CreateFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteAliasCommand.js
var DeleteAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteAlias", {}).n("LambdaClient", "DeleteAliasCommand").f(void 0, void 0).ser(se_DeleteAliasCommand).de(de_DeleteAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteCodeSigningConfigCommand.js
var DeleteCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteCodeSigningConfig", {}).n("LambdaClient", "DeleteCodeSigningConfigCommand").f(void 0, void 0).ser(se_DeleteCodeSigningConfigCommand).de(de_DeleteCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteEventSourceMappingCommand.js
var DeleteEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteEventSourceMapping", {}).n("LambdaClient", "DeleteEventSourceMappingCommand").f(void 0, void 0).ser(se_DeleteEventSourceMappingCommand).de(de_DeleteEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionCodeSigningConfigCommand.js
var DeleteFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionCodeSigningConfig", {}).n("LambdaClient", "DeleteFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionCodeSigningConfigCommand).de(de_DeleteFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionCommand.js
var DeleteFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunction", {}).n("LambdaClient", "DeleteFunctionCommand").f(void 0, void 0).ser(se_DeleteFunctionCommand).de(de_DeleteFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionConcurrencyCommand.js
var DeleteFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionConcurrency", {}).n("LambdaClient", "DeleteFunctionConcurrencyCommand").f(void 0, void 0).ser(se_DeleteFunctionConcurrencyCommand).de(de_DeleteFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionEventInvokeConfigCommand.js
var DeleteFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionEventInvokeConfig", {}).n("LambdaClient", "DeleteFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionEventInvokeConfigCommand).de(de_DeleteFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteFunctionUrlConfigCommand.js
var DeleteFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteFunctionUrlConfig", {}).n("LambdaClient", "DeleteFunctionUrlConfigCommand").f(void 0, void 0).ser(se_DeleteFunctionUrlConfigCommand).de(de_DeleteFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteLayerVersionCommand.js
var DeleteLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteLayerVersion", {}).n("LambdaClient", "DeleteLayerVersionCommand").f(void 0, void 0).ser(se_DeleteLayerVersionCommand).de(de_DeleteLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/DeleteProvisionedConcurrencyConfigCommand.js
var DeleteProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "DeleteProvisionedConcurrencyConfig", {}).n("LambdaClient", "DeleteProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_DeleteProvisionedConcurrencyConfigCommand).de(de_DeleteProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetAccountSettingsCommand.js
var GetAccountSettingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetAccountSettings", {}).n("LambdaClient", "GetAccountSettingsCommand").f(void 0, void 0).ser(se_GetAccountSettingsCommand).de(de_GetAccountSettingsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetAliasCommand.js
var GetAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetAlias", {}).n("LambdaClient", "GetAliasCommand").f(void 0, void 0).ser(se_GetAliasCommand).de(de_GetAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetCodeSigningConfigCommand.js
var GetCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetCodeSigningConfig", {}).n("LambdaClient", "GetCodeSigningConfigCommand").f(void 0, void 0).ser(se_GetCodeSigningConfigCommand).de(de_GetCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetEventSourceMappingCommand.js
var GetEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetEventSourceMapping", {}).n("LambdaClient", "GetEventSourceMappingCommand").f(void 0, void 0).ser(se_GetEventSourceMappingCommand).de(de_GetEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionCodeSigningConfigCommand.js
var GetFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionCodeSigningConfig", {}).n("LambdaClient", "GetFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_GetFunctionCodeSigningConfigCommand).de(de_GetFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionCommand.js
var GetFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunction", {}).n("LambdaClient", "GetFunctionCommand").f(void 0, GetFunctionResponseFilterSensitiveLog).ser(se_GetFunctionCommand).de(de_GetFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionConcurrencyCommand.js
var GetFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionConcurrency", {}).n("LambdaClient", "GetFunctionConcurrencyCommand").f(void 0, void 0).ser(se_GetFunctionConcurrencyCommand).de(de_GetFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionConfigurationCommand.js
var GetFunctionConfigurationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionConfiguration", {}).n("LambdaClient", "GetFunctionConfigurationCommand").f(void 0, FunctionConfigurationFilterSensitiveLog).ser(se_GetFunctionConfigurationCommand).de(de_GetFunctionConfigurationCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionEventInvokeConfigCommand.js
var GetFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionEventInvokeConfig", {}).n("LambdaClient", "GetFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_GetFunctionEventInvokeConfigCommand).de(de_GetFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionRecursionConfigCommand.js
var GetFunctionRecursionConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionRecursionConfig", {}).n("LambdaClient", "GetFunctionRecursionConfigCommand").f(void 0, void 0).ser(se_GetFunctionRecursionConfigCommand).de(de_GetFunctionRecursionConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetFunctionUrlConfigCommand.js
var GetFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetFunctionUrlConfig", {}).n("LambdaClient", "GetFunctionUrlConfigCommand").f(void 0, void 0).ser(se_GetFunctionUrlConfigCommand).de(de_GetFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionByArnCommand.js
var GetLayerVersionByArnCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersionByArn", {}).n("LambdaClient", "GetLayerVersionByArnCommand").f(void 0, void 0).ser(se_GetLayerVersionByArnCommand).de(de_GetLayerVersionByArnCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionCommand.js
var GetLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersion", {}).n("LambdaClient", "GetLayerVersionCommand").f(void 0, void 0).ser(se_GetLayerVersionCommand).de(de_GetLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetLayerVersionPolicyCommand.js
var GetLayerVersionPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetLayerVersionPolicy", {}).n("LambdaClient", "GetLayerVersionPolicyCommand").f(void 0, void 0).ser(se_GetLayerVersionPolicyCommand).de(de_GetLayerVersionPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetPolicyCommand.js
var GetPolicyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetPolicy", {}).n("LambdaClient", "GetPolicyCommand").f(void 0, void 0).ser(se_GetPolicyCommand).de(de_GetPolicyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetProvisionedConcurrencyConfigCommand.js
var GetProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetProvisionedConcurrencyConfig", {}).n("LambdaClient", "GetProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_GetProvisionedConcurrencyConfigCommand).de(de_GetProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/GetRuntimeManagementConfigCommand.js
var GetRuntimeManagementConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "GetRuntimeManagementConfig", {}).n("LambdaClient", "GetRuntimeManagementConfigCommand").f(void 0, void 0).ser(se_GetRuntimeManagementConfigCommand).de(de_GetRuntimeManagementConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeAsyncCommand.js
var InvokeAsyncCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "InvokeAsync", {}).n("LambdaClient", "InvokeAsyncCommand").f(InvokeAsyncRequestFilterSensitiveLog, void 0).ser(se_InvokeAsyncCommand).de(de_InvokeAsyncCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeCommand.js
var InvokeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "Invoke", {}).n("LambdaClient", "InvokeCommand").f(InvocationRequestFilterSensitiveLog, InvocationResponseFilterSensitiveLog).ser(se_InvokeCommand).de(de_InvokeCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeWithResponseStreamCommand.js
var InvokeWithResponseStreamCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "InvokeWithResponseStream", {
  eventStream: {
    output: true
  }
}).n("LambdaClient", "InvokeWithResponseStreamCommand").f(InvokeWithResponseStreamRequestFilterSensitiveLog, InvokeWithResponseStreamResponseFilterSensitiveLog).ser(se_InvokeWithResponseStreamCommand).de(de_InvokeWithResponseStreamCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListAliasesCommand.js
var ListAliasesCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListAliases", {}).n("LambdaClient", "ListAliasesCommand").f(void 0, void 0).ser(se_ListAliasesCommand).de(de_ListAliasesCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListCodeSigningConfigsCommand.js
var ListCodeSigningConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListCodeSigningConfigs", {}).n("LambdaClient", "ListCodeSigningConfigsCommand").f(void 0, void 0).ser(se_ListCodeSigningConfigsCommand).de(de_ListCodeSigningConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListEventSourceMappingsCommand.js
var ListEventSourceMappingsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListEventSourceMappings", {}).n("LambdaClient", "ListEventSourceMappingsCommand").f(void 0, void 0).ser(se_ListEventSourceMappingsCommand).de(de_ListEventSourceMappingsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionEventInvokeConfigsCommand.js
var ListFunctionEventInvokeConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionEventInvokeConfigs", {}).n("LambdaClient", "ListFunctionEventInvokeConfigsCommand").f(void 0, void 0).ser(se_ListFunctionEventInvokeConfigsCommand).de(de_ListFunctionEventInvokeConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionsByCodeSigningConfigCommand.js
var ListFunctionsByCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionsByCodeSigningConfig", {}).n("LambdaClient", "ListFunctionsByCodeSigningConfigCommand").f(void 0, void 0).ser(se_ListFunctionsByCodeSigningConfigCommand).de(de_ListFunctionsByCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionsCommand.js
var ListFunctionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctions", {}).n("LambdaClient", "ListFunctionsCommand").f(void 0, ListFunctionsResponseFilterSensitiveLog).ser(se_ListFunctionsCommand).de(de_ListFunctionsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListFunctionUrlConfigsCommand.js
var ListFunctionUrlConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListFunctionUrlConfigs", {}).n("LambdaClient", "ListFunctionUrlConfigsCommand").f(void 0, void 0).ser(se_ListFunctionUrlConfigsCommand).de(de_ListFunctionUrlConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListLayersCommand.js
var ListLayersCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListLayers", {}).n("LambdaClient", "ListLayersCommand").f(void 0, void 0).ser(se_ListLayersCommand).de(de_ListLayersCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListLayerVersionsCommand.js
var ListLayerVersionsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListLayerVersions", {}).n("LambdaClient", "ListLayerVersionsCommand").f(void 0, void 0).ser(se_ListLayerVersionsCommand).de(de_ListLayerVersionsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListProvisionedConcurrencyConfigsCommand.js
var ListProvisionedConcurrencyConfigsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListProvisionedConcurrencyConfigs", {}).n("LambdaClient", "ListProvisionedConcurrencyConfigsCommand").f(void 0, void 0).ser(se_ListProvisionedConcurrencyConfigsCommand).de(de_ListProvisionedConcurrencyConfigsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListTagsCommand.js
var ListTagsCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListTags", {}).n("LambdaClient", "ListTagsCommand").f(void 0, void 0).ser(se_ListTagsCommand).de(de_ListTagsCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/ListVersionsByFunctionCommand.js
var ListVersionsByFunctionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "ListVersionsByFunction", {}).n("LambdaClient", "ListVersionsByFunctionCommand").f(void 0, ListVersionsByFunctionResponseFilterSensitiveLog).ser(se_ListVersionsByFunctionCommand).de(de_ListVersionsByFunctionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PublishLayerVersionCommand.js
var PublishLayerVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PublishLayerVersion", {}).n("LambdaClient", "PublishLayerVersionCommand").f(PublishLayerVersionRequestFilterSensitiveLog, void 0).ser(se_PublishLayerVersionCommand).de(de_PublishLayerVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PublishVersionCommand.js
var PublishVersionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PublishVersion", {}).n("LambdaClient", "PublishVersionCommand").f(void 0, FunctionConfigurationFilterSensitiveLog).ser(se_PublishVersionCommand).de(de_PublishVersionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionCodeSigningConfigCommand.js
var PutFunctionCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionCodeSigningConfig", {}).n("LambdaClient", "PutFunctionCodeSigningConfigCommand").f(void 0, void 0).ser(se_PutFunctionCodeSigningConfigCommand).de(de_PutFunctionCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionConcurrencyCommand.js
var PutFunctionConcurrencyCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionConcurrency", {}).n("LambdaClient", "PutFunctionConcurrencyCommand").f(void 0, void 0).ser(se_PutFunctionConcurrencyCommand).de(de_PutFunctionConcurrencyCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionEventInvokeConfigCommand.js
var PutFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionEventInvokeConfig", {}).n("LambdaClient", "PutFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_PutFunctionEventInvokeConfigCommand).de(de_PutFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutFunctionRecursionConfigCommand.js
var PutFunctionRecursionConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutFunctionRecursionConfig", {}).n("LambdaClient", "PutFunctionRecursionConfigCommand").f(void 0, void 0).ser(se_PutFunctionRecursionConfigCommand).de(de_PutFunctionRecursionConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutProvisionedConcurrencyConfigCommand.js
var PutProvisionedConcurrencyConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutProvisionedConcurrencyConfig", {}).n("LambdaClient", "PutProvisionedConcurrencyConfigCommand").f(void 0, void 0).ser(se_PutProvisionedConcurrencyConfigCommand).de(de_PutProvisionedConcurrencyConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/PutRuntimeManagementConfigCommand.js
var PutRuntimeManagementConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "PutRuntimeManagementConfig", {}).n("LambdaClient", "PutRuntimeManagementConfigCommand").f(void 0, void 0).ser(se_PutRuntimeManagementConfigCommand).de(de_PutRuntimeManagementConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/RemoveLayerVersionPermissionCommand.js
var RemoveLayerVersionPermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "RemoveLayerVersionPermission", {}).n("LambdaClient", "RemoveLayerVersionPermissionCommand").f(void 0, void 0).ser(se_RemoveLayerVersionPermissionCommand).de(de_RemoveLayerVersionPermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/RemovePermissionCommand.js
var RemovePermissionCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "RemovePermission", {}).n("LambdaClient", "RemovePermissionCommand").f(void 0, void 0).ser(se_RemovePermissionCommand).de(de_RemovePermissionCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/TagResourceCommand.js
var TagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "TagResource", {}).n("LambdaClient", "TagResourceCommand").f(void 0, void 0).ser(se_TagResourceCommand).de(de_TagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UntagResourceCommand.js
var UntagResourceCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UntagResource", {}).n("LambdaClient", "UntagResourceCommand").f(void 0, void 0).ser(se_UntagResourceCommand).de(de_UntagResourceCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateAliasCommand.js
var UpdateAliasCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateAlias", {}).n("LambdaClient", "UpdateAliasCommand").f(void 0, void 0).ser(se_UpdateAliasCommand).de(de_UpdateAliasCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateCodeSigningConfigCommand.js
var UpdateCodeSigningConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateCodeSigningConfig", {}).n("LambdaClient", "UpdateCodeSigningConfigCommand").f(void 0, void 0).ser(se_UpdateCodeSigningConfigCommand).de(de_UpdateCodeSigningConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateEventSourceMappingCommand.js
var UpdateEventSourceMappingCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateEventSourceMapping", {}).n("LambdaClient", "UpdateEventSourceMappingCommand").f(void 0, void 0).ser(se_UpdateEventSourceMappingCommand).de(de_UpdateEventSourceMappingCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionCodeCommand.js
var UpdateFunctionCodeCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionCode", {}).n("LambdaClient", "UpdateFunctionCodeCommand").f(UpdateFunctionCodeRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_UpdateFunctionCodeCommand).de(de_UpdateFunctionCodeCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionConfigurationCommand.js
var UpdateFunctionConfigurationCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionConfiguration", {}).n("LambdaClient", "UpdateFunctionConfigurationCommand").f(UpdateFunctionConfigurationRequestFilterSensitiveLog, FunctionConfigurationFilterSensitiveLog).ser(se_UpdateFunctionConfigurationCommand).de(de_UpdateFunctionConfigurationCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionEventInvokeConfigCommand.js
var UpdateFunctionEventInvokeConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionEventInvokeConfig", {}).n("LambdaClient", "UpdateFunctionEventInvokeConfigCommand").f(void 0, void 0).ser(se_UpdateFunctionEventInvokeConfigCommand).de(de_UpdateFunctionEventInvokeConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/commands/UpdateFunctionUrlConfigCommand.js
var UpdateFunctionUrlConfigCommand = class extends Command.classBuilder().ep(__spreadValues({}, commonParams)).m(function(Command2, cs, config, o2) {
  return [
    getSerdePlugin(config, this.serialize, this.deserialize),
    getEndpointPlugin(config, Command2.getEndpointParameterInstructions())
  ];
}).s("AWSGirApiService", "UpdateFunctionUrlConfig", {}).n("LambdaClient", "UpdateFunctionUrlConfigCommand").f(void 0, void 0).ser(se_UpdateFunctionUrlConfigCommand).de(de_UpdateFunctionUrlConfigCommand).build() {
};

// node_modules/@aws-sdk/client-lambda/dist-es/Lambda.js
var commands = {
  AddLayerVersionPermissionCommand,
  AddPermissionCommand,
  CreateAliasCommand,
  CreateCodeSigningConfigCommand,
  CreateEventSourceMappingCommand,
  CreateFunctionCommand,
  CreateFunctionUrlConfigCommand,
  DeleteAliasCommand,
  DeleteCodeSigningConfigCommand,
  DeleteEventSourceMappingCommand,
  DeleteFunctionCommand,
  DeleteFunctionCodeSigningConfigCommand,
  DeleteFunctionConcurrencyCommand,
  DeleteFunctionEventInvokeConfigCommand,
  DeleteFunctionUrlConfigCommand,
  DeleteLayerVersionCommand,
  DeleteProvisionedConcurrencyConfigCommand,
  GetAccountSettingsCommand,
  GetAliasCommand,
  GetCodeSigningConfigCommand,
  GetEventSourceMappingCommand,
  GetFunctionCommand,
  GetFunctionCodeSigningConfigCommand,
  GetFunctionConcurrencyCommand,
  GetFunctionConfigurationCommand,
  GetFunctionEventInvokeConfigCommand,
  GetFunctionRecursionConfigCommand,
  GetFunctionUrlConfigCommand,
  GetLayerVersionCommand,
  GetLayerVersionByArnCommand,
  GetLayerVersionPolicyCommand,
  GetPolicyCommand,
  GetProvisionedConcurrencyConfigCommand,
  GetRuntimeManagementConfigCommand,
  InvokeCommand,
  InvokeAsyncCommand,
  InvokeWithResponseStreamCommand,
  ListAliasesCommand,
  ListCodeSigningConfigsCommand,
  ListEventSourceMappingsCommand,
  ListFunctionEventInvokeConfigsCommand,
  ListFunctionsCommand,
  ListFunctionsByCodeSigningConfigCommand,
  ListFunctionUrlConfigsCommand,
  ListLayersCommand,
  ListLayerVersionsCommand,
  ListProvisionedConcurrencyConfigsCommand,
  ListTagsCommand,
  ListVersionsByFunctionCommand,
  PublishLayerVersionCommand,
  PublishVersionCommand,
  PutFunctionCodeSigningConfigCommand,
  PutFunctionConcurrencyCommand,
  PutFunctionEventInvokeConfigCommand,
  PutFunctionRecursionConfigCommand,
  PutProvisionedConcurrencyConfigCommand,
  PutRuntimeManagementConfigCommand,
  RemoveLayerVersionPermissionCommand,
  RemovePermissionCommand,
  TagResourceCommand,
  UntagResourceCommand,
  UpdateAliasCommand,
  UpdateCodeSigningConfigCommand,
  UpdateEventSourceMappingCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionEventInvokeConfigCommand,
  UpdateFunctionUrlConfigCommand
};
var Lambda = class extends LambdaClient {
};
createAggregatedClient(commands, Lambda);

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListAliasesPaginator.js
var paginateListAliases = createPaginator(LambdaClient, ListAliasesCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListCodeSigningConfigsPaginator.js
var paginateListCodeSigningConfigs = createPaginator(LambdaClient, ListCodeSigningConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListEventSourceMappingsPaginator.js
var paginateListEventSourceMappings = createPaginator(LambdaClient, ListEventSourceMappingsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionEventInvokeConfigsPaginator.js
var paginateListFunctionEventInvokeConfigs = createPaginator(LambdaClient, ListFunctionEventInvokeConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionUrlConfigsPaginator.js
var paginateListFunctionUrlConfigs = createPaginator(LambdaClient, ListFunctionUrlConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionsByCodeSigningConfigPaginator.js
var paginateListFunctionsByCodeSigningConfig = createPaginator(LambdaClient, ListFunctionsByCodeSigningConfigCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListFunctionsPaginator.js
var paginateListFunctions = createPaginator(LambdaClient, ListFunctionsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListLayerVersionsPaginator.js
var paginateListLayerVersions = createPaginator(LambdaClient, ListLayerVersionsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListLayersPaginator.js
var paginateListLayers = createPaginator(LambdaClient, ListLayersCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListProvisionedConcurrencyConfigsPaginator.js
var paginateListProvisionedConcurrencyConfigs = createPaginator(LambdaClient, ListProvisionedConcurrencyConfigsCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@aws-sdk/client-lambda/dist-es/pagination/ListVersionsByFunctionPaginator.js
var paginateListVersionsByFunction = createPaginator(LambdaClient, ListVersionsByFunctionCommand, "Marker", "NextMarker", "MaxItems");

// node_modules/@smithy/util-waiter/dist-es/utils/sleep.js
var sleep = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
};

// node_modules/@smithy/util-waiter/dist-es/waiter.js
var waiterServiceDefaults = {
  minDelay: 2,
  maxDelay: 120
};
var WaiterState;
(function(WaiterState2) {
  WaiterState2["ABORTED"] = "ABORTED";
  WaiterState2["FAILURE"] = "FAILURE";
  WaiterState2["SUCCESS"] = "SUCCESS";
  WaiterState2["RETRY"] = "RETRY";
  WaiterState2["TIMEOUT"] = "TIMEOUT";
})(WaiterState || (WaiterState = {}));
var checkExceptions = (result) => {
  if (result.state === WaiterState.ABORTED) {
    const abortError = new Error(`${JSON.stringify(__spreadProps(__spreadValues({}, result), {
      reason: "Request was aborted"
    }))}`);
    abortError.name = "AbortError";
    throw abortError;
  } else if (result.state === WaiterState.TIMEOUT) {
    const timeoutError = new Error(`${JSON.stringify(__spreadProps(__spreadValues({}, result), {
      reason: "Waiter has timed out"
    }))}`);
    timeoutError.name = "TimeoutError";
    throw timeoutError;
  } else if (result.state !== WaiterState.SUCCESS) {
    throw new Error(`${JSON.stringify(result)}`);
  }
  return result;
};

// node_modules/@smithy/util-waiter/dist-es/poller.js
var exponentialBackoffWithJitter = (minDelay, maxDelay, attemptCeiling, attempt) => {
  if (attempt > attemptCeiling)
    return maxDelay;
  const delay = minDelay * 2 ** (attempt - 1);
  return randomInRange(minDelay, delay);
};
var randomInRange = (min, max) => min + Math.random() * (max - min);
var runPolling = (_0, _1, _2) => __async(void 0, [_0, _1, _2], function* ({ minDelay, maxDelay, maxWaitTime, abortController, client, abortSignal }, input, acceptorChecks) {
  const { state, reason } = yield acceptorChecks(client, input);
  if (state !== WaiterState.RETRY) {
    return { state, reason };
  }
  let currentAttempt = 1;
  const waitUntil = Date.now() + maxWaitTime * 1e3;
  const attemptCeiling = Math.log(maxDelay / minDelay) / Math.log(2) + 1;
  while (true) {
    if (abortController?.signal?.aborted || abortSignal?.aborted) {
      return { state: WaiterState.ABORTED };
    }
    const delay = exponentialBackoffWithJitter(minDelay, maxDelay, attemptCeiling, currentAttempt);
    if (Date.now() + delay * 1e3 > waitUntil) {
      return { state: WaiterState.TIMEOUT };
    }
    yield sleep(delay);
    const { state: state2, reason: reason2 } = yield acceptorChecks(client, input);
    if (state2 !== WaiterState.RETRY) {
      return { state: state2, reason: reason2 };
    }
    currentAttempt += 1;
  }
});

// node_modules/@smithy/util-waiter/dist-es/utils/validate.js
var validateWaiterOptions = (options) => {
  if (options.maxWaitTime < 1) {
    throw new Error(`WaiterConfiguration.maxWaitTime must be greater than 0`);
  } else if (options.minDelay < 1) {
    throw new Error(`WaiterConfiguration.minDelay must be greater than 0`);
  } else if (options.maxDelay < 1) {
    throw new Error(`WaiterConfiguration.maxDelay must be greater than 0`);
  } else if (options.maxWaitTime <= options.minDelay) {
    throw new Error(`WaiterConfiguration.maxWaitTime [${options.maxWaitTime}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
  } else if (options.maxDelay < options.minDelay) {
    throw new Error(`WaiterConfiguration.maxDelay [${options.maxDelay}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
  }
};

// node_modules/@smithy/util-waiter/dist-es/createWaiter.js
var abortTimeout = (abortSignal) => __async(void 0, null, function* () {
  return new Promise((resolve) => {
    const onAbort = () => resolve({ state: WaiterState.ABORTED });
    if (typeof abortSignal.addEventListener === "function") {
      abortSignal.addEventListener("abort", onAbort);
    } else {
      abortSignal.onabort = onAbort;
    }
  });
});
var createWaiter = (options, input, acceptorChecks) => __async(void 0, null, function* () {
  const params = __spreadValues(__spreadValues({}, waiterServiceDefaults), options);
  validateWaiterOptions(params);
  const exitConditions = [runPolling(params, input, acceptorChecks)];
  if (options.abortController) {
    exitConditions.push(abortTimeout(options.abortController.signal));
  }
  if (options.abortSignal) {
    exitConditions.push(abortTimeout(options.abortSignal));
  }
  return Promise.race(exitConditions);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionActive.js
var checkState = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
});
var waitUntilFunctionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionActiveV2.js
var checkState2 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionActiveV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
});
var waitUntilFunctionActiveV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState2);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionExists.js
var checkState3 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    return { state: WaiterState.SUCCESS, reason };
  } catch (exception) {
    reason = exception;
    if (exception.name && exception.name == "ResourceNotFoundException") {
      return { state: WaiterState.RETRY, reason };
    }
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState3);
});
var waitUntilFunctionExists = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState3);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionUpdated.js
var checkState4 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "Successful") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.LastUpdateStatus;
      };
      if (returnComparator() === "InProgress") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionUpdated = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState4);
});
var waitUntilFunctionUpdated = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState4);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForFunctionUpdatedV2.js
var checkState5 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "Successful") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.Configuration.LastUpdateStatus;
      };
      if (returnComparator() === "InProgress") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForFunctionUpdatedV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState5);
});
var waitUntilFunctionUpdatedV2 = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 1, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState5);
  return checkExceptions(result);
});

// node_modules/@aws-sdk/client-lambda/dist-es/waiters/waitForPublishedVersionActive.js
var checkState6 = (client, input) => __async(void 0, null, function* () {
  let reason;
  try {
    const result = yield client.send(new GetFunctionConfigurationCommand(input));
    reason = result;
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Active") {
        return { state: WaiterState.SUCCESS, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Failed") {
        return { state: WaiterState.FAILURE, reason };
      }
    } catch (e2) {
    }
    try {
      const returnComparator = () => {
        return result.State;
      };
      if (returnComparator() === "Pending") {
        return { state: WaiterState.RETRY, reason };
      }
    } catch (e2) {
    }
  } catch (exception) {
    reason = exception;
  }
  return { state: WaiterState.RETRY, reason };
});
var waitForPublishedVersionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  return createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState6);
});
var waitUntilPublishedVersionActive = (params, input) => __async(void 0, null, function* () {
  const serviceDefaults = { minDelay: 5, maxDelay: 120 };
  const result = yield createWaiter(__spreadValues(__spreadValues({}, serviceDefaults), params), input, checkState6);
  return checkExceptions(result);
});
export {
  Command as $Command,
  AddLayerVersionPermissionCommand,
  AddPermissionCommand,
  ApplicationLogLevel,
  Architecture,
  CodeSigningConfigNotFoundException,
  CodeSigningPolicy,
  CodeStorageExceededException,
  CodeVerificationFailedException,
  CreateAliasCommand,
  CreateCodeSigningConfigCommand,
  CreateEventSourceMappingCommand,
  CreateFunctionCommand,
  CreateFunctionRequestFilterSensitiveLog,
  CreateFunctionUrlConfigCommand,
  DeleteAliasCommand,
  DeleteCodeSigningConfigCommand,
  DeleteEventSourceMappingCommand,
  DeleteFunctionCodeSigningConfigCommand,
  DeleteFunctionCommand,
  DeleteFunctionConcurrencyCommand,
  DeleteFunctionEventInvokeConfigCommand,
  DeleteFunctionUrlConfigCommand,
  DeleteLayerVersionCommand,
  DeleteProvisionedConcurrencyConfigCommand,
  EC2AccessDeniedException,
  EC2ThrottledException,
  EC2UnexpectedException,
  EFSIOException,
  EFSMountConnectivityException,
  EFSMountFailureException,
  EFSMountTimeoutException,
  ENILimitReachedException,
  EndPointType,
  EnvironmentErrorFilterSensitiveLog,
  EnvironmentFilterSensitiveLog,
  EnvironmentResponseFilterSensitiveLog,
  EventSourcePosition,
  FullDocument,
  FunctionCodeFilterSensitiveLog,
  FunctionConfigurationFilterSensitiveLog,
  FunctionResponseType,
  FunctionUrlAuthType,
  FunctionVersion,
  GetAccountSettingsCommand,
  GetAliasCommand,
  GetCodeSigningConfigCommand,
  GetEventSourceMappingCommand,
  GetFunctionCodeSigningConfigCommand,
  GetFunctionCommand,
  GetFunctionConcurrencyCommand,
  GetFunctionConfigurationCommand,
  GetFunctionEventInvokeConfigCommand,
  GetFunctionRecursionConfigCommand,
  GetFunctionResponseFilterSensitiveLog,
  GetFunctionUrlConfigCommand,
  GetLayerVersionByArnCommand,
  GetLayerVersionCommand,
  GetLayerVersionPolicyCommand,
  GetPolicyCommand,
  GetProvisionedConcurrencyConfigCommand,
  GetRuntimeManagementConfigCommand,
  ImageConfigErrorFilterSensitiveLog,
  ImageConfigResponseFilterSensitiveLog,
  InvalidCodeSignatureException,
  InvalidParameterValueException,
  InvalidRequestContentException,
  InvalidRuntimeException,
  InvalidSecurityGroupIDException,
  InvalidSubnetIDException,
  InvalidZipFileException,
  InvocationRequestFilterSensitiveLog,
  InvocationResponseFilterSensitiveLog,
  InvocationType,
  InvokeAsyncCommand,
  InvokeAsyncRequestFilterSensitiveLog,
  InvokeCommand,
  InvokeMode,
  InvokeResponseStreamUpdateFilterSensitiveLog,
  InvokeWithResponseStreamCommand,
  InvokeWithResponseStreamRequestFilterSensitiveLog,
  InvokeWithResponseStreamResponseEvent,
  InvokeWithResponseStreamResponseEventFilterSensitiveLog,
  InvokeWithResponseStreamResponseFilterSensitiveLog,
  KMSAccessDeniedException,
  KMSDisabledException,
  KMSInvalidStateException,
  KMSNotFoundException,
  Lambda,
  LambdaClient,
  LambdaServiceException,
  LastUpdateStatus,
  LastUpdateStatusReasonCode,
  LayerVersionContentInputFilterSensitiveLog,
  ListAliasesCommand,
  ListCodeSigningConfigsCommand,
  ListEventSourceMappingsCommand,
  ListFunctionEventInvokeConfigsCommand,
  ListFunctionUrlConfigsCommand,
  ListFunctionsByCodeSigningConfigCommand,
  ListFunctionsCommand,
  ListFunctionsResponseFilterSensitiveLog,
  ListLayerVersionsCommand,
  ListLayersCommand,
  ListProvisionedConcurrencyConfigsCommand,
  ListTagsCommand,
  ListVersionsByFunctionCommand,
  ListVersionsByFunctionResponseFilterSensitiveLog,
  LogFormat,
  LogType,
  PackageType,
  PolicyLengthExceededException,
  PreconditionFailedException,
  ProvisionedConcurrencyConfigNotFoundException,
  ProvisionedConcurrencyStatusEnum,
  PublishLayerVersionCommand,
  PublishLayerVersionRequestFilterSensitiveLog,
  PublishVersionCommand,
  PutFunctionCodeSigningConfigCommand,
  PutFunctionConcurrencyCommand,
  PutFunctionEventInvokeConfigCommand,
  PutFunctionRecursionConfigCommand,
  PutProvisionedConcurrencyConfigCommand,
  PutRuntimeManagementConfigCommand,
  RecursiveInvocationException,
  RecursiveLoop,
  RemoveLayerVersionPermissionCommand,
  RemovePermissionCommand,
  RequestTooLargeException,
  ResourceConflictException,
  ResourceInUseException,
  ResourceNotFoundException,
  ResourceNotReadyException,
  ResponseStreamingInvocationType,
  Runtime,
  RuntimeVersionConfigFilterSensitiveLog,
  RuntimeVersionErrorFilterSensitiveLog,
  ServiceException2 as ServiceException,
  SnapStartApplyOn,
  SnapStartException,
  SnapStartNotReadyException,
  SnapStartOptimizationStatus,
  SnapStartTimeoutException,
  SourceAccessType,
  State,
  StateReasonCode,
  SubnetIPAddressLimitReachedException,
  SystemLogLevel,
  TagResourceCommand,
  ThrottleReason,
  TooManyRequestsException,
  TracingMode,
  UnsupportedMediaTypeException,
  UntagResourceCommand,
  UpdateAliasCommand,
  UpdateCodeSigningConfigCommand,
  UpdateEventSourceMappingCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionCodeRequestFilterSensitiveLog,
  UpdateFunctionConfigurationCommand,
  UpdateFunctionConfigurationRequestFilterSensitiveLog,
  UpdateFunctionEventInvokeConfigCommand,
  UpdateFunctionUrlConfigCommand,
  UpdateRuntimeOn,
  Client as __Client,
  paginateListAliases,
  paginateListCodeSigningConfigs,
  paginateListEventSourceMappings,
  paginateListFunctionEventInvokeConfigs,
  paginateListFunctionUrlConfigs,
  paginateListFunctions,
  paginateListFunctionsByCodeSigningConfig,
  paginateListLayerVersions,
  paginateListLayers,
  paginateListProvisionedConcurrencyConfigs,
  paginateListVersionsByFunction,
  waitForFunctionActive,
  waitForFunctionActiveV2,
  waitForFunctionExists,
  waitForFunctionUpdated,
  waitForFunctionUpdatedV2,
  waitForPublishedVersionActive,
  waitUntilFunctionActive,
  waitUntilFunctionActiveV2,
  waitUntilFunctionExists,
  waitUntilFunctionUpdated,
  waitUntilFunctionUpdatedV2,
  waitUntilPublishedVersionActive
};
/*! Bundled license information:

bowser/src/bowser.js:
  (*!
   * Bowser - a browser detector
   * https://github.com/lancedikson/bowser
   * MIT License | (c) Dustin Diaz 2012-2015
   * MIT License | (c) Denis Demchenko 2015-2019
   *)
*/
//# sourceMappingURL=@aws-sdk_client-lambda.js.map
