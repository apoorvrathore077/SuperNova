import {
  addPhoneNumber,
  getAllPhoneNumbers,
  getPhoneNumberById,
  getPhoneNumbersByTeam
} from "../models/phonenumber.model.js";

// Add a phone number
export async function addPhoneNumberController(req, res) {
  try {
    const { team_id, provider, number, metadata } = req.body;

    if (!team_id || !number) {
      return res.status(400).json({ message: "Team ID and number required" });
    }

    const phoneNumber = await addPhoneNumber({
      teamId: team_id,
      provider,
      number,
      metadata
    });

    res.status(201).json({ message: "Phone number added", phone_number: phoneNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all phone numbers
export async function getAllPhoneNumbersController(req, res) {
  try {
    const numbers = await getAllPhoneNumbers();
    res.json({ numbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get phone number by ID
export async function getPhoneNumberByIdController(req, res) {
  try {
    const { id } = req.params;
    const phoneNumber = await getPhoneNumberById(id);
    if (!phoneNumber) return res.status(404).json({ message: "Phone number not found" });
    res.json({ phone_number: phoneNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get phone numbers by team
export async function getPhoneNumbersByTeamController(req, res) {
  try {
    const { team_id } = req.params;
    const numbers = await getPhoneNumbersByTeam(team_id);
    res.json({ team_id, numbers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
