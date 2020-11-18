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
    //'debrief',
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

[["LOON-AnimInsitu",	1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",	1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the boss assigned", as: ["the work to the manager","the manager the work"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the worker who the boss assigned", as: ["to the manager","the manager"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the work that the boss assigned", as: ["to the manager","the manager"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  2],     "EPDashedSentence", {s:"+"}, DS, {s: "I heard that the orchestra conductor recommended", as: ["the musician to the composer","the composer the musician"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  2],     "EPDashedSentence", {s:"+"}, DS, {s: "I heard that the orchestra conductor recommended", as: ["the music to the composer","the composer the music"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   2],     "EPDashedSentence", {s:"+"}, DS, {s: "I heard the musician who the orchestra conductor recommended", as: ["to the composer","the composer"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   2],     "EPDashedSentence", {s:"+"}, DS, {s: "I heard the music that the orchestra conductor recommended", as: ["to the composer","the composer"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw that the archivist brought", as: ["the painter to the curator","the curator the painter"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw that the archivist brought", as: ["the paint to the curator","the curator the paint"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the painter who the archivist brought", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   3],     "EPDashedSentence", {s:"+"}, DS, {s: "I saw the paint that the archivist brought", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  4],     "EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the mother gave", as: ["the toddler to the father","the father the toddler"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  4],     "EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the mother gave", as: ["the stroller to the father","the father the stroller"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",   4],     "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the toddler who the mother gave", as: ["to the father","the father"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   4],     "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the stroller that the mother gave", as: ["to the father","the father"], randomOrder: ["f","j"]}],



[["f-Fill",		901], "EPDashedSentence", {s:"+"}, DS, {s: "I heard that the wealthy doner gave", as: ["a huge donation to the university","the university a huge donation"], randomOrder: ["f","j"]}]


];
