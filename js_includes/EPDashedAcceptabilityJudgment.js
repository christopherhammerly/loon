/**
 * Modified form of AcceptabilityJudgment.
 *
 * @author Ethan Poole
 */

define_ibex_controller({
    name: "EPDashedAcceptabilityJudgment",
    jqueryWidget: {
        _init: function () {
            this.options._dashed = true;
            if (this.options.mode === undefined)
                this.options.mode = "speeded acceptability";
            $(this.element).EPAcceptabilityJudgment(this.options);
        }
    },
    properties: {
        obligatory: ["s", "as"],
        htmlDescription: function (opts) {
            var s = ibex_controller_get_property("EPDashedSentence",
                                                 "htmlDescription")(opts);
            var q = ibex_controller_get_property("QuestionAlt",
                                                 "htmlDescription")(opts);
            var p =
                $("<p>")
                .append($("<p>").append("Q: ").append($(q)))
                .append("<br>").append($("<b>").text("S:"))
                .append($(s));
            return p;
        }
    }
});
