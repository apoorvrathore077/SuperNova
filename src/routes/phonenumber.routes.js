import express from "express";
import {
  addPhoneNumberController,
  getAllPhoneNumbersController,
  getPhoneNumberByIdController,
  getPhoneNumbersByTeamController
} from "../controllers/phonenumber.controller.js";

const phoneNumberRoute = express.Router();

// Add a phone number
phoneNumberRoute.post("/telephony/phone-numbers/add", addPhoneNumberController);

// Get all phone numbers
phoneNumberRoute.get("/telephony/phone-numbers/get", getAllPhoneNumbersController);

// Get phone number by ID
phoneNumberRoute.get("/telephony/phone-numbers/:id", getPhoneNumberByIdController);

// Get all phone numbers by team
phoneNumberRoute.get("/telephony/phone-numbers/team/:team_id", getPhoneNumbersByTeamController);

export default phoneNumberRoute;
