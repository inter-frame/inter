/**
 * globalconfig.json options.
 *
 *  {
 *  files: [],
 *  dir: "./core",
 * }
 *
 *
 *
 */

function getConfig() {
  const resultObject = {
    hasFile: false,
    file: void 0,
  };

  try {
    resultObject.file = JSON.parse(fs.readFileSync("./globalconfig.json"));
    resultObject.hasFile = true;
  } catch (e) {
    /*No globalconfig.json*/
  }

  return resultObject;
}

function removeExportDeclaration(string) {
  const result = string.replace(/export/g, "");

  return result;
}

const fs = require("fs");
const config = getConfig();

if (!config.hasFile) throw new Error("No `globalconfig.json` file found");

function build() {
  const { files, dir } = config.file;
  let body = "";

  for (const file of files) {
    const fileString = fs.readFileSync(dir ? `${dir}/${file}` : file);
    body += fileString;
  }

  body = `
  
/**
 * Interjs 
 * Version - 
 * MIT LICENSED BY - Denis Power
 * Repo - https://github.com/interjs/inter
 * 2021- 
 * GENERATED BY INTER GLOBAL BUILDER
 * 
 */

  (function () {

    ${removeExportDeclaration(body)};
	  
  window.Ref = Ref;
  window.renderIf = renderIf;
  window.renderList = renderList;
  window.template = template;
  window.toAttrs = toAttrs;
  window.Backend = Backend;
  console.log("The global version of Inter was loaded successfully.")

  })();
  
`;
  fs.writeFileSync("inter.js", body);
}

build();
