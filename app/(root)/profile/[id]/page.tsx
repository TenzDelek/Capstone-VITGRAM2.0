import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs'
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const Page =async({params}:{params:{id:string}})=>{
    const user=await currentUser();
    if (!user) return null; 
    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    return(
        <section>
            <ProfileHeader 
             accountId={userInfo.id}
             authUserId={user.id}
             name={userInfo.name}
             username={userInfo.username}
             imgUrl={userInfo.image}
             bio={userInfo.bio}/>

        <div className=" mt-9">
        <Tabs defaultValue="threads" className=" w-full">
            <TabsList className=" tab">
            {profileTabs.map((tab)=>(
                <TabsTrigger className="tab" key={tab.label} value={tab.value}>
                    <Image className=" object-contain" width={24} height={24}  src={tab.icon} alt={tab.label}/>
                    <p className=" max-sm:hidden">{tab.label}</p>
                    {tab.label=="Thoughts" && (
                     <p className=" ml-1 rounded-sm  bg-orange-500 px-2 py-1 !text-tiny-medium text-light-2">
                        {userInfo?.threads?.length}
                     </p>
                    )}
                </TabsTrigger>
            ))}
            </TabsList>
            {profileTabs.map((tab)=>(
                <TabsContent className=" w-full text-light-1" key={`content-${tab.label}`} value={tab.value}>
                    <ThreadsTab
                    currentUserId={user.id}
                    accountId={userInfo.id}
                    accountType="User"
                    />
                </TabsContent>
            ))}
        </Tabs>
        </div>

        </section>
    )
}

export default Page