'use strict';



/**
 * Validate params fields
 * @param {apiService} service
 * @param {Object} params
 */
function validate(service, params) {

    if (service.needRequiredFields(params, ['account', 'rightCollection', 'from'])) {
        return;
    }
    
    saveAccountCollection(service, params);
}




/**
 * Get account ID from query
 * @param {saveItemService} service
 * @param {object} params
 * @param {function} next
 */ 
function getAccount(service, params, next) {

    if (params.account) {
        next(params.account);
        return;
    }

    if (!params.user) {
        service.forbidden(service.gt.gettext('Cant create accountCollection, missing user or account'));
        return;
    }

    // find account from user
    service.models.User.findById(params.user, function(err, user) {
        if (service.handleMongoError(err)) {

            if (!user) {
                service.notFound(service.gt.gettext('User not found'));
                return;
            }

            if (!user.account) {
                service.forbidden(service.gt.gettext('The user has no vacation account, collections are only linkable to accounts'));
                return;
            }

            next(user.account);
        }
    });
};



    
    
/**
 * Update/create the calendar document
 * 
 * @param {saveItemService} service
 * @param {Object} params
 */  
function saveAccountCollection(service, params) {
    
    var AccountCollection = service.models.AccountCollection;
    var util = require('util');
    

    if (params.id) {
        AccountCollection.findById(params.id, function(err, document) {
            if (service.handleMongoError(err)) {
                if (null === document) {
                    service.notFound(util.format(service.gt.gettext('AccountCollection document not found for id %s'), params.id));
                    return;
                }
                
                document.rightCollection 	= params.rightCollection;
                document.from 				= params.from;
                document.to 				= params.to;

                document.save(function (err) {
                    if (service.handleMongoError(err)) {
                        service.resolveSuccess(
                            document, 
                            service.gt.gettext('The account collection has been modified')
                        );
                    }
                });
            }
        });

    } else {

        getAccount(service, params, function(accountId) {
        
            AccountCollection.create({
                    account: accountId,
                    rightCollection: params.rightCollection,
                    from: params.from,
                    to: params.to 
                }, function(err, document) {

                if (service.handleMongoError(err))
                {
                    service.resolveSuccess(
                        document, 
                        service.gt.gettext('The account collection has been created')
                    );
                }
            });
            
        });
    }
}
    
    

    
    
    
    



/**
 * Construct the calendar save service
 * @param   {object}          services list of base classes from apiService
 * @param   {express|object}  app      express or headless app
 * @returns {saveItemService}
 */
exports = module.exports = function(services, app) {
    
    var service = new services.save(app);
    
    /**
     * Call the calendar save service
     * 
     * @param {Object} params
     *
     * @return {Promise}
     */
    service.call = function(params) {
        validate(service, params);
        return service.deferred.promise;
    };
    
    
    return service;
};

