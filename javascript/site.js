// Generate key figures
var formatDecimalComma = d3.format(",.0f");

function generateMap (data) {
    var presenceColor = '#7AB800';
    var width = $('#map').width(),
        height= 250;
    var map ;
    var mapscale = 2700;
    var mapprojection = d3.geo.mercator()
                              .center([-15.070, 14.505]) //14.504/-15.070
                              .scale(mapscale)
                              .translate([width / 2, height / 2]);
    map = d3.select('#map').append('svg')
                           .attr('width', width)
                           .attr('height', height);
    var g    = map.append('g').attr('id', 'adm1');
    var path = g.selectAll('path')
                .data(data.features).enter()
                .append('path')
                .attr('d', d3.geo.path().projection(mapprojection))
                .attr('id', function(d){
                    return d.properties.admin1Name;
                })
                .attr('class', function(d){
                    var present = false;
                    d.properties.admin1Name == 'Dakar' ? present = true :
                    d.properties.admin1Name == 'Thies' ? present = true :
                    d.properties.admin1Name == 'Diourbel' ? present = true :
                    d.properties.admin1Name == 'Ziguinchor' ? present = true :
                    d.properties.admin1Name == 'Fatick' ? present = true :
                    d.properties.admin1Name == 'Sedhiou' ? present = true :
                    d.properties.admin1Name == 'Tambacounda' ? present = true :
                    d.properties.admin1Name == 'Kolda' ? present = true : null;

                    var presence = (present == true) ? 'present' : 'absent';
                    return presence;
                })
                .attr('fill', function(f){
                    var clr = ($(this).attr('class') == 'present') ? presenceColor : '#dddddd';
                    return clr;
                })
                .attr('stroke','#7d868d');
    //map tooltips
    var maptip = d3.select('#map').append('div').attr('class', 'd3-tip map-tip hidden');
    path.filter('.adm1')
        .on('mousemove', function(d) {
            console.log(d)
            var mouse = d3.mouse(mapsvg.node()).map( function(d) { return parseInt(d); } );
            maptip
                .classed('hidden', false)
                .attr('style', 'left:'+(mouse[0]+20)+'px; top:'+(mouse[1]+20)+'px')
                .html(d.properties.admin1Name)
        })
        .on('mouseout',  function(d,i) {
            // if (!$(this).data('selected'))
                // $(this).attr('fill', fillColor);
            maptip.classed('hidden', true);
        });
        // .on('click', function(d,i){
        //     selectRegion($(this), d.properties.admin1Name);
        // }); 
} //generateMap

function generateKeyFigures (data) {
	htm = ''
	for(var k = 0, length3 = data.length; k < length3; k++){
		htm+= '<div class="col-md-6"><h4 class="kf"><span>'+formatDecimalComma(data[k]['#reached'])+'</span></h4><h6>'+data[k]['#meta+indicators']+'</h6></div>'
	}
	$('.keyFigures').html(htm)
}
// generateKeyFigures

var sortData = function (d1, d2) {
    if (d1.key > d2.key) return 1;
    if (d1.key < d2.key) return -1;
    return 0;
};

function generateDescription(descriptionData){
    $('.loader').remove();
    $('.container').show();
    $('#description-text h2').text(descriptionData[0]['#description+title']);
    $('#description-text p').text(descriptionData[0]['#description'])
}
var blue = '#7AB800';
var blueLight = '#007A45'//'#72B0E0';

function generateSectorCharts(dataS, dataB, chartID) {
	var chartS = dc.rowChart('#'+chartID+'S');
    var chartB = dc.rowChart('#'+chartID+'B');

	var cfS = crossfilter(dataS);
    var cfB = crossfilter(dataB);

	var dimS = cfS.dimension(function(d){
		return d.indicateur;
	});

	var groupS  = dimS.group().reduceSum(function(d){ return d.valeur;});
    var dimB = cfB.dimension(function(d){
		return d.indicateur;
	});

	var groupB  = dimB.group().reduceSum(function(d){ return d.valeur;});

	chartS
		  .width(400)
		  .height(150)
		  .dimension(dimS)
		  .group(groupS)
		  .colors(blueLight)
		  .data(function(group){
		  	return group.top(Infinity);
		  })
		  .elasticX(true)
		  .xAxis().ticks(4);
    chartB
		  .width(400)
		  .height(150)
		  .dimension(dimB)
		  .group(groupB)
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
	url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uLK2ZRKi_cq1gDMYuAa2-uUSSqgQ9eqU2oeL_UxAG0U%2Fedit%23gid%3D1688365801',
	dataType: 'json',
});
// description text
var descriptionCall = $.ajax({
    type: 'GET',
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uLK2ZRKi_cq1gDMYuAa2-uUSSqgQ9eqU2oeL_UxAG0U%2Fedit%23gid%3D187500782',
    dataType: 'json',
});

var geoDataCall = $.ajax({
    type: 'GET',
    url: 'data/senadm1.json',
    dataType: 'json',
});

$.when(indicsDataCall, dataCall, descriptionCall, geoDataCall).then(function(indicsDataArgs, dataArgs, descriptionArgs, geoDataArgs){
	var indics = hxlProxyToJSON(indicsDataArgs[0]);
	var data = hxlProxyToJSON(dataArgs[0])
    var descriptionData = hxlProxyToJSON(descriptionArgs[0]);

    var geoData = topojson.feature(geoDataArgs[0], geoDataArgs[0].objects.senadm1);

    generateDescription(descriptionData);
    generateMap(geoData);
	generateKeyFigures(data);
//	 console.log(data)
	// generateCharts(data);
	educationData = [],
    educationDataS = [],
    educationDataB = [],
	protectionData= [],
    protectionDataS= [],
    protectionDataB= [],
	santeData	  =	[],
    santeDataS	  =	[],
    santeDataB	  =	[],
	mExistenceData= [],
    mExistenceDataB= [],
    mExistenceDataS= [];

	for (d in indics) {
		indics[d]['#sector'] == 'Education'? educationData.push({type:indics[d]['#indicator+type'],indicateur:indics[d]['#indicator'],valeur:parseInt(indics[d]['#reached'])}):
		indics[d]['#sector'] == 'Protection'? protectionData.push({type:indics[d]['#indicator+type'],indicateur:indics[d]['#indicator'],valeur:parseInt(indics[d]['#reached'])}):
		indics[d]['#sector'] == 'Santé/Nutrition'? santeData.push({type:indics[d]['#indicator+type'],indicateur:indics[d]['#indicator'],valeur:parseInt(indics[d]['#reached'])}):
		indics[d]['#sector'] == "Moyens d'existence"? mExistenceData.push({type:indics[d]['#indicator+type'],indicateur:indics[d]['#indicator'],valeur:parseInt(indics[d]['#reached'])}): null;
	}
    for(d in educationData){
		if (educationData[d]['type'] == 'Bénéficiaires') {
            educationDataS.push({indicateur:educationData[d]['indicateur'],valeur:parseInt(educationData[d]['valeur'])});
        }
    };
       for(d in educationData){
		if (educationData[d]['type'] == 'Structure') {
            educationDataB.push({indicateur:educationData[d]['indicateur'],valeur:parseInt(educationData[d]['valeur'])});
        }
    };
      for(d in protectionData){
		if (protectionData[d]['type'] == 'Bénéficiaires') {
            protectionDataS.push({indicateur: protectionData[d]['indicateur'],valeur:parseInt(protectionData[d]['valeur'])});
        }
    };
       for(d in protectionData){
		if (protectionData[d]['type'] == 'Structure') {
            protectionDataB.push({indicateur:protectionData[d]['indicateur'],valeur:parseInt(protectionData[d]['valeur'])});
        }
    };
    for(d in mExistenceData){
		if (mExistenceData[d]['type'] == 'Bénéficiaires') {
            mExistenceDataS.push({indicateur: mExistenceData[d]['indicateur'],valeur:parseInt(mExistenceData[d]['valeur'])});
        }
    };
       for(d in mExistenceData){
		if (mExistenceData[d]['type'] == 'Structure') {
            mExistenceDataB.push({indicateur:mExistenceData[d]['indicateur'],valeur:parseInt(mExistenceData[d]['valeur'])});
        }
    };
    for(d in santeData){
		if (santeData[d]['type'] == 'Bénéficiaires') {
            santeDataS.push({indicateur: santeData[d]['indicateur'],valeur:parseInt(santeData[d]['valeur'])});
        }
    };
       for(d in santeData){
		if (santeData[d]['type'] == 'Structure') {
            santeDataB.push({indicateur:santeData[d]['indicateur'],valeur:parseInt(santeData[d]['valeur'])});
        }
    };

	generateSectorCharts(educationDataS, educationDataB, 'education');
	generateSectorCharts(protectionDataS, protectionDataB, 'protection');
	generateSectorCharts(santeDataS, santeDataB, 'sante');
	generateSectorCharts(mExistenceDataS, mExistenceDataS, 'mExistence');
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
