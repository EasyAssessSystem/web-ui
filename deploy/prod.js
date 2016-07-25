var environments = {
    'prod':{
        pdm: function(domain) {
            return 'http://103.227.51.161:8180/' + (domain ? domain : EasyAssess.session.domain) + '/data/'
        },

        assess: function(domain) {
            return 'http://103.227.51.161:9190/' + (domain ? domain : EasyAssess.session.domain) + '/assess/'
        }
    }
};

window._activeEnv = environments.prod;