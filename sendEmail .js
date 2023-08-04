import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'; 

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: 'm0hamedkhaled.coder@gmail.com', 
    pass: 'xesoawqioubthbol', 
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'm0hamedkhaled.coder@gmail.com', 
    to,
    subject,
    text, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
const generatePasswordResetToken = () => {
    return uuidv4();
  };
export { sendEmail,generatePasswordResetToken  };