var transforByType = function transforByType(parameter, withComma) {
    var comma = '';
    if(withComma){
        comma = ', ';
    }

    if(_.isString(parameter)){
        return comma + '\'' + parameter + '\'';
    }
    else if(_.isArray(parameter)){
        var finalArray = '[';
        var innerComma = '';
        for (var i = 0; i < parameter.length; i++) {
            if(finalArray.length > 1){
                innerComma = ', ';
            }
            finalArray = finalArray + innerComma + transforByType(parameter[i]);
        }
        return finalArray + ']';
    }
    else if(_.isObject(parameter)){
        return comma + JSON.stringify(parameter);
    }
    else if(_.isFunction(parameter)){
        return comma + parameter + '()';
    }
    else{
        return comma + parameter;
    }
};

enableMogger = function() {
    /**
     * instantiate mogger
     * add the surrogateTargets array.
     */

    var GLOBAL_CSS = [
                        'font-size: 14px;' +
                        ''
                     ].join();

    mogger = new Mogger({
        surrogateTargets: [
            { title: 'Players', target: Players },
            { title: 'Session', target: Session },
            { title: 'Template.leaderboard', target: Template.leaderboard },
            { title: 'Template.player', target: Template.player },
        ],
        globalBeforeConfig: {
            size: 18
        },
        globalInterceptors: [
            {
                filterRegex: /^(get|set|equals|_ensureKey|_getFindOptions|_getFindSelector|find(One)?)$/,
                callback: function(info) {
                    var arg0 = '', arg1 = '';
                    if(info.args[0]){
                        arg0 = transforByType(info.args[0]);
                    }
                    if(info.args[1]){
                        arg1 = transforByType(info.args[1]);
                    }

                    return info.method + '( ' + arg0 + arg1 + ' )';
                }
            }
        ],
        showArguments: true,
    });

    /**
     * tracing all methods from simple_obj_1
     */
    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #277' },
        before: { message: 'Players:' }, targetTitle: 'Players'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #727' },
        before: { message: 'Session:' }, targetTitle: 'Session'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #772' },
        before: { message: 'T.leaderboard:' }, targetTitle: 'Template.leaderboard'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #272' },
        before: { message: 'T.player:' }, targetTitle: 'Template.player'
    });

};
