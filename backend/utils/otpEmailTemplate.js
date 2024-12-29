const OtpEmailTemplate = (otp) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="text-align: center; color: #4CAF50;">Your OTP Code</h2>
        <p>Dear User,</p>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="text-align: center; color: #333; letter-spacing: 2px;">${otp}</h1>
        <p>Please use this OTP to complete your authentication. This code will expire in 2 minutes.</p>
        <p>If you did not request this OTP, please ignore this email or contact support immediately.</p>
        <p style="margin-top: 20px;">Thank you,</p>
        <p>Chatify Team</p>
      </div>
    `;
  };
  
  module.exports =OtpEmailTemplate;
  