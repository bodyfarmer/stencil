import { TYPE_BOOLEAN, TYPE_NUMBER } from '../util/constants';
import { Component, PropMeta, ConfigApi, MethodMeta, PlatformApi, ProxyElement, RendererApi, StateMeta, WatchMeta } from '../util/interfaces';
import { queueUpdate } from './update';


export function initProxy(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, instance: Component, props: PropMeta[], states: StateMeta[], methods: MethodMeta[], watchers: WatchMeta[]) {
  let i = 0;

  if (methods) {
    for (i = 0; i < methods.length; i++) {
      initMethod(methods[i], elm, instance);
    }
  }

  instance.$values = {};

  if (states) {
    for (i = 0; i < states.length; i++) {
      initState(states[i], instance, plt, config, renderer, elm);
    }
  }

  for (i = 0; i < props.length; i++) {
    initProp(props[i].propName, props[i].propType, instance, plt, config, renderer, elm, watchers);
  }
}


function initMethod(methodName: string, elm: ProxyElement, instance: Component) {
  // dom's element instance
  Object.defineProperty(elm, methodName, {
    configurable: true,
    value: instance[methodName].bind(instance)
  });
}


function initState(statePropName: string, instance: Component, plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement) {
  instance.$values[statePropName] = instance[statePropName];

  function getStateValue() {
    return instance.$values[statePropName];
  }

  function setStateValue(value: any) {
    if (instance.$values[statePropName] !== value) {
      instance.$values[statePropName] = value;

      queueUpdate(plt, config, renderer, elm);
    }
  }

  Object.defineProperty(instance, statePropName, {
    configurable: true,
    get: getStateValue,
    set: setStateValue
  });
}


function initProp(propName: string, propType: any, instance: Component, plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, watchers: WatchMeta[]) {
  instance.$values[propName] = getInitialValue(config, elm, instance, propType, propName);

  if (watchers) {
    for (var i = 0; i < watchers.length; i++) {
      if (watchers[i].propName === propName) {
        (instance.$watchers = instance.$watchers || []).push(instance[watchers[i].fn].bind(instance));
      }
    }
  }

  function getPropValue() {
    return instance.$values[propName];
  }

  function setPropValue(value: any) {
    if (instance.$values[propName] !== value) {
      instance.$values[propName] = value;

      if (instance.$watchers) {
        for (var i = 0; i < instance.$watchers.length; i++) {
          instance.$watchers[i](value);
        }
      }

      queueUpdate(plt, config, renderer, elm);
    }
  }

  // dom's element instance
  Object.defineProperty(elm, propName, {
    configurable: true,
    get: getPropValue,
    set: setPropValue
  });

  // user's component class instance
  Object.defineProperty(instance, propName, {
    configurable: true,
    get: getPropValue,
    set: setPropValue
  });
}


function getInitialValue(config: ConfigApi, elm: any, instance: Component, propTypeCode: number, propName: string): any {
  if (elm[propName] !== undefined) {
    return elm[propName];
  }

  if (instance[propName] !== undefined) {
    return instance[propName];
  }

  if (propTypeCode === TYPE_BOOLEAN) {
    return config.getBoolean(propName);
  }

  if (propTypeCode === TYPE_NUMBER) {
    return config.getNumber(propName);
  }

  return config.get(propName);
}
