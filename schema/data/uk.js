'use strict';

const gt = require('./../../modules/gettext');

module.exports = exports = {
    rights: [
        {
            name: gt.gettext("Paid annual leave"),
            quantity: 28,
            rules: [
                {
                    type: "entry_date",
                    title: gt.gettext("The creation of the request can be made in the period of renewal, with 30 days of tolerance"),
                    min: 30,
                    max: 30
                },
                {
                    type: "request_period",
                    title: gt.gettext("The absence must be within the renewal period"),
                    min: 0,
                    max: 0
                }
            ],
            renewal: {
                start: {
                    month:0,
                    day:1
                }
            }
        },
        {
            name: gt.gettext("Ordinary Maternity Leave"),
            quantity: 130, // 26 weeks
            activeFor: {  account: false }
        },
        {
            name: gt.gettext("Additional Maternity Leave"),
            quantity: 130, // 26 weeks
            activeFor: {  account: false }
        }
    ]
};