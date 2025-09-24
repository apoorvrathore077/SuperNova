import express from "express";
import { createTeamController, getTeamController } from "../controllers/team.controller.js";

const teamRoute = express.Router();

// Create a new team
teamRoute.post("/teams/create", createTeamController);

// Get team details along with members
teamRoute.get("/teams/:id", getTeamController);

export default teamRoute;
