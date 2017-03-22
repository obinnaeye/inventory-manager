(function(){
  //DOM objects
  const adminBox = document.getElementById('addAdminBox');
  const adminDisplayButton = document.getElementById('adminDisplayButton');
  const addAdminButton = document.getElementById('addAdminButton');
  
  adminDisplayButton.addEventListener('click', function(){adminBox.style.display = 'block'}, false);
  addAdminButton.addEventListener('click', addAdmin, false);
  
  //Add new admin
  function addAdmin(){
    const username = document.getElementById('admin').value;
    const url = `${appUrl}/api/addadmin?username=${username}`;
    ajaxFunctions.ajaxRequest('POST', url, function(data){
      alert(data);
      adminBox.style.display = 'none';
    });
  }
    
})()

