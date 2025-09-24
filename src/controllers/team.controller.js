import {
  getUserByName,
  createTeam,
  addTeamMember,
  getTeamById,
  getTeamMembers
} from "../models/team.model.js";

// Create a new team and add owner as member
export async function createTeamController(req, res) {
  try {
    const { name: teamName, owner_name } = req.body;

    if (!teamName || !owner_name) {
      return res.status(400).json({ message: "Team name and owner_name are required" });
    }

    // Check if owner exists
    const user = await getUserByName(owner_name);
    if (!user) {
      return res.status(400).json({ message: "User with this name does not exist" });
    }

    // Create the team
    const team = await createTeam({ name: teamName, ownerId: user.id });

    // Add owner as a member
    await addTeamMember({ teamId: team.id, userId: user.id, role: 'owner' });

    res.status(201).json({
      message: "Team created",
      team
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get team details with members
export async function getTeamController(req, res) {
  try {
    const { id } = req.params;

    const team = await getTeamById(id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const members = await getTeamMembers(id);

    res.json({
      team,
      members
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
