import express from "express";
import {
  getLeadByIdController,
  getAllLeadsController,
  getLeadsByTeamIdController
} from "../controllers/lead.controller.js";

const leadRoutes = express.Router();



// Get a lead by ID
leadRoutes.get("/crm/leads/:id", getLeadByIdController);

// Get all leads
leadRoutes.get("/crm/leads/get", getAllLeadsController);

// Get all leads by team ID
leadRoutes.get("/crm/leads/team/:team_id", getLeadsByTeamIdController);

export default leadRoutes;
