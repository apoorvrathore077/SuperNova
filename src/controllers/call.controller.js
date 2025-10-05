import { createCall, getAllCalls, getCallById, getCallsByTeamId } from "../models/call.model.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const account_sid = process.env.TWILIO_ACCOUNT_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
const twilio_number = process.env.TWILIO_NUMBER;
const client = twilio(account_sid, auth_token);

// Create a call
export async function createCallController(req, res) {
  try {
    const { team_id, call_ssid, from_number, to_number, status, started_at, ended_at, recording_url } = req.body;

    if (!from_number && !to_number) {
      return res.status(400).json({ message: "Invalid call data" });
    }

    const twilioCall = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: to_number,
      from: twilio_number
    });

    const call = await createCall({
      teamId: team_id,
      call_ssid,
      from_number,
      to_number,
      status: twilioCall.status,
      started_at: twilioCall.startTime || new Date(),
      ended_at,
      recording_url
    });
    res.status(201).json({ message: "Call recorded", call });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all calls
export async function getAllCallsController(req, res) {
  try {
    const calls = await getAllCalls();
    res.json({ calls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a call by ID
export async function getCallByIdController(req, res) {
  try {
    const { id } = req.params;
    const call = await getCallById(id);
    if (!call) return res.status(404).json({ message: "Call not found" });
    res.json({ call });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all calls by team ID
export async function getCallsByTeamController(req, res) {
  try {
    const { team_id } = req.params;
    const calls = await getCallsByTeamId(team_id);
    res.json({ team_id, calls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
