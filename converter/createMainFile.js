const fs = require("fs-extra");

const updateDrawerScreenTemplate = (screens = [], mainFileTemplate, ext) => {
  let importScreenString = "";
  let componentDeclarationString = "";

  screens.forEach((screen) => {
    importScreenString += `import ${screen.name} from \"./screens/${screen.name}\"\n`;
    componentDeclarationString += `\t\t\t\t\t<Drawer.Screen name={"${screen.name}"} component={${screen.name}} />\n`;
  });

  mainFileTemplate = mainFileTemplate.replace(
    "/* Add Screen imports here */",
    importScreenString
  );
  mainFileTemplate = mainFileTemplate.replace(
    "{/* Add Screen components to Drawer here */}",
    componentDeclarationString
  );

  fs.writeFileSync(
    process.cwd() + "/native-base-starter/App." + ext + "x",
    mainFileTemplate
  );
};

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
\t\t\t\t<Drawer.Navigator screenOptions={{ headerShown: false }}>
\t\t\t\t\t<Drawer.Screen name={"Starter intro"} component={StarterIntro} />
{/* Add Screen components to Drawer here */}
\t\t\t\t</Drawer.Navigator>
\t\t\t</NavigationContainer>
\t\t</NativeBaseProvider>
\t);
}
`;

  updateDrawerScreenTemplate(screens, expoMainFileTemplate, ext);
};

const createCrnaMainFile = (screens, ext) => {
  let crnaMainFileTemplate = `
import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import StarterIntro from './screens/StarterIntro';
/* Add Screen imports here */

const Drawer = createDrawerNavigator();

export default function App() {
\treturn (
\t\t<NativeBaseProvider>
\t\t\t<NavigationContainer>
\t\t\t\t<Drawer.Navigator screenOptions={{ headerShown: false }}>
\t\t\t\t\t<Drawer.Screen name={"Starter intro"} component={StarterIntro} />
{/* Add Screen components to Drawer here */}
\t\t\t\t</Drawer.Navigator>
\t\t\t</NavigationContainer>
\t\t</NativeBaseProvider>
\t);
}
  `;

  updateDrawerScreenTemplate(screens, crnaMainFileTemplate, ext);
};

const createMainFile = (screens, template = "expo", extension = "js") => {
  switch (template) {
    case "expo":
      createExpoMainFile(screens, extension);
      break;
    case "crna":
      createCrnaMainFile(screens, extension);
      break;
    case "next":
      break;
  }
};

module.exports.createMainFile = createMainFile;
