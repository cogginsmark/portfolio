// The Videos page. One shareable link for the video work: editing,
// short-form, and motion graphics across news, teaching, and campus
// media. Per-entry annotation is the point — title, organisation,
// date, Mark's role, and the source article where there is one.
// Inventory verified piece by piece (2026-10-29); the three Signal
// article URLs were checked live the same day.
//
// The first entry carries feature: true and renders as the page's one
// embedded player (Mark's hybrid call, 2026-10-29); every other entry
// renders as a thumbnail card linking out. An ASI Stan State section
// joins these when its entries finish sourcing — no award years are
// printed anywhere until Mark confirms them.
//
// Client Work was added the same night (Mark's "yes for 9/16"): the
// Early Bird Plumbing reel is his credited videography, sourced from
// the live grid after the search index missed it. It first rendered
// as a card linking to the original post; since 2026-10-30 it plays
// in a self-hosted native player (Mark supplied the original file
// and directed that it play directly on the page, unmuted and
// looping — browsers require a muted start, so the player begins
// muted and unmutes on the first tap). An entry with a `src` field
// renders as that player instead of a thumbnail card.
export default {
  author: "Videos",
  intro:
    "Video work across news, teaching, and campus media: editing, short-form, and motion graphics.",
  sections: [
    {
      heading: "Client Work",
      note: "Video produced for a Sacramento business's social channels.",
      entries: [
        {
          title: "916 Day: Early Bird Plumbing",
          date: "September 16, 2025",
          role: "Videography",
          software:
            "Adobe Firefly · Adobe Express · Adobe After Effects · Adobe Illustrator",
          note: "Sacramento pride piece for 916 Day, edited for Early Bird Plumbing from Tower Bridge to the American River.",
          credit:
            "Video by Mark Coggins, as credited on the original post; photos by @leo_visions_.",
          thumb: "/videos/early-bird-916.jpg",
          src: "/videos/early-bird-916.mp4",
          instagram: "https://www.instagram.com/p/DOq20ApEh9T/"
        }
      ]
    },
    {
      heading: "The Signal",
      note: "Video packages for the CSU Stanislaus student newspaper.",
      entries: [
        {
          title:
            "Student Art Showcase Celebrates Creativity and Legacy at Stan State",
          date: "May 16, 2023",
          role: "Video, with Amber Huk",
          note: "Video package for The Signal's coverage of the Student-Centered Art Showcase; the article's photographs are also by Mark Coggins.",
          youtube: "https://youtu.be/ZLTSOVu4r5E",
          videoId: "ZLTSOVu4r5E",
          article:
            "https://csusignal.com/8022/news/student-art-showcase-celebrates-creativity-and-legacy-at-stan-state/",
          feature: true
        },
        {
          title: "Recreation on Vacation: What to do in Turlock",
          date: "December 9, 2022",
          role: "Camera · Co-author",
          note: "Location piece on getting out in Turlock: the Historical Society Museum, Donnelly Park, and Fields of Ice.",
          youtube: "https://youtu.be/Obmk9eMusk8",
          videoId: "Obmk9eMusk8",
          article: "https://csusignal.com/7895"
        },
        {
          title: "A New Way to Get to the Turlock-Denair Amtrak Station",
          date: "September 28, 2022",
          role: "Camera · Co-author",
          note: "News package on Turlock Transit's on-demand shuttle taking Stan State students to the Amtrak station.",
          youtube: "https://youtu.be/0zreQRTvEnk",
          videoId: "0zreQRTvEnk",
          article:
            "https://csusignal.com/7896/news/a-new-way-to-get-to-the-turlock-denair-amtrak-station"
        }
      ]
    },
    {
      heading: "Bay Valley Tech",
      note: "Lectures and tutorials recorded for Bay Valley Tech interns, from the Digital Design Intern Lead period.",
      entries: [
        {
          title: "Photoshop, Photopea & Wix.com | Digital Skills Crash Course",
          role: "Instructor",
          note: "Chaptered crash course for new interns: Photopea editing, layer masks and styles, Wix, and Figma.",
          youtube: "https://youtu.be/raGk58za1ms",
          videoId: "raGk58za1ms"
        },
        {
          title: "Introduction to Figma | Digital Skills Lecture",
          date: "September 7, 2022",
          role: "Instructor",
          note: "Introductory Figma lecture, recorded live in person.",
          youtube: "https://youtu.be/Q4Ra2NuS6A0",
          videoId: "Q4Ra2NuS6A0"
        },
        {
          title: "Select Subject & Quick Selection in Photoshop | BVT Interns",
          date: "November 11, 2022",
          role: "Instructor",
          note: "Photoshop selection-tools tutorial, recorded live.",
          youtube: "https://youtu.be/ahzCo6nB_0s",
          videoId: "ahzCo6nB_0s"
        }
      ]
    }
  ],
  footer: {
    tagline: "Mark Coggins · Modesto, California",
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
