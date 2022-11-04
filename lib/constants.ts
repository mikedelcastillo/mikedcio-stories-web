export const TEXT = {
    NICKNAME: "Mike",
    FULL_NAME: "Mike del Castillo",
    JOB_TITLE: "Software Engineer",
    BIOGRAPHY: "I’m a creative person who’s passionate about software engineering, UX, and fabrication.",
}

// Prevents bots from scraping email
export const OBFSCT_EM_ADDR = [["io", "mikedc"].reverse().join("."), "hello"].reverse().join("@")

export type SocialLink = {
    id: string,
    text: string,
    href: string,
}
export const SOCIAL_LINKS: SocialLink[] = [
    {
        id: "instagram",
        text: "Instagram",
        href: "https://www.instagram.com/mikedc.io/",
    },
    {
        id: "github",
        text: "GitHub",
        href: "https://github.com/mikedelcastillo",
    },
    {
        id: "linkedin",
        text: "LinkedIn",
        href: "https://www.linkedin.com/in/mikedelcasitllo/",
    },
    {
        id: "email",
        text: "Email",
        href: `mailto:${OBFSCT_EM_ADDR}`,
    },
]