import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from "bcryptjs"
export async function sendMail({ email, emailType, userId }: any) {
    try {
        // Configure mail for usage
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        let subject = "";
        let htmlContent = "";

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            });
            subject = "VERIFY YOUR EMAIL";
            htmlContent = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
                to verify your email or copy and paste the link below in your browser.
                <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`;
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
            subject = "Reset Your Password";
            htmlContent = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a>
                to reset your password or copy and paste the link below in your browser.
                <br>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>`;
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "fd322de0998602",
                pass: "8557ea9af6f0c6"
            }
        });

        const mailOptions = {
            from: "ayush@ai",
            to: email,
            subject: subject,
            text: "hello world",
            html: htmlContent
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}
