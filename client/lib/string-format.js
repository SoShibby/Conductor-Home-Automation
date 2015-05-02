var ValueError, create, explicitToImplicit, Format, implicitToExplicit, lookup, resolve,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

ValueError = (function(superClass) {
  extend(ValueError, superClass);

  function ValueError(message1) {
    this.message = message1;
  }

  ValueError.prototype.name = 'ValueError';

  return ValueError;

})(Error);

implicitToExplicit = 'cannot switch from implicit to explicit numbering';

explicitToImplicit = 'cannot switch from explicit to implicit numbering';

create = function(transformers) {
  if (transformers == null) {
    transformers = {};
  }
  return function() {
    var args, explicit, idx, implicit, message, template;
    template = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    idx = 0;
    explicit = implicit = false;
    message = 'cannot switch from {} to {} numbering';
    return template.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g, function(match, literal, key, transformer) {
      var ref, ref1, value;
      if (literal) {
        return literal;
      }
      if (key.length) {
        if (implicit) {
          throw new ValueError(implicitToExplicit);
        }
        explicit = true;
        value = (ref = lookup(args, key)) != null ? ref : '';
      } else {
        if (explicit) {
          throw new ValueError(explicitToImplicit);
        }
        implicit = true;
        value = (ref1 = args[idx++]) != null ? ref1 : '';
      }
      if (Object.prototype.hasOwnProperty.call(transformers, transformer)) {
        return transformers[transformer](value);
      } else {
        return value;
      }
    });
  };
};

lookup = function(object, key) {
  var match;
  if (!/^(\d+)([.]|$)/.test(key)) {
    key = '0.' + key;
  }
  while (match = /(.+?)[.](.+)/.exec(key)) {
    object = resolve(object, match[1]);
    key = match[2];
  }
  return resolve(object, key);
};

resolve = function(object, key) {
  var value;
  value = object[key];
  if (typeof value === 'function') {
    return value.call(object);
  } else {
    return value;
  }
};

Format = create({});

Format.create = create;

Format.extend = function(prototype, transformers) {
  var $Format;
  $Format = create(transformers);
  prototype.Format = function() {
    return $Format.apply(null, [this].concat(slice.call(arguments)));
  };
};

if (typeof module !== 'undefined') {
  module.exports = Format;
} else if (typeof define === 'function' && define.amd) {
  define(Format);
} else {
  window.Format = Format;
}