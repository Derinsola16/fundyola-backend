
import _ from 'lodash';

function clean(transform, request) {
	request.query = cleanParameterBag(transform, request.query);
	request.params = cleanParameterBag(transform, request.params);
	request.body = cleanParameterBag(transform, request.body);
}

function cleanParameterBag(transform, bag) {
	return cleanArray(transform, bag);
}

function cleanArray(transform, data, keyPrefix = "") {
	return _.mapValues(data, (value, key) =>
		cleanValue(transform, keyPrefix + key, value)
	);
}

function cleanValue(transform, key, value) {
	value = _.isArray(value) ? Object.assign({}, value) : value;

	if (_.isObject(value)) return cleanArray(transform, value, key + ".");

	return transform(key, value);
}

// function transform(key, value)
// {
//     if(_.indexOf(except, key) >= 0) return value;
    
//     return _.isString(value) ? ((_.trim(value) == '') ? null : _.trim(value)) : value;
// }

export default function(transform) {

    if(!_.isFunction(transform)) {
        throw Error(`Expect argument to be a function, ${typeof transform} given.`);
    }

    return function (req, res, next) {
        clean(transform, req);
            
        next();
    };
    
}