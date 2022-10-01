//const addon = require('../native');



const MiniSearch = require('minisearch')

const fs = require("fs");

function indexData(file_location){
	let filestr = fs.readFileSync(file_location);
	filejson = JSON.parse(filestr);
	let datadict = {};
	let doclist = [];
	for (var i=0;i<=filejson.length;i++){
		try{
			let proddata = filejson[i];
			barcode = proddata.barcode;
			prodname = proddata.brand +" "+ proddata.name;
			proddata.id = i;
			proddata.prodname = prodname
			doclist.push(proddata);
			datadict[i] = proddata; }
			catch (error){
				console.log("JUS logging! Don worry..",error);
			} 
	}
	let miniSearch = new MiniSearch({
  		fields: ['barcode', 'prodname'], // fields to index for full-text search
  		storeFields: ['barcode', 'prodname','id'] // fields to return with search results
	});
	miniSearch.addAll(doclist);
	return {datadict,miniSearch};

}

function searchbarcode(bci,barcodestr,loadJSON=true){
	let indi = null;
	if (loadJSON){
		indi = MiniSearch.loadJSON(bci,{fields:['barcode', 'prodname','id']} );
		globalThis.barcodeIndex = indi;
	} else {
		indi = bci;
	}
	return indi.search(barcodestr,{ fields:['barcode'], fuzzy:0.1 });
}

function searchname(bci,namestr){
	let indi = MiniSearch.loadJSON(bci,{ fields:['barcode', 'prodname','id']} );
	return indi.search(namestr,{ fields:['prodname'], fuzzy:0.3 });
}

function getcatdata(datadict,index){
	return datadict[i];
}

module.exports = {indexData, searchbarcode, searchname, getcatdata };