// ROCOUT - 6 point online rating version
// Implements word by word presentation, with 6 point judgment scale at the end
// (a modified version of van Dyke & Lewis (2003) methodology)

// Asserts breaks every 12 items.

var showProgressBar = true;

// Main shuffleSequence definition
var shuffleSequence = seq(
    //'consent',
    'setcounter',
    //'intro',
    //'prepractice',
    'practice',
    sepWith("timeoutSep", rshuffle(startsWith('LOON'),startsWith('f'))),
    'debrief',
//  'exit'
    );

// Variable definitions.
var DS = 'EPDashedAcceptabilityJudgment';

//var DS = 'EPDashedAcceptabilityJudgment';

//  Set the Prolific Academic Completion URL
var sendingResultsMessage = "Please wait. Your data are being sent to the server."; 
var completionMessage = "Thank you for your participation. Your completion code is UINJOPV3. To complete this experiment, go to: https://app.prolific.ac/submissions/complete?cc=UINJOPV3."; 
var completionErrorMessage = "There was an error in sending your data to the server. You may still complete this experiment. Your completion code is UINJOPV3. Please go to: https://app.prolific.ac/submissions/complete?cc=UINJOPV3."; 


// Controller settings.
var defaults = [
    "EPDashedSentence", {
        mode: 'speeded acceptability',
        display: 'in place',
        blankText: '+',
        wordTime: 1000,
        wordPauseTime: 100
        },
    DS, {q: '',
        as: [['j','J = Grammatical'],['k','K = Ungrammatical']],
        randomOrder: false,
        presentHorizontally: true,
        mode: 'speeded acceptability',
        display: 'in place',
        blankText: '+',
        wordTime: 300,
        wordPauseTime: 100,
        timeout: 10000}
];

//
//var defaults = [
//    "EPDashedSentence", {
//        mode: 'speeded acceptability',
//        display: 'in place',
//        blankText: '+',
//        wordTime: 1000,
//        wordPauseTime: 150
//        },
//    DS, {q: 'Is that sentence grammatical?',
//        as: [['s','Yes'],['k','No']],
//        randomOrder: false,
//        presentHorizontally: true,
//        mode: 'speeded acceptability',
//        display: 'in place',
//        blankText: '+',
//        wordTime: 225,
//        wordPauseTime: 100,
//        timeout: 2000}
//];

// Add breaks every 12 items
function modifyRunningOrder(ro)
{
    for (var i = 0; i < ro.length; ++i)
    {
        if (i % 12 == 10
            && i > 13
            && i < 385)
        {
            ro[i].push(new DynamicElement(
                "Message",
                {html: "<p>Please take a short break. Press a button to continue when you're ready.</p>", transfer: "keypress"},
            true));
            ro[i].push(new DynamicElement(
                "Separator",
                {transfer: 2500, normalMessage: "Hands in place! The sentences are about to begin again."},
            true));
        }
    }
    return ro;
}

// Items array.
var items = [

["setcounter", "__SetCounter__", { }],
["timeoutSep", Separator, { transfer: 250, normalMessage: "", errorMessage: "Timed out. Please respond more quickly."}],

//["consent", "Form", {consentRequired: true, html: {include: "consent.html"}}],
["intro", "SSForm", {consentRequired: true, html: {include: "intro.html"}}],
["debrief", "Form", {consentRequired: true, html: {include: "debrief.html"}}],
["exit", "Form", {consentRequired: true, html: {include: "exit.html"}}],

["prepractice", "Form", {consentRequired: true, html: {include: "practice1.html"}}],
["prepractice", "Form", {consentRequired: true, html: {include: "practice2.html"}}],
["prepractice", "Form", {consentRequired: true, html: {include: "practice3.html"}}],

["practice", Message, {consentRequired: false,
                   html: ["div",
                           ["p", "Let's try the first practice item. After clicking the link you should get your hands ready. Your left pointer finger should be on the 'f' key and your right pointer finger on the 'j' key."]
                         ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],


["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "How was that?"],
                          ["p", "Let's try another one."]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the work to the manager","the manager the work"], randomOrder: ["f","j"]}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "Alright, that's it for practice!"],
                          ["p", "Press the link when you're ready to begin, and please pay attention throughout the experiment. Have Fun!"]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

[["LOON-AnimInsitu",	1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",	1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  2],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  2],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   2],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   2],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  4],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  4],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   4],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   4],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  5],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  5],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   5],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   5],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  6],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  6],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   6],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   6],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],




[["f-Fill",		901], "EPDashedSentence", {s:"+"}, DS, {s:"The owner knew the customer that the busboys with the plate are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}]


];
