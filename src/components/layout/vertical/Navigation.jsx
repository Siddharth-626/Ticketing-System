'use client'

// React Imports
import { useRef } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'

// Component Imports
import VerticalNav, { NavHeader } from '@menu/vertical-menu'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Firebase Imports
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'

// Style Imports
import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-default) 5%, rgb(var(--mui-palette-background-defaultChannel) / 0.85) 30%, rgb(var(--mui-palette-background-defaultChannel) / 0.5) 65%, rgb(var(--mui-palette-background-defaultChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = () => {
  const theme = useTheme()
  const { isBreakpointReached, toggleVerticalNav } = useVerticalNav()
  const shadowRef = useRef(null)
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <VerticalNav customStyles={navigationCustomStyles(theme)}>
      <NavHeader>
        <Link href='/'>
          <Logo />
        </Link>
        {isBreakpointReached && <i className='ri-close-line text-xl' onClick={() => toggleVerticalNav(false)} />}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <List>
        <ListItem button onClick={() => router.push('/')}>
          <ListItemIcon>
            <ConfirmationNumberIcon className='dark:text-white' />
          </ListItemIcon>
          <ListItemText primary='Tickets' className='dark:text-white' />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon className='dark:text-white' />
          </ListItemIcon>
          <ListItemText primary='Logout' className='dark:text-white' />
        </ListItem>
      </List>
    </VerticalNav>
  )
}

export default Navigation
