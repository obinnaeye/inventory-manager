'use strict';
const path = process.cwd();
const Asset = require(path + '/model/assets.js');
const User = require(path + '/model/users.js');
const Issue = require(path + '/model/issues.js');


function AssetHandler() {
  this.addAsset = function(req, res){
    const query = req.query;
    const asset = {
        name : query.name,
        description : query.description,
        serialnumber : Number(query.serialnumber),
        serialcode : query.serialcode,
        purchasedate : query.purchasedate,
        available : true,
        assignedto: '',
        admin: req.user.username,
        reclaimDate: '',
        issue: {
          nature: '',
          reporter: '',
          date: '',
          reporterComment: '',
          adminComment: '',
          resolved: true
        }
      };
    
    Asset.findOne({$or: [{serialcode : asset.serialcode}, {serialnumber: asset.serialnumber}]},
      function(err, result){
        if (err) throw err;
        if(result){
          res.send('The Serial Number or Serial Code you have provided has already been assigned to an item!');
        }else{
          const newAsset = new Asset(asset);
          newAsset.save(function(err){
            if (err) throw err;
            res.send('Asset has been added successfully!');
          });
        }
      });
  };
  
  this.assignAsset = function(req, res){
    const query = req.query;
    const serial = query.serial;
    const assignee = query.assignee;
    const date = query.date;
    
    User.findOne({username:assignee})
      .exec(function(err, data){
        if (err) throw err
        if(!data){
          res.send(`No user: ${assignee}`);
        }
        else{
          const updates = {
            assignedto : assignee, 
            available : false,
            reclaimDate : date
          };
          Asset.findOneAndUpdate({$and: [{serialcode : serial}, {available : true}]}, { $set: updates},{new : true},
          function(err, result){
            if (err) throw err;
            if(result){
              res.send(`Assigned to ${assignee} successfully`);
            }else{
              res.send('No such item or it is unavailable at the moment!');
            }
            
          });
        }
        
    })
  };
  
  
  this.unAsignAsset = function(req, res){
    const serialcode = req.query.serialcode;
    Asset.findOneAndUpdate({serialcode : serialcode}, {$set:{assignedto : '', available : true, reclaimDate:'' }}, {new : true},
    function(err, data){
      if(err) throw err;
      if(data){
        res.send("Unassigned successfully!");
      }else{
        res.send("Error Occured while performing your request, please try again!");
      }
    })
  };
  
  this.availableAssets = function(req, res){
    Asset.find({available: true})
      .exec(function (err, result) {
        if (err) { throw err}
        if(!result){
          res.send("No results");
        }
        res.json(result);
      });
  };
  
  this.assignedAssets = function(req, res){
    Asset.find({available: false})
      .exec(function (err, result) {
        if (err) { throw err}
        if(!result){
          res.send("No results");
        }
        res.json(result);
      });
  };
  
  this.allAssets = function(req, res){
    Asset.find({})
      .exec(function (err, result) {
        if (err) { throw err}
        if(!result){
          res.send("No results");
        }
        res.json(result);
      });
  };
  
  this.getIssues = function(req, res){
    Issue.find({}, function(err, data) {
        if(err) throw err;
        if(data){res.json(data)}
        else{res.send("No issues")}
    });
  };
  
  this.reportIssue = function(req, res){
    const query = req.query;
    const comment = query.comment;
    const issueType = query.issue;
    const admin = query.admin;
    const newIssue = new Issue({
      nature: issueType,
      reporter: req.user.username,
      date: String(new Date()),
      reporterComment: comment,
      adminComment: '',
      resolved: false,
      admin: admin,
      serial: 0
    });
    console
    //check if user exists
    User.findOne({username: admin})
      .exec(function(err, data){
        if(err){throw err}
        if(!data){
          res.send('User does not exist!');
        }else{
          //if user is admin or superadmin
          if(data.accounttype === 'admin' || data.accounttype === 'superadmin'){
          //check number of issues and update with the new issue
          Issue.find({}, function(err, data){
            if(err) throw err;
            const serial = (data || []).length;
            newIssue.serial = serial + 1;
            newIssue.save(function(err){
              if(err) throw err;
              res.send('Issue has been sent!');
            });
          });
        
          }else{
            res.send('The Username you provided is not an admin!')
          }
        }
      });
  };
  
  this.resolveIssue = function(req, res){
    const query = req.query;
    const adminComment = query.comment ;
    const serial = query.serial;
    Issue.findOneAndUpdate({serial: serial},{$set: {adminComment: adminComment, resolved: true}})
      .exec(function(err, data){
        console.log(data);
      if (err) throw err;
      if(data){
        res.json("Issue has been resolved!");
      }else{
        res.send("Error")
      }
    })
    console.log('resolve') 
  };
}


module.exports = AssetHandler;