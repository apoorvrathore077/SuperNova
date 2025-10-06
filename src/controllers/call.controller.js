// import { createCall, getAllCalls, getCallById, getCallsByTeamId } from "../models/call.model.js";
// import twilio from "twilio";
// import dotenv from "dotenv";

// dotenv.config();
// const account_sid = process.env.TWILIO_ACCOUNT_SID;
// const auth_token = process.env.TWILIO_AUTH_TOKEN;
// const twilio_number = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(account_sid, auth_token);

// // Create a call
// // ✅ Create a call
// export async function createCallController(req, res) {
//   try {
//     const { team_id, call_ssid, from_number, to_number, status, started_at, ended_at, recording_url } = req.body;

//     if (!to_number) {
//       return res.status(400).json({ message: "Missing 'to_number' field" });
//     }

//     if (!twilio_number) {
//       return res.status(500).json({ message: "Twilio number not configured in .env" });
//     }

//     // 🔹 Make the actual call via Twilio
//     const twilioCall = await client.calls.create({
//       url: "http://demo.twilio.com/docs/voice.xml", // or your custom TwiML endpoint
//       to: to_number,
//       from: twilio_number,
//       record: true // optional: enables automatic recording
//     });

//     // 🔹 Save call record to your DB
//     const call = await createCall({
//       teamId: team_id,
//       call_ssid,
//       from_number: twilio_number, // use Twilio number as 'from'
//       to_number,
//       status: twilioCall.status,
//       started_at: twilioCall.startTime || new Date(),
//       ended_at,
//       recording_url: recording_url || twilioCall.subresourceUris?.recordings || null
//     });

//     res.status(201).json({
//       message: "Call initiated and recorded",
//       call,
//       twilioCallSid: twilioCall.sid
//     });
//   } catch (error) {
//     console.error("❌ Error creating Twilio call:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// }

// // Get all calls
// export async function getAllCallsController(req, res) {
//   try {
//     const calls = await getAllCalls();
//     res.json({ calls });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// // Get a call by ID
// export async function getCallByIdController(req, res) {
//   try {
//     const { id } = req.params;
//     const call = await getCallById(id);
//     if (!call) return res.status(404).json({ message: "Call not found" });
//     res.json({ call });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

// // Get all calls by team ID
// export async function getCallsByTeamController(req, res) {
//   try {
//     const { team_id } = req.params;
//     const calls = await getCallsByTeamId(team_id);
//     res.json({ team_id, calls });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

import { createCall, getAllCalls, getCallById, getCallsByTeamId } from "../models/call.model.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const account_sid = process.env.TWILIO_ACCOUNT_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
const twilio_number = process.env.TWILIO_PHONE_NUMBER;
const base_url = process.env.BASE_URL; // Your server URL
const client = twilio(account_sid, auth_token);

// ✅ Create a real-time voice call
export async function createCallController(req, res) {
  try {
    const { team_id, to_number, language = 'hi-IN' } = req.body;

    if (!to_number) {
      return res.status(400).json({ message: "Missing 'to_number' field" });
    }

    if (!twilio_number) {
      return res.status(500).json({ message: "Twilio number not configured in .env" });
    }

    if (!base_url) {
      return res.status(500).json({ message: "BASE_URL not configured in .env" });
    }

    // 🔹 Real-time voice call via Twilio
    const twilioCall = await client.calls.create({
      url: `${base_url}/twiml/voice`, // ✅ Your TwiML endpoint
      to: to_number,
      from: twilio_number,
      record: true, // Recording enable
      recordingStatusCallback: `${base_url}/twiml/recording-status`,
      statusCallback: `${base_url}/twiml/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      // Timeout settings
      timeout: 60,
      machineDetection: 'Enable', // Answering machine detection
    });

    // 🔹 Save call record to your DB
    const call = await createCall({
      teamId: team_id,
      call_ssid: twilioCall.sid,
      from_number: twilio_number,
      to_number,
      status: twilioCall.status,
      started_at: new Date(),
      ended_at: null,
      recording_url: null
    });

    res.status(201).json({
      message: "Real-time voice call initiated",
      call,
      twilioCallSid: twilioCall.sid,
      callStatus: twilioCall.status
    });
  } catch (error) {
    console.error("❌ Error creating Twilio call:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
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

// 🆕 Update call status (called by Twilio webhook)
export async function updateCallStatusController(req, res) {
  try {
    const { CallSid, CallStatus, CallDuration } = req.body;
    
    // Update your database with call status
    // await updateCallInDB(CallSid, CallStatus, CallDuration);
    
    console.log(`Call ${CallSid} status updated: ${CallStatus}`);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating call status" });
  }
}

// 🆕 Save recording URL (called by Twilio webhook)
export async function saveRecordingController(req, res) {
  try {
    const { CallSid, RecordingUrl, RecordingSid } = req.body;
    
    // Update database with recording URL
    // await updateCallRecording(CallSid, RecordingUrl);
    
    console.log(`Recording saved for call ${CallSid}: ${RecordingUrl}`);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving recording" });
  }
}
