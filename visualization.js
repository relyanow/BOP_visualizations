
 // Rebecca Elyanow 2018


 function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://platform-beta.bop.nyc/api/expeditions/58112c8426915e7a0e4c14a8', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function init() {
 loadJSON(function(response) {
  // Parse JSON string into object
    actual_JSON = JSON.parse(response);
    console.log(actual_JSON);


    var live_oyster_size = get_oyster_size_single(actual_JSON,0.0,200.0).filter(Number);
    var number_live_oysters = get_number_live_oysters_single(actual_JSON,0.0,50.0).filter(Number);
    var baseline_oyster_size = live_oyster_size; // TODO
    // var total_mass_substrate_shell_oysters = get_total_mass_substrate_shell_oysters(actual_JSON,2.0,1000.0);

    console.log('oyster size',live_oyster_size.sort());
    plot(live_oyster_size,0.0,200.0,5.0,'Live oyster size (mm)','Live oyster size (mm)','Number of oysters','div_oyster_size');
    plot_barchart([...Array(live_oyster_size.length).keys()].map(String),live_oyster_size.sort(sortNumber),Math.round(live_oyster_size.length/10),10,'Live oyster size (mm)','Oyster','Live oyster size (mm)','div_barplot_oyster_size');
    plot_boxplot(baseline_oyster_size,live_oyster_size,Math.round(live_oyster_size.length/10),10,'Live oyster size (mm)','Oyster','Live oyster size (mm)','div_boxplot_oyster_size');
    // plot_dates(actual_JSON,get_oyster_size,0.0,200.0,5.0,'Live oyster size (mm)','Live oyster size (mm)','Number of oysters','div_dates_oyster_size')
    //plot_expeditions(actual_JSON,get_oyster_size,0.0,200.0,5.0,'Live oyster size (mm)','Live oyster size (mm)','Number of oysters','div_expeditions_oyster_size')

    plot(number_live_oysters,0.0,50.0,1.0,'Number of live oysters','Number of live oysters','Number of substrate shells','div_number_oysters');
    plot_barchart([...Array(number_live_oysters.length).keys()].map(String),number_live_oysters,1,1,'Number of live oysters','Substrate shell','Number of live oysters','div_barplot_number_oysters');
    // plot_dates(actual_JSON,get_number_live_oysters,0.0,50.0,1.0,'Number of live oysters','Number of live oysters','Number of substrate shells','div_dates_number_oysters')
    // plot_expeditions(actual_JSON,get_number_live_oysters,0.0,50.0,1.0,'Number of live oysters','Number of live oysters','Number of substrate shells','div_expeditions_number_oysters')

    // plot(total_mass_substrate_shell_oysters,0.0,1000.0,20.0,'Total mass of substrate shell oysters (g)','Total mass of substrate shell oysters (g)','Number of substrate shells','div_mass_oysters')
    // plot_dates(actual_JSON,get_total_mass_substrate_shell_oysters,0.0,1000.0,20.0,'Total mass of substrate shell oysters (g)','Total mass of substrate shell oysters (g)','Normalized number of substrate shells','div_dates_mass_oysters')
    // plot_expeditions(actual_JSON,get_total_mass_substrate_shell_oysters,0.0,1000.0,20.0,'Total mass of substrate shell oysters (g)','Total mass of substrate shell oysters (g)','Normalized number of substrate shells','div_expeditions_mass_oysters')
 });
}

function sortNumber(a,b) {
    return a - b;
}

const concat = (x,y) =>
	x.concat(y)
const flatMap = (f,xs) =>
	xs.map(f).reduce(concat,[])

function get_date(actual_JSON) {
	var x = actual_JSON.map(function(y) {
		return y.collectionTime.substring(0,10).split('-').map(function(z) {
			return parseFloat(z);
		});
	});
	return x;
}

function date_difference(date1,date2) {
	var i;
	var diffs = date1;
	for (i = 0;i < date1.length;i++){
		var year_dif = (date2[i][0] - date1[i][0]) * 365;
		var month_dif = (date2[i][1] - date1[i][1]) * 12;
		var day_dif = date2[i][2] - date1[i][2];
		diffs[i] =  year_dif + month_dif + day_dif;}
	return diffs
}

function get_oyster_size(actual_JSON,min,max){
	var x = flatMap(function(x) {
		return flatMap(function(y) {
			return y.measurements.map(function(z) {
				return z.sizeOfLiveOysterMM;
			});
		},x.measuringOysterGrowth.substrateShells);
	},actual_JSON);//#.filter(Number);
	// x = x.filter(function(x) {
	//     return x <= max && x >= min;
	// });
	return x;
}

function get_oyster_size_single(actual_JSON,min,max){
	console.log('measuringOysterGrowth',actual_JSON.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells);
	var x = flatMap(function(y) {
			return y.measurements.map(function(z) {
				return z.sizeOfLiveOysterMM;
			});
		},actual_JSON.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells);//#.filter(Number);
	// x = x.filter(function(x) {
	//     return x <= max && x >= min;
	// });
	return x;
}


function get_means(actual_JSON){
	var d = flatMap(function(x) {
		return flatMap(function(y) {
			return y.measurements.map(function(z) {
				return y.averageSizeOfLiveOysters;
			});
		},x.measuringOysterGrowth.substrateShells);
	},actual_JSON);//.filter(Number);
	return d;
}

function get_size_means(actual_JSON){
	var x = flatMap(function(x) {
		return flatMap(function(y) {
			return y.measurements.map(function(z) {
				return y.averageSizeOfLiveOysters;
			});
		},x.measuringOysterGrowth.substrateShells);
	},actual_JSON).filter(Number);
	return x;
}

function get_number_live_oysters(actual_JSON,min,max){
	var x = flatMap(function(x) {
		return flatMap(function(y) {
			return y.totalNumberOfLiveOystersOnShell;
		},x.measuringOysterGrowth.substrateShells);
	},actual_JSON).filter(Number);
	x = x.filter(function(x) {
	    return x <= max && x >= min;
	});
	return x;
}

function get_number_live_oysters_single(actual_JSON,min,max){
	var x = flatMap(function(y) {
			return y.totalNumberOfLiveOystersOnShell;
		},actual_JSON.protocols.oysterMeasurement.measuringOysterGrowth.substrateShells).filter(Number);
	return x;
}


function get_total_mass_substrate_shell_oysters(actual_JSON,min,max){
	var x = flatMap(function(x) {
		return flatMap(function(y) {
			return y.totalMassOfScrubbedSubstrateShellOystersTagG;
		},x.measuringOysterGrowth.substrateShells);
	},actual_JSON).filter(Number);
	x = x.filter(function(x) {
	    return x <= max && x >= min;
	});
	return x;
}

function plot(x,start,end,size,title,xaxis,yaxis,div) {
    var trace = {
	    x: x,
	    type: 'histogram',
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  }
	  };
	var data = [trace];
	var layout = {
	  bargap: 0.05, 
	  title: title, 
	  xaxis: {title: xaxis}, 
	  yaxis: {title: yaxis},
	  width: 700,
      height: 500,
	};
	Plotly.newPlot(div, data,layout);

}

function plot_dates(actual_JSON,datafun,start,end,size,title,xaxis,yaxis,div) {
	var data_2016 = actual_JSON.filter(function(x) {
	    return x.collectionTime.includes('2016');
	});
	var data_2017 = actual_JSON.filter(function(x) {
	    return x.collectionTime.includes('2017');
	});
	var data_2018 = actual_JSON.filter(function(x) {
	    return x.collectionTime.includes('2018');
	});
	var vector_2016 = datafun(data_2016,start,end);
	var vector_2017 = datafun(data_2017,start,end);
	var vector_2018 = datafun(data_2018,start,end);
    var trace_2016 = {
	    x: vector_2016,
	    type: 'histogram',
	    histnorm: 'probability',
	    opacity: 0.5,
	    name: "2016",
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  },
		marker: {
     		color: 'red',
  			}
	  };
    var trace_2017 = {
	    x: vector_2017,
	    type: 'histogram',
	    name: "2017",
	    opacity: 0.5,
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  },
		marker: {
     		color: 'blue',
  			}
	  };
    var trace_2018 = {
	    x: vector_2018,
	    type: 'histogram',
	    name: "2018",
	    opacity: 0.5,
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  },
		marker: {
     		color: 'green',
  			}
	  };
	var data = [trace_2016,trace_2017,trace_2018];
	var layout = {
	  bargap: 0.05, 
	  bargroupgap: 0.1,
	  title: title, 
	  xaxis: {title: xaxis}, 
	  yaxis: {title: yaxis},
	  width: 700,
      height: 500,
	};
	Plotly.newPlot(div, data,layout);

}

function plot_expeditions(actual_JSON,datafun,start,end,size,title,xaxis,yaxis,div) {
	var map = new Map();
	actual_JSON.forEach(function(x) {
		var siteName = x.longitude + "," + x.latitude; // get ORS location from longitude and latitude
		if(map.has(siteName)) {
			map.get(siteName).push(x);
	    } else {
			map.set(siteName,[x]);
	    }
	});
	var data1 = [];
	var data2 = [];
	Array.from(map.values()).forEach(function(x) {
	if (x.length > 1){
	var val1 = x[0];
	var val2 = x[x.length-1];
	data1.push(val1);
	data2.push(val2);
	}
	});
	var diffs = date_difference(get_date(data1),get_date(data2));
	var i;
	for (i = 0; i < diffs.length; i++) { //swap if first data is after second date
		if (diffs[i] < 0) {
			var d1 = data1[i];
			var d2 = data2[i];
			data1[i] = d2;
			data2[i] = d1;
			diffs[i] = Math.abs(diffs[i]);
		}
	}
	var vector1 = datafun(data1,start,end); // get vector of data for first time point (oyster size, number of live oysters, ect.)
	var vector2 = datafun(data2,start,end); // get vector of data for last time point 

	var i;
	if (datafun == get_oyster_size){
		means1 = get_means(data1);
		means2 = get_means(data2);
		var difference_in_size_per_month = [];
		for (i = 0; i < vector1.length; i++) {
			if (vector1[i] >= 300) { // correct high values (assume off by factor of 10)
				vector1[i] = vector1[i]/10;
			}
			if (vector2[i] >= 300) { // correct high values
				vector2[i] = vector2[i]/10;
			}
			if (means1[i] >= 20 && vector2[i] < 10){
				vector2[i] = vector2[i]*10; //correct low values (cm instead of mm)
			}
			vector1 = vector1.filter(Number);
			vector2 = vector2.filter(Number);
			difference_in_size_per_month.push((vector2[i] - vector1[i]) / ((diffs[0]+1) / 30));
		}
		console.log('diffs',diffs.length);
		console.log('vectors',vector1.length,vector2.length);
		console.log(difference_in_size_per_month);
	}
    var trace1 = {
	    x: vector1,
	    type: 'histogram',
	    opacity: 0.5,
	    name: "First expedition",
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  },
		marker: {
     		color: 'red',
  			}
	  };
    var trace2 = {
	    x: vector2,
	    type: 'histogram',
	    name: "Most recent expedition",
	    opacity: 0.5,
	    xbins: {
		    end: end, 
		    size: size, 
		    start: start
		  },
		marker: {
     		color: 'blue',
  			}
	  };

	var data = [trace1,trace2];
	var layout = {
	  bargap: 0.05, 
	  bargroupgap: 0.1,
	  title: title, 
	  xaxis: {title: xaxis}, 
	  yaxis: {title: yaxis},
	  width: 700,
      height: 500,
	};
	Plotly.newPlot(div, data,layout);

}


function plot_barchart(x,y,xtick,ytick,title,xaxis,yaxis,div){
	console.log(x,y)
	var trace1 = {
	  x: x,
	  y: y,
	  type: 'bar',
	  bargap: 0.05, 
	};

	var data = [trace1];
	var layout = {
	  bargap: 0.05, 
	  title: title, 
	  xaxis: {title: xaxis,dtick: xtick}, 
	  yaxis: {title: yaxis,dtick: ytick},
	  width: 700,
      height: 500,
	};
	Plotly.newPlot(div, data,layout);
}

function plot_boxplot(first,current,xtick,ytick,title,xaxis,yaxis,div){
	var trace1 = {
	  y: first,
	  type: 'box',
	  bargap: 0.05, 
	  name: "Baseline"
	};
	var trace2 = {
	  y: current,
	  type: 'box',
	  bargap: 0.05, 
	  name: "Current expedition"
	};

	var data = [trace2];
	var layout = {
	  bargap: 0.05, 
	  title: title, 
	  xaxis: {title: xaxis,dtick: xtick}, 
	  yaxis: {title: yaxis,dtick: ytick},
	  width: 700,
      height: 500,
	};
	Plotly.newPlot(div, data,layout);
}

init()



