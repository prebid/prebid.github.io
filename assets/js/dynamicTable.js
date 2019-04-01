
//   dynamicTable
//
//   Given an array of objects, this function
//   writes a table with 1,2, or 4 columns depending on screen width
//
//   the <script> invocation takes these args
//
//   1) data-div is the div id
//   2) data-array is the name of variable containing the data
//   2) data-sort can be "colFirst" (the default) or "rowFirst"
//
//   Structure of the data-array:
//   dynamicTableContents[{{x}}]={};
//   dynamicTableContents[{{x}}].href="/dev-docs/bidders.html#{{page.biddercode}}";
//   dynamicTableContents[{{x}}].text="{{page.biddercode}}";
//
//   The calling page should create this array then load this
//   function with:
//   <script src="/assets/js/dynamicTable.js" data-div="mydiv" data-array="dynamicTableContents" type="text/javascript"></script>

function writeDynamicTable() {

  // find the div where the table's going to be written
  var divId=document.currentScript.getAttribute('data-div');
  var destDiv;
  if (divId) {
    destDiv = document.getElementById(divId);
  } else {
    return("requires data-div element");
  }

  // find the name of the array that stores the data
  var arrayName=document.currentScript.getAttribute('data-array');
  var _tableContents;
  if (arrayName) {
    _tableContents=window[arrayName];
  } else {
    return("requires data-array element");
  }

  // find what order to sort the table
  var sortType=document.currentScript.getAttribute('data-sort');
  if (!sortType) {
	sortType="colFirst";
  }

  var numCols=4;
  if ($(window).width() <= 414) {
    numCols=1;
  } else if ($(window).width() <= 768) {
    numCols=2;
  }
  var numRows=Math.round((_tableContents.length / numCols)+0.5);

  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('class', 'table table-bordered table-striped');
  var tbdy = document.createElement('tbody');
  var idx=0;
  for (var r = 0; r < numRows; r++) {
    var tr = document.createElement('tr');
    for (var c = 0; c < numCols; c++) {
        var td = document.createElement('td');
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
writeDynamicTable();
