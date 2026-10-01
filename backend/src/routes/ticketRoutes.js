const express = require("express");
const controller = require("../controllers/ticketController");

const router = express.Router();

router.get("/stats", controller.stats);
router.get("/", controller.listTickets);
router.get("/:id", controller.getTicket);
router.post("/", controller.createTicket);
router.put("/:id", controller.updateTicket);
router.delete("/:id", controller.deleteTicket);

module.exports = router;
