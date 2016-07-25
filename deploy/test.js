var environments = {
    'test':{
        pdm: function(domain) {
            return 'http://localhost:8180/' + (domain ? domain : EasyAssess.session.domain) + '/data/'
        },

        assess: function(domain) {
            return 'http://localhost:9190/' + (domain ? domain : EasyAssess.session.domain) + '/assess/'
        }
    }
};

window._activeEnv = environments.test;