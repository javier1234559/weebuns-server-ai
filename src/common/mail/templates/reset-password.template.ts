export const resetPasswordTemplate = (resetCode: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #4F46E5;
      padding: 10px;
      background: #F3F4F6;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>You have requested to reset your password.</p>
    <p>Your verification code is:</p>
    <p class="code">${resetCode}</p>
    <p>This code will expire in 15 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
`;
