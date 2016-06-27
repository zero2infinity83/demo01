 <div class="container-fluid">
	 <div class="row form-inline">    
	     <div class="col-xs-8 col-xs-offset-2">
	         <div class="input-group">
	         	
	         	<div class="form-group">
                 <select class="form-control" data-ng-model="map.srchOpt">
                 		<option value="emp_no">Emp No</option>
                 		<option value="first_name">First Name</option>
                 		<option value="last_name">Last Name</option>
                 		<!-- <option ng-repeat="item in map.srcOptArr" value="{{item.val}}">{{item.txt}}</option> -->
						</select>
					</div>
	             
	             <div class="form-group">
	             	<input type="text" class="form-control" size="85" maxlength="50" placeholder="Search term..." data-ng-model="map.srchTxt">
	             </div>
	             
	             <span class="input-group-btn">
	                 <button class="btn btn-default" type="button" data-ng-click="map.search()"><span class="glyphicon glyphicon-search"></span></button>
	             </span>
	         </div>
	     </div>
	 </div>
</div>

<div class="table-responsive text-center mt50">
	<!-- Table -->
	<table class="table table-hover">
		<thead class="thead-default">
			<tr>
				<th class="row text-center">No</th>
				<th class="text-center">Emp No</th>
				<th class="text-center">First Name</th>
				<th class="text-center">Last Name</th>
				<th class="text-center">Gender</th>
				<th class="text-center">Hire Date</th>
			</tr>
		</thead>
		<tbody>
			<tr data-ng-repeat="row in map.memberList" style="cursor:pointer" data-ng-click="map.goDetail(row.emp_no)">
				<td>{{row.no}}</td>
				<td>{{row.emp_no}}</td>
				<td>{{row.first_name}}</td>
				<td>{{row.last_name}}</td>
				<td>{{row.gender}}</td>
				<td>{{row.hire_date}}</td>			
			</tr>
		</tbody>
	</table>
	
	<ul class="pagination">
		<li class="page-item">
	      <a class="page-link" aria-label="Previous" data-ng-click="map.paging.chgPage('prev')">
	        <span aria-hidden="true">&laquo;</span>
	        <span class="sr-only">Previous</span>
	      </a>
	    </li>
		<li data-ng-repeat="pgNum in map.paging.pageArr" data-ng-class="({{pgNum}} == map.paging.pageNum)?'active':''">
			<a data-ng-click="map.paging.chgPage(pgNum)">{{pgNum}}</a>
		</li>
		<li class="page-item">
	      <a class="page-link" aria-label="Next" data-ng-click="map.paging.chgPage('next')">
	        <span aria-hidden="true">&raquo;</span>
	        <span class="sr-only">Next</span>
	      </a>
	    </li>
	</ul>
	
</div>


