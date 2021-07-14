const nodemailer = require("nodemailer")

const { EMAIL, PASS, CLIENT_URL } = require("./keys")

const sendMail = async (data) => {
  try {
    let { emailTo, resetToken } = data

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASS,
      },
    })

    let mailDetails = {
      from: "Stocka",
      to: emailTo,
      subject: "Reset Password",
      html: `
        <div>
        <h2>Please reset your password using the following link</h2>
        <p>When reseting your password we recommend choosing the one which is easy for you to remember</p>
        <p><strong>If you find any issue about our services please mail us: </strong></p>
        <h4><a href = "mailto: khalifablaise@gmail.com">@stocka.api</a></h4>
        <br/><br/>
        <h3><a style="padding: 15px; font-size=50px" href = "${CLIENT_URL}/reset_password/${resetToken}">Click to reset your password</a></h3>
        </div>        
        `,
    }
    await mailTransporter.sendMail(mailDetails)
    return {
      success: true,
      message: "Email sent successfully",
    }
  } catch (e) {
    return {
      success: false,
      message:
        e.message === "getaddrinfo ENOTFOUND smtp.gmail.com"
          ? "Email not found at smtp.gmail.com"
          : e.message,
    }
  }
}

module.exports = sendMail
