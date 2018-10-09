// Generate key figures
var formatDecimalComma = d3.format(",.0f");

function generateKeyFigures (data) {
	htm = ''
	for(var k = 0, length3 = data.length; k < length3; k++){
		htm+= '<div class="col-md-6 col-sm-6"><h4 class="kf"><span>'+formatDecimalComma(data[k]['#reached'])+'</span></h4><h6>'+data[k]['#meta+indicators']+'</h6></div>'
	}
	$('.keyFigures').html(htm)
}
// generateKeyFigures

var sortData = function (d1, d2) {
    if (d1.key > d2.key) return 1;
    if (d1.key < d2.key) return -1;
    return 0;
};

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
// description
var descriptionCall = $.ajax({ 
    type: 'GET', 
    url: 'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1uLK2ZRKi_cq1gDMYuAa2-uUSSqgQ9eqU2oeL_UxAG0U%2Fedit%23gid%3D187500782',
    dataType: 'json',
});


$.when(indicsDataCall, dataCall).then(function(indicsDataArgs, dataArgs){
	var indics = hxlProxyToJSON(indicsDataArgs[0]);
	var data = hxlProxyToJSON(dataArgs[0])
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
