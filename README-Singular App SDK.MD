# App SDK Documentation

Last updated: 2018-04-06 (tm)

## Introduction

Welcome to the Singular App SDK documentation. The Singular App SDK works identical to the Singular Widget SDK and provides JavaScript libraries to access Singular devices, former web channels, update content and control animations of compositions loaded into this web channels. This document describes the process for developing Singular Apps.

Singular Apps use HTML, CSS and JavaScript code. Apps can be simple, e.g. just setting a single line of text, triggering animation or more complex, as e.g. the Singular Studio Control App you allready may know.

If you want to develop Singular Control Widgets, please check out the Singular Widget SDK documentation.

This documentation is open source. If you’ve found any errors, typos or would like to improve this document, feel free to send us requests and comments to [sdk@singular.live](mailto:sdk@singular.live).

## Setting up you Environment

### Prerequisite

The Singular App SDK requires a local installation of node.js. You can find the latest documentation on node.js and download it from [https://nodejs.org/en/](https://nodejs.org/en/).

> Note:
We recommend installing node.js version 8.11.3LTS! 

### Installation of the Singular-cli
After the installation of node.js, open the console and install the latest Singular-cli. 

Following cli’s are available:

| cli | Description |
|:----|:------------|
| `singular-cli` | Install this cli, if you want to develop Singular Widgets and Singular Apps |

This document describes the installation of the singular-cli. For specific details about the singularwidget-cli or singularapp-cli please refer to [https://github.com/singularlive/](https://github.com/singularlive/) or [https://www.npmjs.com/~singularlive](https://www.npmjs.com/~singularlive). 

#### Install the singular-cli by running this command:

    npm install singular-cli -g

After the installing the cli, console commands to create and deploy Singular Widgets and Apps will become available.

The create commands serve to clone the Singular boiler plates into the specified folder.

The deploy commands check, package and upload the widget or App code to Singular.live. Every widget and App is identified by a unique `deploy key`. How to generate a `deploy key`, is covered in the section `Creating a Singular Widget`.

Create Singular Widget boiler plate:

    singular createwidget <folder name>

Deploy Singular Widget:

    singular deploywidget <folder name>

Create Singular App boiler plate:

    singular createapp <folder name>

Deploy Singular App:

    singular deployapp <folder name>

More information about the Singlar.live cli’s:

- [https://github.com/singularlive/singular-cli](https://github.com/singularlive/singular-cli)

Source code of the widget and App boiler plates:

- [https://github.com/singularlive/widget-development-boilerplate](https://github.com/singularlive/widget-development-boilerplate)
- [https://github.com/singularlive/app-development-boilerplate](https://github.com/singularlive/app-development-boilerplate)

-----
## Creating an App

The following steps are required to create a Singular Widget:

- Creating an App on your local disk
- Creating an App in Singular.live
- Deploying an App
- Testing and debugging an App
- Publishing an App

### Creating an App on your local disk

The following commands will create a folder on your local disk and download the App source code. We recommend adding this folder to your source code management tool.

Open a console and type following commands:

    C:\Users\tm\Singular Apps>singular createapp myFirstApp
    Singular App – myFirstApp has been created
    C:\Users\tm\Singular Apps>dir /S /B
    C:\Users\tm\Singular Apps\myFirstApp
    C:\Users\tm\Singular Apps\myFirstApp\deploykey.json
    C:\Users\tm\Singular Apps\myFirstApp\source
    C:\Users\tm\Singular Apps\myFirstApp\source\app.html
    C:\Users\tm\Singular Apps\myFirstApp\source\icon.png

This set of commands creates the folder “myFirstApp” and clones the widget boiler plate into this folder.

Description of default files:

- `deploykey.json`: File containing the app deploy key.
- `source\app.hml`: app source code
- `source\icon.png`:  app icon in png format

### Creating a App in Singular.live

#### Log into Singular.live

To create a App for Singular.live, login with an account that has developer permissions. To check your user permissions, open the “User Administration” of your Singular account.

#### Create App

Select the `App Manager` in the `Account Drop Down Menu`.

Create a new App by clicking the `New App` button. Enter a name and a category for your App. The App name does not need to match the name of the folder used with the `singular createapp` command. Nevertheless, we recommend using the same names.

#### Enable your App for a composition and an output channel

The `Add composition` button allows to add one or more compositions to your created App.

By using the `Add Output` button, you can select the output(s) for your App.
 
### Deploying an App

Open the `App Manager` and select your app. Copy the `Deploy Key` from the App Details into the `deploykey.json` file. The file should look like this:

```json
{
 "deploykey": "uS3bDUabcDnYlAZMO87OL2nBckvSIdmE"
}
```

Upload the App code to Singular using following command in the node.js console:

    C:\Users\tm\Singular Apps>singular deployapp myFirstApp
    -----------------------------------------------
    Singular.live app deploy
    Validating files in directory "source"
    Creating zip file
    Deploying app to Singular.live
    App ID: 54 successfully deployed
    
    C:\Users\tm\Singular Apps>

The deploy script will then read the deploy.json file, exract the deploy key, create a zip-file of the app sources and upload it to the Singular.live cloud. 
Your app then will be visible in the `App Browser` when creating a new app instance. 

> Activate the `Show Dev Versions` checkbox in the `App Browser` to access the development version of your app.

The status of the `Development` version of your App gets updated every time you deploy new sources for your App. Refresh the `App Manager` and select your App to see and select your App to see the updated status.
 
### Testing and debugging an App

To test your App, follow these steps:

- Open your user folder in the Dashboard. Navigate to `Apps` that are presented in your Assets. Choose and open the App you want to debug.
- Use the browsers built in capabilities for debugging and optimizing your App.
 
### Publishing an App

When the App is fully tested, use the `Publish` function to make it available for other users.

The `Publish` function creates an identical copy of the `Development` version of your App and tags it as `Published`. The `Development` version gets increased by one.

Apps never get deleted from the Singular.live platform. They are always in one of the following states:

* ***development:*** Every new App starts in the `development` status. Apps under development and  can only be accessed by users with development permissions. Once your App is fully developed and tested, you can `publish` it, to make it available to other users. Apps in `development` status can become `Published`

* ***published:*** A published App is available to all members of your account. Only one `published` version of a App exists at the same time. By default, always the latest published version will be used when creating an instance of an App. Apps in `published` status can be `Un-published`.

* ***archived:*** Apps automatically get archived when a new version is published. Existing App instances that use an older version of the App still will stay on this older version. A standard user can manually `update` the App in the App instance by selecting the `Update` button. Users with developer permissions can in addition select to use any archived version of an App. Apps in `archived` status can be `Published` and `Deprecated`.

* ***depreciated:*** An App is set to `Deprecate` status, when you want or need to force App instances to use and upgrade to the latest published version of an App. An App in `deprecated` status can be `Archived`.

#### Overview of App statuses:

| STATUS | ACTION | NEW STATUS |
|:------:|:------:|:----------:|
| development | Publish | published |
| published | Un-publish | archived |
| archived | Publish | published |
|  | Deprecate | deprecated |
| deprecated | Archive | archived |

## API Reference

| class | function | description |
|:------|:---------|:------------|
| singularApp. |  |  |
|  | .storage | {} |
|  | getOutputById(id) | output |
|  | .getCompositionById(id) | composition |
|  | .getCompositionByName(name defined from app template or importComposition) | composition |
|  | .listCompositions() |   |
|  | .listOutputs() |   |
|  | .log | {} |
|  | .listIdsByName(array, name) |   |
|  | .getCompositionBrowserUrl() |   |
|  | .compositionBrowserEventCallback() |   |
|  | .importComposition | please see the description below |
|  | .renderSingularForm(dom, controlNode) | *not available in standalone mode |
|  | .removeSingularForm(dom) | *not available in standalone mode |
|  | .removeCompositionById(id, callback); |   |
|  | .removeCompositionByName(name, callback); |   |
|  | .removeAllCompositions(callback); |   |
| storage |   |   |
|  | .set(key, json) |   |
|  | .update(key, json) |   |
|  | .get(key, callback) |   |
|  | .on(key, callback) |   |
|  | .off(key, callback) |   |
|  | .callback = function(value) | {}; |
| output |   |   |
|  | .setComposition(composition) |   |
|  | .getComposition() | composition |
|  | .getUrl() | string |
| composition |   |   |
|  | .playTo(to) |   |
|  | .jumpTo(to) |   |
|  | .setPayload(payload) |   |
|  | .listSubcompositions() |   |
|  | .getSubcompositionById(id) | subcomposition |
|  | .getSubcompositionByName(name) | subcompositioncontrol node |
|  | .getControlNode() |   |
|  | .getPayload() |   |
|  | .getSequencer() | sequencer |
|  | .remove(callback) |   |
|  | .getModel() |   |
| subcomposition |   |   |
|  | .playTo(to) |   |
|  | .jumpTo(to) |   |
|  | .setPayload(payload) |   |
|  | .getSubcompositionById(id) | subcomposition |
|  | .getSubcompositionByName(name) | subcomposition |
|  | .getControlNode() | control node |
|  | .getPayload() |   |
|  | .getModel() |   |
|  | .getSequencer() | sequencer |
| sequencer |   |   |
|  | .start() |   |
|  | .stop() |   |
|  | .seek(time) |   |
|  | .setPayload() | sequencer payload |
|  | .restoreControlNodeDefaultValue() |   |
|  | .setDuration(duration) |   |

## importComposition(array, callback)

```javascript
array: [{name:’test import’, composition:{refId: 6776}}];

callback: function(message) {
    if (message.success)
        console.log(‘composition imported successfully’);
    else
        console.log(message.desc);
}

example message (JSON Object)
{"success":true,"compositionIds":[{"name":"test import","id":"-KQyyrHYlJWrmIgbS2Xu"}]}
```

## Sequencer Payload Example

```json
payload = [{
        "beginTime": 10,
        "endTime": 20,
        "controlNodes": {
            "payload": {
                "title": "This is the first title"
            }
        }
    }, {
        "beginTime": 20,
        "endTime": 30,
        "controlNodes": {
            "payload": {
                "title": "This is the second title"
            }
        }
    }]
```

## Versioning of Apps

Singular manages different versions of Apps. The versioning is not a source code repository, but will make it possible to use different versions of the same App in different compositions. You can even use different version of a App within the same composition.

### Create App

In our example, we see one version of the App in state Development. The development version is always on top of the version list and this is where you upload your source code to.

### Publish App version 1

Once you are happy with your App you can publish the development version by clicking the Publish button you see in App version list.

Publishing a development version will change its state to Published and it will copy this published version and make it the new development version.

In our example, we will see two versions after we publish our development version: one is development and one is published. 

The Singular App deploy command will now upload the source code into version 2. This is the development version, whereas the published version cannot be changed. 

### Publish App version 2

When you publish the development again you will see three versions. One is the new development version, one is the published version and there will also be an archived version.

The Published version is changed into archived when a publish happens. You can publish an archived version, the currently published version will change into archive, in case a newly published version of an App has a bug and you have to revert back to an older version.

Publishing new version of an App does not change existing compositions. This will ensure that existing compositions will always behave the same even when new versions of Apps are published.

If you want to upgrade Apps in a composition you can do that in the App info editor in the lower left corner of the composition editor.

An archived version can be changed into a deprecated version. Whenever Singular loads a composition and detects that a deprecated version of an App is used it will automatically upgrade this App to the latest published version. This is useful when a published version of an App turns out to be broken and unusable. Fix the problem by uploading new code, publish that code and deprecate the broken version. 

## Getting Help

- **Need help**? Ask a question to the [Singular Helpdesk](https://singularlive.zendesk.com/hc/en-us/requests/new).
- **Found a bug?** You can open a [GitHub issue](https://github.com/singularlive/singular-cli/issues).

## Questions & More Information Needed?

Please contact our helpdesk, customers’ success or support team:

- Visit us at: [www.singular.live](http://www.singular.live)
- for helpdesk please contact: [helpdesk@singular.live](mailto:helpdesk@singular.live)
- for support please contact: [support@singular.live](mailto:support@singular.live)
- for sales please contact: [sales@singular.live](mailto:sales@singular.live)
- for general information: [info@singular.live](mailto:info@singular.live)

