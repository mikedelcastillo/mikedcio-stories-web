import Head from 'next/head'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { SocialLink, SOCIAL_LINKS, TEXT } from '../lib/constants'
import { createStyleShortcut } from '../styles'
import indexStyles from '../styles/Index.module.sass'
import commonStyles from '../styles/Index.module.sass'

const $ = createStyleShortcut([indexStyles, commonStyles])

export default function Home() {
  // Prevent bots from scraping my email and links
  const [hideSocials, setHideSocials] = useState(true)

  useEffect(() => setHideSocials(false), [])

  function SocialLinks() {
    const links = SOCIAL_LINKS.map(link => {
      const className = $(["social-link", link.id])
      const href = hideSocials === true ? 
        `/api/social/${link.id}` : link.href
      return (
        <a className={className}
          target="_blank" rel="noreferrer"
          key={link.id} href={href}>{link.text}</a>
      )
    })
    return (<>{links}</>)
  }

  return (
    <>
      <div className={$`section section-me`}>
        <div className={$`center-content`}>

          <div className={$`profile-image`}>
            <div className={$`image`}></div>
          </div>

          <div className={$`text`}>
            <div className={$`name`}>{TEXT.FULL_NAME}</div>
            <div className={$`job-title`}>{TEXT.JOB_TITLE}</div>
            <div className={$`bio`}>{TEXT.BIOGRAPHY}</div>
            <div className={$`social-link`}><SocialLinks/></div>
          </div>

        </div>
      </div>
    </>
  )
}
