# channels-cli

## TLDR

To create your own Channels card:

* Install tools:
```text
npm install -g bower polymer-cli channels-cli
```
* Create a GitHub repository (lowercase with hyphens such as **`janes-simple-card`**) and clone it locally
* From the root of your new project, scaffold your card:
```text
channels init
```
* Edit your components file (such as **`janes-simple-card.html`**)
* Test your component by running a local server:
```text
polymer serve
```
* Then load a test page for your component by opening a browser using the URL returned after 'reusable components', such as **http://127.0.0.1:8000/components/test-component/janes-simple-card/**.
* Iterate until the composer and viewer works and looks as you want it.
* Commit and push to GitHub
* Create a new GitHub release for your project
* Open Channels client, create a channel, and load your card, such as **`JaneDoe/janes-simple-card`**

## Introduction

[Channels](https://channelelements.org) is a new distributed open-source internet communication platform.  Like email, anyone is free to implement their own server and/or their own client.  Any client can interoperate with any server.  What makes Channels really exciting is that channels are populated with "cards" that are implemented using web components and anyone can create their own cards that will interoperate with any client and server.

## Concepts

Before you create your own card, you should be sure to understand a few basics.  Channels is deeply dependent on [web components](https://www.webcomponents.org/) which are supported on every major browser.  Web components are like little web pages that fit inside their own custom tag on a web page.  The channel page in a Channels client uses a web component at the bottom for composing a message, and a web component for each message in that channel.  So each Channels "card" is a project that defines two new web components:  one for composing cards to be sent to others on a channel, and one for displaying those cards to everyone in the channel.  While we call this latter component a "viewer" it can, in fact, be a fully interactive collaborative "applet" shared by everyone in the channel.

We choose to implement our own cards using [Polymer](https://www.polymer-project.org/), a technology to simplify and enhance web components.  But Polymer is not mandatory for Channels.  You can implement a new card is pure HTML and Javascript if you prefer.  This introduction, however, will help you create your card using components that are built on top of Polymer.

## Creating your own Card:  Instructions

### Step 1:  Install Dependencies

In order to create your own card here, we start with some tools you will need.  If you don't already have Node installed, do that first:  [install Node](https://nodejs.org/en/download/)

You will also need to have a [GitHub](https://github.com/) account and your favorite git client installed such as [git-scm](https://git-scm.com/downloads).

Now you are ready to install the other dependencies.  (Note that you may need to use `sudo` on some machines.)

```text
npm install -g bower polymer-cli channels-cli
```

### Step 2: Create a Repository

Each Channels card is maintained in a separate GitHub repository.

Go to github.com, sign in, and click "New Repository".  In the "Repository name", we recommend a globally unique name that will be the prefix of the web component tags you will create.  Tag names must be globally unique, so choose something distinctive.  You name should be lower-case containing at least one hyphen.  For example, 'sallys-first-card'.

Your repository **must be public** so that all Channels clients will be able to access it when loading your card.

You can leave .gitignore as **None**.  We'll populate that later.  Choose the license you want controlling how others can use your card.

Click **Create repository** and then copy the URL for your repository and paste it into your git client to clone your repository to your machine.

### Step 3: Scaffold your Card

We provide a command-line tool (installed as **channel-cli** above) to help you scaffold your card.

Open a shell and **cd** to the root folder of your local copy of the git repository for your card.

```text
channels init
```

This will ask you for a name and description of your card.  The name will typically match the name of your GitHub repository, such as **sallys-first-card**.

Then your directory will be populated with files and folders needed for your first card.  Your card is almost ready to use!  Skip the next couple of steps if you want to try the card as it is defined by default.

The most important file in your card project is the one that defines the card components and its name will match your project name, such as `sallys-first-card.html`.  This is where your components are defined using HTML and Javascript.  In addition, there is a `channels-component.json` file that tells the Channels client how to use your card, including the tag names to use for composer and viewer.  The `bower.json` file describes your project, especially its dependencies on other components.  Most of the remaining files and folders are for documentation and to support development.

**Important note:** Your dependencies (libraries, etc.) are declared in `bower.json`.  Channels will take care of ensuring that these dependencies are available in the browser when your components are loaded.  So you do not need to "pack" these dependencies into a single file as you might do in some classical web development.  Your card is loaded like any other dependency of the client and will be hosted in a `bower_components` folder with your dependencies appearing in other folders at the same level as yours.

### Step 4: Adding Dependencies

In the world of web components, it is common to take advantage of other components and Javascript libraries, rather than reinventing the wheel.  There are a huge range of these available.  You can use HTML imports and script tags in your component definitions.  But for each you need to declare those dependencies so that Channels can ensure that they are present at runtime.

For example, suppose that you would like to use Polymer's paper-input web component in your composer.  You will add a bower dependency for it first:

```text
bower install --save PolymerElements/paper-input
```

Then you will add an import directive at the top of your card definition:

```html
<link type="import" href="../paper-input/paper-input.html">
```

Or suppose that you like to use JQuery.  You can add a dependency on that library:

```text
bower install --save jquery
```

And then you will add a script tag inside your component definition.  **Note:** Do not place script tags inside your **template** tag.  Place it just above or below the script tag containing your component code.

```html
<script src="../jquery/dist/jquery.min.js"></script>
```

### Step 5: Customize your Composer

In your component definitions file (such as `sallys-first-card.html`), you will see import directives at the top, followed by two web component definitions contained in `<dom-module>` tags.  The first is for your composer.  The second is for your viewer.  Let's look at your composer first.

The definition contains a `<template>` tag and a `<script>` tag.

The template is the HTML markup determining how the component appears in the webpage.  The script determines how it will behave.  The scaffolding created a composer that just contains a "Send" button (using a Polymer paper-button component to make it look pretty -- you could use a `<button>` tag if you prefer).  You can add any additional markup you want to determine how your composer looks and how it works.

The script has two parts.  There is a `class` definition followed by a call to register that class with the browser as a new component using `window.customElements.define`.  `customElements` is a standard part of the window object in newer browsers.  This tells the browser what to do when it finds a tag in a web page with the name specified here.  You'll see that the scaffolding has named your component based on your project name followed by `-composer`.  That's why it is important that your project name is unique.  Otherwise, it may "collide" with another Channels card created by someone else with the same name.

The class definition in the script tag `extends PolymerChannelsCardComposer`.  This means that this Javascript class inherits the properties and methods of that class declared in the `polymer-channels-card` library.  If you look, you will see that that class is a thin wrapper around `Polymer.element` that handles some of the housekeeping for you.  You could inherit directly from Polymer.element if you prefer to do that work yourself.

In the scaffolded version of your composer, there is a single method called `onSendClick`.  This will be called based on the `on-click` handler on the Send button in your template.  You'll see that this method calls `this.send();` which is a method defined in `PolymerChannelsCardComposer` which sends a copy of this card to everyone on the channel.  In most real cases, the composer will collect some kind of information from the user and package that together in a serializable Javascript object to be used to initialize the corresponding viewer components.  For example, you might add a `paper-input` component to your composer template, and then use its contents when the user clicks Send.

**Important:** After you call `this.send()`, note that your composer component will be reused -- allowing the user to compose another message for the channel.  You must therefore reset your component's state after sending so that it is ready for the next message to be composed.  For example, you will typically clear the contents of all textboxes and reset all toggle buttons, etc.

### Step 6:  Customize your Viewer

The second component in your definition is the viewer.  It is another web component definition similar to the composer.  But its job is to display the message that was composed to everyone on the channel.  For more sophisticated cards, the viewer is really like a full application, since it can allow viewers to interact with the card, and even collaborate with other channel participants through that card.

Your viewer component `extends PolymerChannelsCardViewer`.  If you look at that class, you'll see that it defines some properties and methods that your viewer will depend on.

When your viewer component is added into the channel, the client will inject a new HTML tag based on the name of your viewer and it will initialize its `data` and `channel` properties.  The `data` is the information that used when your composer called `this.send()`.  The `channel` is a Javascript object with information and methods related to the channel -- such as the name of the channel, its participants, and methods to send messages.  And the channel will call methods on your component if it receives additional messages after it is created.  The `PolymerChannelsCardViewer` handles most of this for you, but you are free to implement these yourself if you prefer.

In the scaffolded version of your viewer, you will see that the template just contains some static text.  You will replace that with markup that will present the message to participants on the channel.  Typically this will be based on information contained in `this.data` -- which is the information provided by the composer.

Polymer enables "data binding" to make it easy to use information stored in a property within your markup so that you don't have to write extra code to manipulate the DOM elements in your markup.  For example, suppose that the composer sends a message, `this.send({ message: "hello world" });`.  The viewer can then expect that there is a `data.message` string in its properties.  It could display that message in the viewer with markup that looks like:

```html
<div>{{data.message}}</div>
```

Read more about data binding at [Polymer](https://www.polymer-project.org/2.0/docs/devguide/data-binding).

### Step 7:  Test your Card

You are able to test your card in a local test page separate from Channels.  To do this, you use Polymer's tools to serve up your files locally:

```text
polymer serve
```

This will start a new web server on your machine for serving up your files.  It will return two URLs.  Of these you will use the second one called 'reusable components', such as **http://127.0.0.1:8000/components/test-component/sallys-simple-card/**.

Loading this URL in your browser will show you a test page that contains your card -- without running Channels itself.  The page acts as the Channels network.  You will first see your composer.  When you take the action that will send the card, the page will then show three viewers representing three separate conceptual users.

You can now develop your composer and viewer iteratively until they work the way you want them to.  Each time you make a change to your card definition files, just refresh your browser.

### Step 8:  Commit your Changes

Once you are satisfied with your card, save all changes, commit them to your local repository, and push the changes to GitHub.

### Step 9:  Load your Card

Open a Channels client, create a new channel for testing, and at the bottom, click on the button to choose the composer.  Then click on the button to load a new card.  In the dialog enter the owner/repo name (such as **`JaneDoe/janes-simple-card`**) or the URL from GitHub (such as **`https://github.com/JaneDoe/janes-simple-card`**).  They are equivalent.

Your composer should now show up at the bottom of the channel.  Use it and send a card into the channel.  Check out the viewer.  Open a second client and use a share code to view the same channel, so that you can see your viewer and test that it responds correctly to various events.

### Step 10:  Release

When yours to your card works to your satisfaction, go to the GitHub repository and create a release.  For example, you might set the release version to **1.0.0**.  If and when you make changes bump the last digit for bug fixes and the second last digit when there are feature changes.  Avoid changing the first digit.

## Interactive Cards

Since web components can do just about anything, this enables a wide range of possibilities for what can appear in a channel.  It isn't just messages or photos anymore.  Now the cards in the channel could show live data, or be a calculator, or even support collaboration between the participants.

Before we get to collaboration, there is first interactivity.  The composer establishes some data to be presented in cards for each participant.  But that data may be presented in a variety of ways, and the viewer can be interactive.  For example, the data fed from the composer could be numerical, and the viewer might present it in graphical form.  The viewer could allow a participant to zoom, pivot, etc.

But cards get really exciting when they become collaborative.  Imagine, for example, a card that contains a checklist.  The composer initializes the list then sends out the card.  All participants can see that same checklist.  And when anyone makes a change to the list, everyone sees that change.  Suddenly, you have realtime collaboration within the channel between the participants.  Also, since the Channels server maintains a history for the channel, some person who arrives later will still receive this card, along with all changes to it, so that that card will also appear in the new participant's channel.

This works because Channels delivers messages between participants, and each card is able to ask the client to deliver messages that will be received by its counterparts on other cards.  These so-called "card-to-card" messages can contain anything -- JSON-encoded data or even binary data.  It is up to each card implementor to decide if and how it will use this capability.

The library here is designed to simplify cards that, if they do use collaboration, do so using a "shared state" model.  This means that there is no centralized concept of state for the card.  Instead, each card maintains its own copy of the state, and a "mutation" protocol is used to guarantee that all cards will remain in sync.  When a new participant joins (or rejoins), then the card-to-card messages stored by the Channels server can be used to re-synchronize the new card's state.

Most card developers don't need to worry about that.  Instead, they can use the API exposed by the PolymerChannelsCardViewer base class.  This allows state information to be automatically synchronized between cards.  This state information consists of properties (any serializable Javascript variable), arrays (allowing cards to contribute and manipulate shared arrays), and text blocks (allowing collaborative editing of text where mutations are based on "diff").

### Shared Properties

Let's suppose that the composer send the following state information to the channel:

```json
{
  "message": "hello world",
  "count": 0,
  "color": "black"
}
```

The viewer could display this using data binding:

```html
<div>
   <div>{{data.message}}</div>
   <div class$="{{data.color}}">{{data.count}}</div>
</div>
```

The message, color, and count are data-bound to affect the display of the card.  If the composer sends different data, the corresponding card viewer will show different information.

Now, let's make this card interactive:

```html
<div>
   <div on-click="onMessageClick">{{data.message}}</div>
   <div class$="{{data.color}}">{{data.count}}</div>
</div>

...

<script>
  onMessageClick() {
    this.stateController.updateProperty('color', this.data.color === 'red' ? 'blue' : 'red');
    this.stateController.incrementProperty('count', 1);
  }
</script>
```

In the viewer, when any participant clicks on the message in their card, that card will ask its stateController (a member of the base class) to update the color value, and to increment the count value.  The stateController takes care of updating the local data (so that data-binding will cause the local display to be updated) and will send a card-to-card "mutation" message so that other cards will handle that message and update their data accordingly.

What if two participants click on the message in their cards?  For the color property, each one will toggle the current color, and so if there are two clicks anywhere, the count will return to red. But notice how we're using `incrementProperty` for the count property.  If two participants each click on the card, the count will be incremented twice.  And even if they click at the same time, the mutation protocol ensures that both stay in perfect synchronization.

### Shared Arrays

Suppose that you have a card where you want to display a table of things.  That's easy if the table of data was provided by the composer.  The viewer might look like this:

```html
<div>{{data.title}}</div>
<div style="display:table;" items="{{data.items}}">
  <template is="dom-repeat">
    <div style="display:table-row;">
      <div style="display:table-cell;">{{item.date}}</div>
      <div style="display:table-cell;">{{item.by}}</div>
      <div style="display:table-cell;">{{item.message}}</div>
    </div>
  </template>
</div>
```

This uses Polymer's `dom-repeat` template that will create repeating structured based on a data-bound array (stored in data.items sent by the composer).

Now let's make this interactive.  We want any participant to be able to add new rows to the table:

```html
<div>{{data.title}}</div>
<div style="display:table;">
  <template is="dom-repeat" items="{{data.items}}">
    <div style="display:table-row;">
      <div style="display:table-cell;">{{item.date}}</div>
      <div style="display:table-cell;">{{item.by}}</div>
      <div style="display:table-cell;">{{item.message}}</div>
    </div>
  </template>
</div>
<input id="inputText" type="text"> <button on-click="onAddClick">Add</button>

...

<script>
  onAddClick() {
    const item = {
      date: Date.now().toString(),
      by: this.channel.me.details.name,
      message: this.$.inputText.value
    };
    this.stateController.arrayInsert('items', item);
    this.$.inputText.value = '';
  }
</script>
```

We've added a textbox and button.  When the user clicks the button, the `onAddClick` method creates a new item and asks the stateController to insert it into the `items` array in the shared data.  Because the repeating template is data-bound to that array, the local viewer will be updated accordingly, and a message is sent to other cards causing their data to be updated and their views to be updated to match.

The mutation protocol ensures that all array mutations are synchronized.  So even if two or three participants all add records at the same time, the protocol ensures that all tables will resolve to having records in the same order -- even when there are race conditions.  So the card developers doesn't have to worry about cards getting out of sync.

As a side note, you'll notice that the **by** field of the new item is populated using `this.channel.me.details.name`.  This uses the API provided by the channel object that is passed to the viewer card when it is created.  In this case, `this.channel.me` is an object representing the current participant.  So in this example, the participant's name is being added into the **by** field.

## Shared Text

The stateController also handles cases where cards may be sharing blocks of text that are editable by all participants concurrently.  Even this collaborative editing is supported.  The protocol uses a "diff" concept to send mutations based on changes to the text to other cards, and so can merge together changes to the same text by different users at the same time -- as long as those changes are not at the place in the text.  If there are conflicting changes, then the protocol resolves them using "best effort".

To use shared text, one has to be careful with data binding and updates.  When changing a text property, the viewer should call, for example, `this.updateText('mytext', updatedFullText)`.  The stateController will compare `updatedFullText` with the value currently in `this.data.mytext` and will send a mutation based on the difference.  For this reason, it is important that if using a text input control in the UI, it not be data-bound to the same text, or things won't work correctly.

Instead, the textbox can be initialized based on the value in, for example, `this.data.mytext` and then the viewer should implement a method called `updateText(path, newValue, updater)`.  The path, in this example will be 'mytext', and the newValue will be what has been set (either locally or remotely).  If the user is maintaining a cursor/caret while editing, the updater is a function that accepts an offset into the text where the caret is currently, and will return a new offset where it should be moved following this change.  This method on the viewer will be called anytime a change is made to the text -- locally or remotely.