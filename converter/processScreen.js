// const babelParser = require("@babel/parser");
// const traverse = require("babel-traverse").default;
// const t = require("babel-types");
const fs = require("fs-extra");
const tempFolderPath = __dirname + "/../screenshot/temp";

// const isImportDeclaration = (path) =>
//   t.isImportDeclaration(path.node) ||
//   t.isImportSpecifier(path.parent) ||
//   t.isImportDeclaration(path.parent) ||
//   t.isImportSpecifier(path.parent) ||
//   t.isImportDefaultSpecifier(path.parent);

module.exports = function processScreen(
    storybookScreens,
    screenObject,
    isComponent
) {
    function replacerFunction(matchedString, groupMatchString) {
        // console.log(matchedString, "**********", groupMatchString, "matchedString, groupMatchString &*&*");

        let componentName = groupMatchString.replace("../../components/", "");

        // const isComponent = componentName === groupMatchString;
        if (isComponent) {
            // ../../components will work for screens, do this for components
            componentName = groupMatchString.replace("./", "");
        }

        const existingComponent = storybookScreens.components.find(
            c => c.name === componentName
        );

        if (!existingComponent) {
            const code = fs.readFileSync(
                tempFolderPath +
                    "/storybook/storybook/storybook/stories/components/" +
                    componentName +
                    ".tsx",
                "utf-8"
            );
            const componentObject = {
                name: componentName,
                code: code,
                dependencies: []
            };
            processScreen(storybookScreens, componentObject, true);
            storybookScreens.components.push(componentObject);
        }

        screenObject.dependencies.push({
            type: "component",
            name: componentName
        });

        return matchedString.replace(
            groupMatchString,
            isComponent
                ? groupMatchString
                : groupMatchString.replace("../../", "../")
        );
    }

    if (isComponent) {
        // console.log(screenObject, "screenObject &*&*");
        const regExp = /^import.*(\.\/.*?)['|"].*$/gm;

        screenObject.code = screenObject.code.replace(regExp, replacerFunction);
    } else {
        const regExp = /^import.*'(\..*\/components\/.*?)['|"].*$/gm;

        const originalCode = screenObject.code;
        screenObject.code = screenObject.code.replace(regExp, replacerFunction);
    }

    return;

    // const ast = babelParser.parse(code, {
    //   sourceType: "module",
    //   plugins: ["jsx", "typescript"],
    // });

    // traverse(ast, {
    //   enter(path) {
    //     if (!isImportDeclaration(path)) {
    //       // console.log("%c &*& path", "color: #10b981;", path);
    //     }
    //   },
    //   // ImportDeclaration(path) {
    //   //   lastImport = path;
    //   // }
    // });

    // // console.log("%c &*& ast", "color: #10b981;");
    // return code;
};
