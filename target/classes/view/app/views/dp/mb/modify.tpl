 <form class="form-horizontal">
 		
 	  <h1 class="text-center">Employee Infomation</h1>
 	  
 	  <hr />
 		
     <div class="form-group">
       <label class="col-sm-3 control-label" for="EmpNo">Emp No</label>
        <div class="col-sm-6">
          <input class="form-control" id="EmpNo" type="text" placeholder="Emp No" readonly data-ng-model="map.inpEmpNo">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="FirstName">First Name</label>
        <div class="col-sm-6">
          <input class="form-control" id="FirstName" type="text" placeholder="First Name" data-ng-model="map.inpFirstName">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="LastName">Last Name</label>
        <div class="col-sm-6">
          <input class="form-control" id="LastName" type="text" placeholder="Last Name" data-ng-model="map.inpLastName">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="DeptName">Dept Name</label>
        <div class="col-sm-6">
        	 <select class="form-control" id="DeptName" data-ng-model="map.inpDeptNo">
        	 	<option value="0">Select DeptName......</optino>
        	 	<option data-ng-repeat="item in map.deptListArr" value="{{item.dept_no}}">{{item.dept_name}}</option>        	 	
        	 </select>
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="Title">Title</label>
        <div class="col-sm-6">
          <input class="form-control" id="LastName" type="text" placeholder="Title" data-ng-model="map.inpTitle">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="Gender">Gender</label>
        <div class="col-sm-6">
          <select class="form-control" id="Gender" data-ng-model="map.inpGender">
        	 	<option value="M">Male</option>
        	 	<option value="F">Female</option>
        	 </select>
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="BirthDate">Birth Date</label>
        <div class="col-sm-6">
          <input class="form-control" id="BirthDate" type="text" placeholder="Birth Date" data-ng-model="map.inpBirthDate">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="HireDate">Hire Date</label>
        <div class="col-sm-6">
          <input class="form-control" id="HireDate" type="text" placeholder="Hire Date" data-ng-model="map.inpHireDate">
        </div>        
     </div>
     
     <div class="form-group">
     		<div class="col-xs-6">
     			<table class="table table-hover col-md-offset-6">
					<thead class="thead-default">
						<tr>							
							<th class="text-center">From Date</th>
							<th class="text-center">To Date</th>
							<th class="row text-center">Salary</th>
						</tr>
					</thead>
					<tbody>
						<tr data-ng-repeat="row in map.empInfoArr">
							<td class="text-center">{{row.from_date}}</td>
							<td class="text-center">{{row.to_date}}</td>
							<td class="text-center">{{row.salary}}</td>
						</tr>
					</tbody>
				</table>
     		</div>
     	</div>
     	
     	<hr/>
     		
  		<div class="form-group">     	
       <div class="col-sm-12 text-center">
         <button class="btn btn-primary" type="submit" data-ng-click="map.modify()">Modify<i class="fa fa-check"></i></button>
         <button class="btn btn-danger" type="submit" data-ng-click="map.cancel()">Cancel<i class="fa fa-times"></i></button>
         <button class="btn btn-info" type="submit" data-ng-click="map.goList()">Go Back To List<i class="fa fa-check"></i></button>         
       </div>
     	</div>     
     
</form>