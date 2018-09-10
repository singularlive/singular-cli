# Singular-cli Documentation

Last updated: 2018-09-09 (tm)

## Introduction

Welcome to the Singular CLI provides commands to create Singular Widget and App boilerplates and deploy your Widget, App and Interactive Layer code to the Singular platform.

If you want to develop Singular Widgets, Apps and Interactive Layer Scripts, please check out the Singular Develop Docs at [https://developer.singular.live](https://developer.singular.live).

This documentation is open source. If you’ve found any errors, typos or would like to improve this document, feel free to send us requests and comments to [support@singular.live](mailto:support@singular.live).

## Setting up your Environment

### Prerequisite

The Singular CLI requires a local installation of node.js. You can find the latest documentation on node.js and download it from [https://nodejs.org/en/](https://nodejs.org/en/).

> Note:
We recommend installing node.js version 8.11.3LTS! 

### Installation of the Singular-cli

After the installation of node.js, open the console and install the latest Singular-cli by running this command:

    npm install singular-cli -g 

## Available commands from the singular-cli

After the installation of the cli, console commands to create and deploy Singular Widgets, Apps and Interactive Layer Scripts will be available.

The create commands serve to clone the Singular boilerplates into the specified folder.

The deploy commands check, package and upload the Widget, App or Interactive Layer Code to the Singular.live platform. Every Widget, App and Interactive Layer Script is identified by a unique `deploy key`. Please refer to the [Singular Knowledge Base](https://singularlive.zendesk.com/hc/en-us/search?utf8=%E2%9C%93&query=deploy+key) for details on how to generate a `deploy key`.

### Create Singular Widget boiler plate:

    singular createwidget <widget name>

### Deploy Singular Widget:

    singular deploywidget <widget folder name>

### Create Singular App boiler plate:

    singular createapp <app name>

### Deploy Singular App:

    singular deployapp <app folder name>

### Deploy an Singular Interactive Layer Script

    singular deployinteractive <interactive-folder-name>

## Getting Help

- **Need help**? Ask a question to the [Singular Helpdesk](https://singularlive.zendesk.com/hc/en-us/requests/new).
- **Found a bug?** You can open a [GitHub issue](https://github.com/singularlive/singular-cli/issues).

## Questions & More Information Needed?

Source code of the widget and App boiler plates:

- [https://github.com/singularlive/widget-development-boilerplate](https://github.com/singularlive/widget-development-boilerplate)
- [https://github.com/singularlive/app-development-boilerplate](https://github.com/singularlive/app-development-boilerplate)

Please contact our helpdesk, customers’ success or support team:

- Visit us at: [www.singular.live](http://www.singular.live)
- for support please contact: [support@singular.live](mailto:support@singular.live)


