import {
  getLeadById,
  getAllLeads,
  getLeadsByTeamId
} from "../models/lead.model.js";



// Get a lead by ID
export async function getLeadByIdController(req, res) {
  try {
    const { id } = req.params;
    const lead = await getLeadById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all leads
export async function getAllLeadsController(req, res) {
  try {
    const leads = await getAllLeads();
    res.json({ leads });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
}

// Get leads by team ID
export async function getLeadsByTeamIdController(req, res) {
  try {
    const { team_id } = req.params;
    const leads = await getLeadsByTeamId(team_id);
    res.json({ team_id, leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
