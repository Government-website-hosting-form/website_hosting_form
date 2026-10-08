const express = require("express");
const router = express.Router();
const { requireOicRole } = require("../middleware/auth");
const c = require("../controllers/oicController");

router.use(requireOicRole);
router.get("/requests", c.list);                       // search + filters + sort
router.get("/requests/:id", c.getOne);                 // pura form + audit log
router.put("/requests/:id", c.update);                 // edit (abhi frontend use nahi karta)
router.post("/requests/:id/approve", c.approve);       // approve
router.post("/requests/:id/reject", c.reject);         // access denied (remarks required)
router.post("/requests/:id/objection", c.objection);   // objection (remarks required)
router.get("/filters", c.filterOptions);               // dropdown values + counts

module.exports = router;