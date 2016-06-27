 <form class="form-horizontal">
 		
 	  <h1 class="text-center">Login</h1>
 	  
 	  <hr />
 		
     <div class="form-group">
       <label class="col-sm-3 control-label" for="EmpNo">ID</label>
        <div class="col-sm-6">
          <input class="form-control" id="EmpNo" type="text" placeholder="ID" data-ng-model="map.inpId">
        </div>        
     </div>
     
     <div class="form-group">
       <label class="col-sm-3 control-label" for="FirstName">PW</label>
        <div class="col-sm-6">
          <input class="form-control" id="FirstName" type="text" placeholder="Password" data-ng-model="map.inpPw">
        </div>        
     </div>    
     	
     	<hr/>
     		
  		<div class="form-group">     	
       <div class="col-sm-12 text-center">
         <button class="btn btn-primary" type="submit" data-ng-click="map.execLogin()">Login<i class="fa fa-check"></i></button>
         <button class="btn btn-danger" type="submit" data-ng-click="map.cancel()">Cancel<i class="fa fa-times"></i></button>                  
       </div>
     	</div>
     
</form>