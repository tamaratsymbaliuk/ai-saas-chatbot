import { SIDE_BAR_MENU } from "@/constants/menu"
import { LogOut, Menu } from "lucide-react"

type Props = {
    domains:
 | {
        id: string
        name: string
        icon: string | null
    } []

  | null
  | undefined  
}

const MaxMenu = ({ current, domains, onExpand, onSignOut }: Props) => {
    return (
        <div className="py-3 px-4 flex flex-col h-full">
            <div className="flex justify-between items-center">
                <p className="text-2xl font-bold text-gravel"
                onClick={() => window.location.href = '/'}
                >
                    MailGenie
                </p>
                <Menu
                className="cursor-pointer animate-fade-in opacity-0 delay-300 fill-mode-forwards"
                onClick={onExpand}
                />          
            </div>
            <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
                <div className="flex flex-col">
                    <p className="text-xs text-gray-500 mb-3">MENU</p>
                    {SIDE_BAR_MENU.map((menu, key) => (
                        <MenuItem 
                        size="max"
                        {...menu}
                        key={key}
                        current={current}
                        />
                    ))}
                    <DomainMenu domains={domains} />
                </div>
                <div className="flex flex-col">
                    {/* <p className="text-xs text-gray-500 mb-3">OPTIONS</p> */} 
                    <MenuItem 
                    size="max"
                    label="Sign out"
                    icon={<LogOut />}
                    onSignOut={onSignOut}
                    />
                </div>
            </div>
        </div>
    )
}

export default MaxMenu