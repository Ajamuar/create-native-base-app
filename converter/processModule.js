const babelParser = require("@babel/parser");
const fs = require("fs-extra");

function getScreenArrayFromCallExpression(object) {
  let screenNames = [];

  if (object.arguments) {
    let screenLiterals = object.arguments.filter(
      (arg) => arg.type === "StringLiteral"
    );

    screenLiterals.forEach(
      (screenLiteral) => (screenNames = [...screenNames, screenLiteral.value])
    );
  }

  if (object.callee && object.callee.object)
    screenNames = [
      ...screenNames,
      ...getScreenArrayFromCallExpression(object.callee.object),
    ];

  return screenNames;
}

module.exports = function (path) {
  const content = fs.readFileSync(path + "/index.tsx", "utf-8");

  const ast = babelParser.parse(content, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const expression = ast.program.body.filter(
    (child) => child.type === "ExpressionStatement"
  );

  let storybookExpression = expression[0];

  let screenNames = getScreenArrayFromCallExpression(
    storybookExpression.expression
  );

  let importDeclarations = ast.program.body.filter(
    (child) => child.type === "ImportDeclaration"
  );

  let customImports = importDeclarations.filter((declaration) => {
    if (!declaration.specifiers) return false;

    let localDeclarations = declaration.specifiers.filter(
      (specifier) =>
        specifier.local && screenNames.includes(specifier.local.name)
    );

    if (localDeclarations.length > 0) return true;

    return false;
  });

  let screenMap = {};
  customImports.forEach((customImport) => {
    if (customImport.source.value) {
      const screenFileName = customImport.source.value.replace("./", "");
      screenMap[screenFileName] = customImport.source.value;
    }
  });

  return screenMap;
};
