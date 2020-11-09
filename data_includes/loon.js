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
    'prepractice',
    'practice',
    sepWith("timeoutSep", rshuffle(startsWith('ROC'),startsWith('f'))),
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
        wordTime: 225,
        wordPauseTime: 100,
        timeout: 2000}
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
                           ["p", "Let's try the first practice item. After clicking the link you should get your hands ready. Your right hand will be on 'J' and 'K' (pointer finger on 'J' and middle finger on 'K') and your left hand on the '1-3' keys"]
                         ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],


["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I know those cats was...", as: [['j','J = test'],['k','K = test2']]}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "How was that? That item is one that some, but not all, English speakers judge to be ungrammatical."],
                          ["p", "Let's try another one."]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I saw the students were..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "That probably felt different than the last one. Many English speakers judge that last sentence to be grammatical. "],
                          ["p", "Now let's try a few in a row. These will be longer, and more similar to the ones you'll see in the experiment"]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

["practice", "EPDashedSentence", {s:"+"}, DS, {s: "The prince waltzed with every girl who he are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I turned and screamed at the waiter who the customers always is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
["practice", "EPDashedSentence", {s:"+"}, DS, {s: "Did you sit up all night worrying about the man who is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "Alright, that's it for practice!"],
                          ["p", "Press the link when you're ready to begin, and please pay attention throughout the experiment. Have Fun!"]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

[["ROC-MatchGram",			1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclub that the advertisement on the telephone pole is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclub that the advertisement on the telephone pole are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclub that the advertisement on the telephone poles is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclub that the advertisement on the telephone poles are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclubs that the advertisement on the telephone pole is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	1],			"EPDashedSentence", {s:"+"}, DS, {s:"John checked out the fancy nightclubs that the advertisement on the telephone pole are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],	
[["ROC-MatchGram",			2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone pole that the advertisement for the fancy nightclub is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone pole that the advertisement for the fancy nightclub are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone pole that the advertisement for the fancy nightclubs is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone pole that the advertisement for the fancy nightclubs are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone poles that the advertisement for the fancy nightclub is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	2],			"EPDashedSentence", {s:"+"}, DS, {s:"Sarah leaned on the telephone poles that the advertisement for the fancy nightclub are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],	
[["ROC-MatchGram",			3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant tree that the path to the famous monument is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant tree that the path to the famous monument are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant tree that the path to the famous monuments is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant tree that the path to the famous monuments are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant trees that the path to the famous monument is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	3],			"EPDashedSentence", {s:"+"}, DS, {s:"Bill trimmed the giant trees that the path to the famous monument are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],	
[["ROC-MatchGram",			4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monument that the path by the giant tree is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monument that the path by the giant tree are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monument that the path by the giant trees is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monument that the path by the giant trees are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monuments that the path by the giant tree is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	4],			"EPDashedSentence", {s:"+"}, DS, {s:"Brian photographed the famous monuments that the path by the giant tree are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false	}],	
[["ROC-MatchGram",			5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansion that the sign on the old highway is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansion that the sign on the old highway are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansion that the sign on the old highways is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansion that the sign on the old highways are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansions that the sign on the old highway is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	5],			"EPDashedSentence", {s:"+"}, DS, {s:"Alex visited the massive mansions that the sign on the old highway are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],	
[["ROC-MatchGram",			6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highway that the sign near the massive mansion is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-MatchUnGram",		6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highway that the sign near the massive mansion are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchGram",		6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highway that the sign near the massive mansions is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-PPMismatchUngram",	6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highway that the sign near the massive mansions are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchGram",	6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highways that the sign near the massive mansion is..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],
[["ROC-ORCMismatchUngram",	6],			"EPDashedSentence", {s:"+"}, DS, {s:"Caroline looked for the old highways that the sign near the massive mansion are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}],	




[["f-GramFill",		901], "EPDashedSentence", {s:"+"}, DS, {s:"The owner knew the customer that the busboys with the plate are..."},Question,{q: 'Please rate your confidence',as: ['Not at all confident','Somewhat confident','Very confident'],randomOrder: false,presentHorizontally: false}]


];
