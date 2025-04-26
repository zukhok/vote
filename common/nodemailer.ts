import nodemailer from "nodemailer";

export let config = {
  service: "",
  auth: {
    user: "",
    pass: "",
  },
};
export let transport = nodemailer.createTransport(config);