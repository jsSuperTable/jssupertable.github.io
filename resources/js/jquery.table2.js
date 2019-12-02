/*
    jquery.table2
    ^^^^^^^^^^^^^^^

    Description: Draw Table
    Version: Version 0.0.1
    Author: BJIT Limited
*/

(function( $ ) {

    $.table2 = function(element, options) {

        /*
            #Default data for plugin
        */
       var defaults =  {
		thead: ["Warning!"],
		searchable: [true, false, false, false],
		sortable: [true, false, false, false],
        alignments: ["left", "left", "left", "left"],
		allowedKeys: ["warningText.message"],
        tbody : [{"warningText":{"message":"No Data Found"}}],
		pagination : true,
		actionButtons : false,
		perPage : 5,
		globalSearch : false,
        onPageClick: function() {} 
	};

        var plugin = this;

        plugin.settings = {};

        var $element = $(element);

        var lastRowIndex = 0;

        var drawTableHeader = function (table,thead){
			var header = table.createTHead();
			var row = header.insertRow(lastRowIndex++);  

			for (var j = 0; j < thead.length; j++) {
				var cell = row.insertCell(j);
				var thData = thead[j];
				cell.outerHTML = "<th>"+thData+"</th>";
			}
		}
		var drawSearchableRow = function (table,thead,searchable) {
			if (searchable.indexOf(true)>-1) {
				var row = table.insertRow(lastRowIndex++);
				for (var j = 0; j < thead.length; j++) {
					var cell = row.insertCell(j);
					if (searchable[j]) {
						cell.innerHTML = '<input type="text" id="field'+j+'" placeholder="Type Here"/>';
					} else {
						cell.innerHTML = '';
					}
				}
			}			
		}
		var drawTableBody = function (table,tbody,keys){
			var body = document.createElement('tbody');

			for (var i = 0; i < tbody.length; i++) {
				//var row = table.insertRow(lastRowIndex++);
				var tr = document.createElement('tr');
				for (var j = 0; j < keys.length; j++) {
					//var cell = row.insertCell(j);
					var key = keys[j];
					var td = document.createElement('td');
					if (key.indexOf(".")> -1) {
						var splitted = key.split(".");
						var parentKey = splitted[0];
						var childKey = splitted[1];
						//cell.innerHTML = tbody[i][parentKey][childKey];

						td.innerHTML = tbody[i][parentKey][childKey];

					} else {
						//cell.innerHTML = tbody[i][key];
						td.innerHTML = tbody[i][key];
					}
					var textAlign = plugin.settings.alignments[j];
					td.style.textAlign = textAlign;
					tr.appendChild(td);
					
				}
				body.appendChild(tr);

			}
			table.appendChild(body);
		}
        var drawPaginatedTable = function (table,pageNo) {
			var currentPage = 0;
			var trs = table.getElementsByTagName("tr");
			var startIndex = plugin.settings.searchable.indexOf(true)>-1 ? 2 : 1;
			for (var i = startIndex; i < trs.length; i++) {
				var tr = trs[i];
				currentPage = i/plugin.settings.perPage;
				currentPage = Math.ceil(currentPage);
				tr.className = "test";

				if (pageNo>=currentPage && (pageNo<currentPage+1)) {
					tr.style = "";	
				} else {
					tr.style = "display:none;";	
				}
				
			}
			$('.test').click(function(){
				var tds = this.getElementsByTagName('td');
				for(var i=0;i<tds.length;i++) {
					
				}
			});
			drawPaginationLinks(table,pageNo);
		}

		var drawPaginationLinks = function (table,activePage){
			
			$('#'+table.id+'-pagination').remove();

			var preparedList = "<nav id='"+table.id+"-pagination' aria-label=\"Page navigation example\">"+
			"<ul class=\"pagination\">";
			var totalPages = plugin.settings.tbody.length/plugin.settings.perPage;
			
			for (var i=0;i<totalPages;i++) {
				if ((activePage-1) == i) {
					preparedList = preparedList + "<li class=\"active page-item\"> <a href=\"javascript:void(0);\" class=\"current page-link\">"+(i+1)+"</a></li>";
				} else {
					preparedList = preparedList + "<li class=\"page-item\"> <a href=\"javascript:void(0);\" class=\"page-link\">"+(i+1)+"</a></li>";
				}
				
			}
			preparedList = preparedList + "</ul></nav>";
			$("#"+table.id+"").parent().append(preparedList);
			$('#'+table.id+'-pagination a').click(function(){
				var pageNo = this.innerText;
				drawPaginatedTable(table,pageNo);
			});
			
		}

		var bindSearchableEvents = function (table,thead,searchable){
			for (var j = 0; j < thead.length; j++) {
				if (searchable[j]) {
					var targetTd = j;
					$("#field"+targetTd+"").keyup(function() {
						var title = $(this).val();
						
						var filter, tr, td, txtValue;
						filter = title.toUpperCase();
						//table = document.getElementById("example");
						tr = table.getElementsByTagName("tr");
						if (filter!="") {
							for (var i = 2; i < tr.length; i++) {
								td = tr[i].getElementsByTagName("td")[targetTd];
								if (td) {
									tr[i].style = "";	
									txtValue = td.textContent || td.innerText;
									if (txtValue.toUpperCase().indexOf(filter) > -1) {
										tr[i].removeAttribute("hidden");
										tr[i].style.display = "";
									} else {
										//tr[i].style.display = "";
										tr[i].style.display = "none";
										
									}
								}
							}
							$('#'+table.id+'-pagination').hide();
						} else {
							if (plugin.settings.pagination) {
								drawPaginatedTable(table,1);
								//drawPaginationLinks(table,1);
								$('#'+table.id+'-pagination').show();
							}
							
						}
						
						
					});
				}
			}
        }
        
        /*
            #Initliazes plugin
        */
        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            plugin.generateTable();
        };

        
        /*
        #Generates HTML for table (nav)
        */
        plugin.generateTable = function() {
			var columns = plugin.settings.thead;
            var thead = plugin.settings.thead;
			var tbody = plugin.settings.tbody;
			var allowedKeys = plugin.settings.allowedKeys;
			
            var table = $element[0];
            var searchableRow = true;
            var pagination = plugin.settings.pagination;
			var perPage = plugin.settings.perPage;
			var searchable = plugin.settings.searchable;
            
            if (columns.length == allowedKeys.length) {
                drawTableHeader(table,thead);
                if (searchableRow) {
                    drawSearchableRow(table,thead,searchable);
                    bindSearchableEvents(table,thead,searchable);
                }
                drawTableBody(table,tbody,allowedKeys);
                
                if (pagination) {
                    
                    //drawPaginatedTable(table,0,false,perPage);
					//drawPaginationLinks(table,1);
					drawPaginatedTable(table,1);
                }
            } else {
                alert('Error: Unable to draw!');
            }
            return 1;
        };

        plugin.init();

    };

    $.fn.table2 = function(options) {

        return this.each(function() {
            if (undefined === $(this).data('table2')) {
                var plugin = new $.table2(this, options);
                    $(this).data('table2', plugin);
            }
        });

    };

}( jQuery ));

/*
var records = [];
	for (var i=0;i<50;i++) {
		var firstName = faker.name.firstName();
		var lastName = faker.name.lastName();
		var name = firstName + " " + lastName;
		var fatherName = faker.name.firstName();
		fatherName += " " +faker.name.lastName();

		var data = {
			"name" : name,
			"fatherName" : fatherName,
			"district" : faker.address.city(),
			"ssn" : faker.phone.phoneNumber()
		};
		records.push(data);
	}
	var tableData = {
		thead: ["Name", "Father Name", "District", "SSN"],
		searchable: [true, false, false, false],
		pagination : true,
		actionButtons : false,
		perPage : 10,
		globalSearch : false,
		tbody: records
	};
	
	$('#example').table2(tableData);
*/