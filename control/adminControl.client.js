
//DOM objects
let globalCode = '';
let globalResolveCode = '';
const newAssetDisplayButton = document.getElementById("newAssetDisplayButton");
const addAssetBox = document.getElementById("addAssetBox");
const addAssetButton = document.getElementById("addAssetButton");
const cancelAssetButton = document.getElementById("cancelAssetButton");
const assignAssetBox = document.getElementById("assignAssetBox");
const availableAssetButton = document.getElementById('availableAssetButton');
const assignedAssetButton = document.getElementById('assignedAssetButton');

//display all assets
$('#allAssetsDisplayButton').click(function() {
  getAllAssets();
  closeWindows('allAssetsContainer');
});

//display available asset box
availableAssetButton.addEventListener('click', function() {
  availableAsset();
  closeWindows('availableContainer');
})


//display unavailable asset box
assignedAssetButton.addEventListener('click', function() {
  assignedAsset();
  closeWindows('assignedContainer');
})

 //display issues
$('#issueDisplayButton').click(function() {
  getIssues();
  closeWindows('issueContainer');
});



//add asset
newAssetDisplayButton.addEventListener('click', function(){closeWindows('addAssetBox')}, false);
addAssetButton.addEventListener('click', addAsset, false);
cancelAssetButton.addEventListener('click', function(){addAssetBox.style.display = 'none'}, false);


//Add new asset
function addAsset(){
  const trailingSpace = /^\s+|\s+$/g;
  const allSpace = /\s+/g;
  const name = document.getElementById('newName').value.replace(trailingSpace, '');
  const description = document.getElementById('newDescription').value.replace(trailingSpace, '');
  const serialnumber = document.getElementById('newSerialNumber').value;
  const serialcode = document.getElementById('newSerialCode').value.replace(allSpace, '');
  const purchaseDate = document.getElementById('newPurchaseDate').value;
  const purchaseDate2 = new Date(purchaseDate);
  const today = new Date();
  if(Date.parse(today < Date.parse(purchaseDate2))){
    alert("Purchase Date can not be greater than today!")
    return;
  }
  
  if(!name || !description || !serialnumber || !serialcode || !purchaseDate){
    alert("Please provide a valid input for all field!");
    return;
  }
  
  if(serialnumber < 1){
    alert("Serial Number should not be less than 1!");
    return;
  }
  
  const url = `${appUrl}/api/addasset?name=${name}&description=${description}&serialcode=${serialcode}
   &serialnumber=${serialnumber}&purchasedate=${purchaseDate}`;
  ajaxFunctions.ajaxRequest('POST', url, function(data){
    if (data === 'Asset has been added successfully!'){
      alert(data);
      addAssetBox.style.display = 'none';
    }else{
      alert(data);
    }
    
  });
}

//assign asset
$('#assignAsset').click(assignAsset)
$('#assignCancel').click( function(){assignAssetBox.style.display = 'none'});



//Assign Asset
function assignAsset(){
  const username = $('#assignUser').val();
  const date = $('#assignReclaimDate').val();
  const reclaimdate= new Date(date);
  const today = new Date();
  
  if(Date.parse(reclaimdate) < Date.parse(today)){
    alert('Reclaim date can not be less than today!');
    return;
  }
  
  if(!username){
    alert('Please provide username!');
    return;
  }
  
  
  
  const url = `${appUrl}/api/assignasset?assignee=${username}&serial=${globalCode}&date=${date}`;
  ajaxFunctions.ajaxRequest('POST', url, function(data){
    alert(data);
    assignAssetBox.style.display = 'none';
    $('#availableAssetButton').click();
  });
}

//get available assets
function availableAsset(){
  ajaxFunctions.ajaxRequest('GET', `${appUrl}/api/availableassets`, createAvailabe);
}

//create the box for available assets
function createAvailabe(data){
  if(data !== "No results"){
    const assets = JSON.parse(data);
    
    let innerHtml ='<h3>Available Assets</h3>';
    for (var i = 0; i<assets.length; i++){
      const asset = assets[i];
        innerHtml += `<div class='available'>
        <p>Name: ${asset.name}</p>
        <p>Description: ${asset.description}</p>
        <p>Serial Number: ${asset.serialnumber}</p>
        <p>Andela Serial Code: ${asset.serialcode}of</p>
        <p>Date of Purchase: ${asset.purchasedate}</p>
        <input type='submit' value='Assign' serial = '${asset.serialcode}' class='assign-submit'>
      </div>`; 
    }
    $('#availableAssetBox').html(innerHtml);
    $('.assign-submit').click(assignDisplay);
  }else{
    $('#availableAssetBox').html('<h3>No Available Asset</h3>');
  }
}

//get assigned assets
function assignedAsset(){
  ajaxFunctions.ajaxRequest('GET', `${appUrl}/api/assignedassets`, createAssigned);
}

//create the box for assigned assets
function createAssigned(data){
  console.log(data);
  if(data !== "No results"){
    const assets = JSON.parse(data);
    console.log(assets)
    let innerHtml = '<h3>Assigned Assets</h3>';
    for (var i = 0; i<assets.length; i++){
      const asset = assets[i];
        innerHtml += `<div class='available'>
        <p>Name: ${asset.name}</p>
        <p>Description: ${asset.description}</p>
        <p>Serial Number: ${asset.serialnumber}</p>
        <p>Andela Serial Code: ${asset.serialcode}</p>
        <p>Date of Purchase: ${asset.purchasedate}</p>
        <p>Assigned to: ${asset.assignedto}</p>
        <p>Reclaim Date: ${asset.reclaimDate}</p>
        <input type='submit' value='Unassign' serial = '${asset.serialcode}' class='unassign-submit'>
      </div>`;
    }
    $('#assignedAssetBox').html(innerHtml);
    $('.unassign-submit').click(unassignAsset);
  }else{
    $('#assignedAssetBox').html('<h3>No Assigned Asset</h3>');
  }
}

//unassign asset
function unassignAsset(){
  const serial = this.getAttribute('serial');
  const url = `${appUrl}/api/unassignasset?serialcode=${serial}&test=test`;
  ajaxFunctions.ajaxRequest('POST', url, function(data){
    alert(data);
  });
  $('#assignedAssetButton').click();
  
}

//get all assets
function getAllAssets(){
  ajaxFunctions.ajaxRequest('GET', `${appUrl}/api/allassets`, createAssets);
}

function createAssets(data){
  if(data !== "No results"){
    const assets = JSON.parse(data);
    let innerHtml='<h3>All Assets</h3>';
    for (var i = 0; i<assets.length; i++){
      const asset = assets[i];
        innerHtml += `<div class='available'>
        <p>Name: ${asset.name}</p>
        <p>Description: ${asset.description}</p>
        <p>Serial Number: ${asset.serialnumber}</p>
        <p>Andela Serial Code: ${asset.serialcode}of</p>
        <p>Date of Purchase: ${asset.purchasedate}</p>
        <p>Available: ${asset.available?'Yes': 'No'}</p>
      </div>`; 
    }
    $('#allAssetsBox').html(innerHtml);
  }else{
    $('#allAssetsBox').html('<h3>No Assets</h3>');
  }
}

//displays the assign asset box
function assignDisplay(){
  const serial = this.getAttribute('serial');
  globalCode = serial;
  console.log(globalCode);
  closeWindows('assignAssetBox');
}

//closes any open window except the one passed as argument
function closeWindows(open){
  document.getElementById('assignAssetBox').style.display = 'none';
  document.getElementById('availableContainer').style.display = 'none';
  document.getElementById('assignedContainer').style.display = 'none';
  document.getElementById('addAssetBox').style.display = 'none';
  document.getElementById('assignAssetBox').style.display = 'none';
  document.getElementById('allAssetsContainer').style.display = 'none';
  document.getElementById('issueContainer').style.display = 'none';
  document.getElementById('resolveContainer').style.display = 'none';
  document.getElementById(open).style.display = 'block';
}

//get issues
function getIssues(){
  ajaxFunctions.ajaxRequest('GET', `${appUrl}/api/issue`, issueList);
}

//create the box for available assets
function issueList(data){
  if(data !== "No issues"){
    let issues = JSON.parse(data);
    issues.sort(function(a,b){
      return a.resolved - b.resolved;
    });
    
    let innerHtml ='<h3>Issues: Sorted by resolved.</h3>';
    for (var i = 0; i<issues.length; i++){
      const issue = issues[i];
        innerHtml += `<div class='available'>
        <p>Nature of Issue: ${issue.nature}</p>
        <p>Report: ${issue.reporter}</p>
        <p>Date of report: ${issue.date}</p>
        <p>Resolved: ${issue.resolved?'Yes': 'No'}</p>
        <p>Reporter's Comment: ${issue.reporterComment}</p>
        <p>Admin's Comment: ${issue.adminComment}</p>
        ${!issue.resolved? `<input type='submit' value='Resolve' serial = '${issue.serial}' class='resolve-submit submit'>`:''}
      </div>`; 
    }
    $('#issueBox').html(innerHtml);
    $('.resolve-submit').click(function() {
      globalResolveCode = this.getAttribute('serial');
      console.log(globalResolveCode);
        document.getElementById('resolveContainer').style.display = 'block';
    });
  }else{
    $('#issueBox').html('<h3>No Issues</h3>');
  }
}

//resolve issue, triggered in form action
function resolveIssue(){
  const comment = $('#resolveComment').val();
  ajaxFunctions.ajaxRequest('POST', `${appUrl}/api/resolveissue?serial=${globalResolveCode}&comment=${comment}`, function(response){
    alert(response);
    document.getElementById('resolveContainer').style.display = 'none';
    $('#issueDisplayButton').click();
  });
}

$('#resolveCancel').click(function() {
  document.getElementById('resolveContainer').style.display = 'none';
});


