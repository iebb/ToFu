import React from "react";
import $ from 'jquery';
import {toast} from "react-toastify";

export class Api extends React.Component {
}

Api.endPoint = 'https://mytodo.tech/api';

Api.login = function (username, pass, cb, cbe) {
    if (localStorage.token) {
        if (cb) cb(true);
        return
    }
    this.getToken(username, pass, (res) => {
        if (res.authenticated) {
            localStorage.token = res.token;
            localStorage.user = JSON.stringify(res.data);
            if (cb) cb(true)
        } else {
            if (cb) cb(false)
        }
    }, cbe);
};

Api.logout = function () {
    delete localStorage.token;
    delete localStorage.user;
};

Api.user = function () {
    return JSON.parse(localStorage.user);
};

Api.loggedIn = function () {
    return !!localStorage.token
};

Api.getToken = function (username, pass, cb, cbe) {
    $.ajax({
        type: 'POST',
        url: Api.endPoint + '/auth/',
        data: {
            username: username,
            password: pass
        },
        success: function (res) {
            cb({
                authenticated: true,
                token: res.token,
                data: res
            })
        },
        error: function (data) {
            cbe && cbe(data);
        }
    })
};

Api.createUser = function (data, cb, cbe) {
    $.post({
        url: Api.endPoint + "/user/add",
        data: data,
        success: function (data) {
            cb && cb(data);
        },
        error: function (data) {
            cbe && cbe(data);
        }
    })
};

Api.get = function (endpoint, cb, cbe) {
    if (!localStorage.token) {
        toast.error("Login Required");
        return false;
    }
    $.get({
        url: Api.endPoint + endpoint,
        headers: {
            'Authorization': 'Token ' + localStorage.token,
        },
        success: function (data) {
            cb && cb(data);
        },
        error: function (data) {
            cbe && cbe(data);
        }
    })
};


Api.post = function (endpoint, data, cb, cbe) {
    if (!localStorage.token) {
        toast.error("Login Required");
        return false;
    }
    $.post({
        url: Api.endPoint + endpoint,
        headers: {
            'Authorization': 'Token ' + localStorage.token,
        },
        data: data,
        success: function (data) {
            cb && cb(data);
        },
        error: function (data) {
            cbe && cbe(data);
        }
    })
};

Api.getData = function (endpoint, data, cb, cbe) {
    if (!localStorage.token) {
        toast.error("Login Required");
        return false;
    }
    $.get({
        url: Api.endPoint + endpoint,
        headers: {
            'Authorization': 'Token ' + localStorage.token,
        },
        data: data,
        success: function (data) {
            cb && cb(data);
        },
        error: function (data) {
            cbe && cbe(data);
        }
    })
};