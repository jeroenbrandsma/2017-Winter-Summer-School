"use strict";

const router = require("express").Router();
const auth = require(process.cwd() + "/config/lib/authorisation.js");
const School = require("mongoose").model("school");
const logger = require(process.cwd() + "/config/lib/logger");

// adds a new school
router.post("/API/school", auth.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	const school = new School({
		name: req.body.schoolName,
		startDate: new Date(req.body.startDate),
		endDate: new Date(req.body.endDate)
	});

	school.save(function (err) {
		if (err) {
			logger.warning("Can not add school\n" + err);
			res.redirect("/options");
			res.sendStatus(400);
		} else {
			res.redirect("/options");
			res.sendStatus(200);
		}
	});

});

router.get("/API/school", function (req, res) {
	if (req.query.id) {
		School.findById(req.query.id, function (err, school) {
			if (typeof school === "undefined" || err) {
				logger.warning("Can not find school\n" + (err || "Wrong id provided"));
				res.sendStatus(400);
			} else res.send(schools);
		});
	} else {
		School
			.find({})
			.limit(req.query.count || 10)
			.exec(function (err, schools) {
				if (err) {
					logger.warning("Can not retrieve schools\n" + err);
					res.sendStatus(400);
				} else res.send(schools);
			});
	}
});

// delete a school
router.delete("/API/school", auth.isAuthorised("ALTER_SCHOOLS"), function (req, res) {
	School.findOneAndRemove({"_id": req.body.id}, function (err) {
		if (err) {
			logger.warning("Can not deleted school\n" + err);
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}
	});
});

module.exports = router;
