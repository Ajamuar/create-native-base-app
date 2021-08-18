const fs = require("fs-extra");

const createExpoMainFile = (screens, ext) => {
  let expoMainFileTemplate = `
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider } from "native-base";
import StarterIntro from "./screens/StarterIntro";
/* Add Screen imports here */

const Drawer = createDrawerNavigator();

export default function App() {
\treturn (
\t\t<NativeBaseProvider>
\t\t\t<NavigationContainer>
\t\t\t\t<Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
\t\t\t\t\t<Drawer.Screen name={"Starter intro"} component={StarterIntro} />
{/* Add Screen components to Drawer here */}
\t\t\t\t</Drawer.Navigator>
\t\t\t</NavigationContainer>
\t\t</NativeBaseProvider>
\t);
}
`;

  let importScreenString = "";
  let componentDeclarationString = "";

  screens.forEach((screen) => {
    importScreenString += `import ${screen.name} from \"./screens/${screen.name}\"\n`;
    componentDeclarationString += `\t\t\t\t\t<Drawer.Screen name={"${screen.name}"} component={${screen.name}} />\n`;
  });

  expoMainFileTemplate = expoMainFileTemplate.replace(
    "/* Add Screen imports here */",
    importScreenString
  );
  expoMainFileTemplate = expoMainFileTemplate.replace(
    "{/* Add Screen components to Drawer here */}",
    componentDeclarationString
  );

  fs.writeFileSync(
    process.cwd() + "/expo-starter/App." + ext,
    expoMainFileTemplate
  );
};

const createMainFile = (screens) => {
  const env = "expo";
  const ext = "js";

  switch (env) {
    case "expo":
      createExpoMainFile(screens, ext);
  }
};

module.exports.createMainFile = createMainFile;
