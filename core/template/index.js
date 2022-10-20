import {
  createText,
  validTagOption,
  validObjectOptions,
  isCallable,
  isDefined,
  isObj,
  validDomEvent,
  validStyleName,
  isBool,
  isFalse,
} from "../helpers.js";

import {
  runCanNotRenderConditionallyWarning,
  runIllegalTextWarning,
  runInvalidEventHandlerWarning,
  runInvalidEventWarning,
  runInvalidObjectOptionsError,
  runInvalidRenderIfOptionWarning,
  runInvalidStyleWarning,
  runInvalidTagOptionError,
  runInvalidTemplateArgumentError,
} from "./errors.js";

function createEvents(events, container) {
  Object.entries(events).forEach((event) => {
    const [name, handler] = event;

    if (validDomEvent(name)) {
      if (isCallable(handler)) {
        container[name] = handler;
      } else runInvalidEventHandlerWarning(name);
    } else runInvalidEventWarning(name);
  });
}

function createAttrs(attrs, container) {
  Object.entries(attrs).forEach((attr) => {
    // eslint-disable-next-line prefer-const
    let [name, value] = attr;

    const setAttr = (attrValue) => {
      if (isDefined(attrValue) && !isFalse(attrValue)) {
        if (name !== "value") {
          container.setAttribute(name, attrValue);
        } else {
          container[name] = attrValue;
        }
      }
    };

    if (isCallable(value)) {
      value = value();

      setAttr(value);
    } else {
      setAttr(value);
    }
  });
}

function createStyles(styles, container) {
  Object.entries(styles).forEach((style) => {
    const [name, value] = style;

    if (validStyleName(name)) {
      const styleValue = isCallable(value) ? value() : value;

      if (isDefined(styleValue)) {
        container.style[name] = styleValue;
      }
    } else runInvalidStyleWarning(name);
  });
}

function createTextOrChildren(text, children, container) {
  if (isDefined(text) && children.length == 0) {
    const textContent = isCallable(text)
      ? createText(text())
      : createText(text);

    if (isDefined(textContent)) container.appendChild(textContent);
  } else if (isDefined(text) && children.length > 0) {
    runIllegalTextWarning();
    createChildren(container, children);
  } else {
    if (children.length > 0) {
      createChildren(container, children);
    }
  }
}

export function template(obj) {
  if (isObj(obj)) {
    const temp = Symbol.for("template");

    return {
      [temp]: !0,
      element: obj,
    };
  } else runInvalidTemplateArgumentError(obj);
}

export function toDOM(obj, isChild, index) {
  /* eslint-disable prefer-const */
  let {
    tag,
    text,
    renderIf,
    attrs = {},
    events = {},
    styles = {},
    children = [],
  } = obj;

  /*eslint-enable prefer-const*/

  tag = isCallable(tag) ? tag() : tag;

  if (isDefined(renderIf) && !isChild) {
    runCanNotRenderConditionallyWarning();

    return false;
  }

  if (!validTagOption(tag)) runInvalidTagOptionError(tag);
  if (!validObjectOptions(attrs, styles, events))
    runInvalidObjectOptionsError();

  const container = document.createElement(tag);
  container.template = Object.assign(obj, {
    target: container,
  }); // For diffing task.

  if (isChild) {
    container.index = index;
  }

  createAttrs(attrs, container);
  createEvents(events, container);
  createStyles(styles, container);
  createTextOrChildren(text, children);

  return container;
}

function createChildren(root, children) {
  let index = -1;

  for (const child of children) {
    /* eslint-disable prefer-const */
    let {
      tag,
      text,
      attrs = {},
      events = {},
      styles = {},
      children = [],
      renderIf,
    } = child;

    /* eslint-enable prefer-const */

    index++;
    child.index = index;
    tag = isCallable(tag) ? tag() : tag;

    if (isDefined(renderIf) && isBool(renderIf)) {
      if (isFalse(renderIf)) {
        continue;
      }
    }

    if (isDefined(renderIf) && !isBool(renderIf))
      runInvalidRenderIfOptionWarning(renderIf);

    if (!validTagOption(tag)) runInvalidTagOptionError(tag);

    if (!validObjectOptions(attrs, styles, events))
      runInvalidObjectOptionsError();

    const container = document.createElement(tag);
    container.index = index;
    container.template = Object.assign(child, {
      target: container,
    }); //For diffing task.

    createAttrs(attrs, container);
    createEvents(events, container);
    createStyles(styles, container);
    createTextOrChildren(text, children);
    root.appendChild(container);
  }
}
