'use server';

import nodemailer from 'nodemailer';

export const onMailer = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    to: email,
    subject: 'Realtime Support',
    text: 'One of your customers on MailGenie just switched to realtime mode',
  };

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email send error:', error);
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info);
        }
      });
    });
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Email failed to send');
  }
};