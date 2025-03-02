import { MenuLogo } from "@/icons/menu-logo"

type MinMenuProps = {
    domains:
 | {
        id: string
        name: string
        icon: string | null
    } []

  | null
  | undefined  
}

const MinMenu = ({ 
    onShrink,
    current,
    onSignOut,
    domains,
}: MinMenuProps) => {
    return (
        <div className="py-3 px-4 flex flex-col h-full">
            <span className="animate-fade-in opacity-0 delay-300 fill-mode-forwards cursor-pointer">
                <MenuLogo onClick={onShrink} />
            </span>
            <div className="animate-fade-in opacity-0 delay-300 fill-mode-forwards flex flex-col justify-between h-full pt-10">
                <div className="flex flex-col">
                    {SIDE_BAR_MENU.map((menu, key) => (
                        <MenuItem 
                        size="min"
                        {...menu}
                        key={key}
                        current={current}
                        />
                  ))}
                    <DomainMenu 
                    min
                    domains={domains}
               />
              </div>
              <div className="flex flex-col">
                  <MenuItem 
                  size="min"
                  label="Sign out"
                  icon={<LogOut />}
                  onSignOut={onSignOut}
                  />
              </div>
              </div>
              </div>
          )
      } 

      export default MinMenu
                    


                    
                    