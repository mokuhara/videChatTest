export default class CookieHandler {
  constructor(key) {
    this.key = key;
  }

  getCookie() {
    const cookiesArr = document.cookie.split(";");
    const cookie = cookiesArr.find((cookie) => {
      const decodeCookie = decodeURIComponent(cookie);
      const coookieKey = decodeCookie.split("=")[0].trim();
      return coookieKey === this.key;
    });
    if (!cookie || !cookie.split("=")[1]) return "";
    return JSON.parse(decodeURIComponent(cookie).split("=")[1]);
  }

  setCookie(account) {
    const jsonVal = {
      uid: account.uid,
      name: account.name,
      iconUrl: account.iconUrl,
    };
    document.cookie =
      this.key + "=" + encodeURIComponent(JSON.stringify(jsonVal));
  }

  resetCoookie() {
    document.cookie = this.key + "=; expires=0";
  }

  isLogin() {
    console.log(this.getCookie());
    return this.getCookie() ? true : false;
  }
}
