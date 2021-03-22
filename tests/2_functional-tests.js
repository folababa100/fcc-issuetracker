// "test": "\"mocha --timeout 5000 --recursive --exit --ui tdd tests/\""

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
	suite('Routing Tests', function () {
		suite('Create route tests', function () {
			test("Create an issue with every field", function (done) {
				chai
					.request(server)
					.post("/api/issues/apitest")
					.send({
						issue_title: "Normal title",
						issue_text: "Normal text",
						created_by: "Folababa",
						assigned_to: "Folababa",
						status_text: "Being worked on"
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.issue_title, "Normal title");
						assert.equal(res.body.issue_text, "Normal text");
						assert.equal(res.body.created_by, "Folababa");
						assert.equal(res.body.assigned_to, "Folababa");
						assert.equal(res.body.status_text, "Being worked on");
						done()
					})
			})

			test("Create an issue with only required fields", function (done) {
				chai
					.request(server)
					.post("/api/issues/apitest")
					.send({
						issue_title: "Normal title",
						issue_text: "Normal text",
						created_by: "Folababa"
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.issue_title, "Normal title");
						assert.equal(res.body.issue_text, "Normal text");
						assert.equal(res.body.created_by, "Folababa");
						done()
					})
			})

			test("Create an issue with missing required fields", function (done) {
				chai
					.request(server)
					.post("/api/issues/apitest")
					.send({
						issue_title: "Normal title",
						created_by: "Folababa"
					})
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "required field(s) missing");
						done()
					})
			})
		});

		suite("Get routes test", () => {
			test("View issues on a project", (done) => {
				chai
					.request(server)
					.get("/api/issues/apitest")
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isArray(res.body.issues)
						done();
					})
			})

			test("View issues on a project with one filter", (done) => {
				chai
					.request(server)
					.get("/api/issues/apitest")
					.query({
						open: true
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isArray(res.body.issues)
						done();
					})
			})

			test("View issues on a project with multiple filters", (done) => {
				chai
					.request(server)
					.get("/api/issues/apitest")
					.query({
						open: true,
						assigned_to: "Folababa"
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isArray(res.body.issues)
						done();
					})
			})
		})

		suite("Update routes test", () => {
			test("Update one field on an issue", (done) => {
				chai
					.request(server)
					.put("/api/issues/apitest")
					.send({
						issue_title: "Github issue",
						_id: "605834fc9f81ff1883d04bcc" // To be added soon.
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.result, "successfully updated")
						done();
					})
			})

			test("Update multiple fields on an issue", (done) => {
				chai
					.request(server)
					.put("/api/issues/apitest")
					.send({
						issue_title: "Github issue",
						issue_text: "Very important",
						_id: "605834fc9f81ff1883d04bcc" // To be added soon.
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.result, "successfully updated")
						done();
					})
			})

			test("Update an issue with missing _id", (done) => {
				chai
					.request(server)
					.put("/api/issues/apitest")
					.send({
						issue_title: "Github issue",
						issue_text: "Very important",
					})
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "missing _id")
						done();
					})
			})

			test("Update an issue with no fields to update", (done) => {
				chai
					.request(server)
					.put("/api/issues/apitest")
					.send({
            _id: "dwdwwwwe"
          })
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "no update field(s) sent")
						done();
					})
			})

			test("Update an issue with an invalid _id", (done) => {
				chai
					.request(server)
					.put("/api/issues/apitest")
					.send({
						issue_title: "Github issue",
						issue_text: "Very important",
						_id: "wefew"
					})
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "An error occurred")
						done();
					})
			})
		})

		suite("Delete routes test", () => {
			test("Delete an issue", (done) => {
				chai
					.request(server)
					.delete("/api/issues/apitest")
					.send({
						_id: "60583137549caf180dbd8f59" // To be added soon.
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body.result, "successfully deleted")
						done();
					})
			})

			test("Delete an issue with an invalid _id", (done) => {
				chai
					.request(server)
					.delete("/api/issues/apitest")
					.send({
						_id: "wedwed"
					})
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "An error occurred")
						done();
					})
			})

			test("Delete an issue with missing _id", (done) => {
				chai
					.request(server)
					.delete("/api/issues/apitest")
					.send({})
					.end((err, res) => {
						assert.equal(res.status, 400);
						assert.equal(res.body.error, "missing _id")
						done();
					})
			})
		})
	});
});
