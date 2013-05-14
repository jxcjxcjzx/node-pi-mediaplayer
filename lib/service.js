/*
var Products = require('../../simple-collection');
var Product = require('../../simple-collection').SimpleModel;
var Stores = require('../../simple-collection');
var Store = require('../../simple-collection').SimpleModel;

var fetchAllCallback = function (data) {
//	console.log(Products);
}

Products.addDatasource('data/shopping.db', 'products');
Products.fetchAll(fetchAllCallback);

Stores.addDatasource('data/shopping.db', 'stores');
Stores.fetchAll();

Products.add(new Product({
	name: 'ABC',
	labels: ['ab', 'bc']
}));
*/

var Service = {

    set: function () {
    }

};

/*
console.log(Products);
console.log(Stores);
*/

module.exports = Service;
