---
title:  Welcome to my first blog with Astro
---




```js
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware((context, next) => {
  // If a basic auth header is present, it wil take the string form: "Basic authValue"
  const basicAuth = context.request.headers.get("authorization");

  if (basicAuth) {
    // Get the auth value from string "Basic authValue"
    const authValue = basicAuth.split(" ")[1] ?? "username:password";

    // Decode the Base64 encoded string via atob (https://developer.mozilla.org/en-US/docs/Web/API/atob)
    // Get the username and password. NB: the decoded string is in the form "username:password"
    const [username, pwd] = atob(authValue).split(":");

    // check if the username and password are valid
    if (username === "admin" && pwd === "admin") {
      // forward request
      return next();
    }
  }

  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-authenticate": 'Basic realm="Secure Area"',
    },
  });
});
```
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |


### Block editor
https://blocky-editor.dev

### yjs
https://yjs.dev/

### chai
https://www.chaijs.com/


### yoopta-editor
https://github.com/Darginec05/Yoopta-Editor


### Grotesk css styles
https://github.com/kartiknair/grotesk

### playcode
https://playcode.io/javascript


### PKG npm
empaquetar .exe node


### turbo de hotfire con astro

### codeForces
 ejecrcios de programacion


### Fonts
circularSt free
```js

html {
font-family: "CircularStd", monospace;
}
@font-face {
	font-family: "CircularStd";
	src: url("./path");
	font-weight: 900;
	font-style: normal;
	font-display: swap;
}
```

### Zustand
global store framwrowk agnostic


### shadercn componentes de React


### https://homebrewery.naturalcrit.com/
impresionnte editor de manual de instrucciones