#!/usr/bin/env node

"use strict";

const program = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const { execSync } = require('child_process');

program.version("0.1.1").parse(process.argv);

const cardName = path.basename(process.cwd());


const questions = [
  {
    type: "input",
    name: "name",
    message: "Card name:",
    default: cardName,
    validate: (input) => {
      return input.length > 1 && /^[a-z]+\-[a-z\-]+[a-z]$/.test(input);
    },
  }, {
    type: "input",
    name: "description",
    message: "Description:",
    default: ''
  }
];

function capitalize(value) {
  let result = '';
  let caps = true;
  for (let i = 0; i < value.length; i++) {
    if (value.charAt(i) === '-') {
      caps = true;
    } else if (caps) {
      result += value.charAt(i).toUpperCase();
      caps = false;
    } else {
      result += value.charAt(i);
      caps = false;
    }
  }
  return result;
}

inquirer.prompt(questions).then((answers) => {
  const cardName = answers.name;
  fs.writeFileSync('polymer.json', JSON.stringify({ "lint": { "rules": ["polymer-2"] } }, null, 2));
  fs.writeFileSync('index.html', "<!doctype html>\n<html>\n  <head>\n    <meta charset='utf- 8'>\n    <meta http-equiv='refresh' content='0;url=demo/' />\n    <title>card-sample-shared-toggle</title>\n  </head>\n  <body>\n    <!--\n        ELEMENT API DOCUMENTATION SUPPORT COMING SOON\n        Visit demo/index.html to see live examples of your element running.\n        This page will automatically redirect you there when run in the browser\n        with `polymer serve`.\n      -->\n  </body>\n</html>\n");
  const channelsComponent = {
    composerTag: cardName + '-composer',
    viewerTag: cardName + '-viewer',
  };
  fs.writeFileSync('channels-component.json', JSON.stringify(channelsComponent, null, 2));
  const bower = {
    "name": cardName,
    "description": answers[1],
    "main": cardName + ".html",
    "dependencies": {
      "polymer": "Polymer/polymer#^2.0.0",
      "paper-button": "PolymerElements/paper-button#^2.0.0",
      "polymer-channels-card": "^0.1.2"
    },
    "devDependencies": {
      "iron-demo-helpers": "PolymerElements/iron-demo-helpers#^2.0.0",
      "web-component-tester": "Polymer/web-component-tester#^6.0.0",
      "webcomponentsjs": "webcomponents/webcomponentsjs#^1.0.0"
    },
    "resolutions": {
      "polymer": "^2.0.0"
    },
    "ignore": [
      "**/.*",
      "node_modules",
      "bower_components",
      "test",
      "demo"
    ]
  };
  fs.writeFileSync('bower.json', JSON.stringify(bower, null, 2));
  fs.writeFileSync('.gitignore', "bower_components\n");
  const demoIndexContent = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
    <title>${cardName} demo</title>
    <script src="../../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../../polymer-channels-card/channels-card-demo-helper.html">
    <link rel="import" href="../../iron-demo-helpers/demo-pages-shared-styles.html">
    <link rel="import" href="../${cardName}.html">
    <custom-style>
      <style is="custom-style" include="demo-pages-shared-styles">
      </style>
    </custom-style>
  </head>
  <body>
    <div class="vertical-section-container centered">
      <h3>${cardName} demo</h3>
      <channels-card-demo-helper composer-tag-name="${cardName}-composer" viewer-tag-name="${cardName}-viewer"></channels-card-demo-helper>
    </div>
  </body>

  </html>
`;
  if (!fs.existsSync('demo')) {
    fs.mkdirSync('demo');
  }
  const cardTitle = capitalize(cardName);
  fs.writeFileSync('demo/index.html', demoIndexContent);
  const cardContent = `
<link rel="import" href="../polymer-channels-card/polymer-channels-card.html">
<link rel="import" href="../paper-button/paper-button.html">

<dom-module id="${cardName}-composer">
  <template>
    <div>
      <!-- Enter your composer markup here, and add code in the script below to assemble whatever
      initialization data is needed to complete card composition -->
      <paper-button on-click="onSendClick" raised>Send</paper-button>
    </div>
  </template>
  <script>
    class ${cardTitle}Composer extends PolymerChannelsCardComposer {
      static get is() { return '${cardName}-composer'; }
      // Add other script support needed to assemble the initialization data based on user interaction in the composer
      onSendClick() {
        this.send({ /* enter your initialization data here that will be used to initialize 'data' property in the viewer */ });
      }
    }
    window.customElements.define(${cardTitle}Composer.is, ${cardTitle}Composer);
  </script>
</dom-module>

<dom-module id="${cardName}-viewer">
  <template>
    <div>
      Your card viewer markup goes here
    </div>
  </template>
  <script>
    class ${cardTitle}Viewer extends PolymerChannelsCardViewer {
      static get is() { return '${cardName}-viewer'; }
      // Add other script support needed to display or for the participant to interact with the card,
      // calling this.stateController when appropriate to share state changed with other participants.
    }
    window.customElements.define(${cardTitle}Viewer.is, ${cardTitle}Viewer);
  </script>
</dom-module>
`
  fs.writeFileSync(cardName + '.html', cardContent);
  const bowerOutput = execSync('bower install');
  console.log("\n\nYour Channels card has been initialized.  Your next step is to edit " + cardName + ".html")
});
