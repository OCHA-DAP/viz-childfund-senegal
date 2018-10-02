
// Generate key figures
var formatDecimalComma = d3.format(",.0f");

function generateKeyFigures (data) {
	htm = ''
	for(var k = 0, length3 = data.length; k < length3; k++){
		htm+= '<div class="col-md-6 col-sm-6"><h4 class="kf"><span>'+formatDecimalComma(data[k]['#reached'])+'</span></h4><h6>'+data[k]['#meta+indicators']+'<h6></div>'
	}
	$('.keyFigures').html(htm)
}
// generateKeyFigures

var sortData = function (d1, d2) {
    if (d1.key > d2.key) return 1;
    if (d1.key < d2.key) return -1;
    return 0;
};

var blue = '#007CE0';
var blueLight = '#72B0E0';

function generateSectorCharts(data,chartID) {
	var chart = dc.rowChart('#'+chartID+'');

	var cf = crossfilter(data);

	var dim = cf.dimension(function(d){
		return d.indicateur;
	});

	var group  = dim.group().reduceSum(function(d){ return d.valeur;});

	chart
		  .width(350)
		  .height(300)
		  .dimension(dim)
		  .group(group)
		  .colors(blueLight)
		  .data(function(group){
		  	return group.top(Infinity);
		  })
		  .elasticX(true)
		  .xAxis().ticks(4);

	dc.renderAll();
} //generateSectorCharts

// Get the data from hxl proxy
var indicsDataCall = $.ajax({
	type: 'GET',
	url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uLK2ZRKi_cq1gDMYuAa2-uUSSqgQ9eqU2oeL_UxAG0U%2Fedit%3Fusp%3Dsharing',
	dataType: 'json',
});

var dataCall = $.ajax({
	type: 'GET',
	url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uLK2ZRKi_cq1gDMYuAa2-uUSSqgQ9eqU2oeL_UxAG0U%2Fedit%23gid%3D1328099099',
	dataType: 'json',
});

$.when(indicsDataCall, dataCall).then(function(indicsDataArgs, dataArgs){
	var indics = hxlProxyToJSON(indicsDataArgs[0]);
	var data = hxlProxyToJSON(dataArgs[0])
	generateKeyFigures(indics);
	// console.log(data)
	// generateCharts(data);
	educationData = [],
	protectionData= [],
	santeData	  =	[],
	mExistenceData= [];
	for (d in data){
		data[d]['#sector'] == 'Education'? educationData.push({indicateur:data[d]['#indicator'],valeur:parseInt(data[d]['#reached'])}):
		data[d]['#sector'] == 'Protection'? protectionData.push({indicateur:data[d]['#indicator'],valeur:parseInt(data[d]['#reached'])}):
		data[d]['#sector'] == 'Santé/Nutrition'? santeData.push({indicateur:data[d]['#indicator'],valeur:parseInt(data[d]['#reached'])}):
		data[d]['#sector'] == "Moyens d'existence"? mExistenceData.push({indicateur:data[d]['#indicator'],valeur:parseInt(data[d]['#reached'])}): null;
	}
	generateSectorCharts(educationData, 'education');
	generateSectorCharts(protectionData, 'protection');
	generateSectorCharts(santeData, 'sante');
	generateSectorCharts(mExistenceData, 'mExistence');
});

function hxlProxyToJSON(input){
    var output = [];
    var keys = [];
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
