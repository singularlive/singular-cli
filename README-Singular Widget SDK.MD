# Widget SDK Documentation

## Introduction

Welcome to the Singular Widget SDK documentation. The Singular Widget SDK provides Java Script libraries to access composition properties, control and data structures. This document describes the process for developing Singular Widgets.

If you want to develop Singular Control Apps, please check out the Singular App SDK documentation.

This documentation is open source. If you’ve found any errors, typos or would like to improve this document, feel free to send us requests and comments to [sdk@singular.live](mailto:sdk@singular.live).

## Setting up you Environment

### Prerequisite

The Singular Widget SDK requires a local installation of node.js. You can find the latest documentation on node.js and download it from [https://nodejs.org/en/](https://nodejs.org/en/).

### Installation of the Singular-cli
After the installation of node.js, open the console and install the latest Singular-cli. 

Following cli’s are available:

| cli | Description |
|:----|:------------|
| `singular-cli` (recommended) | Install this cli, if you want to develop Singular Widgets and Singular Apps |
| `singularwidget-cli` | Install this cli, if you want to develop Singular Widgets only |
| `singularapp-cli` | Install this cli, if you want to develop Singular Apps only |


This document describes the installation of the singular-cli. For specific details about the singularwidget-cli or singularapp-cli please refer to [https://github.com/singularlive/](https://github.com/singularlive/) or [https://www.npmjs.com/~singularlive](https://www.npmjs.com/~singularlive). 

#### Install running the command:

    npm install singular-cli -g

After the installation of the cli, console commands to create and deploy Singular Widgets and Apps are available.

The create commands clone the Singular boiler plates into the specified folder.

The deploy commands check, package and upload the widget or app code to Singular.live. Every widget and app is identified by a unique `deploy key`. How to generate a `deploy key`, is covered in the section `Creating a Singular Widget`.

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
- [https://github.com/singularlive/singularwidget-cli](https://github.com/singularlive/singularwidget-cli)
- [https://github.com/singularlive/singularapp-cli ](https://github.com/singularlive/singularapp-cli)

Source code of the widget and app boiler plates:

- [https://github.com/singularlive/widget-development-boilerplate](https://github.com/singularlive/widget-development-boilerplate)
- [https://github.com/singularlive/app-development-boilerplate](https://github.com/singularlive/app-development-boilerplate)

## Creating a Widget

The following steps are required to create a Singular Widget:

- Creating a widget on your local disk
- Creating a widget in Singular.live
- Deploying a widget
- Testing and debugging a widget
- Publishing a widget

### Creating a widget on your local disk

The following commands create a folder on your local disk and download the widget source code. We recommend adding this folder to your source code management tool.

Open a console and type following commands:

    C:\Users\tm\Singular Widgets>singular createwidget myFirstWidget
    Singular Widget – myFirstWidget has been created
    C:\Users\tm\Singular Widgets>dir /S /B
    C:\Users\tm\Singular Widgets\myFirstWidget
    C:\Users\tm\Singular Widgets\myFirstWidget\deploykey.json
    C:\Users\tm\Singular Widgets\myFirstWidget\source
    C:\Users\tm\Singular Widgets\myFirstWidget\source\icon.png
    C:\Users\tm\Singular Widgets\myFirstWidget\source\output.html

This command creates the folder “myFirstWidget” and clones the widget boiler plate into this folder.

Description of default files:

- `deploykey.json`: File containing the widget deploy key.
- `source\icon.png`:  widget icon in png format
- `source\output.hml`: widget source code

### Creating a widget in Singular.live

#### Log into Singular.live

To create a widget for Singular.live, login with a user that has developer permissions. To check your user permissions, open the “User Administration” of your Singular account.

#### Create Widget

Select the `Widget Manager` in the `Account Drop Down Menu`.

Create a new widget by clicking the `New Widget` button. Enter a name and a category for your widget. The widget name does not need to match the name of the folder used with the `singular createwidget` command. Nevertheless, we recommend using the same names.

#### Enable your widget for custom state animation handling

If you develop custom in- and out-animations for your widget, you need to enable the `Custom State Animation` checkbox in the Widget Manager. This will allow your widget to receive state animation callbacks. for details please refer to `WIDGET SDK FUNCTIONS`.
 
This activates the `Widget` effect in the animation menu.
 
### Deploying a widget

Copy the `Deploy Key` from the Widget Details into the `deploykey.json` file. The file should look like this:

```javascript
{
  "deploykey": "uS3bDUabcDnYlAZMO87OL2nBckvSIdmE"
}
```

Upload the Widget code to Singular using following command in the node.js console:

    C:\Users\tm\Singular Widgets>singular deploywidget myFirstWidget
    -----------------------------------------------
    Singular.live widget deploy
    Validating files in directory "source"
    Creating zip file
    Deploying widget to Singular.live
    Widget ID: 3294 successfully deployed
    
    C:\Users\tm\Singular Widgets>

The deploy script reads the deploy.json file, exracts the deploy key, creates a zip-file of the widget sources and uploads it to Singular.live.

The status of the `Development` version of your widget gets updated every time you deploy new sources for your widget. Refresh the Widget Manager and select your widget to see and select your Widget to see the updated status.
 
### Testing and debugging a widget

To test your widget, follow these steps:

- open the Singular composition editor
- to add your widget to the composition, open the widget browser by clicking `Add` -> `Widget`
- Make sure to activate the `Show Dev Versions` checkbox to see all development versions of widgets.
- Select your widget to add it to the Singular composition tree
- Use the browsers built in capabilities for debugging and optimizing your widget.
 
### Publishing a widget

When the widget is fully tested, use the ”Publish” function to make it available for other users.

The `Publish` function creates an identical copy of the `Development` version of your widget and tags it as `Published`. The `Development` version gets increased by one.
 
Widgets never get deleted from the Singular.live platform. They are always in one of the following states:

* ***development:*** Every new widget starts in the `development` status. Widget under development and only can be accessed by users with development permissions. Once your widget is fully developed and tested, you `publish` it, to make it available to other users. Widgets in “development” status can be `Published`

* ***published:*** A published Widget is available to all members of your account. Only one `published` versions of a widget exists at the same time. By default, always the latest published version will be used when a widget is added to a composition. Widgets in `published` status can be `Un-published`.

* ***archived:*** Widgets automatically get archived when a new version is being published. Existing compositions that use an older version of the widget still will stay on this version. A standard user can manually `update` the widget in the composition by selecting the `Update` button. Users with developer permissions can in addition select to use any archived version of a widget. Widgets in `archived` status can be `Published` and `Deprecated`.

* ***depreciated:*** A widget is set to `Deprecate` status, when you want or need to force compositions to use and upgrade to the latest published version of a widget. A Widgets in `deprecated` status can be `Archived`.

#### Overview of widget statuses:

| STATUS | ACTION | NEW STATUS |
|:------:|:------:|:----------:|
| development | Publish | published |
| published | Un-publish | archived |
| archived | Publish | published |
|  | Deprecate | deprecated |
| deprecated | Archive | archived |

## Widget UI Definition

The widget UI is defined by a JSON structure. Singular creates the user interface for the widget based on this structure.

The structure is an object with one member called `model`. The `model` has two members, `fields` and `groups` which are defined as arrays. The definition of `fields` is required, the definition of `groups` is optional.

```javascript
{
    "model": {
        "fields": [{
            "id": "myID",
            "type": "text",
            "title": "My Title",
            "defaultValue": "This is the default value"
        }],
        "groups": []
    }
}
```

The JSON structure above creates a text field for a widget. The following section describes in detail all supported field types and their properties.

### UI Field Types

#### Properties are supported by all field types

| property | var type | example | description |
|---------:|:--------:|:-------:|:------------|
| id | string | “theName” | the identifier of the field. This must be unique |
| type | string | “text” | type of field |
| title | string | “Enter name” | the text shown in the user interface left to the input field |
| defaultValue | string | “John Doe”, "#9B9B9B" | the value assigned to a field when a new instance of a widget is created |
| disabled | boolean | “true”, “false” | fields can be disabled by default. Set this to true to disable the field |
| hidden   | boolean | “true”, “false” | fields can be hidden in the user interface. Set this to true to hide the field |

#### Field types and their specific properties

| field type | properties | var type | example | description |
|-----------:|:----------:|:--------:|:-------:|:------------|
| label | [default properties] |  |  | read only html text |
| text | [default properties] |  |  | single line text input field |
| textarea | [default properties] |  |  | multi line text input field |
| | • rows | integer | “5” | number of rows |
| | • cols | integer | “15” | number of columns |
| font | [default properties] |  |  | font selector including font style |
| | hideUI |  |  |  |
| | • style | boolean | “true”, “false” | show/hide all style options |
| | • bold | boolean | “true”, “false” | show/hide bold option |
| | • italic | boolean | “true”, “false” | show/hide italic option |
| | • underline | boolean | “true”, “false” | show/hide unterline option |
| | • alignment	 | boolean | “true”, “false” | show/hide alignment option |
| json | [default properties] |  |  | JSON input field with syntax highlighting |
| | • width | integer | “300” | width in pixel |
| | • height  | integer | “200” | height in pixel |
| number | [default properties] |  |  |  |	
| | • min | double | “0.0” | minimum value allowed |
| | • max | double | “83.43” | maximum value allowed |
| | • step | double | “0.1” | step for value changes when using up and down arrows |
| | • unit | string | “%”, “px” | show a unit string in the input field next to the number |
| | • format | string | “0.01” | number format, defines how many digits are shown |
| color | [default properties] |  |  | color selector |
| gradient | [default properties] |  |  |  gradient selector to choose between color, linear od radial gradient |
| image | [default properties] |  |  | image selector |
| checkbox | [default properties] |  |  | on / off selector |
| selection | [default properties] |  |  | drop down list of string values |
| | selections | array |  | array with strings the user can select |
| | • id | string | “default” | option id |
| | • title | string | “Default Text” | option title |
| button | [default properties] |  |  | push button |
| composition | [default properties] |  |  | select a composition instance |
				
#### Examples

Define a field showing percentage values between 0 and 100:

```javascript
{
    "model": {
        "fields": [{
            "id": "theNumber",
            "type": "number",
            "title": "Percentage",
            "defaultValue": "50.0",
            "min": "0.0",
            "max": "100.0",
            "step": "0.1",
            "unit": "%",
            "format": "0.01"
        }],
        "groups": []
    }
}
```

Define a selection field:

```javascript
{
    "model": {
        "fields": [{
            "id": "theSelection",
            "type": "selection",
            "title": "Select your Country",
            "defaultValue": "Thailand",
            "selections": [
                {
                    "id": "theDefault",
                    "type": "Thailand"
                },
                {
                    "id": "theOption1",
                    "type": "Austria"
                },
                {
                    "id": " theOption2",
                    "type": "Japan"
                },
                {
                    "id": " theOption3",
                    "type": "Thailand"
                }
            ]
        }],
        "groups": []
    }
}
```

### Grouping UI Fields

Use groups to logically combine UI fields into on UI panel. The groups item is an array of group objects.

Structure of the group object:

```javascript
{
    "model": {
        "fields": [
            /* field definition */
            /* ... */
        ],
        "groups": [
            {
                "id": "theGroupID",
                "title": "groupTitle",
                "width": "double",
                "toolTip": "toolTip for Group",
                "activeId": "useThisGroup",
                "childIds": ["fieldId1", " fieldId2", " fieldId3"]
            }
        ]
    }
}
```

The JSON structure above defines a group field with six UI fields which are combined on one panel in the widget UI.

The following table describes in the available group properties.

| property | var type | example | description |
|---------:|:--------:|:-------:|:------------|
| id | string | “theGroup” | identifier of the field. This must be unique |
| title | string | “Text Input” | text shown in the header of the UI panel |
| width | string |  | defines the width of the panel |
|  |  | “double” | double width of panel |
|  |  | “”, “single” | any other string defines standard width of panel |
| toolTip | string | “Details ..." | the tool tip text is shown on “mouse over” on the `I` icon |
| childIds | array | “text1”, “text2” | array containing the IDs of fields defined in the “fields” section. |
| activeID | string | “useTheGroup” | the ID of a `checkbox` field that will be shown n the header of the panel. |
|  |  |  | NOTE: The `checkbox` field has to be defined as part of the `fields` array before it is attached to a group using the `activeID` definition! |

Fields that are not explicitly assigned to a group, are automatically group in the `Miscellaneous` group panel. The `Miscellaneous` group panel will be hidden if all UI fields are assigned to groups.

The state of the `activeID` property of a group panel enables and disables all the fields in a group. E.g. you defined a UI field of the type `checkbox` with the ID `useTitle` and assigned it to a group called `Shadow` using `activeID`: `useTitle`. The checkbox will be shown in the upper right corner of the group. Depending on the state of the `useTitle` checkbox, all shadow properties like `theTitle`, `theSubtitle`, etc, that belong to this group are enabled or disabled.

Please refer to the following example.

```javasrcipt
{
    "model": {
        "fields": [{
            "id": "theTitle“,
            "type": "text“,
            "title“: "Title“,
            "defaultValue“: "Title Default Text"
        },{
            "id“: "theSubtitle“,
            "type“: "text“,
            "title“: "Sub Title“,
            "defaultValue“: "Sub Title Default Text"
        },{
            "id“: "useTitle“,
            "type“: "checkbox“,
            "title“: "Use Title“,
            "defaultValue“: true
        }],
        "groups“: [
            {
                "id“: "theTitleGroup“,
                "title“: "Lower Third“,
                "width“: "double“,
                "toolTip“: "toolTip for title gourp“,
                "childIds“: ["theTitlex“, "theSubtitle"]
            }

        ]
    }
}
```

Using the above definition will create following widget editor: 
 
> NOTE:
>
>The `Use Title` checkbox will enable and disabled the `Title` and `Sub Title` fields.

 
## Widget SDK Functions

A singular widget must include the Singular widget library. The current release of the library is 1.0.2 and can be found here:
[https://libs.singular.live/singularwidget/1.0.2/singularwidget.js](https://libs.singular.live/singularwidget/1.0.2/singularwidget.js)

To initialize the library, add the following code to your widget

```javascript
SingularWidget.init({
	  onInit: onSingularInit,
	  onValue: onSingularValue,
	  onButtonClicked: onSingularButtonClicked,
        onEditComp: onSingularEditComp,
        onAnimation: onSingularAnimation
	});
```

This call will tell Singular which functions to call in your widget.

* ***onInit():*** This function is called when a widget instance is created.

* ***onValue(json):*** This function is called when an instance of a widget is created or the instance data is changed. The instance data structure is defined with the UI Definition JSON in the widget manager in Singular. 

* ***onButtonClicked(buttonID):*** If you widget has push buttons this function is called when one is clicked.

* ***onEditComp(fieldID):*** Is called when the sub composition of a widget is edited. The fieldID tells you which composition field is being edited. Sub composition in widgets are quite complex and will be explained in the next section.

* ***onAnimation(msg):*** Is called when animation events occurred.

Description of `msg` parameters:

parameter	value	example	description
msg.event	“init”	“event”:”init” 	init is called when animation is set up
	“seek”
	“event”:”seek”	seek is called when the user moves the animation timeline in the editor
	“start”	“event”:”start”
	start is called when the animation is playing and the timeline reaches the beginning of the animation.
	“stop”	“event”:”stop”	stop is called when the animation is paying and the timeline reaches the ending of the animation
msg.timeline	“In”	"timeline":"In"	timeline to “In” state
	“Out”	"timeline":"Out"	timeline to “Out” state
msg.duration	0.5	"duration":0.5	duration of the animation to 0.5 seconds
msg.time	0.005	“time":0.005	current time from the beginning of the animation
msg.direction	“forward”	"direction":"forward"
	run animation forward:
animation is playing from stage “Out1” to “In” or “In” to “Out2”
	“backward”	"direction":"backward"
	run animation backward: 
animation is playing from stage “Out2” to “In” or “In” to “Out1”

Example of msg param:

    {"event":"init","timeline":"In","duration":0.5,"direction":"forward"}
    
    {"event":"seek","timeline":"In","duration":0.5,"time":0.005}
    
    {"event":"start","timeline":"In","duration":0.5,"direction":"forward"}
    
    {"event":"stop","timeline":"In","duration":0.5,"direction":"forward"}
 
## Composition Instances

in progress

## Versioning of Widgets

Singular manages different versions of widgets. The versioning is not a source code repository, but will make it possible to use different versions of the same widget in different compositions. You can even use different version of a widget within the same composition.

### Create widget:

In our example, we see one version of the widget in state Development. The development version is always on top of the version list and this is where you upload your source code to.
 
### Publish widget version 1

Once you are happy with your widget you can publish the development version by clicking the Publish button you see in widget version list.

Publishing a development version will change its state to Published and it will copy this published version and make it the new development version.

In our example, we will see two versions after we publish our development version: one is development and one is published. 

The singular widget deploy command will now upload the source code into version 2, this is the development version, whereas the published version cannot be changed. 

### Publish widget version 2

When you publish the development again you will see three versions. One is the new development version, one is the published version and there will also be an archived version.

The Published version is changed into archived when a publish happens. You can publish an archived version, the currently published version will change into archive, in case a newly published version of a widget has a bug and you have to revert back to an older version.

Publishing new version of a widget does not change existing compositions. This will ensure that existing compositions will always behave the same even when new versions of widgets are published.

If you want to upgrade widgets in a composition you can do that in the widget info editor in the lower left corner of the composition editor.

An archived version change be changed into a deprecated version. Whenever Singular loads a composition and detects that a deprecated version of a widget is used it will automatically upgrade this widget to the latest published version. This is useful when a published version of a widget turns out to be broken and unusable. Fix the problem by uploading new code, publish that code and deprecate the broken version. 

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



