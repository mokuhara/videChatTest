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
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
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
        db.collection("Account")
            .onSnapshot((querySnapshot) => {
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
        console.log('members')
        console.log(members)
        state.members = members;
        console.log(state.members)
    },
    changeActiveStatus(state, status) {
        state.user.isActive = status;
    },
    changePeerId(state, peerId) {
        state.user.peerId = peerId
    },
    changeCallStatus(state, bool) {
        state.callStart = bool
    },
    storeOpponent(state, payload) {
        state.opponent.name = payload.name
        state.opponent.iconUrl = payload.iconUrl
        state.opponent.peerId = payload.peerId
    }
};

export default createStore({
    state,
    mutations,
    actions,
    modules: {},
});