Save easily your form data in the browser when you are offline

## Features

- **Ligthweight:** it's <1kb gzipped
- **Simple:** use in specific form, an array of forms or in all forms in the page

## Usage

Formkeeper exports a single function, which will get the specified form, or and array of forms, or all forms in a page and prepare them to be connection-safely and send the data as soon as possible to the server.

The formkeeper module is available in: ES Modules, CommonJS, UMD...

```js
formkeeper("#contact"); // passing the id of one form, but you can pass classes too

formkeeper(["#contact", ".search"]) // passing multiple forms

formkeeper() // apply in all forms
```

## Explanation

All the data is stored in [localstorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) when the user gets offline and when the connection with the internet are available, the data stored is sent to the server.

## License

MIT
