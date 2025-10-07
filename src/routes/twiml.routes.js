import express from "express";
import twilio from "twilio";

const twilioRouter = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;

// Main voice endpoint - jab call connect hoti hai
twilioRouter.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();
  
  // Welcome message
  twiml.say({
    voice: 'Polly.Aditi', // Hindi voice
    language: 'hi-IN'
  }, 'नमस्ते, आपका स्वागत है। कृपया अपना संदेश बोलें।');

  // User ka speech input lena
  twiml.gather({
    input: 'speech',
    action: '/twiml/api/process-speech',
    speechTimeout: 'auto',
    language: 'hi-IN', // Hindi recognition
    hints: 'hello, help, support' // recognition improve karne ke liye
  });

  // Agar koi input nahi aaya
  twiml.say('हमें आपकी आवाज़ सुनाई नहीं दी। कृपया दोबारा कोशिश करें।');
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Speech processing endpoint
twilioRouter.post("/process-speech", (req, res) => {
  const userSpeech = req.body.SpeechResult;
  const confidence = req.body.Confidence;
  const twiml = new VoiceResponse();
  
  console.log(`User said: ${userSpeech} (Confidence: ${confidence})`);

  if (!userSpeech) {
    twiml.say('माफ़ करें, हमें आपकी बात समझ नहीं आई।');
    twiml.redirect('/twiml/voice');
  } else {
    // Response based on user input
    const lowerSpeech = userSpeech.toLowerCase();
    
    if (lowerSpeech.includes('hello') || lowerSpeech.includes('हेलो') || lowerSpeech.includes('नमस्ते')) {
      twiml.say({
        voice: 'Polly.Aditi',
        language: 'hi-IN'
      }, 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?');
    } 
    else if (lowerSpeech.includes('help') || lowerSpeech.includes('मदद')) {
      twiml.say({
        voice: 'Polly.Aditi',
        language: 'hi-IN'
      }, 'मैं आपकी मदद के लिए यहाँ हूँ। कृपया अपनी समस्या बताएं।');
    }
    else if (lowerSpeech.includes('bye') || lowerSpeech.includes('अलविदा')) {
      twiml.say({
        voice: 'Polly.Aditi',
        language: 'hi-IN'
      }, 'धन्यवाद। अलविदा।');
      twiml.hangup();
      res.type('text/xml');
      res.send(twiml.toString());
      return;
    }
    else {
      // Echo back what user said
      twiml.say({
        voice: 'Polly.Aditi',
        language: 'hi-IN'
      }, `आपने कहा: ${userSpeech}`);
    }

    // Continue conversation
    twiml.gather({
      input: 'speech',
      action: '/twiml/api/process-speech',
      speechTimeout: 'auto',
      language: 'hi-IN'
    });

    twiml.say('और कुछ बोलना चाहेंगे?');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Call status updates
twilioRouter.post("/call-status", (req, res) => {
  const callStatus = req.body.CallStatus;
  const callSid = req.body.CallSid;
  const duration = req.body.CallDuration;
  
  console.log(`Call ${callSid} status: ${callStatus}`);
  
  if (duration) {
    console.log(`Call duration: ${duration} seconds`);
  }
  
  // Yaha aap database update kar sakte ho
  // updateCallStatus(callSid, callStatus, duration);
  
  res.sendStatus(200);
});

// Recording status
twilioRouter.post("/recording-status", (req, res) => {
  const recordingSid = req.body.RecordingSid;
  const recordingUrl = req.body.RecordingUrl;
  const callSid = req.body.CallSid;
  
  console.log(`Recording available: ${recordingUrl}`);
  
  // Database me recording URL save karo
  // updateCallRecording(callSid, recordingUrl);
  
  res.sendStatus(200);
});

export default twilioRouter;