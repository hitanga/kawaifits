import express from "express";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      adminPhoneSet: !!process.env.ADMIN_PHONE_NUMBER,
      resendKeySet: !!process.env.RESEND_API_KEY
    });
  });

  // API Route for sending emails
  app.post(["/api/send-email", "/api/send-email/"], async (req, res) => {
    const { name, email, message } = req.body;

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in the environment.");
      return res.status(500).json({ error: "Email service is not configured." });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data, error } = await resend.emails.send({
        from: "Kawai Fits <onboarding@resend.dev>",
        to: ["hitanga@gmail.com"],
        replyTo: email, // Allows you to reply directly to the customer
        subject: `[Kawai Fits] New Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #f43f5e; padding-bottom: 10px;">New Contact Form Submission</h2>
            <p style="margin-top: 20px;"><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">This email was sent from your Kawai Fits website contact form.</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(400).json({ error });
      }

      res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  app.post(["/api/admin/send-otp", "/api/admin/send-otp/"], async (req, res) => {
    const { phone } = req.body;
    const adminPhone = process.env.ADMIN_PHONE_NUMBER;

    if (!adminPhone) {
      return res.status(500).json({ error: "Admin phone number not configured." });
    }

    // Check if it's the admin's phone number
    if (phone !== adminPhone) {
      return res.status(403).json({ error: "Access denied. Only the administrator can login." });
    }

    // Success response means the client can proceed with Firebase Phone Auth
    res.status(200).json({ success: true, message: "Authorized to proceed with OTP." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware loaded (Development)");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log("Serving static files from:", distPath);
    app.use(express.static(distPath));
    // Express 5 uses *all for catch-all routes
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static middleware loaded (Production)");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
