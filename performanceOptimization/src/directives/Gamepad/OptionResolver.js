export default class OptionResolver {
  constructor (allowExtra = false) {
    this.allowExtra = allowExtra;
    this.defaults = new Map();
    this.types = new Map();
    this.optional = new Set();
    this.required = new Set();
  }

  setDefaults(defaults) {
    Object.entries(defaults).forEach(([key, value]) => this.defaults.set(key, value));
    return this;
  }

  setTypes(types) {
    Object.entries(types).forEach(([key, value]) => this.types.set(key, value));
    return this;
  }

  setOptional(values) {
    values.forEach(value => this.optional.add(value));
    return this;
  }

  setRequired(values) {
    values.forEach(value => this.required.add(value));
    return this;
  }

  resolve(source) {
    const options = Object.assign(this.getDefaults(), source);
    this.validate(options);
    return options;
  }

  getDefaults() {
    const options = {};
    for (const [key, value] of this.defaults) {
      options[key] = value;
    }
    return options;
  }

  validate(options) {
    for (const key in options) {
      if (!this.optionExists(key)) {
        throw new Error(`Unkown option "${key}".`);
      }
      this.checkType(key, options[key]);
    }

    for (const key of this.required.values()) {
      if (typeof options[key] === 'undefined') {
        throw new Error(`Option "${key}" is required.`);
      }
    }
  }

  checkType(key, value) {
    if (!this.types.has(key)) {
      return;
    }
    const expectedType = this.types.get(key);
    const givenType = typeof value;
    if (givenType !== expectedType) {
      throw new Error(`Wrong value for option "${key}". Expected type "${expectedType}" but got "${givenType}".`);
    }
  }

  optionExists(key) {
    if (this.allowExtra) {
      return true;
    }
    return this.defaults.has(key) || this.optional.has(key) || this.required.has(key) || this.types.has(key);
  }
}