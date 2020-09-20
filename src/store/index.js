import {
    createStore
} from 'vuex'


import CookieHandler from "./cookie";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
    firebaseConfig
} from "../../config/firebase";

const cookieHandler = new CookieHandler("motoTest");
firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
//
const state = {
    user: {
        uuid: "",
        name: "",
        iconUrl: "",
        peerId: "",
        isActive: "",
        isLogin: false,
    },
};

const actions = {
    checkLogin({
        commit,
        state
    }) {
        if (state.user.isLogin) return;
        if (!cookieHandler.isLogin()) return;
        const user = cookieHandler.getCookie();
        commit("storeUser", user);
    },
    signIn({
        dispatch
    }) {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/userinfo.email");
        firebase.auth().useDeviceLanguage();
        firebase.auth().signInWithPopup(provider);
        dispatch("AuthStateChanged");
    },
    signOut({
        dispatch
    }) {
        firebase.auth().signOut();
        dispatch("AuthStateChanged");
    },
    AuthStateChanged({
        commit
    }) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const _user = {
                    name: user.displayName,
                    iconUrl: user.photoURL,
                    peerId: user.peerId,
                    isActive: user.isActive,
                };
                commit("storeUser", _user);
            } else {
                commit("deleteUser");
            }
        });
    },
};
const mutations = {
    storeUser(state, user) {
        state.user.name = user.name;
        state.user.iconUrl = user.iconUrl;
        (state.user.peerId = user.peerId),
        (state.user.isActive = user.isActive),
        (state.user.isLogin = true);
    },
    deleteUser(state) {
        state.user.name = "";
        state.user.iconUrl = "";
        (state.user.peerId = ""),
        (state.user.isActive = ""),
        (state.user.isLogin = false);
    },
};


export default createStore({
    state,
    mutations,
    actions,
    modules: {

    }
})