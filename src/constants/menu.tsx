import DashboardPage from '@/app/(dashboard)/dashboard/page'
import ChatIcon from '@/icons/chat-icon'
import DashboardIcon from '@/icons/dashboard-icon'
import StarIcon from '@/icons/star-icon'
import TimerIcon from '@/icons/timer-icon'
import { JSX } from 'react'

type SIDE_BAR_MENU_PROPS = {
    label: string
    icon: JSX.Element
    path: string
}

export const SIDE_BAR_MENU: SIDE_BAR_MENU_PROPS[] = [
    {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: 'dashboard',
    },
    {
        label: 'Conversations',
        icon: <ChatIcon />,
        path: 'conversation',
    },
    {
        label: 'Integrations',
        icon: <IntegrationsIcon />,
        path: 'integration',
    },
    {
        label: 'Appointments',
        icon: <CalIcon />,
        path: 'appointments',
    },
    {
        label: 'Email Marketing',
        icon: <EmailIcon />,
        path: 'email-marketing',
    },
    {
        label: 'Settings',
        icon: <SettingsIcon />,
        path: 'settings',
    },
]

type TABS_MENU_PROPS = {
    label: string
    icon?: JSX.Element
}

]