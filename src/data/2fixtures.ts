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
  footer: {
    tagline: "Mark Coggins — Turlock, California",
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
