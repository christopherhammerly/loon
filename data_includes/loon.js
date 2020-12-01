// ROCOUT - 6 point online rating version
// Implements word by word presentation, with 6 point judgment scale at the end
// (a modified version of van Dyke & Lewis (2003) methodology)

// Asserts breaks every 12 items.

PennController.DebugOff();

var showProgressBar = true;

// Main shuffleSequence definition
var shuffleSequence = seq(
    'intro',
    'setcounter',
    'prepractice',
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
var completionMessage = "Thank you for your participation. Your completion code is 1E1230E5. To complete this experiment, go to: https://app.prolific.ac/submissions/complete?cc=1E1230E5."; 
var completionErrorMessage = "There was an error in sending your data to the server. You may still complete this experiment. Your completion code is 1E1230E5. Please go to: https://app.prolific.ac/submissions/complete?cc=1E1230E5."; 


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
["timeoutSep", Separator, { transfer: 1000, normalMessage: "", errorMessage: "Timed out. Please respond with your first instinct."}],

//["consent", "Form", {consentRequired: true, html: {include: "consent.html"}}],
["intro", "Form", {consentRequired: true, html: {include: "intro.html"}}],
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


["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I saw the boss assigned", as: ["the salesman to the customer","the customer the salesman"], randomOrder: ["f","j"]}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "How was that?"],
                          ["p", "Let's try a few in a row."]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I remembered the mother brought", as: ["the nurse to the child","the child the nurse"], randomOrder: ["f","j"]}],
["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I saw the teacher showed", as: ["the painting to the student","the student the painting"], randomOrder: ["f","j"]}],
["practice", "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the secretary recommended", as: ["the stylist to the bride","the bride the stylist"], randomOrder: ["f","j"]}],

["practice", Message, {consentRequired: false,
                  html: ["div",
                          ["p", "Alright, that's it for practice!"],
                          ["p", "Press the link when you're ready to begin, and please pay attention throughout the experiment. Have Fun!"]
                        ]}],

['practice',"Separator",{transfer: 2500, normalMessage: "Get your hands in place!"}],

[["LOON-AnimInsitu",  1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the boss assigned", as: ["the worker to the manager","the manager the worker"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the boss assigned", as: ["the work to the manager","the manager the work"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the worker who the boss assigned", as: ["to the manager","the manager"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   1],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the work that the boss assigned", as: ["to the manager","the manager"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  2],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard that the orchestra conductor recommended", as: ["the musician to the composer","the composer the musician"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  2],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard that the orchestra conductor recommended", as: ["the music to the composer","the composer the music"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  2],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard the musician who the orchestra conductor recommended", as: ["to the composer","the composer"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   2],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard the music that the orchestra conductor recommended", as: ["to the composer","the composer"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  3],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the archivist brought", as: ["the painter to the curator","the curator the painter"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  3],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the archivist brought", as: ["the painting to the curator","the curator the painting"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  3],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the painter who the archivist brought", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   3],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the painting that the archivist brought", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  4],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the mother gave", as: ["the toddler to the father","the father the toddler"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  4],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the mother gave", as: ["the stroller to the father","the father the stroller"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  4],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the toddler who the mother gave", as: ["to the father","the father"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   4],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the stroller that the mother gave", as: ["to the father","the father"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  5],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the manager assigned", as: ["the cashier to the trainee","the trainee the cashier"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  5],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the manager assigned", as: ["the register to the trainee","the trainee the register"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  5],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the cashier who the manager assigned", as: ["to the trainee","the trainee"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   5],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the register that the manager assigned", as: ["to the trainee","the trainee"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  6],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the valet brought", as: ["the driver to the traveler","the traveler the driver"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  6],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the valet brought", as: ["the taxi to the traveler","the traveler the taxi"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  6],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the driver who the valet brought", as: ["to the traveler","the traveler"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   6],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the taxi that the valet brought", as: ["to the traveler","the traveler"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  7],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the dad gave", as: ["the baby to the nanny","the nanny the baby"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  7],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the dad gave", as: ["the cradle to the nanny","the nanny the cradle"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  7],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the baby who the dad gave", as: ["to the nanny","the nanny"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   7],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the cradle that the dad gave", as: ["to the nanny","the nanny"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  8],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the doctor assigned", as: ["the therapist to the patient","the patient the therapist"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  8],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the doctor assigned", as: ["the therapy to the patient","the patient the therapy "], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  8],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the therapist who doctor assigned", as: ["to the patient","the patient"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   8],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the therapy the doctor assigned", as: ["to the patient","the patient"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  9],			"EPDashedSentence", {s:"+"}, DS, {s: "I remember that the hiring manager promised", as: ["the intern to the administrator","the administrator the intern"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  9],			"EPDashedSentence", {s:"+"}, DS, {s: "I remember that the hiring manager promised", as: ["the assistance to the administrator","the administrator the assistance"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  9],			"EPDashedSentence", {s:"+"}, DS, {s: "I remember the intern who the hiring manager promised", as: ["to the administrator","the administrator"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   9],			"EPDashedSentence", {s:"+"}, DS, {s: "I remember the assistance that the hiring manager promised", as: ["to the administrator","the administrator"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  10],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the hostess showed", as: ["the dancer to the guest","the guest the dancer"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  10],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the hostess showed", as: ["the dance to the guest ","the guest the dance"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  10],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the dancer who the hostess showed", as: ["to the guest","the guest"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   10],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the dance that the hostess showed", as: ["to the guest ","the guest"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  11],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the nurse brought", as: ["the doctor to the patient","the patient the doctor"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  11],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the nurse brought", as: ["the medicine to the patient","the patient the medicine"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  11],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the doctor who the nurse brought", as: ["to the patient","the patient "], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   11],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the medicine that the nurse brought", as: ["to the patient","the patient "], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  12],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the travel blogger recommended", as: ["the pilot to the passenger","the passenger the pilot"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  12],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the travel blogger recommended", as: ["the plane to the passenger","the passenger the plane"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  12],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the pilot who the travel blogger recommended", as: ["to the passenger","the passenger"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   12],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the plane that the travel blogger recommended", as: ["to the passenger","the passenger"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  13],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the famous director assigned", as: ["the designer to the actor","the actor the designer"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  13],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the famous director assigned", as: ["the design to the actor","the actor the design"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  13],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the designer who the famous director assigned", as: ["to the actor","the actor"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   13],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the design that the famous director assigned", as: ["to the actor","the actor"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  14],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the art critic showed", as: ["the painter to the student","the student the painter"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  14],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the art critic showed", as: ["the painting to the student","the student the painting"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  14],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the painter who the art critic showed", as: ["to the student","the student"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   14],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the painting that the art critic showed", as: ["to the student","the student"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  15],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the building manager promised", as: ["the contractor to the boss","the boss the contractor"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  15],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the building manager promised", as: ["the contract to the boss","the boss the contract"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  15],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the contractor who the building manager promised", as: ["to the boss","the boss"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   15],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the contract that the building manager promised", as: ["to the boss","the boss"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  16],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the local expert recommended", as: ["the brewer to the tourist","the tourist the brewer"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  16],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the local expert recommended", as: ["the brewery to the tourist","the tourist the brewery"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  16],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the brewer who the local expert recommended", as: ["to the tourist","the tourist"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   16],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the brewery that the local expert recommended", as: ["to the tourist","the tourist"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  17],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the principal assigned", as: ["the teacher to the student","the student the teacher"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  17],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the principal assigned", as: ["the lesson to the student","the student the lesson"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  17],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the teacher who the principal assigned", as: ["to the student","the student"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   17],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the lesson that the principal assigned", as: ["to the student","the student"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  18],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the teacher showed", as: ["the farmer to the child","the child the farmer"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  18],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the teacher showed", as: ["the farm to the child","the child the farm"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  18],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the farmer who the teacher showed", as: ["to the child","the child"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   18],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the farm that the teacher showed", as: ["to the child","the child"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  19],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the tour guide gave", as: ["the student to the chaperone","the chaperone the student"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  19],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the tour guide gave", as: ["the luchbox to the chaperone","the chaperone the luchbox"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  19],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the student who the tour guide gave", as: ["to the chaperone","the chaperone"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   19],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the luchbox that the tour guide gave", as: ["to the chaperone","the chaperone"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  20],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the assistant showed", as: ["the reporter to the senator","the senator the reporter"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  20],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the assistant showed", as: ["the report to the senator","the senator the report"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  20],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the reporter who the assistant showed", as: ["to the senator","the senator"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   20],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the report that the assistant showed", as: ["to the senator","the senator"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  21],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the judge promised", as: ["the witness to the lawyer","the lawyer the witness"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  21],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the judge promised", as: ["the evidence to the lawyer","the lawyer the evidence"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  21],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the witness who the judge promised", as: ["to the lawyer","the lawyer"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   21],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the evidence that the judge promised", as: ["to the lawyer","the lawyer"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  22],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the critic recommended", as: ["the chef to the reporter","the reporter the chef"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  22],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the critic recommended", as: ["the restaurant to the reporter","the reporter the restaurant"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  22],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the chef who the critic recommended", as: ["to the reporter","the reporter"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   22],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the restaurant that the critic recommended", as: ["to the reporter","the reporter"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  23],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the director promised", as: ["the cameraman to the producer","the producer the cameraman"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  23],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the director promised", as: ["the camera to the producer","the producer the camera"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  23],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the cameraman who the director promised", as: ["to the producer","the producer"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   23],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the camera that the director promised", as: ["to the producer","the producer"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  24],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the publisher assigned", as: ["the author to the agent","the agent the author"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  24],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the publisher assigned ", as: ["the book to the agent","the agent the book"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  24],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the author who the publisher assigned", as: ["to the agent","the agent"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   24],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the book that the publisher assigned", as: ["to the agent","the agent"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  25],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the police chief assigned", as: ["the investigator to the detective","the detective the investigator"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  25],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the police chief assigned", as: ["the investigation to the detective","the detective the investigation"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  25],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the investigator who the police chief assigned", as: ["to the detective","the detective"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   25],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the investigation that the police chief assigned", as: ["to the detective","the detective"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  26],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the publisher promised", as: ["the illustrator to the author","the author the illustrator"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  26],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the publisher promised", as: ["the illustration to the author","the author the illustration"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  26],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the illustrator who the publisher promised", as: ["to the author","the author"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   26],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the illustration that the publisher promised", as: ["to the author","the author"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  27],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard that the journalist showed", as: ["the announcer to the reporter","the reporter the announcer"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  27],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard that the journalist showed", as: ["the announcement to the reporter","the reporter the announcement"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  27],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard the announcer who the journalist showed", as: ["to the reporter","the reporter"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   27],			"EPDashedSentence", {s:"+"}, DS, {s: "I heard the announcement that the journalist showed", as: ["to the reporter","the reporter"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  28],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the dog trainer gave", as: ["the puppy to the owner","the owner the puppy"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  28],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the dog trainer gave", as: ["the collar to the owner","the owner the collar"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  28],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the puppy who the dog trainer gave", as: ["to the owner","the owner"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   28],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the collar that the dog trianer gave", as: ["to the owner","the owner"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  29],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the neighbor brought", as: ["the gardener to the homeowner","the homeowner the gardener"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  29],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the neighbor brought", as: ["the mulch to the homeowner","the homeowner the mulch"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  29],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the gardener who the neighbor brought", as: ["to the homeowner","the homeowner"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   29],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the mulch that the neighbor brought", as: ["to the homeowner","the homeowner"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  30],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the concerned woman brought", as: ["the doctor to the patient","the patient the doctor"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  30],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the concerned woman brought", as: ["the medicine to the patient","the patient the medicine"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  30],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the doctor who the concerned woman brought", as: ["to the patient","the patient"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   30],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the medicine that the concerned woman brought", as: ["to the patient","the patient"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  31],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the reporter brought", as: ["the cameraman to the interviewer","the interviewer the cameraman"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  31],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the reporter brought", as: ["the camera to the interviewer","the interviewer the camera"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  31],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the cameraman who the reporter brought", as: ["to the interviewer","the interviewer"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   31],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the camera that the reporter brought", as: ["to the interviewer","the interviewer"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  32],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the mother showed", as: ["the librarian to the child","the child the librarian"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  32],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the mother showed", as: ["the library to the child","the child the library"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  32],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the librarian who the mother showed", as: ["to the child","the child"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   32],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the library that the mother showed", as: ["to the child","the child"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  33],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the art critic showed", as: ["the sculptor to the curator","the curator the sculptor"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  33],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw that the art critic showed", as: ["the sculpture to the curator","the curator the sculpture"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  33],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the sculptor who the art critic showed", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   33],			"EPDashedSentence", {s:"+"}, DS, {s: "I saw the sculpture that the art critic showed", as: ["to the curator","the curator"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  34],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the librarian recommended", as: ["the researcher to the professor","the professor the researcher"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  34],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the librarian recommended", as: ["the journal to the professor","the professor the journal"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  34],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the researcher who the librarian recommended", as: ["to the professor","the professor"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   34],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the journal that the librarian recommended", as: ["to the professor","the professor"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  35],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the vet gave", as: ["the dog to the girl","the girl the dog"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  35],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the vet gave", as: ["the leash to the girl","the girl the leash"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  35],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the dog who the vet gave", as: ["to the girl","the girl"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   35],			"EPDashedSentence", {s:"+"}, DS, {s: "I noticed the leash that the vet gave", as: ["to the girl","the girl"], randomOrder: ["f","j"]}],

[["LOON-AnimInsitu",  36],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the party planner recommended", as: ["the bartender to the bachelorette","the bachelorette the bartender"], randomOrder: ["f","j"]}],
[["LOON-InanInsitu",  36],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the party planner recommended", as: ["the bar to the bachelorette","the bachelorette the bar"], randomOrder: ["f","j"]}],
[["LOON-AnimMoved",	  36],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the bartender who the party planner recommended", as: ["to the bachelorette","the bachelorette"], randomOrder: ["f","j"]}],
[["LOON-InanMoved",   36],			"EPDashedSentence", {s:"+"}, DS, {s: "I remembered the bar that the party planner recommend", as: ["to the bachelorette","the bachelorette"], randomOrder: ["f","j"]}],

//Copy/paste ^ 36x and re-number them
//don't put linebreak between items yet
//copy/paste items from right to left
//repeat with fillers





[["f-Fill",		901], "EPDashedSentence", {s:"+"}, DS, {s: "I heard that the wealthy doner gave", as: ["a huge donation to the university","the university a huge donation"], randomOrder: ["f","j"]}],
[["f-Fill",		902], "EPDashedSentence", {s:"+"}, DS, {s: "I heard that the truck driver brought", as: ["the crate to the shipyard","the shipyard the crate"], randomOrder: ["f","j"]}],
[["f-Fill",		903], "EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the inspector gave", as: ["a citation to the restaurant","the restaurant a citation"], randomOrder: ["f","j"]}],
[["f-Fill",		904], "EPDashedSentence", {s:"+"}, DS, {s: "I remembered that the banker promised", as: ["the loan to the company","the company the loan"], randomOrder: ["f","j"]}],
[["f-Fill",		905], "EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the manager assigned", as: ["the crane to the construction site","the construction site the crane"], randomOrder: ["f","j"]}],
[["f-Fill",		906], "EPDashedSentence", {s:"+"}, DS, {s: "I noticed that the publisher recommended", as: ["the story to the newspaper","the newspaper the story"], randomOrder: ["f","j"]}],
[["f-Fill",		907], "EPDashedSentence", {s:"+"}, DS, {s: "I remembered the lion that the zookeeper fed", as: ["the big meal to","the big meal"], randomOrder: ["f","j"]}],
[["f-Fill",		908], "EPDashedSentence", {s:"+"}, DS, {s: "I heard the preacher who the church offered", as: ["the job to","the job"], randomOrder: ["f","j"]}],
[["f-Fill",		909], "EPDashedSentence", {s:"+"}, DS, {s: "I saw the judge who the juror passed", as: ["the verdict to","the verdict"], randomOrder: ["f","j"]}],
[["f-Fill",		910], "EPDashedSentence", {s:"+"}, DS, {s: "I saw the impatient woman who the mailman handed", as: ["the letter to","the letter"], randomOrder: ["f","j"]}],
[["f-Fill",		911], "EPDashedSentence", {s:"+"}, DS, {s: "I heard the child who the mother promised", as: ["the present to","the present"], randomOrder: ["f","j"]}],
[["f-Fill",		912], "EPDashedSentence", {s:"+"}, DS, {s: "I saw the patient who the doctor recommended", as: ["the medication to","the medication"], randomOrder: ["f","j"]}],
[["f-Fill",		913], "EPDashedSentence", {s:"+"}, DS, {s: "I saw the principal who the teacher brought", as: ["the student to","the student"], randomOrder: ["f","j"]}],
[["f-Fill",		914], "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the police officer who the vigilante gave", as: ["the criminal to","the criminal"], randomOrder: ["f","j"]}],
[["f-Fill",		915], "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the witness who the judge assigned", as: ["the bodyguard to","the bodyguard"], randomOrder: ["f","j"]}],
[["f-Fill",		916], "EPDashedSentence", {s:"+"}, DS, {s: "I remembered the director who the casting agent recommended", as: ["the actor to","the actor"], randomOrder: ["f","j"]}],
[["f-Fill",		917], "EPDashedSentence", {s:"+"}, DS, {s: "I saw the composer who the talent scout showed", as: ["the singer to","the singer"], randomOrder: ["f","j"]}],
[["f-Fill",		918], "EPDashedSentence", {s:"+"}, DS, {s: "I noticed the dog trainer who the vet gave", as: ["the dog to","the dog"], randomOrder: ["f","j"]}]
//!!!!!!!add commas to first 17, no comma after 18th!!!!!!

];
