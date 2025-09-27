import express from "express";
import { addTeamMemberController, getTeamMembersController } from "../controllers/teammember.controller.js";


const teamMemberRouter = express.Router();

// Add a member to a team
teamMemberRouter.post("/team-members", addTeamMemberController);

// List members of a team
teamMemberRouter.get("/team-members/:team_id", getTeamMembersController);

export default teamMemberRouter;
