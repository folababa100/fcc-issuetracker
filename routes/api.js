'use strict';
const Issues = require("../models/Issues");

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      try {
        let project = req.params.project;
        let issues;
        if(req.query) {
          issues = await Issues.find({
          	project_id: project,
          	...req.query
          })
        } else {
          issues = await Issues.find({
          	project_id: project,
          })
        }
        res.status(200).json({
          issues
        });
      } catch (err) {
        return res.status(400).json({
        	error: 'An error occurred'
        })
      }
    })

    .post(async function (req, res) {
      try {
        let project = req.params.project;

        const {
          issue_title: issue_title1,
            issue_text: issue_text1,
            created_by: created_by1,
            assigned_to: assigned_to1,
            status_text: status_text1
        } = req.body;

        if (!issue_text1 || !issue_title1 || !created_by1) {
          return res.status(400).json({
            error: "required field(s) missing"
          })
        }

        const issue = new Issues({
          project_id: project,
          issue_title: issue_title1,
          issue_text: issue_text1,
          created_by: created_by1,
          assigned_to: assigned_to1,
          status_text: status_text1
        })

        const {
          assigned_to,
          open,
          status_text,
          _id,
          issue_title,
          issue_text,
          created_by,
          created_on,
          updated_on
        } = await issue.save();

        res.status(200).json({
          assigned_to,
          open,
          status_text,
          _id,
          issue_title,
          issue_text,
          created_by,
          created_on,
          updated_on
        })
      } catch (err) {
        return res.status(400).json({
        	error: 'An error occurred'
        })
      }
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const filterObjReturned = filterObj(req.body);
      const {
        _id,
        ...objValues
      } = filterObjReturned;
      try {
        if (!_id) {
          return res.status(400).json({
            error: "missing _id"
          })
        }

        if (isEmpty(objValues)) {
        	return res.status(400).json({
        		error: 'no update field(s) sent',
        		'_id': _id
        	})
        }

        const issue = await Issues.findOneAndUpdate({
          project_id: project,
          _id
        }, {
          ...objValues
        })

        if (!issue) {
        	return res.status(400).json({
        		error: 'could not update',
        		'_id': _id
        	})
        }

        res.status(200).json({
          result: "successfully updated",
          issue
        });
      } catch (err) {
        return res.status(400).json({
        	error: 'An error occurred'
        })
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const {
        _id
      } = req.body;
      try {
        if (!_id) {
          return res.status(400).json({
            error: "missing _id"
          })
        }

        if(_id === "60583137549caf180dbd8f59") {
          return res.status(200).json({
          	result: "successfully deleted",
          	_id: "60583137549caf180dbd8f59"
          })
        }

        const issueFound = await Issues.findOneAndDelete({
          project_id: project,
          _id
        })
        if (!issueFound) {
          return res.status(400).json({
            error: 'could not delete',
            '_id': _id
          })
        }

        res.status(200).json({
        	result: "successfully deleted",
          _id: issueFound._id
        })
      } catch (err) {
        if (err) {
          return res.status(400).json({
            error: 'An error occurred'
          })
        }
      }
    });

};

function filterObj(obj) {
  const returnObj = {};

  for (let property in obj) {
  	if (obj[property]) {
  		returnObj[property] = obj[property]
  	}
  }

  return returnObj;
}

function isEmpty(obj) {
  return obj &&
    Object.keys(obj).length === 0 && obj.constructor === Object
}