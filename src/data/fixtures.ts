export default {
  author: "Mark Coggins",
  hero: {
    subtitle: "Graphic Designer at California State University Stanislaus.",
    description: "Enjoying the exploration of new software and techniques to create engaging and compelling designs.",
    cta: "Browse Designs",
  },
  products: {
    featured: [
      {
        name: "Associated Students Inc.",
        medium: "Photoshop · Illustrator · Smartsheet",
        summary: "Graphic Design Assistant",
        copy: [
          "See my work with the student voice of CSU Stanislaus."
        ],
        links: {
          color: "#363636",
          primary: {
            name: "Explore",
            url: "https://doubletext.me/"
          }
        },
        images: [
          "/doubletext/0.jpg",
          "/doubletext/1.jpg",
          "/doubletext/2.jpg",
          "/doubletext/3.jpg",
          "/doubletext/4.jpg"
        ]
      },
      {
        name: "Flux",
        medium: "Photoshop · Illustrator · Premiere Pro",
        summary: "Brand creation.",
        copy: [
          "See my work with creating a content creation house in Austin, Texas.",
        ],
        links: {
          color: "#363636",
          primary: {
            name: "Learn more",
            url: "https://portfolium.com/entry/flux"
          }
        },
        images: [
          "/climblist/0.jpg",
          "/climblist/1.jpg",
        ]
      }
    ],
    // Only supports 0-3 at the moment
    minor: [
      {
        name: "Cover Your Cover",
        description: "Web and brand design for facemask cases.",
        link: {
          name: "Project",
          url: "https://portfolium.com/entry/cover-your-cover"
        }
      },
      {
        name: "JukeBuds",
        description: "Product and ad design for wireless earbuds.",
        link: {
          name: "Project",
          url: "https://portfolium.com/entry/jukebuds"
        }
      },
      {
        name: "ShapeLamps",
        description: "Web and brand design for colorful & unique lamps.",
        link: {
          name: "Project",
          url: "https://portfolium.com/entry/shapelamps"
        }
      }
    ]
  },
  logoSection: {
    title: "As hired by",
    // Only supports 0-3 at the moment
    logos: [
      {
        src: "/logos/csustan3.svg",
        url: "https://www.csustan.edu/",
        alt: "California State University Stanislaus"
      },
      {
        src: "/logos/census.svg",
        url: "https://www.census.gov/",
        alt: "United States Census Bureau"
      },
      {
        src: "/logos/suezwahlen.svg",
        url: "https://www.sueformayor.com/",
        alt: "Sue Zwahlen for Congress"
      }
  ]
  },
  footer: {
    tagline: "Mark Coggins — Turlock, California",
    links: [
      {
        name: "Twitter",
        url: "https://twitter.com/markacoggins",
        fa: "fab fa-twitter" // Code from: https://fontawesome.com/v5/icons/twitter?s=brands
      },
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
      },
    ]
  }
}