"use strict";
const db = require("../db/db-config");
const Watch = db.watch;
const Alert = db.alert;
const uuid = require('uuid');

exports.isWatchExist = function (watchId) {
    return Watch.count({ where: { watchId: watchId } })
        .then(count => {
            return count !== 0;
        });
}

exports.addWatch = (watch) => {
    return Watch.create({
        watchId: uuid.v4(),
        userId: watch.userId,
        zipcode: watch.zipcode
    });
}

exports.addAlert = (alerts, watchId) => {
    for (let i in alerts) {
        alerts[i]["watchId"] = watchId;
    }
    return Alert.bulkCreate(alerts);
}

exports.updateWatch = (oldWatch, newWatch) => {
    const updatedWatch = {
        zipcode: newWatch.zipcode ? newWatch.zipcode : oldWatch.zipcode
    }
    return Watch.update(updatedWatch, {
        where: {
            watchId: newWatch.watchId
        }
    });
}

exports.updateAlert = (oldAlert, newAlert) => {
    const updatedAlert = {
        fieldType: newAlert[0].fieldType ? newAlert[0].fieldType : oldAlert.fieldType,
        operator: newAlert[0].fieldType ? newAlert[0].operator : oldAlert.operator,
        value: newAlert[0].value ? newAlert[0].value : oldAlert.value
    }
    return Alert.update(updatedAlert, {
        where: {
            alertId: newAlert.alertId
        }
    });
}

exports.deleteWatch = (watchId) => {
    return Watch.destroy({
        where: {
            watchId: watchId
        }
    });
}

exports.getWatch = (watchId) => {
    return Watch.findOne({
        where: {
            watchId: watchId
        },
        include: ["alerts"]
    })
}

exports.getAlert = (alertId) => {
    return Alert.findOne({
        where: {
            alertId: alertId
        }
    })
}
