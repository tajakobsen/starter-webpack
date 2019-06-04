const R = require('ramda');

// recurry :: Function -> Function
const recurry = R.pipe(R.uncurryN(2), R.curry);
// splitPath :: String -> Array
const splitPath = R.pipe(R.split('.'), R.filter(R.pipe(R.isEmpty, R.not)));
// lensStringPath :: String -> Object
const lensStringPath = R.pipe(splitPath, R.lensPath);
// getByStringPath :: String -> Object
const getByStringPath = R.pipe(splitPath, R.path);
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
// reversedConcatArraysByPath :: String -> Array -> Object -> Object
const reversedConcatArraysByPath = doArrayByPath(data => R.concat(R.__, data));
// setByPath :: String -> Object -> Object -> Object
const setByPath = R.curry((objPath, data, object) =>
  R.set(lensStringPath(objPath), data, object)
);

// setOutput :: Object -> Object -> Object
const setOutput = setByPath('output');
// setBundleEntry :: Object -> Object -> Object
const setBundleEntry = setByPath('entry.bundle');
// setEntry :: String -> Object -> Object -> Object
const setEntry = recurry(bundleName => setByPath(`entry.${bundleName}`));
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
  setOutput,
  setBundleEntry,
  setEntry,
  addRule,
  addPlugin,
  addPlugins,
  appendExtensions,
  prependExtensions
};
