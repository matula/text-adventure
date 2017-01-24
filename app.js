// [START app]
'use strict';

process.env.DEBUG = 'actions-on-google:*';

let ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let GreatAdventure = require('./adventure');
var gadv = new GreatAdventure();

let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({type: 'application/json'}));

app.post('/', function (request, response) {
    const assistant = new ActionsSdkAssistant({request: request, response: response});

    function mainIntent(assistant) {
        let res = gadv.begin();
        assistant.data = res.data;
        let inputPrompt = assistant.buildInputPrompt(false, res.prompt,
            ['I didn\'t hear you. Are you still there?', 'Wanna go somewhere?', 'Where do you want to go?']);
        assistant.ask(inputPrompt);
    }

    function rawInput(assistant) {
        if (assistant.getRawInput() === 'bye') {
            assistant.tell('Thanks for playing Text Adventure! Goodbye!');
        } else {
            let res = gadv.setParams(assistant.data).setCommand(assistant.getRawInput()).parse();
            assistant.data = res.data;
            if(res.data.doorUnlocked == true) {
                assistant.tell(res.prompt + " .... Thank you for playing Text Adventure! Please check back again soon for new features and games!");
                return;
            }
            let inputPrompt = assistant.buildInputPrompt(false, res.prompt,
                ['I didn\'t hear you. Are you still there?', 'Wanna go somewhere?', 'Where do you want to go?']);
            assistant.ask(inputPrompt);
        }
    }

    let actionMap = new Map();
    actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
    actionMap.set(assistant.StandardIntents.TEXT, rawInput);

    assistant.handleRequest(actionMap);
});

app.post('/test', function (request, response) {
    let command = request.body.command;
    let params = request.body.data;
    let res = gadv.setParams(params).setCommand(command).parse();
    response.json({res});
});

// Start the server
let server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
    console.log('Press Ctrl+C to quit.');
});
// [END app]
