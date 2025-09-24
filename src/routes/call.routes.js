import express from "express";
import {
  createCallController,
  getAllCallsController,
  getCallByIdController,
  getCallsByTeamController
} from "../controllers/call.controller.js";

const callRouter = express.Router();

// Record a call
callRouter.post("/telephony/calls", createCallController);

// Get all calls
callRouter.get("/telephony/calls", getAllCallsController);

// Get a call by ID
callRouter.get("/telephony/calls/:id", getCallByIdController);

// Get all calls by team ID
callRouter.get("/telephony/calls/team/:team_id", getCallsByTeamController);

export default callRouter;
