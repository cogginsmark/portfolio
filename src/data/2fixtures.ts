// About page data. Was a single pre-wrap text blob in hero.description
// ("Residence - ... / Education - ... / ..."), rendered through the
// Home hero. The facts are unchanged, word for word — they are now
// structured so the About page can lay them out as real sections:
// a facts list, education, and experience.
export default {
  author: "Mark Coggins",
  role: "Graphic Designer",
  facts: [
    { label: "Residence", value: "Modesto, CA" },
    { label: "Education", value: "California State University Stanislaus" },
    { label: "Major", value: "Bachelor of Communication Studies, Bachelor of Creative Media" }
  ],
  experience: [
    {
      label: "Internships",
      value: "Bay Valley Tech (6 Months) Position: Lead Design Intern"
    },
    {
      label: "Experience",
      value: "Graphic Design Student Assistant position at Associated Students Inc, at California State University Stanislaus"
    }
  ],
  // The ACUI awards, verified against the physical certificates and
  // the conference's own program page (Mark, 2026-10-30): Region I
  // Conference 2022, "Steal This Idea" — the work sample's March 2023
  // dating was the error; the certificates print 2022.
  awards: [
    {
      label: "Promotional Campaigns",
      value: "Third Place — ACUI Region I Conference, Steal This Idea (March 2022). Hispanic Heritage Month social media posts for @sc.stanstate."
    },
    {
      label: "Logos / Brand Identity",
      value: "Third Place — ACUI Region I Conference, Steal This Idea (March 2022). ASI marketing department identity."
    }
  ],
  awardsNote: "The certificates are signed by the 2022 conference co-chairs, Cecilia Ortiz and Jenny Puccinelli — Puccinelli now serves as ACUI Region I's Regional Director.",
  awardsSource: {
    label: "2022 conference program (ACUI)",
    url: "https://events.rdmobile.com/Events/Info/1621388"
  },
  footer: {
    tagline: "Mark Coggins — Modesto, California",
    links: [
      {
        name: "Medium",
        url: "https://medium.com/@markcoggins",
        fa: "fab fa-medium"
      },
      {
        name: "Github",
        url: "https://github.com/cogginsmark",
        fa: "fab fa-github"
      },
      {
        name: "Linkedin",
        url: "https://www.linkedin.com/in/cogginsmark/",
        fa: "fab fa-linkedin"
      },
      {
        name: "Email",
        url: "mailto:cogginsmark@icloud.com",
        fa: "fa fa-envelope"
      }
    ]
  }
}
