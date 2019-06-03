const R = require('ramda');

// lensStringPath :: String -> Object
const lensStringPath = R.pipe(R.split('.'), R.lensPath);
// getByStringPath :: String -> Object
const getByStringPath = R.pipe(R.split('.'), R.path);
// doArrayByPath :: Function -> String -> Object -> Object -> Object
const doArrayByPath = arrayFn => R.curry((objPath, data, object) =>
  R.pipe(
    getByStringPath(objPath),
    arrayFn(data),
    R.set(lensStringPath(objPath), R.__, object)
  )(object)
);

// appendToArrayByPath :: String -> Object -> Object -> Object
const appendToArrayByPath = doArrayByPath(R.append);
// concatArraysByPath :: String -> Array -> Object -> Object
const concatArraysByPath = doArrayByPath(R.concat);
// concatArraysByPath :: String -> Array -> Object -> Object
const reversedConcatArraysByPath = doArrayByPath(data => R.concat(R.__, data));
// setByPath :: String -> Object -> Object -> Object
const setByPath = R.curry((objPath, data, object) =>
  R.set(lensStringPath(objPath), data, object)
);

// setEntry :: Object -> Object
const setEntry = setByPath('entry.bundle');
// addRule :: Object -> Object -> Object
const addRule = appendToArrayByPath('module.rules');
// addPlugin :: Object -> Object -> Object
const addPlugin = appendToArrayByPath('plugins');
// addPlugins :: Array -> Array
const addPlugins = list => R.map(addPlugin, list);
// prependExtensions :: Object -> Object
const prependExtensions = concatArraysByPath('resolve.extensions');
// appendExtensions :: Object -> Object
const appendExtensions = reversedConcatArraysByPath('resolve.extensions');

module.exports = {
  setEntry,
  addRule,
  addPlugin,
  addPlugins,
  appendExtensions,
  prependExtensions
};
