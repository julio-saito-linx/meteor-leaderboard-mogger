enableMogger = function() {
    /**
     * instantiate mogger
     * add the surrogateTargets array.
     */
    var mogger = new Mogger({
        surrogateTargets: [
            { title: 'Players', target: Players },
            { title: 'Session', target: Session },
            { title: 'Template.leaderboard', target: Template.leaderboard },
            { title: 'Template.player', target: Template.player },
        ],
        globalBeforeConfig: {
            css: 'color: #555; font-size: 12px',
            size: 20,
            randomColor: true
        },
        showArguments: true
    });

    /**
     * tracing all methods from simple_obj_1
     */
    mogger.traceObj({
        before: { message: 'Players:' }, targetTitle: 'Players'
    });

    mogger.traceObj({
        before: { message: 'Session:' }, targetTitle: 'Session'
    });

    mogger.traceObj({
        before: { message: 'T.leaderboard:' }, targetTitle: 'Template.leaderboard'
    });

    mogger.traceObj({
        before: { message: 'T.player:' }, targetTitle: 'Template.player'
    });

};
