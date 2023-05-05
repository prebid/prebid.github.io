
//   writeDynamicTable
//
//   Given an array of objects, this function
//   writes a table with 1,2, or 4 columns depending on screen width
//
//   the invocation takes these args
//
//   div is the div id
//   data is the name of variable containing the data
//   sort can be "colFirst" (the default) or "rowFirst"
//   maxcols can set a max number of columns
//   striped is boolean defining whether to set the table-striped class. defaults to true.
//   fixedHeight is boolean defining whether to set the fixed height class. defaults to false
//
//   Structure of the data-array:
//   dynamicTableContents[{{x}}]={};
//   dynamicTableContents[{{x}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
//   dynamicTableContents[{{x}}].text="{{page.biddercode}}";
//

function writeDynamicTable(args) {

  // find the div where the table's going to be written
  var divId=args.div;
  var destDiv;
  if (divId) {
    destDiv = document.getElementById(divId);
  } else {
    return("requires data-div element");
  }

  // find the name of the array that stores the data
  var arrayName=args.data;
  var _tableContents;
  if (arrayName) {
    _tableContents=window[arrayName];
  } else {
    return("requires data-array element");
  }

  // find what order to sort the table
  var sortType=args.sort;
  if (!sortType) {
	sortType="colFirst";
  }

  var maxCols=args.maxcols;
  var numCols=4;
  if ($(window).width() <= 414) {
    numCols=1;
  } else if ($(window).width() <= 768) {
    numCols=2;
  }
 if (numCols > maxCols) {
   numCols=maxCols;
  }
  var numRows=Math.round((_tableContents.length / numCols)+0.49);

  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  var striped=true;
  if (typeof args.striped === 'boolean') {
    striped=args.striped;
  }
  if (striped) {
    tbl.setAttribute('class', 'table-bordered table-striped centered');
  } else {
    tbl.setAttribute('class', 'table-bordered centered');
  }
  var fixedHeight=false;
  if (typeof args.fixedHeight === 'boolean') {
    fixedHeight=args.fixedHeight;
  }
  var tbdy = document.createElement('tbody');
  tbdy.setAttribute('class','centered');
  var idx=0;
  for (var r = 0; r < numRows; r++) {
    var tr = document.createElement('tr');
    if (fixedHeight) {
      tr.setAttribute('class','centeredFixedHeight');
    } else {
      tr.setAttribute('class','centered');
    }
    for (var c = 0; c < numCols; c++) {
        var td = document.createElement('td');
	if (fixedHeight) {
	  td.setAttribute('class','centeredFixedHeight');
	} else {
	  td.setAttribute('class','centered');
	}
	if (sortType == "colFirst") {
		idx=(r + (c*numRows));
	} else {
		idx=(c + (r*numCols));
	}
	if (idx < _tableContents.length) {
		var aTag = document.createElement('a');
		aTag.setAttribute('href',_tableContents[idx].href);
		aTag.innerHTML = _tableContents[idx].text;
            	td.appendChild(aTag);
	} else {
	    	td.appendChild(document.createTextNode(''));
	}
        tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  destDiv.appendChild(tbl)
}
