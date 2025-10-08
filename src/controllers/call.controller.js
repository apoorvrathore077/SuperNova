import { createCall, getAllCalls, getCallById, getCallsByTeamId } from "../models/call.model.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const account_sid = process.env.TWILIO_ACCOUNT_SID;
const auth_token = process.env.TWILIO_AUTH_TOKEN;
const twilio_number = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(account_sid, auth_token);
const base_url = process.env.BASE_URL || "http://localhost:5000";

// Create a call
// ✅ Create a call
export async function createCallController(req, res) {
  try {
    const { team_id, call_ssid, from_number, to_number, status, started_at, ended_at, recording_url } = req.body;

    if (!to_number) {
      return res.status(400).json({ message: "Missing 'to_number' field" });
    }

    if (!twilio_number) {
      return res.status(500).json({ message: "Twilio number not configured in .env" });
    }

    // 🔹 Make the actual call via Twilio
    const twilioCall = await client.calls.create({
      url: `${base_url}/api/digidial/voice`, // or your custom TwiML endpoint
      to: to_number,
      from: twilio_number,
      record: true,
      statusCallback: `${base_url}/api/digidial/telephony/twilio-call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'] // jo events chahiye // optional: enables automatic recording
    });

    // 🔹 Save call record to your DB
    const call = await createCall({
      teamId: team_id,
      call_ssid: twilioCall.sid,
      from_number: twilio_number, // use Twilio number as 'from'
      to_number,
      status: twilioCall.status,
      started_at: twilioCall.startTime || new Date(),
      ended_at,
      recording_url: recording_url || twilioCall.subresourceUris?.recordings || null
    });

    res.status(201).json({
      message: "Call initiated and recorded",
      call,
      twilioCallSid: twilioCall.sid
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

export function voiceHandler(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse; // ✅ correct ESM
  const twiml = new VoiceResponse();

  twiml.say({ voice: 'Polly.Aditi', language: 'hi-IN' }, 'नमस्ते! आपका स्वागत है।');

  // Connect live audio stream to WebSocket
  const connect = twiml.connect();
  connect.stream({ url: `${process.env.BASE_URL.replace(/^https?:\/\//, 'wss://')}/audio-stream` });

  // Gather speech
  twiml.gather({
    input: 'speech',
    action: `${process.env.BASE_URL}/api/digidial/process-speech`,
    speechTimeout: 'auto',
    language: 'hi-IN'
  });

  res.type('text/xml');
  res.send(twiml.toString());
}


export function processSpeech(req, res) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  const userSpeech = req.body.SpeechResult;

  console.log("✅ User said:", userSpeech);

  if (!userSpeech) {
    twiml.say('माफ़ करें, हमें आपकी बात समझ नहीं आई।');
    twiml.redirect(`${base_url}/api/voice`);
  } else {
    twiml.say(`आपने कहा: ${userSpeech}`);
    twiml.gather({
      input: 'speech',
      action: `${base_url}/api/process-speech`,
      speechTimeout: 'auto',
      language: 'hi-IN'
    });
  }

  res.type('text/xml');
  res.send(twiml.toString());
}

export async function twilioCallStatusWebhook(req, res) {
  try {
    const payload = req.body;

    console.log("🔥 Twilio Webhook Received:", payload);

    const callSid = payload.CallSid; // Twilio se aane wala SID
    const callStatus = payload.CallStatus; // queued, ringing, in-progress, completed

    if (!callSid) {
      return res.status(400).send("Missing CallSid");
    }

    // DB update
    const endedAt = callStatus === "completed" ? new Date() : null;
    const updatedCall = await updateCallStatusBySid(callSid, {
      status: callStatus,
      ended_at: endedAt
    });

    // Webhook log
    await createWebhookLog({
      teamId: updatedCall?.team_id || null,
      event_type: `call.${callStatus}`,
      payload
    });

    res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("❌ Twilio webhook error:", error);
    res.status(500).send("Internal server error");
  }
}




