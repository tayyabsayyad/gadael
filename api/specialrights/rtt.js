'use strict';

const SpecialRight = require('./specialright');
const gt = require('./../../modules/gettext');

/**
 * Right for "reduction du temps de travail"
 *
 * @constructor
 * @augments specialright
 *
 *
 */
function Rtt() {
    SpecialRight.call(this);

    this.editQuantity = false;

    this.countries = ['FR'];
}


Rtt.prototype = Object.create(SpecialRight.prototype);
Rtt.prototype.constructor = Rtt;


Rtt.prototype.getName = function() {
    return gt.gettext('RTT');
};


Rtt.prototype.getDescription = function() {
    return gt.gettext('Working time reduction right, this right require an annual leave with same renewal period');
};


/**
 * Get initial quantity used by renewals
 * @param {RightRenewal} renewal
 * @return {Promise}
 */
Rtt.prototype.getQuantity = function(renewal, user) {

    return user.getAccount()
    .then(account => {

        return Promise.all([
        //    account.getWeekHours(renewal.start, renewal.finish),
            renewal.getPlannedWorkDayNumber(user), // without week-ends, annual leaves and non working days
            account.getCollection(renewal.start) // collection on period start
        ]);
    })
    .then(all => {

        // all[0] number of potential worked days in the renewal of the annual leave
        // all[1].workedDays agreement worked days

        if (undefined === all[1].workedDays) {
            throw new Error('missing workdays on collection');
        }

        return Math.abs(all[0] - all[1].workedDays);
    });

};


Rtt.prototype.getQuantityLabel = function() {
    return gt.gettext('RTT is computed from the user time schedule on the renewal period');
};


exports = module.exports = Rtt;