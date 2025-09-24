import { addTeamMember, getTeamMembers, getUserById, getTeamById } from "../models/teammembers.model.js";

// Add a member
export async function addTeamMemberController(req, res) {
  try {
    const { team_id, user_id, role } = req.body;

    if (!team_id || !user_id) {
      return res.status(400).json({ message: "Team ID and User ID are required" });
    }

    const team = await getTeamById(team_id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const user = await getUserById(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const member = await addTeamMember({ teamId: team_id, userId: user_id, role });

    res.status(201).json({ message: "Member added", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// List all members
export async function getTeamMembersController(req, res) {
  try {
    const { team_id } = req.params;

    const team = await getTeamById(team_id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = await getTeamMembers(team_id);
    res.json({ team_id, members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
