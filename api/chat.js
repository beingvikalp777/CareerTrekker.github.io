export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const siteData = `
CareerTrekker is a student guidance platform focused on colleges, exams, cutoffs, and career paths.

Key exam routes:
- JEE Main: for NITs, IIITs, many engineering colleges, and JEE Advanced eligibility
- JEE Advanced: for IIT admissions
- NEET UG: for MBBS, BDS and allied medical admissions
- CLAT UG: for national law universities
- AILET: for NLU Delhi
- CAT: for IIMs and MBA institutes
- BITSAT: for BITS campuses
- VITEEE: for VIT admissions

Selected colleges on the site include:
- IIT Madras
- IIT Delhi
- IIT Bombay
- IIT Kanpur
- IIT Kharagpur
- IIT Roorkee
- IIT Guwahati
- IIT Hyderabad
- IIT BHU
- IIT Dhanbad
- IIT Indore
- IIT Ropar
- IIT Mandi
- AIIMS Delhi
- AIIMS Rishikesh
- AIIMS Bhubaneswar
- AIIMS Jodhpur
- AIIMS Bhopal
- AIIMS Patna
- AIIMS Raipur
- AIIMS Nagpur
- AIIMS Kalyani
- JIPMER Puducherry
- CMC Vellore
- IMS BHU
- NLSIU Bengaluru
- NLU Delhi
- IIM Ahmedabad
- IIM Bangalore
- BITS Pilani
- VIT Vellore

Answer clearly, practically, and briefly. If the answer is not known from the provided site data, say that the current site assistant is limited and needs either more site data or a web-connected backend.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: siteData
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }

    const answer =
      data.output_text ||
      "Sorry, I could not generate a response right now.";

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
