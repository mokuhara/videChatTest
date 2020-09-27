import {
    createStore
} from "vuex";

import CookieHandler from "./cookie";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
    firebaseConfig
} from "../../config/firebase";

import axios from "axios";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
const BASEURL = "http://localhost:3000";

const cookieHandler = new CookieHandler("motoTest");
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//
const state = {
    member: {},
    user: {
        uid: "",
        name: "",
        iconUrl: "",
        peerId: "",
        isActive: "",
        isLogin: false,
    },
    members: [],
    opponent: {
        name: "",
        iconUrl: "",
        peerId: "",
    },
    callStart: false,
    chatStart: false,
    peerObj: {},
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
        commit,
        dispatch
    }) {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const idToken = await user.getIdToken();
                const res = await axios.get(
                    BASEURL + "/secret/userinfo", {
                        headers: {
                            Authorization: idToken
                        }
                    }
                );
                if (!res.data) return;
                const _user = {
                    uid: user.uid,
                    name: user.displayName,
                    iconUrl: user.photoURL,
                    peerId: user.peerId,
                    isActive: user.isActive,
                };
                cookieHandler.setCookie(_user);
                commit("storeUser", _user);
                dispatch("storeUser2Firebase");
            } else {
                cookieHandler.resetCoookie();
                commit("deleteUser");
            }
        });
    },
    storeUser2Firebase({
        state,
        dispatch
    }) {
        db.collection("Account")
            .doc(state.user.uid)
            .get()
            .then((doc) => {
                //新規登録の場合
                if (!doc.exists) {
                    db.collection("Account")
                        .doc(state.user.uid)
                        .set({
                            name: state.user.name,
                            iconUrl: state.user.iconUrl,
                            peerId: state.user.peerId,
                            isActive: state.user.isActive,
                            isLogin: state.user.isLogin,
                        })
                        .then(() => {
                            console.log("Document successfully written!");
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                    //既存ユーザーの場合
                } else {
                    db.collection("Account")
                        .doc(state.user.uid)
                        .update({
                            name: state.user.name,
                            iconUrl: state.user.iconUrl,
                            peerId: state.user.peerId,
                            isActive: state.user.isActive,
                            isLogin: state.user.isLogin,
                        })
                        .then(() => {
                            console.log("Document successfully updated!");
                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                        });
                }
                //membersを更新する
                dispatch("getUser2Firebase");
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    },
    findUser2Firebase(_, userId) {
        db.collection("Account")
            .doc(userId)
            .get()
            .then((doc) => {
                if (!doc.exists) console.log("No such document!");
                console.log(doc);
                // commit("storeMember", doc)
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    },
    getUser2Firebase({
        commit
    }) {
        db.collection("Account").onSnapshot((querySnapshot) => {
            let members = [];
            querySnapshot.forEach((doc) => {
                if (!doc.exists) return;
                const id = doc.id;
                let member = doc.data();
                member["uid"] = id;
                members.push(member);
            });
            commit("storeMembers", members);
        });
    },
    storePeerId2DB({
        commit,
        state
    }, peerId) {
        axios
            .post(BASEURL + "/api/v1/peerId/store", {
                uid: state.user.uid,
                peerId: peerId,
            })
            .then((response) => {
                if (!response.data) return;
                commit("changePeerId", response["data"].peerId);
            });
    },
    getPeerIdFromDB({
        commit
    }, uid) {
        axios
            .post(BASEURL + "/api/v1/peerId/search", {
                uid: uid,
            })
            .then((response) => {
                if (!response.data) return;
                commit("changeOpponentPeerId", response["data"].peerId);
            });
    },
    storeChat2DB(_, payload) {
        axios
            .post(BASEURL + "/api/v1/chat/store", {
                thread: payload.thread,
                localUid: payload.localUid,
                remoteUid: payload.remoteUid
            })
            .then((response) => {
                if (!response.data) return;
                console.log(response.data)
            });
    }
};

const mutations = {
    storeUser(state, user) {
        state.user.uid = user.uid;
        state.user.name = user.name;
        state.user.iconUrl = user.iconUrl;
        state.user.peerId = user.peerId || "";
        state.user.isActive = user.isActive || "inactive";
        state.user.isLogin = true;
    },
    deleteUser(state) {
        state.user.uid = "";
        state.user.name = "";
        state.user.iconUrl = "";
        state.user.peerId = "";
        state.user.isActive = "";
        state.user.isLogin = false;
    },
    storeMembers(state, members) {
        state.members = members;
        console.log(state.members);
    },
    changeActiveStatus(state, status) {
        state.user.isActive = status;
    },
    changePeerId(state, peerId) {
        state.user.peerId = peerId;
    },
    changeCallStatus(state, bool) {
        state.callStart = bool;
    },
    changeChatStatus(state, bool) {
        state.chatStart = bool;
    },
    changeOpponentPeerId(state, peerId) {
        state.opponent.peerId = peerId;
    },
    storeOpponent(state, payload) {
        state.opponent.name = payload.name;
        state.opponent.iconUrl = payload.iconUrl;
        state.opponent.peerId = payload.peerId;
    },
    changePeerObj(state, obj) {
        state.peerObj = obj;
    },
};

export default createStore({
    state,
    mutations,
    actions,
    modules: {},
});