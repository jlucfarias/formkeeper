const formkeeper = (form = undefined, offlineCallback) => {
  var isOffline = false, storageEmpty = true, timeOutID, target;
  const req = new XMLHttpRequest();

  const isOnline = (url) => {
    req.open('get', window.location.origin, false);
    req.onreadystatechange = () => {
      if (req.status === 200 && req.readyState === 4) {
        isOffline = !(window.navigator.onLine && req.responseText);
        return !isOffline;
      }
    };
    req.send();
  };

  const sendData = (form, data) => {
    req.open('post', form.action, true);
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.onreadystatechange = () => { // Call a function when the state changes.
      if (req.readyState === XMLHttpRequest.DONE && req.status === 200 && !storageEmpty) {
        localStorage.removeItem(form.id);
      }
    }
    req.send(JSON.stringify(data));
  };

  const checkStorage = (forms, isTimeout) => {
    if (isOnline() && typeof Storage !== 'undefined') {
      forms.forEach(form => {
        const item = localStorage.getItem(form.id);
        const entry = item && JSON.parse(item);

        entry && sendData(form, entry.data);
      });
      storageEmpty = true;
      isTimeout && clearTimeout(timeOutID);
    }
  }

  if (form !== undefined) {
    if (typeof form === 'string') target = [...document.querySelector(form)];
    else if (Array.isArray(form)) {
      if (form[0] instanceof NodeList) target = form;
      else if (form[0] instanceof String) target = form.map(formName => document.querySelector(formName));
    }
  } else {
    target = [...document.querySelectorAll('form')];
  }

  window.addEventListener('load', () => checkStorage(target));
  window.addEventListener('online', () => checkStorage(target));
  window.addEventListener('offline', isOnline);

  target.forEach(element => {
    element.addEventListener('submit', event => {
      event.preventDefault();
      var data = {};
      const fields = element.elements.filter((field) => field.name && field.value && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit');

      fields.forEach(field => {
        data[field.name] = field.value;
      });

      if (isOnline()) {
        sendData(element, data);
      } else {
        offlineCallback && offlineCallback();
        if (typeof Storage !== 'undefined') {
          const entry = {
            time: new Date().getTime(),
            data: data,
          };
          localStorage.setItem(element.id, JSON.stringify(entry));
        }
        storageEmpty = false;
        timeOutID = setTimeout(checkStorage, 1500, target, true);
      }
    });
  });
}

module.exports = formkeeper;
